import type { FileEntry } from '../core/types'
import type { FileItem } from './types'

/**
 * Converts a browser entry back into the `FileItem` shape FSG app code expects.
 *
 * The storage adapter keeps the raw API object in `meta.raw`, so a round trip
 * through the browser returns exactly what the service sent — including fields the
 * browser has no concept of, like `area`. The derived fallback covers entries from
 * some other adapter.
 */
export function entryToFileItem(entry: FileEntry): FileItem {
  const raw = entry.meta?.raw as FileItem | undefined
  if (raw) return raw

  return {
    id: entry.id,
    name: entry.name,
    fullName: entry.name,
    parent_id: entry.path ?? '',
    modified_time: entry.modifiedAt ? new Date(entry.modifiedAt).toISOString() : '',
    mime_type: entry.mimeType ?? (entry.isDir ? 'application/x-directory' : ''),
    size: entry.size ?? 0,
    path: entry.path ?? '',
  }
}

/** Converts a `FileItem` into a browser entry, for the preview surfaces that take one. */
export function fileItemToEntry(file: FileItem): FileEntry {
  const modified = Date.parse(file.modified_time)
  return {
    id: file.id,
    name: file.fullName || file.name,
    isDir: file.mime_type === 'application/x-directory' || file.mime_type === 'application/vnd.google-apps.folder',
    size: file.size,
    mimeType: file.mime_type,
    modifiedAt: Number.isNaN(modified) ? undefined : modified,
    path: file.path,
    meta: { raw: file },
  }
}
