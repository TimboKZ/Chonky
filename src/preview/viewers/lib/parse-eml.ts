/**
 * RFC 5322 / MIME parsing for the .eml viewer.
 *
 * Kept apart from the component so the parts that get email wrong — nesting,
 * transfer encodings, character sets — can be tested without rendering anything.
 */

export interface EmailAttachment {
  filename: string
  contentType: string
  /** Content-ID with its angle brackets stripped, when the part carries one. */
  contentId?: string
  inline: boolean
  /**
   * Set when the body referenced this part and it was embedded, so a caller can
   * avoid listing an image the reader is already looking at. Membership is decided
   * by what the body referenced, not by whether the part carries a Content-ID:
   * Gmail stamps one on ordinary attachments too.
   */
  renderedInline: boolean
  /** Payload as base64 with whitespace removed, ready to drop into a data: URI. */
  base64: string
  /** Decoded size in bytes. */
  size: number
}

export interface ParsedEmail {
  subject: string
  from: string
  to: string
  cc?: string
  bcc?: string
  date: string
  messageId?: string
  contentType?: string
  /** Plain-text alternative, or the sole body of a non-multipart message. */
  body: string
  /** HTML alternative with cid: references already resolved to data: URIs. */
  htmlBody?: string
  attachments: EmailAttachment[]
}

interface MimePart {
  headers: Record<string, string>
  mediaType: string
  params: Record<string, string>
  disposition: string
  dispositionParams: Record<string, string>
  encoding: string
  /** Undecoded body of this part. */
  raw: string
}

/**
 * Recursion is bounded because a malformed or hostile message can nest deeply
 * enough to cost real time, and no real message goes past three or four levels.
 *
 * A self-referential boundary is not the case this guards: splitting consumes the
 * delimiter lines, so the inner part is empty and terminates on its own. What the
 * bound does mean is that a legal message nested past this depth loses its body
 * silently, which is the trade being made.
 */
const MAX_DEPTH = 12

/**
 * Embedding inflates by roughly a third, and the result is held as a string and
 * handed to an iframe. Past this the remaining references are left as cid:, which
 * renders a broken image — visibly wrong, rather than a wedged tab.
 */
const MAX_INLINE_BYTES = 15 * 1024 * 1024

/**
 * Parses a message.
 *
 * `emlContent` is expected to hold the file's bytes one per code unit, as a
 * latin-1 decode of the response produces. A message declares its own character
 * set per part and this parser honours it, so decoding the file as UTF-8 before
 * handing it over destroys any part that is not UTF-8 before parsing begins.
 */
export function parseEmlContent(emlContent: string): ParsedEmail {
  const root = parsePart(emlContent)

  const collected = { html: '', text: '', attachments: [] as EmailAttachment[] }
  collectParts(root, collected, 0)

  const headers = root.headers
  const htmlBody = collected.html ? resolveCidReferences(collected.html, collected.attachments) : undefined

  return {
    subject: decodeHeaderValue(headers['subject'] || 'No Subject'),
    from: decodeHeaderValue(headers['from'] || 'Unknown Sender'),
    to: decodeHeaderValue(headers['to'] || 'Unknown Recipient'),
    cc: headers['cc'] ? decodeHeaderValue(headers['cc']) : undefined,
    bcc: headers['bcc'] ? decodeHeaderValue(headers['bcc']) : undefined,
    date: headers['date'] || 'Unknown Date',
    messageId: headers['message-id'],
    contentType: headers['content-type'],
    body: collected.text.trim() || (collected.html ? stripTags(collected.html) : ''),
    htmlBody,
    attachments: collected.attachments,
  }
}

function parsePart(raw: string): MimePart {
  const { headers, body } = splitHeadersAndBody(raw)
  const { value: mediaType, params } = parseParameterisedHeader(headers['content-type'] || 'text/plain')
  const { value: disposition, params: dispositionParams } = parseParameterisedHeader(headers['content-disposition'] || '')

  return {
    headers,
    mediaType: mediaType.toLowerCase(),
    params,
    disposition: disposition.toLowerCase(),
    dispositionParams,
    encoding: (headers['content-transfer-encoding'] || '').trim().toLowerCase(),
    raw: body,
  }
}

