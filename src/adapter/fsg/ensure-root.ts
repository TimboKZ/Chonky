import { FILE_STORAGE } from './endpoints'
import type { FsgRequestFn } from './request'

/**
 * Makes sure an entity's root folder exists before the browser opens it.
 *
 * The file-storage service creates area roots but not per-entity folders, so the
 * first visit to a new work order or ticket would otherwise land on a 404. Call it
 * before mounting the browser, or pass it as `onBeforeLoad`.
 *
 * For a multi-segment path (`opportunity/123`) the first segment is an entity-type
 * root the backend pre-creates, so creation starts at the second. A single-segment
 * path (a bare work-order number) is itself created under `/`. A segment that
 * already exists makes the API reject the create, which is expected and ignored.
 */
export async function ensureRootDirectory(options: {
  request: FsgRequestFn
  area: string
  rootPath: string
}): Promise<void> {
  const { request, area, rootPath } = options

  try {
    const existing = await request({ path: FILE_STORAGE.DIRECTORIES(area, rootPath) })
    if (existing?.results?.length > 0) return
  } catch {
    // Doesn't exist yet — fall through and create it.
  }

  const segments = rootPath.replace(/^\/+/, '').split('/').filter(Boolean)
  if (segments.length === 0) return

  const startIndex = segments.length > 1 ? 1 : 0
  let parent = segments.length > 1 ? `/${segments[0]}/` : '/'

  for (const segment of segments.slice(startIndex)) {
    try {
      await request({
        path: FILE_STORAGE.DIRECTORY(area),
        method: 'POST',
        body: JSON.stringify({ name: segment, path: parent }),
      })
    } catch {
      // Already there — carry on to the next level.
    }
    parent = `${parent}${segment}/`.replace(/\/{2,}/g, '/')
  }
}
