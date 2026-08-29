/** Extension without the dot, lowercased. Returns '' when the name carries none. */
export function getExtension(fileName: string): string {
  const base = fileName.replace(/\/+$/, '')
  const dot = base.lastIndexOf('.')
  if (dot <= 0 || dot === base.length - 1) return ''
  return base.slice(dot + 1).toLowerCase()
}

/** Name with its extension stripped. `.gitignore` keeps its leading dot. */
export function getBaseName(fileName: string): string {
  const ext = getExtension(fileName)
  return ext ? fileName.slice(0, -(ext.length + 1)) : fileName
}

/**
 * Middle-truncates a long name for display, keeping both ends legible — the tail
 * matters because it carries the extension and any trailing counter.
 *
 * Display only. Every mutation (rename, move, upload) uses the untruncated name;
 * a truncated name reaching an API would create a file called `foo ... bar.pdf`.
 */
export function truncateMiddle(name: string, max = 30): string {
  if (name.length <= max) return name
  const keep = Math.max(4, Math.floor((max - 5) / 2))
  return `${name.slice(0, keep)} ... ${name.slice(-keep)}`
}

/**
 * Strips characters the FSG file-storage backend rejects, preserving the
 * extension. An empty result falls back to `file`, so a name made entirely of
 * illegal characters still uploads rather than failing with a blank name.
 */
export function sanitizeFileName(fileName: string): string {
  const illegal = /[^a-zA-Z0-9()._\s-]/g
  const dot = fileName.lastIndexOf('.')
  if (dot > 0) {
    const name = fileName.slice(0, dot).replace(illegal, '').replace(/\s+/g, ' ').trim()
    const ext = fileName.slice(dot + 1).replace(illegal, '').trim()
    return name.length > 0 ? `${name}.${ext}` : `file.${ext}`
  }
  const sanitized = fileName.replace(illegal, '').replace(/\s+/g, ' ').trim()
  return sanitized.length > 0 ? sanitized : 'file'
}

export interface NameValidation {
  valid: boolean
  message?: string
}

export function validateName(name: string): NameValidation {
  if (!name || name.trim().length === 0) return { valid: false, message: 'Name cannot be empty' }
  if (/[^a-zA-Z0-9()._\s-]/.test(name)) return { valid: false, message: 'Name contains illegal characters' }
  if (name.startsWith('.') || name.endsWith('.')) return { valid: false, message: 'Name cannot start or end with periods' }
  return { valid: true }
}

/**
 * Picks a name that doesn't collide with `taken`, inserting " (2)", " (3)", … before
 * the extension. Used for copy/paste, moves, and uploads into a folder that already
 * holds the name.
 */
export function uniqueName(desired: string, taken: Iterable<string>): string {
  const used = new Set(taken)
  if (!used.has(desired)) return desired

  const ext = getExtension(desired)
  const stem = (ext ? desired.slice(0, -(ext.length + 1)) : desired).replace(/ \(\d+\)$/, '')
  const suffix = ext ? `.${ext}` : ''

  let n = 2
  while (used.has(`${stem} (${n})${suffix}`)) n++
  return `${stem} (${n})${suffix}`
}

/** Joins path segments into a single normalised, slash-separated path. */
export function joinPath(...segments: (string | undefined | null)[]): string {
  const joined = segments.filter((s): s is string => !!s).join('/')
  return joined.replace(/\/{2,}/g, '/')
}
