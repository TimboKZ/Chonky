import { describe, expect, it, vi } from 'vitest'
import { runUploadPipeline } from './upload'
import type { FileSystemAdapter } from '../adapter/types'
import type { FileEntry, Notification, UploadTask } from './types'

function makeFile(name: string, relativePath?: string, size = 4): File {
  const file = new File(['data'], name, { type: 'text/plain' })
  Object.defineProperty(file, 'size', { value: size })
  if (relativePath !== undefined) {
    Object.defineProperty(file, 'webkitRelativePath', { value: relativePath, configurable: true })
  }
  return file
}

const entry = (name: string, path: string): FileEntry => ({ id: `${path}/${name}`, name, isDir: false, path })

interface Harness {
  adapter: FileSystemAdapter
  created: string[]
  uploaded: { name: string; destination: string }[]
  notifications: Notification[]
  tasks: UploadTask[][]
}

function harness(existing: Record<string, string[]> = {}, overrides: Partial<FileSystemAdapter> = {}): Harness {
  const created: string[] = []
  const uploaded: { name: string; destination: string }[] = []
  const notifications: Notification[] = []
  const tasks: UploadTask[][] = []

  const adapter: FileSystemAdapter = {
    id: 'test',
    async list(path) {
      return { entries: (existing[path] ?? []).map((name) => entry(name, path)) }
    },
    async createDirectory(path, name) {
      created.push(`${path}/${name}`.replace(/^\//, ''))
    },
    async upload({ name, destination }) {
      uploaded.push({ name, destination })
    },
    ...overrides,
  }

  return { adapter, created, uploaded, notifications, tasks }
}

const run = (h: Harness, options: Partial<Parameters<typeof runUploadPipeline>[0]> = {}) =>
  runUploadPipeline({
    adapter: h.adapter,
    files: [],
    destination: 'root',
    onTaskUpdate: (next) => h.tasks.push(next),
    notify: (n) => h.notifications.push(n),
    ...options,
  })

describe('runUploadPipeline', () => {
  it('sanitizes names and steps around one already in the destination', async () => {
    const h = harness({ root: ['report.txt'] })
    const result = await run(h, { files: [makeFile('report.txt'), makeFile('in:valid?.txt')] })

    expect(result.uploaded).toBe(2)
    expect(h.uploaded.map((u) => u.name).sort()).toEqual(['invalid.txt', 'report (2).txt'])
  })

  it('reserves names within the batch, so two identical files do not collide', async () => {
    const h = harness()
    await run(h, { files: [makeFile('a.txt'), makeFile('a.txt'), makeFile('a.txt')] })

    expect(h.uploaded.map((u) => u.name).sort()).toEqual(['a (2).txt', 'a (3).txt', 'a.txt'])
  })

  it('creates every ancestor directory of a nested upload, parents first', async () => {
    const h = harness()
    await run(h, { files: [makeFile('deep.txt', 'photos/2024/june/deep.txt')] })

    expect(h.created).toEqual(['root/photos', 'root/photos/2024', 'root/photos/2024/june'])
    expect(h.uploaded[0].destination).toBe('root/photos/2024/june')
  })

  it('creates directories that carry no files at all', async () => {
    const h = harness()
    const result = await run(h, { files: [], emptyDirs: ['empty/nested'] })

    expect(h.created).toEqual(['root/empty', 'root/empty/nested'])
    expect(result.uploaded).toBe(0)
  })

  it('keeps going when a directory create fails, since it usually means it exists', async () => {
    const h = harness({}, { createDirectory: vi.fn().mockRejectedValue(new Error('already exists')) })
    const result = await run(h, { files: [makeFile('a.txt', 'sub/a.txt')] })

    expect(result.uploaded).toBe(1)
    expect(h.uploaded[0].destination).toBe('root/sub')
  })

  it('reports a total failure when creating directories WAS the whole operation', async () => {
    // With no files to follow, a failed create is not recoverable and must not be
    // swallowed the way it is when an upload comes next.
    const h = harness({}, { createDirectory: vi.fn().mockRejectedValue(new Error('denied')) })
    await expect(run(h, { files: [], emptyDirs: ['nope'] })).rejects.toThrow('No directories could be created')
  })

  it('aborts without touching the backend when the transform cancels', async () => {
    const h = harness()
    const result = await run(h, {
      files: [makeFile('a.txt')],
      transform: async () => ({ files: [], cancelled: true }),
    })

    expect(result).toEqual({ uploaded: 0, cancelled: true })
    expect(h.uploaded).toHaveLength(0)
    expect(h.created).toHaveLength(0)
  })

  it('uploads what the transform returned, not what it was given', async () => {
    const h = harness()
    await run(h, {
      files: [makeFile('photo.heic')],
      transform: async () => ({ files: [makeFile('photo.jpg')] }),
    })

    expect(h.uploaded.map((u) => u.name)).toEqual(['photo.jpg'])
  })

  it('records a per-file failure without failing the rest of the batch', async () => {
    const h = harness(
      {},
      {
        upload: vi.fn(async ({ name }) => {
          if (name === 'bad.txt') throw new Error('507 Insufficient Storage')
        }),
      },
    )
    const result = await run(h, { files: [makeFile('good.txt'), makeFile('bad.txt')] })

    expect(result.uploaded).toBe(1)
    const final = h.tasks.at(-1)!
    expect(final.find((task) => task.name === 'bad.txt')?.status).toBe('error')
    expect(final.find((task) => task.name === 'good.txt')?.status).toBe('done')
    expect(h.notifications.at(-1)).toMatchObject({ level: 'warning' })
  })

  it('escalates to an error notification when every file fails', async () => {
    const h = harness({}, { upload: vi.fn().mockRejectedValue(new Error('nope')) })
    const result = await run(h, { files: [makeFile('a.txt')] })

    expect(result.uploaded).toBe(0)
    expect(h.notifications.at(-1)).toMatchObject({ level: 'error' })
  })

  it('refuses outright when the adapter cannot upload', async () => {
    const h = harness({}, { upload: undefined })
    await expect(run(h, { files: [makeFile('a.txt')] })).rejects.toThrow(/read-only/)
  })

  it('uploads under the sanitized name when the destination cannot be listed', async () => {
    const h = harness({}, { list: vi.fn().mockRejectedValue(new Error('404')) })
    const result = await run(h, { files: [makeFile('a.txt')] })

    expect(result.uploaded).toBe(1)
    expect(h.uploaded[0].name).toBe('a.txt')
  })

  it('marks every task cancelled when the signal is already aborted', async () => {
    const h = harness()
    const controller = new AbortController()
    controller.abort()

    await run(h, { files: [makeFile('a.txt')], signal: controller.signal })

    expect(h.uploaded).toHaveLength(0)
    expect(h.tasks.at(-1)!.every((task) => task.status === 'cancelled')).toBe(true)
  })
})
