import { describe, expect, it } from 'vitest'

import { decodeHeaderValue, parseEmlContent } from './parse-eml'

/**
 * The messages below are reduced from real ones captured off SendGrid Inbound
 * Parse. Each reproduces a shape that broke the previous parser: nesting past one
 * level, transfer encodings, and cid: references that resolve against nothing
 * inside an iframe.
 *
 * A message is bytes, so a fixture carrying a non-ASCII part writes it as the
 * bytes that part declares — `\xE9`, not `é`. That is what parseEmlContent is
 * handed at runtime and the difference is the whole point of the charset paths.
 */

const NESTED_WITH_INLINE_IMAGE = [
  'From: Ryan Olson <ryan.olson@fsgi.com>',
  'To: 92J14019@jobs.fsgapps.com',
  'Subject: Fwd: Engage Release Notes',
  'Message-ID: <abc@mail.gmail.com>',
  'Date: Thu, 20 Aug 2026 12:02:33 -0500',
  'Content-Type: multipart/related; boundary="00000000000068d56006597d7db5"',
  '',
  '--00000000000068d56006597d7db5',
  'Content-Type: multipart/alternative; boundary="00000000000068d55f06597d7db4"',
  '',
  '--00000000000068d55f06597d7db4',
  'Content-Type: text/plain; charset="UTF-8"',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  'Date: Fri, Aug 7, 2026 at 11:57=E2=80=AFAM',
  '',
  '--00000000000068d55f06597d7db4',
  'Content-Type: text/html; charset="UTF-8"',
  'Content-Transfer-Encoding: quoted-printable',
  '',
  '<div dir=3D"ltr"><img src=3D"cid:ii_msj6io360" alt=3D"image.png"></div>',
  '',
  '--00000000000068d55f06597d7db4--',
  '--00000000000068d56006597d7db5',
  'Content-Type: image/png; name="image.png"',
  'Content-Disposition: inline; filename="image.png"',
  'Content-Transfer-Encoding: base64',
  'Content-ID: <ii_msj6io360>',
  '',
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmM',
  'IQAAAABJRU5ErkJggg==',
  '',
  '--00000000000068d56006597d7db5--',
].join('\n')

/** The image above, with the line wrap the sender applied taken back out. */
const INLINE_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

const FLAT_PLAIN_TEXT = [
  'From: Avra Garcia <avra.garcia@icloud.com>',
  'To: 92J14019@jobs.fsgapps.com',
  'Subject: On my way',
  'Message-Id: <DEF@icloud.com>',
  'Content-Type: text/plain; charset=us-ascii',
  '',
  'Sent from my iPhone',
].join('\n')

/**
 * Outlook derives a nested boundary from its parent's by appending to it, so the
 * inner delimiter line begins with the whole of the outer one. The suffix starts
 * with a hyphen so the inner delimiter also begins with the outer *close*
 * delimiter, which puts both comparisons in `splitMultipart` under test.
 *
 * The inner part is a multipart/alternative because that is what makes loose
 * matching visible: a flattened tree appends both alternatives instead of
 * choosing between them.
 */
const PREFIX_BOUNDARIES = [
  'From: a@b.c',
  'Subject: prefixed boundaries',
  'Content-Type: multipart/mixed; boundary="----=_NextPart_000_0012"',
  '',
  '------=_NextPart_000_0012',
  'Content-Type: multipart/alternative; boundary="----=_NextPart_000_0012--01D9"',
  '',
  '------=_NextPart_000_0012--01D9',
  'Content-Type: text/plain',
  '',
  'WORST',
  '------=_NextPart_000_0012--01D9',
  'Content-Type: text/plain',
  '',
  'BEST',
  '------=_NextPart_000_0012--01D9--',
  '------=_NextPart_000_0012',
  'Content-Type: application/pdf; name="rfi.pdf"',
  'Content-Disposition: attachment; filename="rfi.pdf"',
  'Content-Transfer-Encoding: base64',
  '',
  'JVBERi0=',
  '------=_NextPart_000_0012--',
].join('\n')

