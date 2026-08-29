import type { FileSystemAdapter, ListResult, MoveRequest, UploadRequest } from '../types'
import type { FileEntry } from '../../core/types'
import { FILE_STORAGE } from './endpoints'
import { createFsgRequest, type FsgRequestFn } from './request'
import { getDirectoryName } from './names'

/** Shapes the file-storage v2 API returns. */
interface FsgDirectory {
  id: string
  name: string
  parent_id?: string
  modified_time?: string
  created_time?: string
  mime_type?: string
  path: string
}

interface FsgFile extends FsgDirectory {
  size?: number
  area?: string
}

export interface FsgAdapterOptions {
  /** API gateway base URL, e.g. `https://api.fsgi.com`. */
  baseUrl: string
  /** Storage area, e.g. `servicelab`, `jobs`, `tiny-ticket`. */
  area: string
  /**
   * Where a delete sends things. The backend has no hard delete, so the browser's
   * Delete moves the entry under this path. Set to `null` to make Delete throw
   * rather than archive.
   * @default '/Archive'
   */
  archivePath?: string | null
  /** Thumbnail edge length requested from the preview endpoint. @default 128 */
  thumbnailSize?: number
  /** Supply to reuse an app's own fetch wrapper (auth headers, tracing, retries). */
  request?: FsgRequestFn
}

const toEpoch = (value?: string) => (value ? new Date(value).getTime() : undefined)

/** Strips leading and trailing slashes so a path compares equal however it was built. */
const normalise = (path: string) => path.replace(/^\/+|\/+$/g, '')

/**
 * Reduces a path to the one form both sides of a comparison can be trusted to
 * agree on: no edge slashes, and percent-decoded.
 *
 * The listing endpoints take a percent-encoded path, and whether they echo
 * `parent_id` and `path` back encoded or decoded varies by deployment. Comparing
 * raw strings meant a folder called "My Folder" listed as empty against a backend
 * that returned `My%20Folder`. A malformed escape is left as-is rather than
 * throwing, so one bad entry can't fail the whole listing.
 */
function canonical(path: string): string {
  const trimmed = normalise(path)
  try {
    return decodeURIComponent(trimmed)
  } catch {
    return trimmed
  }
}

/**
 * Adapter for the FSG file-storage v2 service.
 *
 * Two quirks of that API are handled here rather than leaking into the UI:
 *
 * - Directory and file listings are separate endpoints, so `list` fans out and
 *   merges them.
 * - Both endpoints can return entries from outside the requested path (the walk
 *   root itself, and descendants when the backend ignores `recursive=false`), so
 *   results are filtered back down to direct children.
 */