function splitHeadersAndBody(raw: string): { headers: Record<string, string>; body: string } {
  const lines = raw.split('\n')
  const headers: Record<string, string> = {}
  let currentHeader = ''
  let bodyStart = lines.length

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '')

    // RFC 5322 ends the header block with an empty line; a line carrying only
    // spaces or tabs is a folded continuation. Accepting whitespace here is the
    // more forgiving reading but the more damaging one to get wrong: one stray
    // space in the header block ends it early and the whole message renders as
    // the raw MIME dump this parser exists to avoid. Read strictly, the same
    // message parses correctly, and the only sender penalised is one that meant
    // a whitespace line as a separator — which nothing in the spec permits.
    if (line === '') {
      bodyStart = i + 1
      break
    }

    // A header folded onto continuation lines is one logical header. References
    // wraps this way past two hops, and reading only its first line silently
    // drops every message id but the first. Unfolding joins with a single space
    // and contributes none at all where there is nothing either side of the fold,
    // so a header whose value starts on the next line does not acquire a leading
    // one — Content-ID is written that way and the space breaks the cid: lookup.
    if (/^[ \t]/.test(line) && currentHeader) {
      const continuation = line.trim()
      if (continuation) {
        headers[currentHeader] = headers[currentHeader] ? `${headers[currentHeader]} ${continuation}` : continuation
      }
      continue
    }

    const match = line.match(/^([^:]+):[ \t]*(.*)$/)
    if (match) {
      currentHeader = match[1].toLowerCase()
      headers[currentHeader] = match[2].trim()
    }
  }

  return { headers, body: lines.slice(bodyStart).join('\n') }
}

/** Splits `text/html; charset="UTF-8"` into its media type and parameters. */
function parseParameterisedHeader(value: string): { value: string; params: Record<string, string> } {
  const raw: Record<string, string> = {}
  const segments = splitOnUnquotedSemicolons(value)
  const head = (segments.shift() || '').trim()

  for (const segment of segments) {
    const match = segment.match(/^\s*([^=]+)=\s*(.*)$/)
    if (!match) continue
    raw[match[1].trim().toLowerCase()] = unquote(match[2].trim())
  }

  return { value: tokeniseHeadValue(head), params: foldExtendedParameters(raw) }
}

/**
 * Reduces `text/html (hypertext)` to `text/html`.
 *
 * RFC 5322 permits a comment anywhere whitespace is allowed in a structured
 * header, and comparing the untokenised head against `text/html` fails on one —
 * which means the message loses its body rather than merely its comment.
 */
function tokeniseHeadValue(head: string): string {
  return (
    head
      .replace(/\([^)]*\)/g, ' ')
      .trim()
      .split(/[\s]+/)[0] || ''
  )
}

function unquote(value: string): string {
  if (!value.startsWith('"')) return value
  return value.replace(/^"(.*)"$/, '$1').replace(/\\(.)/g, '$1')
}

/**
 * Folds RFC 2231 continuations and extended values back into plain parameters.
 *
 * Outlook splits a long filename across `filename*0*`/`filename*1*` and encodes
 * anything non-ASCII as `charset''percent-escapes`. Keyed off the literal name,
 * neither form is ever seen, and the file arrives called "attachment".
 */
function foldExtendedParameters(raw: Record<string, string>): Record<string, string> {
  const params: Record<string, string> = {}
  const continuations = new Map<string, { index: number; value: string; extended: boolean }[]>()

  for (const [key, value] of Object.entries(raw)) {
    // `filename*0` numbers a section, `filename*` marks a value that carries its
    // own charset, and `filename*0*` does both.
    const match = key.match(/^([^*]+)(?:\*(\d+))?(\*)?$/)
    if (!match || (match[2] === undefined && match[3] === undefined)) {
      params[key] = value
      continue
    }
    const segments = continuations.get(match[1]) || []
    segments.push({ index: match[2] === undefined ? 0 : Number(match[2]), value, extended: match[3] !== undefined })
    continuations.set(match[1], segments)
  }

  // RFC 2231 §4 makes the extended form authoritative when both are present.
  for (const [name, segments] of continuations) {
    segments.sort((a, b) => a.index - b.index)

    let charset = 'utf-8'
    const bytes: number[] = []

    segments.forEach((segment, position) => {
      let text = segment.value
      if (segment.extended && position === 0) {
        const parts = text.split("'")
        if (parts.length >= 3) {
          if (parts[0]) charset = parts[0].toLowerCase()
          text = parts.slice(2).join("'")
        }
      }
      for (const byte of segment.extended ? percentDecodeToBytes(text) : new TextEncoder().encode(text)) {
        bytes.push(byte)
      }
    })

    params[name] = decodeBytes(Uint8Array.from(bytes), charset)
  }

  return params
}

