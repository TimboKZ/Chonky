import type { FileEntry, FolderChainItem } from '../core/types'

export interface ListResult {
  entries: FileEntry[]
  /**
   * Crumbs for this path. Adapters that can derive the trail from the path alone can
   * omit it and the browser will build one by splitting on `/`.
   */
  folderChain?: FolderChainItem[]
}

export interface UploadRequest {
  file: File
  /** Directory to upload into, relative to the adapter root. */
  destination: string
  /** Collision-safe name chosen by the browser. Upload under this, not `file.name`. */
  name: string
  signal?: AbortSignal
  /** Called with 0–1 when the transport can report progress. */
  onProgress?: (fraction: number) => void
}

export interface MoveRequest {
  entry: FileEntry
  /** Destination directory, relative to the adapter root. */
  destination: string
  /** Name to land under — already de-duplicated against the destination. */
  name: string
}

/**
 * The contract between the browser and a storage backend. Everything except
 * `list` is optional: an adapter that implements only `list` yields a read-only
 * browser, and the UI hides the actions it cannot service rather than offering
 * buttons that fail.
 */
export interface FileSystemAdapter {
  /** Stable id, used to namespace persisted view preferences. */
  readonly id: string

  list(path: string, options?: { signal?: AbortSignal }): Promise<ListResult>

  createDirectory?(path: string, name: string): Promise<void>
  /** Move or rename. Renaming is a move whose destination equals the source path. */
  move?(request: MoveRequest): Promise<void>
  copy?(request: MoveRequest): Promise<void>
  /**
   * Remove an entry. Backends that archive rather than erase (as FSG's does)
   * implement that here — the UI only promises the entry leaves the listing.
   */
  remove?(entry: FileEntry): Promise<void>
  upload?(request: UploadRequest): Promise<void>

  /** URL to open the file in a new tab. Enables the Open action. */
  getOpenUrl?(entry: FileEntry): string
  /** URL to download the file. Enables the Download action. */
  getDownloadUrl?(entry: FileEntry): string
  /** Fetches raw bytes — used by the viewers and by HEIC conversion. */
  read?(entry: FileEntry): Promise<ArrayBuffer>
}

/** Narrowing helpers so the UI can ask "can this backend do X?" without casts. */
export const adapterCan = {
  createDirectory: (a: FileSystemAdapter) => typeof a.createDirectory === 'function',
  move: (a: FileSystemAdapter) => typeof a.move === 'function',
  copy: (a: FileSystemAdapter) => typeof a.copy === 'function',
  remove: (a: FileSystemAdapter) => typeof a.remove === 'function',
  upload: (a: FileSystemAdapter) => typeof a.upload === 'function',
  open: (a: FileSystemAdapter) => typeof a.getOpenUrl === 'function',
  download: (a: FileSystemAdapter) => typeof a.getDownloadUrl === 'function',
  read: (a: FileSystemAdapter) => typeof a.read === 'function',
}