/** A message with `levels` nested multiparts wrapped around one text part. */
function nestedToDepth(levels: number): string {
  const lines = ['Content-Type: multipart/mixed; boundary="B0"', '']
  for (let i = 0; i < levels - 1; i++) {
    lines.push(`--B${i}`, `Content-Type: multipart/mixed; boundary="B${i + 1}"`, '')
  }
  lines.push(`--B${levels - 1}`, 'Content-Type: text/plain', '', 'DEEP-BODY')
  for (let i = levels - 1; i >= 0; i--) lines.push(`--B${i}--`)
  return lines.join('\n')
}

describe('parseEmlContent', () => {
  it('finds the html body nested inside multipart/alternative inside multipart/related', () => {
    const parsed = parseEmlContent(NESTED_WITH_INLINE_IMAGE)

    // The previous parser split only on the top-level boundary, so a body one
    // level down was never found and the viewer fell back to dumping raw MIME.
    expect(parsed.htmlBody).toBeDefined()
    expect(parsed.htmlBody).toContain('<div dir="ltr">')
  })

  it('reads a flat message with no multipart wrapper', () => {
    const parsed = parseEmlContent(FLAT_PLAIN_TEXT)

    expect(parsed.body).toBe('Sent from my iPhone')
    expect(parsed.htmlBody).toBeUndefined()
    expect(parsed.attachments).toHaveLength(0)
  })

  it('reads Message-Id whatever case the client used', () => {
    // Apple sends Message-Id, Gmail sends Message-ID.
    expect(parseEmlContent(FLAT_PLAIN_TEXT).messageId).toBe('<DEF@icloud.com>')
    expect(parseEmlContent(NESTED_WITH_INLINE_IMAGE).messageId).toBe('<abc@mail.gmail.com>')
  })

  it('joins a folded header rather than reading only its first line', () => {
    const message = [
      'From: a@b.c',
      'Subject: a very long subject that the client',
      '\twrapped onto a second line',
      'Content-Type: text/plain',
      '',
      'body',
    ].join('\n')

    expect(parseEmlContent(message).subject).toBe('a very long subject that the client wrapped onto a second line')
  })

  it('survives a message that is not MIME at all', () => {
    const parsed = parseEmlContent('this is not a message')

    expect(parsed.subject).toBe('No Subject')
    expect(parsed.attachments).toHaveLength(0)
  })
})

describe('header block', () => {
  it('ends the headers only on an empty line, not on a line of whitespace', () => {
    // RFC 5322 unfolds a whitespace-only line into the header above it. Ending
    // the block there instead leaves Content-Type unread and dumps the rest of
    // the message as raw MIME — the exact failure this parser exists to remove.
    const message = ['From: a@b.c', 'Subject: s', ' ', 'Content-Type: text/html', '', '<p>hi</p>'].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).toBe('<p>hi</p>')
    expect(parsed.subject).toBe('s')
    expect(parsed.body).not.toContain('Content-Type')
  })

  it('reads a media type carrying a comment', () => {
    // RFC 5322 allows a comment anywhere whitespace is legal in a structured
    // header, and an untokenised compare against "text/html" fails on one.
    const message = ['From: a@b.c', 'Content-Type: text/html (hypertext); charset=utf-8', '', '<p>commented</p>'].join('\n')

    expect(parseEmlContent(message).htmlBody).toBe('<p>commented</p>')
  })
})

describe('boundaries', () => {
  it('does not treat a nested boundary that starts with its parent as the parent', () => {
    const parsed = parseEmlContent(PREFIX_BOUNDARIES)

    // Matching the delimiter by prefix or substring flattens the alternative into
    // its parent, which then appends both alternatives instead of choosing one.
    expect(parsed.body).toBe('BEST')
  })

  it('keeps the parts either side of a nested boundary', () => {
    const parsed = parseEmlContent(PREFIX_BOUNDARIES)

    expect(parsed.attachments.map((a) => a.filename)).toEqual(['rfi.pdf'])
  })

  it('does not confuse the nested boundary in a real Gmail message with its parent', () => {
    const parsed = parseEmlContent(NESTED_WITH_INLINE_IMAGE)

    expect(parsed.attachments).toHaveLength(1)
    expect(parsed.attachments[0].filename).toBe('image.png')
  })
})