function percentDecodeToBytes(value: string): Uint8Array {
  const bytes: number[] = []

  for (let i = 0; i < value.length; i++) {
    if (value[i] === '%' && /^[0-9A-F]{2}$/i.test(value.substr(i + 1, 2))) {
      bytes.push(parseInt(value.substr(i + 1, 2), 16))
      i += 2
      continue
    }
    bytes.push(value.charCodeAt(i) & 0xff)
  }

  return Uint8Array.from(bytes)
}

function splitOnUnquotedSemicolons(value: string): string[] {
  const out: string[] = []
  let current = ''
  let inQuotes = false
  let escaped = false

  for (const char of value) {
    if (escaped) {
      escaped = false
      current += char
      continue
    }
    // A backslash inside a quoted string escapes the next character, so a
    // filename of `a\"b.pdf` must not be read as leaving the quoted string.
    if (char === '\\' && inQuotes) {
      escaped = true
      current += char
      continue
    }
    if (char === '"') inQuotes = !inQuotes
    if (char === ';' && !inQuotes) {
      out.push(current)
      current = ''
      continue
    }
    current += char
  }
  out.push(current)
  return out
}

/**
 * Splits a multipart body on its boundary.
 *
 * Boundary lines are matched whole rather than by `indexOf`, because a nested
 * boundary is frequently the parent's boundary plus a suffix — splitting on a
 * substring merges the two levels and loses the inner parts.
 */
function splitMultipart(body: string, boundary: string): string[] {
  const open = `--${boundary}`
  const close = `--${boundary}--`
  const parts: string[] = []
  let current: string[] | null = null

  for (const line of body.split('\n')) {
    const trimmed = line.replace(/\r$/, '').trimEnd()

    if (trimmed === close) {
      if (current) parts.push(current.join('\n'))
      return parts
    }
    if (trimmed === open) {
      if (current) parts.push(current.join('\n'))
      current = []
      continue
    }
    if (current) current.push(line)
  }

  if (current) parts.push(current.join('\n'))
  return parts
}

interface BodyAccumulator {
  html: string
  text: string
  attachments: EmailAttachment[]
}

/**
 * Decides whether a leaf part is the message body rather than a file.
 *
 * The presence of a name is deliberately not the test. RFC 2183 `inline` means
 * "display this", and a filename alongside it is legal — Zimbra and Notes
 * gateways emit `inline; filename="message.html"` for the body itself, and
 * disqualifying it renders the message as "No message content" with a bogus
 * attachment beside it. A name with no disposition at all is the older way of
 * marking an attachment, so that one still counts as a file.
 */
function isBodyPart(part: MimePart, filename: string): boolean {
  if (part.mediaType !== 'text/plain' && part.mediaType !== 'text/html') return false
  if (part.disposition === 'attachment') return false
  return part.disposition === 'inline' || !filename
}

function appendBody(acc: BodyAccumulator, mediaType: string, value: string): void {
  if (!value) return
  if (mediaType === 'text/html') acc.html = acc.html ? `${acc.html}\n${value}` : value
  else acc.text = acc.text ? `${acc.text}\n${value}` : value
}

/**
 * Picks one body out of a set of alternatives.
 *
 * RFC 2046 §5.1.4 orders alternatives worst-first, so the last one a reader can
 * display is the one the sender intended. Each candidate is collected on its own
 * so that a later alternative supersedes an earlier one instead of appending to
 * it — which is the opposite of how every other multipart subtype combines.
 * Attachments are shared, because a part nested under a losing alternative is
 * still a file the reader should see.
 */
function collectAlternative(segments: MimePart[], acc: BodyAccumulator, depth: number): void {
  let html = ''
  let text = ''

  for (const segment of segments) {
    const candidate: BodyAccumulator = { html: '', text: '', attachments: acc.attachments }
    collectParts(segment, candidate, depth + 1)
    if (candidate.html) html = candidate.html
    if (candidate.text) text = candidate.text
  }

  appendBody(acc, 'text/html', html)
  appendBody(acc, 'text/plain', text)
}

