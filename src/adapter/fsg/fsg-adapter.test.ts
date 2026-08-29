import { describe, expect, it, vi } from 'vitest'
import { createFsgAdapter } from './fsg-adapter'
import { getDirectoryName } from './names'
import type { FileEntry } from '../../core/types'

interface Call {
  path: string
  method?: string
  body?: any
}

function makeAdapter(responses: (params: any) => any = () => ({ results: [] })) {
  const calls: Call[] = []
  const request = vi.fn(async (params: any) => {
    calls.push({ path: params.path, method: params.method, body: params.body ? JSON.parse(String(params.body)) : undefined })
    return responses(params)
  })
  const adapter = createFsgAdapter({ baseUrl: 'https://api.test', area: 'jobs', request })
  return { adapter, calls, request }
}

const entry = (overrides: Partial<FileEntry> = {}): FileEntry => ({
  id: 'file-1',
  name: 'report.pdf',
  isDir: false,
  path: 'jobs/123',
  ...overrides,
})

describe('createFsgAdapter — list', () => {
  it('merges the separate directory and file listings into one set of entries', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/')
        ? { results: [{ id: 'dir-1/', name: 'Photos', path: '123', modified_time: '2026-01-02T00:00:00Z' }] }
        : { results: [{ id: 'file-1', name: 'a.pdf', parent_id: '123', size: 10 }] },
    )

    const { entries } = await adapter.list('123')

    expect(entries.map((e) => e.name)).toEqual(['Photos', 'a.pdf'])
    expect(entries[0].isDir).toBe(true)
    expect(entries[1].isDir).toBe(false)
  })

  it('strips the trailing slash a directory id carries, which the move endpoints reject', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/') ? { results: [{ id: 'dir-1/', name: 'Photos', path: '123' }] } : { results: [] },
    )

    const { entries } = await adapter.list('123')
    expect(entries[0].id).toBe('dir-1')
  })

  it('drops the walk root, which the backend reports as a child of itself', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/')
        ? { results: [{ id: '.', name: 'jobs', path: '' }, { id: 'dir-1', name: 'Photos', path: '' }] }
        : { results: [] },
    )

    const { entries } = await adapter.list('')
    expect(entries.map((e) => e.name)).toEqual(['Photos'])
  })

  it('keeps only direct children, discarding descendants a recursive listing leaks', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/')
        ? { results: [{ id: 'd1', name: 'Photos', path: '/123' }, { id: 'd2', name: 'Deep', path: '/123/Photos' }] }
        : { results: [{ id: 'f1', name: 'a.pdf', parent_id: '123' }, { id: 'f2', name: 'deep.pdf', parent_id: '123/Photos' }] },
    )

    const { entries } = await adapter.list('123')
    expect(entries.map((e) => e.name)).toEqual(['Photos', 'a.pdf'])
  })

  it('matches a parent path whether or not it is percent-encoded or slash-wrapped', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/')
        ? { results: [{ id: 'd1', name: 'Sub', path: '/My Folder/' }] }
        : { results: [{ id: 'f1', name: 'a.pdf', parent_id: 'My%20Folder' }] },
    )

    const { entries } = await adapter.list('My Folder')
    expect(entries.map((e) => e.name)).toEqual(['Sub', 'a.pdf'])
  })

  it('converts timestamps to epoch milliseconds', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/') ? { results: [] } : { results: [{ id: 'f1', name: 'a.pdf', parent_id: '', modified_time: '2026-01-02T03:04:05Z' }] },
    )

    const { entries } = await adapter.list('')
    expect(entries[0].modifiedAt).toBe(Date.parse('2026-01-02T03:04:05Z'))
  })
})

