import './styles.css'

// ── Components ────────────────────────────────────────────────────────────────
export { FileBrowser, FileBrowserRoot } from './ui/file-browser'
export type { FileBrowserProps } from './ui/file-browser'
export { FilePicker } from './ui/file-picker'
export type { FilePickerProps } from './ui/file-picker'

// Composable parts, for apps that need a different arrangement than <FileBrowser>.
export { FileToolbar } from './ui/toolbar'
export { Breadcrumbs } from './ui/breadcrumbs'
export { FolderTree } from './ui/folder-tree'
export { FileListing } from './ui/views/listing'
export { FileDropzone } from './ui/dropzone'
export { UploadQueue } from './ui/upload-queue'
export { StatusBar } from './ui/status-bar'
export { FileBrowserDialogs } from './ui/dialogs'
export { FileContextMenu } from './ui/action-menu'
export { FileTypeIcon } from './ui/file-icon'
export { Thumbnail } from './ui/thumbnail'
export { GridView } from './ui/views/grid-view'
export { ListView } from './ui/views/list-view'
export { DetailsView, defaultDetailsColumns } from './ui/views/details-view'
export type { DetailsColumn } from './ui/views/details-view'

// ── Engine ────────────────────────────────────────────────────────────────────
export { useFileBrowser } from './core/engine'
export type { FileBrowserEngine, UseFileBrowserOptions } from './core/engine'
export { FileBrowserProvider, useFileBrowserContext } from './core/context'
export { useEntryInteraction } from './ui/use-entry-interaction'

// ── Actions ───────────────────────────────────────────────────────────────────
export {
  FileActionId,
  MUTATING_ACTION_IDS,
  convertHeicAction,
  copyAction,
  createFolderAction,
  cutAction,
  defaultFileActions,
  deleteAction,
  downloadAction,
  mergeFileActions,
  openFilesAction,
  openInNewTabAction,
  pasteAction,
  previewAction,
  refreshAction,
  renameAction,
  toggleDetailsAction,
  uploadDirectoryAction,
  uploadFilesAction,
} from './core/actions'
export type { FileActionIdValue } from './core/actions'

// ── Adapters ──────────────────────────────────────────────────────────────────
export { adapterCan } from './adapter/types'
export type { FileSystemAdapter, ListResult, MoveRequest, UploadRequest } from './adapter/types'
export { createMemoryAdapter } from './adapter/memory-adapter'
export type { MemoryAdapterOptions, MemoryNode } from './adapter/memory-adapter'

// ── Types ─────────────────────────────────────────────────────────────────────
export type {
  ClipboardState,
  ConfirmOptions,
  Density,
  FileAction,
  FileActionContext,
  FileActionEvent,
  FileActionHandler,
  FileBrowserHandle,
  FileBrowserState,
  FileEntry,
  FolderChainItem,
  LoadStatus,
  Notification,
  NotificationAdapter,
  PromptOptions,
  SortDirection,
  SortKey,
  UploadStatus,
  UploadTask,
  ViewMode,
} from './core/types'

// ── Utilities ─────────────────────────────────────────────────────────────────
export { formatBytes } from './util/bytes'
export { formatDate, formatDateTime } from './ui/format-date'
export { getBaseName, getExtension, joinPath, sanitizeFileName, truncateMiddle, uniqueName, validateName } from './util/names'
export type { NameValidation } from './util/names'
export { getFileKind, getKindLabel, isHeic } from './util/mime'
export type { FileKind } from './util/mime'
export { isSystemFile } from './util/system-files'
export { attachRelativePaths, pickDirectory, pickFiles, traverseDroppedItems, unreadableDirsMessage } from './util/file-drop'
export type { DroppedFile, DropTraversal, PickedDirectory } from './util/file-drop'
export { filterEntries, sortEntries, visibleEntries } from './core/sort'
export { pruneSelection, resolveSelection, selectedEntries } from './core/selection'
export { formatHotkey, matchesHotkey } from './core/hotkeys'
export { runUploadPipeline } from './core/upload'
export { cn } from './util/cn'