function collectParts(part: MimePart, acc: BodyAccumulator, depth: number): void {
  if (depth > MAX_DEPTH) return

  if (part.mediaType.startsWith('multipart/')) {
    const boundary = part.params['boundary']
    if (!boundary) return
    const segments = splitMultipart(part.raw, boundary).map(parsePart)

    if (part.mediaType === 'multipart/alternative') {
      collectAlternative(segments, acc, depth)
      return
    }

    // Every other multipart subtype displays all of its parts, in order
    // (RFC 2046 §5.1.3), so each one appends rather than competing.
    for (const segment of segments) collectParts(segment, acc, depth + 1)
    return
  }

  const filename = part.dispositionParams['filename'] || part.params['name'] || ''

  if (isBodyPart(part, filename)) {
    appendBody(acc, part.mediaType, decodeTextPart(part))
    return
  }

  const base64 = toBase64Payload(part)
  if (!base64) return

  acc.attachments.push({
    filename: decodeHeaderValue(filename) || 'attachment',
    contentType: part.mediaType,
    contentId: (part.headers['content-id'] || '').replace(/^<|>$/g, '') || undefined,
    inline: part.disposition === 'inline',
    renderedInline: false,
    base64,
    size: Math.floor((base64.length * 3) / 4),
  })
}

/**
 * Decodes a text part to a string.
 *
 * Both encodings are decoded to bytes first and only then to text. Going straight
 * to characters — as `String.fromCharCode` on each quoted-printable pair does —
 * treats every byte as one character, so a UTF-8 sequence such as the narrow
 * no-break space Gmail puts in dates arrives as mojibake.
 */
function decodeTextPart(part: MimePart): string {
  const charset = (part.params['charset'] || 'utf-8').toLowerCase()

  if (part.encoding === 'base64') {
    return decodeBytes(base64ToBytes(stripWhitespace(part.raw)), charset)
  }
  if (part.encoding === 'quoted-printable') {
    return decodeBytes(quotedPrintableToBytes(part.raw), charset)
  }
  // 8bit, 7bit, binary and an absent header all mean the payload is already
  // bytes. Returning it verbatim ignores the declared charset, so the same
  // message reads correctly in quoted-printable and as mojibake in 8bit.
  return decodeBytes(latin1ToBytes(part.raw), charset)
}

/** Returns the part's payload as base64, ready for a data: URI. */
function toBase64Payload(part: MimePart): string {
  if (part.encoding === 'base64') return stripWhitespace(part.raw)

  const bytes = part.encoding === 'quoted-printable' ? quotedPrintableToBytes(part.raw) : latin1ToBytes(part.raw)
  return bytesToBase64(bytes)
}

/**
 * Both halves of the data: URI are sender-controlled and land inside an `src="`
 * attribute, so both are checked against what they are allowed to be rather than
 * escaped. A `Content-Type` head of `image/png"><style>…` otherwise closes the
 * attribute and lands live markup in the document; `default-src 'none'` and the
 * empty sandbox keep that to CSS, but `style-src 'unsafe-inline'` cannot be
 * tightened without breaking email, so the injected style still hides the real
 * message. A part that fails either check keeps its cid: reference, which renders
 * as a broken image — the same fallback as a reference that matches nothing.
 */
const MEDIA_TYPE_PATTERN = /^[a-z0-9][a-z0-9!#$^_.+-]*\/[a-z0-9][a-z0-9!#$^_.+-]*$/
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/

/**
 * Matches a cid: reference in attribute or `url()` position only.
 *
 * Rewriting on the bare token turns "my id is cid:i" in visible prose into a
 * data: URI mid-sentence. Requiring an `=` or a `url(` in front costs nothing —
 * a reference the body can actually load always has one.
 */
const CID_REFERENCE = /(=\s*["']?|url\(\s*["']?)cid:([^"'\s>)]+)/gi

/**
 * Replaces every cid: reference with the bytes of the part it names.
 *
 * A reference resolves against nothing inside a srcDoc iframe, so an unresolved
 * one always renders broken. One with no matching part is left alone rather than
 * removed: a visibly missing image is a truer record than a silent deletion.
 */