describe('body selection', () => {
  it('treats an inline part carrying a filename as the body', () => {
    // RFC 2183 "inline" means display this, and Zimbra and Notes gateways name
    // the body part. Disqualifying it renders "No message content" and lists the
    // message itself as an attachment.
    const message = [
      'From: a@b.c',
      'Content-Type: text/html; charset=utf-8; name="message.html"',
      'Content-Disposition: inline; filename="message.html"',
      '',
      '<p>THE BODY</p>',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).toBe('<p>THE BODY</p>')
    expect(parsed.attachments).toHaveLength(0)
  })

  it('treats a named text part with no disposition as a file', () => {
    // A name and no Content-Disposition is the older way of marking an
    // attachment, so this one must not be swallowed as the body.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '--X',
      'Content-Type: text/plain; name="notes.txt"',
      '',
      'noted',
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.body).toBe('see attached')
    expect(parsed.attachments.map((a) => a.filename)).toEqual(['notes.txt'])
  })

  it('keeps every text part under multipart/mixed, in order', () => {
    // RFC 2046 §5.1.3: mixed parts are all displayed. Taking only the first
    // silently deletes the second.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'FIRST',
      '--X',
      'Content-Type: text/plain',
      '',
      'SECOND',
      '--X--',
    ].join('\n')

    expect(parseEmlContent(message).body).toBe('FIRST\nSECOND')
  })

  it('takes the last alternative under multipart/alternative', () => {
    // RFC 2046 §5.1.4 orders alternatives worst-first, so the richest the reader
    // can display is the last one, not the first.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/alternative; boundary="X"',
      '',
      '--X',
      'Content-Type: text/html',
      '',
      '<p>WORST</p>',
      '--X',
      'Content-Type: text/plain',
      '',
      'plain',
      '--X',
      'Content-Type: text/html',
      '',
      '<p>RICHEST</p>',
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).toBe('<p>RICHEST</p>')
  })

  it('does not treat the body alternatives as attachments', () => {
    expect(parseEmlContent(NESTED_WITH_INLINE_IMAGE).attachments.map((a) => a.filename)).toEqual(['image.png'])
  })

  it('keeps an attachment that also carries a Content-ID', () => {
    // Gmail stamps a Content-ID on ordinary attachments too, so "has a cid" does
    // not mean "is displayed inline".
    const message = [
      'From: a@b.c',
      'Subject: report',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '',
      '--X',
      'Content-Type: application/json; name="data.json"',
      'Content-Disposition: attachment; filename="data.json"',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <f_abc123>',
      '',
      'eyJhIjoxfQ==',
      '',
      '--X--',
    ].join('\n')

    const parsed = parseEmlContent(message)
    expect(parsed.attachments).toHaveLength(1)
    expect(parsed.attachments[0].filename).toBe('data.json')
    expect(parsed.attachments[0].inline).toBe(false)
  })

  it('blanks the body rather than descending forever past the depth bound', () => {
    // A self-referential boundary cannot recurse — the delimiter lines are
    // consumed — so what the bound actually decides is where a legally deep
    // message stops being read. Both sides of that line are pinned here.
    expect(parseEmlContent(nestedToDepth(12)).body).toBe('DEEP-BODY')
    expect(parseEmlContent(nestedToDepth(13)).body).toBe('')
  })

  it('does not recurse without bound on a self-referential boundary', () => {
    const message = [
      'Content-Type: multipart/mixed; boundary="LOOP"',
      '',
      '--LOOP',
      'Content-Type: multipart/mixed; boundary="LOOP"',
      '',
      '--LOOP',
      'Content-Type: text/plain',
      '',
      'deep',
      '--LOOP--',
    ].join('\n')

    expect(() => parseEmlContent(message)).not.toThrow()
  })
})

