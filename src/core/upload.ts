import type { FileSystemAdapter } from '../adapter/types'
import type { Notification, UploadTask } from './types'
import { sanitizeFileName, uniqueName, joinPath } from '../util/names'

export interface UploadPipelineOptions {
  adapter: FileSystemAdapter
  files: File[]
  /** Relative paths of directories to create even though they carry no files. */
  emptyDirs?: string[]
  /** Directory the drop landed in, relative to the adapter root. */
  destination: string
  /**
   * Transforms the file list before upload — HEIC decoding, image downscaling.
   * Returning `cancelled` aborts the whole upload without touching the backend.
   */
  transform?: (files: File[]) => Promise<{ files: File[]; cancelled?: boolean }>
  onTaskUpdate: (tasks: UploadTask[]) => void
  notify: (notification: Notification) => void
  signal?: AbortSignal
}

/** Groups files by the directory they belong in, derived from `webkitRelativePath`. */
function groupByDirectory(files: File[], destination: string) {
  const byDirectory = new Map<string, File[]>()
  const directories = new Set<string>()

  for (const file of files) {
    const relative = (file as File & { webkitRelativePath?: string }).webkitRelativePath || ''
    if (!relative || !relative.includes('/')) {
      const list = byDirectory.get(destination) ?? []
      list.push(file)
      byDirectory.set(destination, list)
      continue
    }

    const segments = relative.split('/')
    segments.pop()

    // Register every ancestor, not just the leaf: creating `a/b/c` requires `a` and
    // `a/b` to exist first, and the backend creates one level at a time.
    let current = destination
    for (const segment of segments) {
      current = joinPath(current, segment)
      directories.add(current)
    }

    const target = joinPath(destination, segments.join('/'))
    const list = byDirectory.get(target) ?? []
    list.push(file)
    byDirectory.set(target, list)
  }

  return { byDirectory, directories }
}

let taskSequence = 0

/**
 * Runs an upload: optional transform, directory creation, collision-safe naming,
 * then the transfers themselves.
 *
 * Uploads run concurrently but names are resolved per-directory beforehand, so two
 * files landing in the same folder can't both claim the same free name.
 */
export async function runUploadPipeline(options: UploadPipelineOptions): Promise<{ uploaded: number; cancelled: boolean }> {
  const { adapter, destination, onTaskUpdate, notify, signal } = options

  let files = options.files
  if (options.transform && files.length > 0) {
    const result = await options.transform(files)
    if (result.cancelled) return { uploaded: 0, cancelled: true }
    files = result.files
  }

  const { byDirectory, directories } = groupByDirectory(files, destination)

  // Empty directories carry no files, so register their segments explicitly or they
  // would never be created.
  for (const relative of options.emptyDirs ?? []) {
    let current = destination
    for (const segment of relative.split('/').filter(Boolean)) {
      current = joinPath(current, segment)
      directories.add(current)
    }
  }

  let createdDirectories = 0
  const sortedDirectories = [...directories].sort()
  if (sortedDirectories.length > 0 && adapter.createDirectory) {
    for (const path of sortedDirectories) {
      const segments = path.split('/')
      const name = segments.pop()!
      try {
        await adapter.createDirectory(segments.join('/'), name)
        createdDirectories++
      } catch (e) {
        // Usually "already exists", which is fine when files are following. A genuine
        // failure surfaces below, but only for the empty-directory-only case where
        // creating the directory IS the operation.
        console.warn('Directory create failed (it may already exist):', path, e)
      }
    }
  }

  if (files.length === 0) {
    if (sortedDirectories.length > 0 && createdDirectories === 0) {
      throw new Error('No directories could be created')
    }
    return { uploaded: 0, cancelled: false }
  }

  if (!adapter.upload) throw new Error('This file browser is read-only: its adapter cannot upload.')

  const tasks: UploadTask[] = []
  const plan: { task: UploadTask; file: File; destination: string; name: string }[] = []

  for (const [directory, directoryFiles] of byDirectory) {
    // Resolve names against what's already there, then keep reserving as we go so
    // two files in this batch can't be assigned the same free name.
    let taken: string[] = []
    try {
      const listing = await adapter.list(directory, { signal })
      taken = listing.entries.map((entry) => entry.name)
    } catch {
      // A directory that was just created can list as missing on some backends —
      // upload under the sanitised name and let the backend arbitrate a collision.
    }

    for (const file of directoryFiles) {
      const name = uniqueName(sanitizeFileName(file.name), taken)
      taken.push(name)
      const task: UploadTask = {
        id: `upload-${++taskSequence}`,
        name,
        size: file.size,
        destination: directory,
        status: 'queued',
        progress: 0,
      }
      tasks.push(task)
      plan.push({ task, file, destination: directory, name })
    }
  }

  onTaskUpdate([...tasks])

  const publish = () => onTaskUpdate(tasks.map((task) => ({ ...task })))

  await Promise.all(
    plan.map(async ({ task, file, destination: directory, name }) => {
      if (signal?.aborted) {
        task.status = 'cancelled'
        publish()
        return
      }
      task.status = 'uploading'
      publish()
      try {
        await adapter.upload!({
          file,
          destination: directory,
          name,
          signal,
          onProgress: (fraction) => {
            task.progress = fraction
            publish()
          },
        })
        task.status = 'done'
        task.progress = 1
      } catch (e) {
        task.status = 'error'
        task.error = e instanceof Error ? e.message : 'Upload failed'
      }
      publish()
    }),
  )

  const failed = tasks.filter((task) => task.status === 'error')
  const uploaded = tasks.filter((task) => task.status === 'done').length

  if (failed.length > 0) {
    notify({
      level: uploaded > 0 ? 'warning' : 'error',
      message:
        failed.length === 1
          ? `${failed[0].name} failed to upload.`
          : `${failed.length} of ${tasks.length} files failed to upload.`,
    })
  }

  return { uploaded, cancelled: false }
}
