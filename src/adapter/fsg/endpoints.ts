/**
 * FSG file-storage v2 endpoints. Every path takes the storage `area` first, which
 * is what scopes one app's files from another's.
 */
const encodePath = (path: string) => path.split('/').map(encodeURIComponent).join('/')

export const FILE_STORAGE = {
  DIRECTORY: (area: string) => `/file-storage/v2/directories/${area}`,
  DIRECTORIES: (area: string, path: string) => `/file-storage/v2/directories/${area}?path=${encodePath(path)}&recursive=false`,
  MOVE_DIRECTORY: (area: string) => `/file-storage/v2/directories/${area}/move`,
  FILE: (area: string) => `/file-storage/v2/files/${area}/upload`,
  FILES: (area: string, path: string) => `/file-storage/v2/files/${area}?path=${encodePath(path)}&recursive=false`,
  MOVE_FILE: (area: string) => `/file-storage/v2/files/${area}/move`,
  COPY_FILE: (area: string) => `/file-storage/v2/files/${area}/copy`,
  DOWNLOAD: (area: string, id: string) => `/file-storage/v2/files/${area}/download?fileId=${encodeURIComponent(id)}`,
  OPEN: (area: string, id: string) => `/file-storage/v2/files/${area}/open?fileId=${encodeURIComponent(id)}`,
  PREVIEW: (area: string, id: string) => `/file-storage/v2/files/${area}/preview?fileId=${encodeURIComponent(id)}`,
}
