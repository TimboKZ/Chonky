/**
 * The file browser wired to the FSG file-storage v2 service.
 *
 * This is what FSG apps import. `@fsg/file-browser` itself is backend-agnostic;
 * everything here is the FSG-specific composition — the storage adapter, the
 * entity root bootstrap, `sonner` notifications, and the HEIC and
 * image-optimization upload pass.
 */
export { FsgFileBrowser, FsgFileBrowser as FileBrowser } from './fsg-file-browser'
export type { FsgFileBrowserProps, FsgFileBrowserProps as FileBrowserProps } from './fsg-file-browser'
export { FsgPreviewPanel, FsgPreviewPanel as FilePreviewPanel } from './fsg-preview-panel'
export type { FsgPreviewPanelProps, FsgPreviewPanelProps as FilePreviewPanelProps } from './fsg-preview-panel'

export { entryToFileItem, fileItemToEntry } from './converters'
export type {
  Directory,
  DirectoryResponse,
  FileBrowserApiConfig,
  FileBrowserItem,
  FileItem,
  FileResponse,
} from './types'

export { FILE_STORAGE, createFsgAdapter, createFsgRequest, ensureRootDirectory, getDirectoryName } from '../adapter/fsg'
export type { FsgAdapterOptions, FsgRequestFn, FsgRequestParams } from '../adapter/fsg'