export function createFsgAdapter(options: FsgAdapterOptions): FileSystemAdapter {
  const { baseUrl, area, archivePath = '/Archive', thumbnailSize = 128 } = options
  const request = options.request ?? createFsgRequest(baseUrl)

  const toFileEntry = (file: FsgFile, path: string): FileEntry => ({
    id: file.id,
    name: file.name,
    isDir: false,
    size: file.size,
    mimeType: file.mime_type,
    modifiedAt: toEpoch(file.modified_time),
    createdAt: toEpoch(file.created_time),
    path,
    thumbnailUrl: `${baseUrl}${FILE_STORAGE.PREVIEW(area, file.id)}&width=${thumbnailSize}&height=${thumbnailSize}`,
    meta: { raw: file },
  })

  const toDirectoryEntry = (directory: FsgDirectory, path: string): FileEntry => ({
    // Directory ids carry a trailing slash on some backends; the move endpoints
    // reject it, so it is stripped once here rather than at each call site.
    id: directory.id.replace(/\/$/, ''),
    name: directory.name,
    isDir: true,
    mimeType: 'application/x-directory',
    modifiedAt: toEpoch(directory.modified_time),
    createdAt: toEpoch(directory.created_time),
    path,
    meta: { raw: directory },
  })

  return {
    id: `fsg:${area}`,

    async list(path, listOptions): Promise<ListResult> {
      const requested = canonical(path)

      const [directoryResponse, fileResponse] = await Promise.all([
        request({ path: FILE_STORAGE.DIRECTORIES(area, path), signal: listOptions?.signal }),
        request({ path: FILE_STORAGE.FILES(area, path), signal: listOptions?.signal }),
      ])

      // `id: '.'` is the listed directory reporting itself — the backend walks from
      // the directory it was asked for, so at the area root that entry would pass
      // the path filter and the area would list itself as its own child.
      const directories: FsgDirectory[] = (directoryResponse?.results ?? []).filter(
        (directory: FsgDirectory) => directory.id !== '.' && canonical(directory.path ?? '') === requested,
      )

      const files: FsgFile[] = (fileResponse?.results ?? []).filter((file: FsgFile) => canonical(file.parent_id ?? '') === requested)

      return {
        entries: [
          ...directories.map((directory) => toDirectoryEntry(directory, path)),
          ...files.map((file) => toFileEntry(file, path)),
        ],
      }
    },

    async createDirectory(path, name) {
      await request({
        path: FILE_STORAGE.DIRECTORY(area),
        method: 'POST',
        body: JSON.stringify({ name, path }),
      })
    },

    async move({ entry, destination, name }: MoveRequest) {
      await request({
        path: entry.isDir ? FILE_STORAGE.MOVE_DIRECTORY(area) : FILE_STORAGE.MOVE_FILE(area),
        method: 'POST',
        body: JSON.stringify({ id: entry.id.replace(/\/$/, ''), new_name: name, new_path: destination }),
      })
    },

    async copy({ entry, destination, name }: MoveRequest) {
      if (entry.isDir) throw new Error('The file-storage service cannot copy folders.')
      await request({
        path: FILE_STORAGE.COPY_FILE(area),
        method: 'POST',
        body: JSON.stringify({ id: entry.id, new_name: name, new_path: destination }),
      })
    },

    async remove(entry) {
      if (archivePath === null) throw new Error('Deleting is disabled for this file browser.')

      // The archive mirrors the item's own listing path, normalised so it matches
      // what the directory listing reports back — an unnormalised `/Archive//` at
      // the area root would not.
      const parent = normalise(entry.path ?? '')
      const destination = parent ? `${archivePath}/${parent}` : archivePath

      if (entry.isDir) {
        // A directory move is `os.Rename` on the backend, which refuses an existing
        // non-empty destination rather than overwriting it the way a file move
        // does. Look for a name already sitting there and step around it.
        let taken: string[] = []
        try {
          const archived = await request({ path: FILE_STORAGE.DIRECTORIES(area, destination) })
          taken = ((archived?.results ?? []) as FsgDirectory[])
            .filter((directory) => canonical(directory.path ?? '') === canonical(destination))
            .map((directory) => directory.name)
        } catch (e) {
          // A missing archive path lists empty rather than erroring; if the listing
          // fails anyway, fall through and let the move report the collision.
          console.warn('Could not list the archive destination; archiving under the original name', e)
        }

        await request({
          path: FILE_STORAGE.MOVE_DIRECTORY(area),
          method: 'POST',
          body: JSON.stringify({ id: entry.id.replace(/\/$/, ''), new_name: getDirectoryName(entry.name, taken), new_path: destination }),
        })
        return
      }

      await request({
        path: FILE_STORAGE.MOVE_FILE(area),
        method: 'POST',
        body: JSON.stringify({ id: entry.id, new_name: entry.name, new_path: destination }),
      })
    },

    async upload({ file, destination, name, signal }: UploadRequest) {
      const formData = new FormData()
      formData.append('path', destination)
      formData.append('fileSize', String(file.size))
      formData.append('file', file, name)

      // No `onProgress`: the endpoint is fetch-based and fetch cannot report upload
      // progress. The queue shows queued → uploading → done per file, which is the
      // granularity this backend supports.
      await request({
        path: FILE_STORAGE.FILE(area),
        method: 'POST',
        body: formData,
        omitContentType: true,
        signal,
      })
    },

    getOpenUrl: (entry) => `${baseUrl}${FILE_STORAGE.OPEN(area, entry.id)}`,
    getDownloadUrl: (entry) => `${baseUrl}${FILE_STORAGE.DOWNLOAD(area, entry.id)}`,

    async read(entry) {
      return request({
        path: FILE_STORAGE.DOWNLOAD(area, entry.id),
        responseHandler: (response: Response) => response.arrayBuffer(),
      })
    },
  }
}