describe('transfer encodings and charsets', () => {
  it('decodes quoted-printable through bytes so UTF-8 survives', () => {
    const parsed = parseEmlContent(NESTED_WITH_INLINE_IMAGE)

    // =E2=80=AF is a narrow no-break space. Decoding each pair straight to a
    // character renders it as "â€¯".
    expect(parsed.body).toContain('11:57\u202FAM')
    expect(parsed.body).not.toContain('â')
  })

  it('honours the charset on an 8bit part', () => {
    // 8bit, 7bit and an absent header all mean the payload is already bytes.
    // Handing those back verbatim leaves them as whatever the byte values happen
    // to be as characters, so the same message is correct in quoted-printable and
    // mojibake in 8bit. UTF-8 over 8bit is what Gmail sends.
    const utf8 = ['From: a@b.c', 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: 8bit', '', 'caf\xC3\xA9 cr\xC3\xA8me'].join(
      '\n',
    )

    expect(parseEmlContent(utf8).body).toBe('café crème')
  })

  it('honours a charset that is not UTF-8', () => {
    const latin1 = ['From: a@b.c', 'Content-Type: text/plain; charset=iso-8859-1', 'Content-Transfer-Encoding: 8bit', '', 'caf\xE9 cr\xE8me'].join(
      '\n',
    )

    expect(parseEmlContent(latin1).body).toBe('café crème')
  })

  it('rejoins base64 split across the lines the sender wrapped it onto', () => {
    const parsed = parseEmlContent(NESTED_WITH_INLINE_IMAGE)

    // Reading only the first line yields a data: URI that still looks plausible
    // and decodes to a truncated image, which is every wrapped attachment there
    // is — so the whole payload is asserted, not a prefix of it.
    expect(parsed.attachments[0].base64).toBe(INLINE_IMAGE_BASE64)
    expect(parsed.attachments[0].size).toBe(72)
    expect(parsed.htmlBody).toContain(`src="data:image/png;base64,${INLINE_IMAGE_BASE64}"`)
  })
})

describe('cid: resolution', () => {
  it('resolves a cid: reference in attribute position', () => {
    const parsed = parseEmlContent(NESTED_WITH_INLINE_IMAGE)

    expect(parsed.htmlBody).toContain('data:image/png;base64,iVBORw0KGgo')
    expect(parsed.htmlBody).not.toContain('src="cid:')
  })

  it('leaves a cid: token in visible prose alone', () => {
    // The reference the body loads is in attribute position; the same token in a
    // sentence is text, and rewriting it drops a data: URI mid-sentence.
    const message = NESTED_WITH_INLINE_IMAGE.replace('<div dir=3D"ltr">', '<div dir=3D"ltr"><p>my id is cid:ii_msj6io360 and here it is</p>')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).toContain('<p>my id is cid:ii_msj6io360 and here it is</p>')
    expect(parsed.htmlBody).toContain('src="data:image/png;base64,')
  })

  it('leaves a cid: reference with no matching part alone', () => {
    const message = NESTED_WITH_INLINE_IMAGE.replace('cid:ii_msj6io360', 'cid:nothing-matches-this')
    const parsed = parseEmlContent(message)

    // A visibly broken image is a truer record than a silent deletion.
    expect(parsed.htmlBody).toContain('cid:nothing-matches-this')
  })

  it('matches a content id by case before falling back to a case-insensitive match', () => {
    // RFC 2392 content ids are case-sensitive, so folding to lower case makes
    // <A> and <a> collide and shows one image twice.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/related; boundary="X"',
      '',
      '--X',
      'Content-Type: text/html',
      '',
      '<img src="cid:A"><img src="cid:a">',
      '--X',
      'Content-Type: image/png',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <A>',
      '',
      'QUFB',
      '--X',
      'Content-Type: image/gif',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <a>',
      '',
      'YmJi',
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).toContain('<img src="data:image/png;base64,QUFB">')
    expect(parsed.htmlBody).toContain('<img src="data:image/gif;base64,YmJi">')
  })

  it('reads a folded Content-ID', () => {
    // Unfolding leaves " <img1>", so stripping the brackets before trimming
    // keeps the opening one and the reference never matches.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/related; boundary="X"',
      '',
      '--X',
      'Content-Type: text/html',
      '',
      '<img src="cid:img1">',
      '--X',
      'Content-Type: image/png',
      'Content-Transfer-Encoding: base64',
      'Content-ID:',
      '\t<img1>',
      '',
      'QUFB',
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.attachments[0].contentId).toBe('img1')
    expect(parsed.htmlBody).toContain('data:image/png;base64,QUFB')
  })

  it('charges the embedding budget once for an image referenced twice', () => {
    // Without that, a large image referenced three times leaves its last
    // reference broken while the first two show the same bytes.
    const payload = 'A'.repeat(9 * 1024 * 1024)
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/related; boundary="X"',
      '',
      '--X',
      'Content-Type: text/html',
      '',
      '<img src="cid:big"><img src="cid:big">',
      '--X',
      'Content-Type: image/png',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <big>',
      '',
      payload,
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).not.toContain('cid:big')
  })
})

