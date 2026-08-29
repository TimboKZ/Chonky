import type { FileSystemAdapter, ListResult, MoveRequest, UploadRequest } from './types'
import type { FileEntry } from '../core/types'
import { joinPath } from '../util/names'

export interface MemoryNode {
  name: string
  isDir: boolean
  size?: number
  mimeType?: string
  modifiedAt?: number
  thumbnailUrl?: string
  children?: MemoryNode[]
  /**
   * The file's bytes. Give a node content and it previews, opens, and downloads
   * like a real one; without it `read` reports that the fixture has no content and
   * the URL builders return undefined, so the preview panel falls back cleanly.
   */
  content?: string | ArrayBuffer | Uint8Array
}

export interface MemoryAdapterOptions {
  tree: MemoryNode[]
  /** Artificial latency in ms, so loading states are visible in Storybook. */
  latency?: number
  /** Read-only when false — the browser then hides every mutating action. */
  writable?: boolean
  /**
   * Serve file content: implements `read`, `getOpenUrl`, and `getDownloadUrl`, so
   * previews and downloads work. Set false to model a listing-only backend.
   * @default true
   */
  servesContent?: boolean
}

function findDirectory(roots: MemoryNode[], path: string): MemoryNode[] | null {
  const segments = path.split('/').filter(Boolean)
  let level = roots
  for (const segment of segments) {
    const next = level.find((node) => node.isDir && node.name === segment)
    if (!next) return null
    next.children ??= []
    level = next.children
  }
  return level
}

/**
 * An in-memory backend for Storybook, tests, and prototyping. Mutations apply to
 * the tree object handed in, so a story can assert against it afterwards.
 */
function toBytes(content: string | ArrayBuffer | Uint8Array): ArrayBuffer {
  if (typeof content === 'string') return new TextEncoder().encode(content).buffer as ArrayBuffer
  if (content instanceof Uint8Array) return content.slice().buffer as ArrayBuffer
  return content
}

/**
 * A `blob:` URL for a node's content, created once and reused.
 *
 * Not `data:` — Chrome blocks frame navigation to data: URLs outright, so a PDF
 * served that way would silently render nothing. Blob URLs work in an iframe, in
 * `<img>`, and for downloads. Caching per node also keeps the URL stable across
 * renders, so an `<img src>` doesn't churn on every paint.
 */
const blobUrls = new WeakMap<MemoryNode, string>()

function toObjectUrl(node: MemoryNode): string | undefined {
  if (!node.content) return undefined
  const cached = blobUrls.get(node)
  if (cached) return cached
  const url = URL.createObjectURL(new Blob([toBytes(node.content)], { type: node.mimeType || 'application/octet-stream' }))
  blobUrls.set(node, url)
  return url
}

export function createMemoryAdapter(options: MemoryAdapterOptions): FileSystemAdapter {
  const { tree, latency = 0, writable = true, servesContent = true } = options
  const wait = () => (latency > 0 ? new Promise((resolve) => setTimeout(resolve, latency)) : Promise.resolve())

  /** Walks the tree to the node an entry came from, so mutations are reflected. */
  const findNode = (entry: FileEntry): MemoryNode | undefined =>
    findDirectory(tree, entry.path ?? '')?.find((node) => node.name === entry.name)

  const toEntry = (node: MemoryNode, path: string): FileEntry => ({
    id: joinPath(path, node.name) || node.name,
    name: node.name,
    isDir: node.isDir,
    size: node.size ?? (node.content ? toBytes(node.content).byteLength : undefined),
    mimeType: node.mimeType,
    modifiedAt: node.modifiedAt,
    thumbnailUrl: node.thumbnailUrl,
    path,
  })

  const base: FileSystemAdapter = {
    id: 'memory',
    async list(path): Promise<ListResult> {
      await wait()
      const level = findDirectory(tree, path)
      if (!level) throw new Error(`No such directory: ${path || '/'}`)
      return { entries: level.map((node) => toEntry(node, path)) }
    },
  }

  const content: Partial<FileSystemAdapter> = servesContent
    ? {
        async read(entry) {
          await wait()
          const node = findNode(entry)
          if (!node?.content) {
            throw new Error(`“${entry.name}” has no content in this fixture — set \`content\` on the node to preview it.`)
          }
          return toBytes(node.content)
        },
        getOpenUrl(entry) {
          const node = findNode(entry)
          return node ? toObjectUrl(node) : undefined
        },
        getDownloadUrl(entry) {
          const node = findNode(entry)
          return node ? toObjectUrl(node) : undefined
        },
      }
    : {}

  if (!writable) return { ...base, ...content }

  return {
    ...base,
    ...content,
    async createDirectory(path, name) {
      await wait()
      const level = findDirectory(tree, path)
      if (!level) throw new Error(`No such directory: ${path || '/'}`)
      if (level.some((node) => node.name === name)) throw new Error(`“${name}” already exists`)
      level.push({ name, isDir: true, children: [], modifiedAt: Date.now() })
    },

    async move({ entry, destination, name }: MoveRequest) {
      await wait()
      const from = findDirectory(tree, entry.path ?? '')
      const to = findDirectory(tree, destination)
      if (!from || !to) throw new Error('Source or destination is missing')
      const index = from.findIndex((node) => node.name === entry.name)
      if (index === -1) throw new Error(`“${entry.name}” is no longer there`)
      const [node] = from.splice(index, 1)
      to.push({ ...node, name, modifiedAt: Date.now() })
    },

    async copy({ entry, destination, name }: MoveRequest) {
      await wait()
      const from = findDirectory(tree, entry.path ?? '')
      const to = findDirectory(tree, destination)
      if (!from || !to) throw new Error('Source or destination is missing')
      const node = from.find((candidate) => candidate.name === entry.name)
      if (!node) throw new Error(`“${entry.name}” is no longer there`)
      to.push(structuredClone({ ...node, name, modifiedAt: Date.now() }))
    },

    async remove(entry) {
      await wait()
      const level = findDirectory(tree, entry.path ?? '')
      if (!level) throw new Error('Directory is missing')
      const index = level.findIndex((node) => node.name === entry.name)
      if (index !== -1) level.splice(index, 1)
    },

    async upload({ file, destination, name, onProgress }: UploadRequest) {
      const level = findDirectory(tree, destination)
      if (!level) throw new Error(`No such directory: ${destination || '/'}`)
      // Report progress in steps so the queue UI animates rather than snapping to done.
      for (const fraction of [0.25, 0.5, 0.75, 1]) {
        await wait()
        onProgress?.(fraction)
      }
      level.push({ name, isDir: false, size: file.size, mimeType: file.type, modifiedAt: Date.now() })
    },
  }
}