function resolveCidReferences(html: string, attachments: EmailAttachment[]): string {
  const byCid = new Map<string, EmailAttachment>()
  const byLowercaseCid = new Map<string, EmailAttachment | null>()

  for (const attachment of attachments) {
    if (!attachment.contentId) continue
    byCid.set(attachment.contentId, attachment)
    // RFC 2392 content ids are case-sensitive, so a fold to lower case can make
    // two distinct parts collide. Case-insensitive lookup stays as a fallback for
    // senders that vary the case, but only where it names exactly one part.
    const lowercase = attachment.contentId.toLowerCase()
    byLowercaseCid.set(lowercase, byLowercaseCid.has(lowercase) ? null : attachment)
  }
  if (byCid.size === 0) return html

  let budget = MAX_INLINE_BYTES
  // A body referencing the same image three times should embed it once and be
  // charged for it once, or the third reference falls off the end of the budget.
  const embedded = new Map<EmailAttachment, string>()

  return html.replace(CID_REFERENCE, (match, prefix: string, reference: string) => {
    const attachment = byCid.get(reference) ?? byLowercaseCid.get(reference.toLowerCase())
    if (!attachment) return match

    const already = embedded.get(attachment)
    if (already) return `${prefix}${already}`

    if (attachment.base64.length > budget) return match
    if (!MEDIA_TYPE_PATTERN.test(attachment.contentType) || !BASE64_PATTERN.test(attachment.base64)) return match

    budget -= attachment.base64.length
    attachment.renderedInline = true

    const uri = `data:${attachment.contentType};base64,${attachment.base64}`
    embedded.set(attachment, uri)
    return `${prefix}${uri}`
  })
}

function stripWhitespace(value: string): string {
  return value.replace(/[\s]/g, '')
}

function latin1ToBytes(value: string): Uint8Array {
  return Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff)
}

function base64ToBytes(value: string): Uint8Array {
  try {
    return latin1ToBytes(atob(value))
  } catch {
    return new Uint8Array()
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  try {
    return btoa(binary)
  } catch {
    return ''
  }
}

function quotedPrintableToBytes(value: string): Uint8Array {
  const withoutSoftBreaks = value.replace(/=\r?\n/g, '')
  const bytes: number[] = []

  for (let i = 0; i < withoutSoftBreaks.length; i++) {
    const char = withoutSoftBreaks[i]
    if (char === '=' && /^[0-9A-F]{2}$/i.test(withoutSoftBreaks.substr(i + 1, 2))) {
      bytes.push(parseInt(withoutSoftBreaks.substr(i + 1, 2), 16))
      i += 2
      continue
    }
    bytes.push(char.charCodeAt(0) & 0xff)
  }

  return Uint8Array.from(bytes)
}

function decodeBytes(bytes: Uint8Array, charset: string): string {
  try {
    return new TextDecoder(charset).decode(bytes)
  } catch {
    return new TextDecoder('utf-8').decode(bytes)
  }
}

const ENCODED_WORD = /=\?([^?]+)\?([BbQq])\?([^?]*)\?=/g
/** A run of encoded words separated by nothing but the whitespace RFC 2047 §6.2 discards. */
const ENCODED_WORD_RUN = /=\?[^?]+\?[BbQq]\?[^?]*\?=(?:[ \t]*=\?[^?]+\?[BbQq]\?[^?]*\?=)*/g

/** Decodes RFC 2047 encoded words, which is how any non-ASCII header arrives. */
export function decodeHeaderValue(value: string): string {
  return value.replace(ENCODED_WORD_RUN, decodeEncodedWordRun)
}

/**
 * Decodes adjacent encoded words as one byte run.
 *
 * RFC 2047 §5 permits a multi-byte character to be split across two encoded
 * words, and CJK and emoji clients do it constantly. Decoding each word to text
 * on its own truncates the sequence at the seam and yields the same mojibake
 * this parser decodes through bytes to avoid. §6.2 also makes the whitespace
 * between two encoded words a separator rather than content, so it is dropped.
 */
function decodeEncodedWordRun(run: string): string {
  let out = ''
  let charset = ''
  let bytes: number[] = []

  const flush = () => {
    if (bytes.length === 0) return
    out += decodeBytes(Uint8Array.from(bytes), charset)
    bytes = []
  }

  for (const [, wordCharset, encoding, text] of run.matchAll(ENCODED_WORD)) {
    const lowercase = wordCharset.toLowerCase()
    if (lowercase !== charset) {
      flush()
      charset = lowercase
    }
    const decoded = encoding.toLowerCase() === 'b' ? base64ToBytes(text) : quotedPrintableToBytes(text.replace(/_/g, ' '))
    for (const byte of decoded) bytes.push(byte)
  }

  flush()
  return out
}

function stripTags(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}