describe('injected markup', () => {
  it('does not let a crafted Content-Type break out of the src attribute', () => {
    // Both halves of the data: URI are sender-controlled and land inside src=".
    // A media type closing the attribute lands live markup in the document; the
    // sandbox holds it to CSS, but style-src 'unsafe-inline' is load-bearing for
    // email, so the injected rule still hides the real message.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/related; boundary="X"',
      '',
      '--X',
      'Content-Type: text/html',
      '',
      '<p>body</p><img src="cid:evil">',
      '--X',
      'Content-Type: image/png"><style>*{display:none}</style><x y="',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <evil>',
      '',
      'QUFB',
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).not.toContain('<style>')
    expect(parsed.htmlBody).toContain('src="cid:evil"')
  })

  it('does not let a crafted payload break out of the src attribute', () => {
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/related; boundary="X"',
      '',
      '--X',
      'Content-Type: text/html',
      '',
      '<p>body</p><img src="cid:evil">',
      '--X',
      'Content-Type: image/png',
      'Content-Transfer-Encoding: base64',
      'Content-ID: <evil>',
      '',
      '"><style>*{display:none}</style><x/y=',
      '--X--',
    ].join('\n')
    const parsed = parseEmlContent(message)

    expect(parsed.htmlBody).not.toContain('<style>')
    expect(parsed.htmlBody).toContain('src="cid:evil"')
  })
})

