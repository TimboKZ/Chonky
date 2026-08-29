import { getExtension } from './names'

/** Broad file categories the UI keys icon, colour, and preview choice off. */
export type FileKind =
  | 'folder'
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'spreadsheet'
  | 'document'
  | 'presentation'
  | 'archive'
  | 'code'
  | 'text'
  | 'email'
  | 'model'
  | 'unknown'

const BY_EXTENSION: Record<string, FileKind> = {
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', bmp: 'image', webp: 'image', svg: 'image',
  heic: 'image', heif: 'image', avif: 'image', ico: 'image', tif: 'image', tiff: 'image',

  mp4: 'video', mov: 'video', m4v: 'video', webm: 'video', ogv: 'video', avi: 'video', mkv: 'video',

  mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio', flac: 'audio', aac: 'audio',

  pdf: 'pdf',

  xlsx: 'spreadsheet', xls: 'spreadsheet', xlsm: 'spreadsheet', csv: 'spreadsheet', tsv: 'spreadsheet',
  docx: 'document', doc: 'document', rtf: 'document', odt: 'document',
  pptx: 'presentation', ppt: 'presentation', odp: 'presentation',

  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive', bz2: 'archive',

  js: 'code', jsx: 'code', ts: 'code', tsx: 'code', json: 'code', xml: 'code', yaml: 'code', yml: 'code',
  html: 'code', htm: 'code', css: 'code', scss: 'code', sass: 'code', less: 'code', py: 'code', go: 'code',
  rb: 'code', java: 'code', c: 'code', h: 'code', cpp: 'code', rs: 'code', sh: 'code', sql: 'code',

  txt: 'text', md: 'text', log: 'text',

  eml: 'email', msg: 'email',

  stl: 'model', obj: 'model', gltf: 'model', glb: 'model', '3mf': 'model',
}

const MIME_PREFIX: [string, FileKind][] = [
  ['image/', 'image'],
  ['video/', 'video'],
  ['audio/', 'audio'],
  ['text/', 'text'],
]

const MIME_EXACT: Record<string, FileKind> = {
  'application/pdf': 'pdf',
  'application/json': 'code',
  'application/xml': 'code',
  'text/html': 'code',
  'text/csv': 'spreadsheet',
  'application/zip': 'archive',
  'application/x-directory': 'folder',
  'application/vnd.google-apps.folder': 'folder',
  'application/vnd.google-apps.document': 'document',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'application/vnd.ms-excel': 'spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
  'application/vnd.ms-powerpoint': 'presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
  'application/msexcel': 'spreadsheet',
  'application/x-msexcel': 'spreadsheet',
  'application/x-ms-excel': 'spreadsheet',
  'application/x-excel': 'spreadsheet',
  'application/xls': 'spreadsheet',
  'application/x-xls': 'spreadsheet',
  'message/rfc822': 'email',
}

/**
 * Classifies a file. Extension wins over MIME type: the FSG file-storage backend
 * reports `application/octet-stream` for anything it can't sniff, which would
 * flatten most of the interesting types to `unknown`.
 */
export function getFileKind(input: { name?: string; mimeType?: string; isDir?: boolean }): FileKind {
  if (input.isDir) return 'folder'

  const ext = getExtension(input.name ?? '')
  if (ext && BY_EXTENSION[ext]) return BY_EXTENSION[ext]

  const mime = (input.mimeType ?? '').toLowerCase()
  if (MIME_EXACT[mime]) return MIME_EXACT[mime]
  for (const [prefix, kind] of MIME_PREFIX) {
    if (mime.startsWith(prefix)) return kind
  }
  return 'unknown'
}

/** Sentence-case label for the kind, used in the details view's Type column. */
export function getKindLabel(kind: FileKind): string {
  switch (kind) {
    case 'folder': return 'Folder'
    case 'image': return 'Image'
    case 'video': return 'Video'
    case 'audio': return 'Audio'
    case 'pdf': return 'PDF'
    case 'spreadsheet': return 'Spreadsheet'
    case 'document': return 'Document'
    case 'presentation': return 'Presentation'
    case 'archive': return 'Archive'
    case 'code': return 'Code'
    case 'text': return 'Text'
    case 'email': return 'Email'
    case 'model': return '3D model'
    default: return 'File'
  }
}

export function isHeic(input: { name?: string; mimeType?: string }): boolean {
  const mime = (input.mimeType ?? '').toLowerCase()
  if (mime === 'image/heic' || mime === 'image/heif' || mime === 'image/heic-sequence' || mime === 'image/heif-sequence') return true
  const ext = getExtension(input.name ?? '')
  return ext === 'heic' || ext === 'heif'
}
