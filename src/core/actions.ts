import {
  ArrowUpFromLine,
  ClipboardPaste,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FolderPlus,
  FolderUp,
  Image as ImageIcon,
  Info,
  Pencil,
  RefreshCw,
  Scissors,
  Trash2,
} from 'lucide-react'
import type { FileAction } from './types'
import { isHeic } from '../util/mime'

/**
 * Canonical action ids. Exported as constants because handlers switch on them and
 * a consuming app replaces an action by reusing its id — a typo'd string literal
 * would silently register a second, unreachable action instead.
 */
export const FileActionId = {
  OpenFiles: 'open_files',
  OpenInNewTab: 'open_in_new_tab',
  Download: 'download',
  Rename: 'rename',
  Delete: 'delete',
  Copy: 'copy',
  Cut: 'cut',
  Paste: 'paste',
  CreateFolder: 'create_folder',
  UploadFiles: 'upload_files',
  UploadDirectory: 'upload_directory',
  Refresh: 'refresh',
  ToggleDetails: 'toggle_details',
  PreviewFile: 'preview_file',
  ConvertHeic: 'convert_heic',
  SelectAll: 'select_all',
  ClearSelection: 'clear_selection',
} as const

export type FileActionIdValue = (typeof FileActionId)[keyof typeof FileActionId]

const notADirectory = (entry: { isDir: boolean }) => !entry.isDir

export const openFilesAction: FileAction = {
  id: FileActionId.OpenFiles,
  label: 'Open',
  icon: Eye,
  hotkey: 'Enter',
  group: 'Open',
  contextMenu: true,
  requiresSelection: true,
}

export const openInNewTabAction: FileAction = {
  id: FileActionId.OpenInNewTab,
  label: 'Open in new tab',
  icon: ExternalLink,
  group: 'Open',
  contextMenu: true,
  requiresSelection: true,
  appliesTo: notADirectory,
}

export const downloadAction: FileAction = {
  id: FileActionId.Download,
  label: 'Download',
  icon: Download,
  group: 'Open',
  toolbar: true,
  contextMenu: true,
  requiresSelection: true,
  appliesTo: notADirectory,
}

export const previewAction: FileAction = {
  id: FileActionId.PreviewFile,
  label: 'Preview',
  icon: ImageIcon,
  group: 'Open',
  contextMenu: true,
  requiresSelection: true,
  appliesTo: notADirectory,
}

export const renameAction: FileAction = {
  id: FileActionId.Rename,
  label: 'Rename',
  icon: Pencil,
  hotkey: 'F2',
  group: 'Edit',
  contextMenu: true,
  requiresSelection: true,
}

export const copyAction: FileAction = {
  id: FileActionId.Copy,
  label: 'Copy',
  icon: Copy,
  hotkey: 'mod+c',
  group: 'Edit',
  contextMenu: true,
  requiresSelection: true,
  appliesTo: notADirectory,
}

export const cutAction: FileAction = {
  id: FileActionId.Cut,
  label: 'Cut',
  icon: Scissors,
  hotkey: 'mod+x',
  group: 'Edit',
  contextMenu: true,
  requiresSelection: true,
}

export const pasteAction: FileAction = {
  id: FileActionId.Paste,
  label: 'Paste',
  icon: ClipboardPaste,
  hotkey: 'mod+v',
  group: 'Edit',
  toolbar: true,
  contextMenu: true,
  // Hidden rather than disabled: an always-visible greyed-out Paste is noise in a
  // menu the user opens dozens of times a session.
  isVisible: (ctx) => ctx.clipboard !== null && ctx.clipboard.entries.length > 0,
}

export const deleteAction: FileAction = {
  id: FileActionId.Delete,
  label: 'Delete',
  icon: Trash2,
  hotkey: ['Delete', 'Backspace'],
  group: 'Edit',
  contextMenu: true,
  destructive: true,
  requiresSelection: true,
  // Folders are excluded by default: deleting one takes its whole subtree. An app
  // opts in by replacing this action with one whose appliesTo admits directories.
  appliesTo: notADirectory,
}

export const createFolderAction: FileAction = {
  id: FileActionId.CreateFolder,
  label: 'New folder',
  icon: FolderPlus,
  hotkey: 'mod+shift+n',
  group: 'Create',
  toolbar: true,
  contextMenu: true,
}

export const uploadFilesAction: FileAction = {
  id: FileActionId.UploadFiles,
  label: 'Upload files',
  icon: ArrowUpFromLine,
  hotkey: 'mod+u',
  group: 'Create',
  toolbar: true,
  contextMenu: true,
}

export const uploadDirectoryAction: FileAction = {
  id: FileActionId.UploadDirectory,
  label: 'Upload folder',
  icon: FolderUp,
  hotkey: 'mod+shift+u',
  group: 'Create',
  toolbar: true,
  contextMenu: true,
}

export const convertHeicAction: FileAction = {
  id: FileActionId.ConvertHeic,
  label: 'Convert to JPG',
  icon: ImageIcon,
  group: 'Edit',
  contextMenu: true,
  requiresSelection: true,
  appliesTo: (entry) => !entry.isDir && isHeic(entry),
}

export const refreshAction: FileAction = {
  id: FileActionId.Refresh,
  label: 'Refresh',
  icon: RefreshCw,
  hotkey: 'mod+r',
  toolbar: true,
  iconOnly: true,
}

export const toggleDetailsAction: FileAction = {
  id: FileActionId.ToggleDetails,
  label: 'File info',
  icon: Info,
  toolbar: true,
  iconOnly: true,
}

/** Ids of every action that changes stored state. `readOnly` strips all of them. */
export const MUTATING_ACTION_IDS: ReadonlySet<string> = new Set<string>([
  FileActionId.Rename,
  FileActionId.Delete,
  FileActionId.Cut,
  FileActionId.Paste,
  FileActionId.CreateFolder,
  FileActionId.UploadFiles,
  FileActionId.UploadDirectory,
  FileActionId.ConvertHeic,
])

/** The set a browser gets when `fileActions` isn't supplied. */
export const defaultFileActions: FileAction[] = [
  uploadFilesAction,
  uploadDirectoryAction,
  createFolderAction,
  openFilesAction,
  openInNewTabAction,
  previewAction,
  downloadAction,
  renameAction,
  copyAction,
  cutAction,
  pasteAction,
  deleteAction,
  refreshAction,
  toggleDetailsAction,
]

/**
 * Merges overrides into a base set, matching on id. An override with a known id
 * replaces that action in place (keeping its position); an unknown id appends.
 *
 * Replacement rather than append is what an app needs to narrow Delete with its own
 * `appliesTo` — two actions sharing an id would leave the permissive one live.
 */
export function mergeFileActions(base: FileAction[], overrides: FileAction[] = []): FileAction[] {
  if (overrides.length === 0) return base
  const byId = new Map(overrides.map((action) => [action.id, action]))
  const merged = base.map((action) => byId.get(action.id) ?? action)
  const seen = new Set(base.map((action) => action.id))
  for (const action of overrides) {
    if (!seen.has(action.id)) merged.push(action)
  }
  return merged
}
