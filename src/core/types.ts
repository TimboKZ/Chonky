import type { ComponentType } from 'react'

/**
 * One row in the browser. Adapters map their backend's shape onto this; anything
 * backend-specific rides along in `meta` and comes back untouched in action events.
 */
export interface FileEntry {
  /** Stable identity for selection, focus, and mutation. Unique within a listing. */
  id: string
  /** Full, untruncated name. Never a display-shortened one — mutations use this. */
  name: string
  isDir: boolean
  size?: number
  /** Epoch milliseconds. */
  modifiedAt?: number
  createdAt?: number
  mimeType?: string
  /** Directory this entry was listed from, relative to the adapter root. */
  path?: string
  /** Absolute URL for a thumbnail image, when the backend can render one. */
  thumbnailUrl?: string
  /** True to render the entry greyed out and skip it in default actions. */
  disabled?: boolean
  /** Adapter passthrough. Returned unchanged in every action event. */
  meta?: Record<string, unknown>
}

/** One crumb in the breadcrumb trail. `path` is what navigation resolves to. */
export interface FolderChainItem {
  id: string
  name: string
  path: string
  isRoot?: boolean
}

export type ViewMode = 'grid' | 'list' | 'details'
export type SortKey = 'name' | 'size' | 'modifiedAt' | 'kind'
export type SortDirection = 'asc' | 'desc'
export type Density = 'comfortable' | 'compact'
export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ClipboardState {
  entries: FileEntry[]
  mode: 'copy' | 'cut'
  /** Path the entries were cut/copied from, so a paste into the same folder is a no-op. */
  sourcePath: string
}

export type UploadStatus = 'queued' | 'uploading' | 'done' | 'error' | 'cancelled'

export interface UploadTask {
  id: string
  name: string
  size: number
  /** Destination directory, relative to the adapter root. */
  destination: string
  status: UploadStatus
  /** 0–1. Adapters that can't report progress leave this at 0 until `done`. */
  progress: number
  error?: string
}

export interface FileBrowserState {
  /** Current directory, relative to the adapter root. */
  path: string
  entries: FileEntry[]
  folderChain: FolderChainItem[]
  status: LoadStatus
  error: string | null

  selection: ReadonlySet<string>
  /** Roving-tabindex target. Follows the keyboard, not the selection. */
  focusedId: string | null
  /** Range-selection anchor — the entry a shift-click or shift-arrow measures from. */
  anchorId: string | null

  viewMode: ViewMode
  sortKey: SortKey
  sortDirection: SortDirection
  density: Density
  showHidden: boolean
  search: string

  clipboard: ClipboardState | null
  uploads: UploadTask[]
}

/**
 * An action a user can invoke — a toolbar button, a context-menu item, a hotkey, or
 * all three. Actions are data, so a consuming app can add, replace, or remove one
 * without forking the UI.
 */
export interface FileAction {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  /** e.g. `mod+c` (mod = ⌘ on macOS, Ctrl elsewhere), `shift+n`, `Delete`. */
  hotkey?: string | string[]
  /** Groups context-menu items into separated sections. */
  group?: string
  toolbar?: boolean
  contextMenu?: boolean
  /** Toolbar rendering: icon with a tooltip rather than an icon + label. */
  iconOnly?: boolean
  /** Styles the item as destructive and asks for confirmation where relevant. */
  destructive?: boolean
  /**
   * Narrows the selection this action operates on. The narrowed list is what the
   * handler receives, and an empty one disables the control — which is what makes a
   * locked item's Delete look unavailable rather than merely fail after the click.
   */
  appliesTo?: (entry: FileEntry) => boolean
  /** Disable unless at least one entry survives `appliesTo`. */
  requiresSelection?: boolean
  /** Hide entirely (rather than disable) when false. Evaluated per render. */
  isVisible?: (ctx: FileActionContext) => boolean
}

export interface FileActionContext {
  path: string
  entries: FileEntry[]
  selection: FileEntry[]
  folderChain: FolderChainItem[]
  clipboard: ClipboardState | null
  readOnly: boolean
  /**
   * Whether a details panel is mounted to receive a preview. Actions that only
   * change what that panel shows have nowhere to put their result without one, so
   * they hide rather than sit in the menu doing nothing.
   */
  hasDetailsPanel: boolean
}

export interface FileActionEvent extends FileActionContext {
  id: string
  /**
   * Suppresses the browser's built-in handling of this action. Call it from
   * `onFileAction` when the app fully owns the behaviour — otherwise the default
   * runs after your handler returns, and a custom Open would be followed by the
   * built-in one navigating away.
   */
  preventDefault(): void
  readonly defaultPrevented: boolean
  /** Selection narrowed by the action's `appliesTo`. Usually what you want. */
  targets: FileEntry[]
  /** Entries excluded by `appliesTo` — report these rather than dropping them silently. */
  excluded: FileEntry[]
  /** The entry the event originated from, for a double-click or a context-menu click. */
  origin?: FileEntry
  browser: FileBrowserHandle
}

export type FileActionHandler = (event: FileActionEvent) => void | Promise<void>

/** Imperative control surface, handed to action handlers and exposed via ref. */
export interface FileBrowserHandle {
  getState(): FileBrowserState
  /** Navigate to a directory and load it. */
  navigate(path: string): Promise<void>
  /** Open a folder (navigate into it) or emit an open-file action. */
  open(entry: FileEntry): Promise<void>
  /** Re-list the current directory. */
  refresh(): Promise<void>
  navigateUp(): Promise<void>
  setSelection(ids: Iterable<string>): void
  /**
   * Applies a resolved selection together with its range anchor and roving-focus
   * target in one update, so a shift-click can't land with a stale anchor.
   */
  applySelection(next: { selection: Iterable<string>; anchorId?: string | null; focusedId?: string | null }): void
  setFocus(id: string | null): void
  selectAll(): void
  clearSelection(): void
  setViewMode(mode: ViewMode): void
  setDensity(density: Density): void
  setShowHidden(showHidden: boolean): void
  setSort(key: SortKey, direction?: SortDirection): void
  setSearch(query: string): void
  setClipboard(clipboard: ClipboardState | null): void
  /** Queue files for upload into `destination` (defaults to the current directory). */
  upload(files: File[], options?: { destination?: string; emptyDirs?: string[] }): Promise<void>
  /** Ask the user for a string (used by rename and create-folder). */
  prompt(options: PromptOptions): Promise<string | null>
  confirm(options: ConfirmOptions): Promise<boolean>
  notify(notification: Notification): void
}

export interface PromptOptions {
  title: string
  label?: string
  defaultValue?: string
  submitLabel?: string
  /** Selects only the stem, leaving the extension unhighlighted — rename's default. */
  selectStemOnly?: boolean
  validate?: (value: string) => { valid: boolean; message?: string }
}

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  destructive?: boolean
}

export interface Notification {
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
}

/**
 * Where user-facing messages go. The package deliberately does not depend on a
 * toast library; FSG apps pass an adapter backed by `sonner`, and the default
 * writes to the console so nothing is lost when one isn't supplied.
 */
export type NotificationAdapter = (notification: Notification) => void
