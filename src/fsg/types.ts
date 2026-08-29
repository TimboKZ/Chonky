/** Shapes the FSG file-storage v2 service returns, as app code holds them. */

export type Directory = {
  id: string
  name: string
  fullName?: string
  parent_id?: string
  modified_time: string
  mime_type?: string
  created_time?: string
  path: string
}

export type FileItem = {
  id: string
  name: string
  fullName?: string
  parent_id: string
  modified_time: string
  mime_type: string
  size: number
  path: string
  area?: string
}

export type DirectoryResponse = { path: string; results: Directory[] }
export type FileResponse = { path: string; results: FileItem[] }

/** A row as the browser displays it. `isDir` distinguishes a directory from a file. */
export type FileBrowserItem = FileItem & { isDir?: boolean }

/** Endpoint configuration. Consuming apps supply both. */
export interface FileBrowserApiConfig {
  /** Base URL for the API gateway (e.g. https://api.example.com) */
  baseUrl: string
  /** File storage area (e.g. 'servicelab', 'jobs', 'tiny-ticket') */
  area: string
}
