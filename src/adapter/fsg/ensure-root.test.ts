import { describe, expect, it, vi } from 'vitest'
import { ensureRootDirectory } from './ensure-root'

const harness = (responder: (path: string) => unknown = () => ({ results: [] })) => {
  const calls: { path: string; method?: string; body?: any }[] = []
  const request = vi.fn(async (params: any) => {
    calls.push({ path: params.path, method: params.method, body: params.body ? JSON.parse(String(params.body)) : undefined })
    return responder(params.path)
  })
  return { request, calls, creates: () => calls.filter((c) => c.method === 'POST') }
}

describe('ensureRootDirectory', () => {
  it('creates nothing for the area root', async () => {
    // `/` is what the dev stories open by default: the area root always exists, and
    // trying to create it would POST an empty directory name.
    const h = harness()
    await ensureRootDirectory({ request: h.request, area: 'engage-v2', rootPath: '/' })
    expect(h.creates()).toHaveLength(0)
  })

  it('does nothing when the folder already has contents', async () => {
    const h = harness(() => ({ results: [{ id: 'd1', name: 'Photos', path: '/12345' }] }))
    await ensureRootDirectory({ request: h.request, area: 'engage-v2', rootPath: '12345' })
    expect(h.creates()).toHaveLength(0)
  })

  it('creates a single-segment entity folder under the area root', async () => {
    const h = harness()
    await ensureRootDirectory({ request: h.request, area: 'engage-v2', rootPath: '12345' })

    expect(h.creates()).toHaveLength(1)
    expect(h.creates()[0].body).toEqual({ name: '12345', path: '/' })
  })

  it('skips the entity-type root and creates from the second segment on', async () => {
    // The backend pre-creates the type root (`opportunity`), so creating it again
    // would fail and the real folder would never be made.
    const h = harness()
    await ensureRootDirectory({ request: h.request, area: 'engage-v2', rootPath: 'opportunity/123' })

    expect(h.creates().map((c) => c.body)).toEqual([{ name: '123', path: '/opportunity/' }])
  })

  it('keeps going when a level already exists', async () => {
    const h = harness((path) => {
      if (path.includes('/directories/')) return { results: [] }
      throw new Error('409 already exists')
    })
    await expect(ensureRootDirectory({ request: h.request, area: 'engage-v2', rootPath: 'a/b/c' })).resolves.toBeUndefined()
    expect(h.creates().map((c) => c.body?.name)).toEqual(['b', 'c'])
  })
})