describe('createFsgAdapter — mutations', () => {
  it('routes a rename to the file or the directory endpoint as appropriate', async () => {
    const { adapter, calls } = makeAdapter()

    await adapter.move!({ entry: entry(), destination: 'jobs/123', name: 'new.pdf' })
    await adapter.move!({ entry: entry({ id: 'dir-1', isDir: true }), destination: 'jobs/123', name: 'New' })

    expect(calls[0].path).toContain('/files/jobs/move')
    expect(calls[0].body).toEqual({ id: 'file-1', new_name: 'new.pdf', new_path: 'jobs/123' })
    expect(calls[1].path).toContain('/directories/jobs/move')
  })

  it('refuses to copy a folder, which the service cannot do', async () => {
    const { adapter } = makeAdapter()
    await expect(adapter.copy!({ entry: entry({ isDir: true }), destination: 'x', name: 'y' })).rejects.toThrow(/cannot copy folders/)
  })

  it('archives a deleted file under a path mirroring where it lived', async () => {
    const { adapter, calls } = makeAdapter()
    await adapter.remove!(entry({ path: '/jobs/123/' }))

    expect(calls[0].path).toContain('/files/jobs/move')
    expect(calls[0].body).toEqual({ id: 'file-1', new_name: 'report.pdf', new_path: '/Archive/jobs/123' })
  })

  it('archives at the bare archive root when the entry sat at the area root', async () => {
    const { adapter, calls } = makeAdapter()
    await adapter.remove!(entry({ path: '' }))
    expect(calls[0].body.new_path).toBe('/Archive')
  })

  it('steps around a name already in the archive, because a directory move cannot overwrite', async () => {
    // The backend renames directories with os.Rename, which fails outright against
    // an existing non-empty destination rather than overwriting it.
    const { adapter, calls } = makeAdapter((params) =>
      params.path.includes('/directories/jobs?') ? { results: [{ id: 'd', name: 'Photos', path: '/Archive/jobs/123' }] } : {},
    )

    await adapter.remove!(entry({ id: 'dir-1', name: 'Photos', isDir: true, path: 'jobs/123' }))

    const move = calls.find((call) => call.path.includes('/directories/jobs/move'))!
    expect(move.body.new_name).toBe('Photos (2)')
  })

  it('archives under the original name when the archive listing fails', async () => {
    const { adapter, calls } = makeAdapter((params) => {
      if (params.path.includes('/directories/jobs?')) throw new Error('404')
      return {}
    })

    await adapter.remove!(entry({ id: 'dir-1', name: 'Photos', isDir: true, path: 'jobs/123' }))

    const move = calls.find((call) => call.path.includes('/directories/jobs/move'))!
    expect(move.body.new_name).toBe('Photos')
  })

  it('refuses to delete when archiving is switched off', async () => {
    const request = vi.fn(async () => ({}))
    const adapter = createFsgAdapter({ baseUrl: 'https://api.test', area: 'jobs', archivePath: null, request })
    await expect(adapter.remove!(entry())).rejects.toThrow(/Deleting is disabled/)
  })

  it('uploads as multipart under the collision-safe name it was handed', async () => {
    const bodies: FormData[] = []
    const request = vi.fn(async (params: any) => {
      if (params.body instanceof FormData) bodies.push(params.body)
      return {}
    })
    const adapter = createFsgAdapter({ baseUrl: 'https://api.test', area: 'jobs', request })

    await adapter.upload!({ file: new File(['x'], 'original.txt'), destination: 'jobs/123', name: 'renamed.txt' })

    expect(bodies[0].get('path')).toBe('jobs/123')
    expect((bodies[0].get('file') as File).name).toBe('renamed.txt')
    expect(request.mock.calls[0][0].omitContentType).toBe(true)
  })
})

describe('createFsgAdapter — URLs', () => {
  it('builds absolute open, download, and thumbnail URLs', async () => {
    const { adapter } = makeAdapter((params) =>
      params.path.includes('/directories/') ? { results: [] } : { results: [{ id: 'f 1', name: 'a.pdf', parent_id: '' }] },
    )

    const { entries } = await adapter.list('')
    expect(adapter.getOpenUrl!(entries[0])).toBe('https://api.test/file-storage/v2/files/jobs/open?fileId=f%201')
    expect(adapter.getDownloadUrl!(entries[0])).toContain('/download?fileId=f%201')
    expect(entries[0].thumbnailUrl).toContain('width=128&height=128')
  })
})

describe('getDirectoryName', () => {
  it('leaves an unclaimed name alone and counts up from an existing suffix', () => {
    expect(getDirectoryName('Photos', ['Docs'])).toBe('Photos')
    expect(getDirectoryName('Photos', ['Photos'])).toBe('Photos (2)')
    expect(getDirectoryName('Photos', ['Photos', 'Photos (2)'])).toBe('Photos (3)')
    // Unlike the file helper, a dot in the name is not treated as an extension.
    expect(getDirectoryName('2024.backup', ['2024.backup'])).toBe('2024.backup (2)')
  })
})
