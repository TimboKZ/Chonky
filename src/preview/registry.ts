import { getExtension } from '../util/names'
import { getFileKind } from '../util/mime'
import type { FileEntry } from '../core/types'

/** How the preview surface should render a given file. */
export type PreviewStrategy =
  | 'image'
  | 'video'
  | 'audio'
  | 'iframe'
  | 'csv'
  | 'html'
  | 'eml'
  | 'stl'
  | 'xlsx'
  | 'docx'
  | 'server-render'
  | 'none'

/** Types the backend can render to an image server-side. */
const SERVER_RENDERABLE = new Set([
  'pdf', 'pptx', 'ppt', 'doc', 'txt', 'json', 'xml', 'md', 'log',
  'js', 'ts', 'tsx', 'jsx', 'css', 'scss', 'sass', 'less', 'yaml', 'yml',
])

const IFRAME_MIME = new Set(['application/pdf', 'text/plain', 'audio/mpeg'])

/**
 * Picks the viewer for an entry.
 *
 * Extension is checked before MIME type throughout, because the file-storage
 * service reports `application/octet-stream` for anything it can't sniff — which
 * covers most of the interesting office formats.
 */
export function getPreviewStrategy(entry: FileEntry): PreviewStrategy {
  if (entry.isDir) return 'none'

  const extension = getExtension(entry.name)
  const mimeType = (entry.mimeType ?? '').toLowerCase()

  if (extension === 'eml') return 'eml'
  if (extension === 'csv' || mimeType === 'text/csv') return 'csv'
  if (extension === 'html' || extension === 'htm' || mimeType === 'text/html') return 'html'
  if (extension === 'stl') return 'stl'
  if (extension === 'xlsx' || extension === 'xls') return 'xlsx'
  if (extension === 'docx') return 'docx'

  const kind = getFileKind(entry)
  if (kind === 'image') return 'image'
  if (kind === 'video') return 'video'
  if (kind === 'audio') return 'audio'

  if (IFRAME_MIME.has(mimeType) || extension === 'pdf') return 'iframe'
  if (SERVER_RENDERABLE.has(extension)) return 'server-render'

  return 'none'
}

export function isPreviewable(entry: FileEntry): boolean {
  return getPreviewStrategy(entry) !== 'none'
}

/** Strategies whose viewer needs the file's text. */
export const TEXT_STRATEGIES: ReadonlySet<PreviewStrategy> = new Set<PreviewStrategy>(['csv', 'html'])
/** Strategies whose viewer needs the file's bytes. */
export const BINARY_STRATEGIES: ReadonlySet<PreviewStrategy> = new Set<PreviewStrategy>(['stl', 'xlsx', 'docx', 'eml'])