describe('attachment names', () => {
  it('decodes an RFC 2231 extended filename', () => {
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '--X',
      'Content-Type: application/pdf',
      "Content-Disposition: attachment; filename*=UTF-8''Rapport%20final.pdf",
      'Content-Transfer-Encoding: base64',
      '',
      'JVBERi0=',
      '--X--',
    ].join('\n')

    expect(parseEmlContent(message).attachments[0].filename).toBe('Rapport final.pdf')
  })

  it('joins an RFC 2231 filename split across continuations', () => {
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '--X',
      'Content-Type: application/pdf',
      "Content-Disposition: attachment; filename*0*=UTF-8''Very%20long%20name; filename*1*=%20part%20two.pdf",
      'Content-Transfer-Encoding: base64',
      '',
      'JVBERi0=',
      '--X--',
    ].join('\n')

    expect(parseEmlContent(message).attachments[0].filename).toBe('Very long name part two.pdf')
  })

  it('prefers the extended form when the ASCII fallback is also present', () => {
    // RFC 2231 §4 makes the starred parameter authoritative; senders emit the
    // plain one alongside it for clients that predate the extension.
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '--X',
      'Content-Type: application/pdf',
      'Content-Disposition: attachment; filename="Rapport_final.pdf"; ' + "filename*=UTF-8''Rapport%20final%20%C3%A9t%C3%A9.pdf",
      'Content-Transfer-Encoding: base64',
      '',
      'JVBERi0=',
      '--X--',
    ].join('\n')

    expect(parseEmlContent(message).attachments[0].filename).toBe('Rapport final été.pdf')
  })

  it('unescapes a quoted filename containing a quote', () => {
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '--X',
      'Content-Type: application/pdf',
      'Content-Disposition: attachment; filename="a\\"b.pdf"; size=8',
      'Content-Transfer-Encoding: base64',
      '',
      'JVBERi0=',
      '--X--',
    ].join('\n')

    expect(parseEmlContent(message).attachments[0].filename).toBe('a"b.pdf')
  })

  it('decodes an RFC 2047 encoded word in a filename', () => {
    const message = [
      'From: a@b.c',
      'Content-Type: multipart/mixed; boundary="X"',
      '',
      '--X',
      'Content-Type: text/plain',
      '',
      'see attached',
      '--X',
      'Content-Type: application/pdf',
      'Content-Disposition: attachment; filename="=?utf-8?B?csOpZWwucGRm?="',
      'Content-Transfer-Encoding: base64',
      '',
      'JVBERi0=',
      '--X--',
    ].join('\n')

    expect(parseEmlContent(message).attachments[0].filename).toBe('réel.pdf')
  })
})

describe('decodeHeaderValue', () => {
  it('decodes a base64 encoded word', () => {
    expect(decodeHeaderValue('=?utf-8?B?UkZJIDEy?=')).toBe('RFI 12')
  })

  it('decodes a quoted-printable encoded word, including its underscores', () => {
    expect(decodeHeaderValue('=?utf-8?q?RFI_12?=')).toBe('RFI 12')
  })

  it('decodes multi-byte UTF-8 in a header', () => {
    expect(decodeHeaderValue('=?utf-8?q?caf=C3=A9?=')).toBe('café')
  })

  it('joins a character split across two encoded words', () => {
    // RFC 2047 §5 permits the split and CJK and emoji clients do it constantly.
    // Decoding each word on its own truncates the sequence at the seam.
    expect(decodeHeaderValue('=?utf-8?Q?caf=C3?= =?utf-8?Q?=A9?=')).toBe('café')
  })

  it('drops the whitespace between two adjacent encoded words', () => {
    // RFC 2047 §6.2: the separator is not content, so a folded subject of two
    // encoded words must not gain a space it never had.
    expect(decodeHeaderValue('=?utf-8?B?4pyU?= =?utf-8?B?4pyU?=')).toBe('✔✔')
  })

  it('keeps the whitespace around an encoded word next to plain text', () => {
    expect(decodeHeaderValue('RFI =?utf-8?q?caf=C3=A9?= today')).toBe('RFI café today')
  })

  it('leaves an unencoded header alone', () => {
    expect(decodeHeaderValue('RFI 12 - slab edge')).toBe('RFI 12 - slab edge')
  })
})

describe('renderedInline', () => {
  it('marks only the parts the body actually referenced', () => {
    const parsed = parseEmlContent(NESTED_WITH_INLINE_IMAGE)

    expect(parsed.attachments[0].renderedInline).toBe(true)
  })

  it('leaves an unreferenced attachment unmarked so it is still listed', () => {
    // Gmail stamps a Content-ID on ordinary attachments, so keying off the cid
    // alone would hide a real file from the attachment list.
    const message = NESTED_WITH_INLINE_IMAGE.replace('cid:ii_msj6io360', 'cid:something-else')
    const parsed = parseEmlContent(message)

    expect(parsed.attachments[0].contentId).toBe('ii_msj6io360')
    expect(parsed.attachments[0].renderedInline).toBe(false)
  })
})
