import { ChonkyIconName } from './icons'
import { FileActionId } from '../core/actions'
import type { ChonkyFileAction } from './types'

/**
 * Chonky's built-in action objects.
 *
 * Ids match the modern action ids wherever the two mean the same thing, so an app
 * that switches on `data.id` in its handler keeps working unchanged. Where Chonky
 * had no equivalent, the id is preserved verbatim and the shim maps it.
 */
export const ChonkyActions = {
  OpenFiles: {
    id: FileActionId.OpenFiles,
    __chonkyId: 'open_files',
    button: { name: 'Open', toolbar: false, contextMenu: true, icon: ChonkyIconName.openFiles },
  },
  OpenSelection: {
    id: FileActionId.OpenFiles,
    __chonkyId: 'open_selection',
    requiresSelection: true,
    button: { name: 'Open selection', toolbar: false, contextMenu: true, group: 'Actions', icon: ChonkyIconName.openFiles },
  },
  OpenParentFolder: { id: 'open_parent_folder', button: { name: 'Go up a directory', toolbar: true, icon: ChonkyIconName.folderOpen } },
  SelectAllFiles: { id: FileActionId.SelectAll, hotkeys: ['ctrl+a'], button: { name: 'Select all files', toolbar: true } },
  ClearSelection: { id: FileActionId.ClearSelection, hotkeys: ['escape'], button: { name: 'Clear selection', toolbar: true } },
  UploadFiles: { id: FileActionId.UploadFiles, button: { name: 'Upload files', toolbar: true, icon: ChonkyIconName.upload } },
  DownloadFiles: {
    id: FileActionId.Download,
    requiresSelection: true,
    button: { name: 'Download files', toolbar: true, contextMenu: true, group: 'Actions', icon: ChonkyIconName.download },
  },
  DeleteFiles: {
    id: FileActionId.Delete,
    requiresSelection: true,
    hotkeys: ['delete'],
    button: { name: 'Delete files', toolbar: true, contextMenu: true, group: 'Actions', icon: ChonkyIconName.trash },
  },
  CreateFolder: { id: FileActionId.CreateFolder, button: { name: 'Create folder', toolbar: true, tooltip: 'Create a folder', icon: ChonkyIconName.folderCreate } },
  CopyFiles: {
    id: FileActionId.Copy,
    requiresSelection: true,
    hotkeys: ['ctrl+c'],
    button: { name: 'Copy files', contextMenu: true, group: 'Actions', icon: ChonkyIconName.copy },
  },
  // Drag-and-drop is handled natively by the rebuilt browser; the id survives so an
  // existing handler's `case ChonkyActions.EndDragNDrop.id` still compiles.
  StartDragNDrop: { id: 'start_drag_n_drop' },
  EndDragNDrop: { id: 'end_drag_n_drop' },
  MouseClickFile: { id: 'mouse_click_file' },
  KeyboardClickFile: { id: 'keyboard_click_file' },
  ChangeSelection: { id: 'change_selection' },
  ToggleHiddenFiles: { id: 'toggle_hidden_files', hotkeys: ['ctrl+h'], button: { name: 'Show hidden files', toolbar: true } },
  ToggleShowFoldersFirst: { id: 'toggle_show_folders_first', button: { name: 'Show folders first', toolbar: true } },
  EnableListView: { id: 'enable_list_view', button: { name: 'Switch to List view', toolbar: true, icon: ChonkyIconName.list } },
  EnableGridView: { id: 'enable_grid_view', button: { name: 'Switch to Grid view', toolbar: true, icon: ChonkyIconName.smallThumbnail } },
  EnableCompactView: { id: 'enable_compact_view', button: { name: 'Switch to Compact view', toolbar: true, icon: ChonkyIconName.list } },
  SortFilesByName: { id: 'sort_files_by_name', button: { name: 'Sort by name', toolbar: true, group: 'Options' } },
  SortFilesBySize: { id: 'sort_files_by_size', button: { name: 'Sort by size', toolbar: true, group: 'Options' } },
  SortFilesByDate: { id: 'sort_files_by_date', button: { name: 'Sort by date', toolbar: true, group: 'Options' } },
  FocusSearchInput: { id: 'focus_search_input', hotkeys: ['ctrl+f'] },
} as unknown as Record<string, ChonkyFileAction>

/**
 * Chonky's action factory. In the shim it is an identity function with the same
 * signature — the object it returns is translated to a modern `FileAction` when the
 * compat browser resolves its action list.
 *
 * The second `effect` argument is accepted and preserved on the object, but the
 * rebuilt browser does not run Chonky's effect protocol: effects existed to let an
 * action mutate Chonky's Redux store, which no longer exists. Anything an effect
 * did belongs in `onFileAction`.
 */
export function defineFileAction(action: ChonkyFileAction, effect?: unknown): ChonkyFileAction {
  return effect ? { ...action, effect } : action
}

/** Chonky's file predicates, which apps used inside action filters. */
export const FileHelper = {
  isDirectory: (file: { isDir?: boolean } | null | undefined): boolean => !!file?.isDir,
  isHidden: (file: { isHidden?: boolean; name?: string } | null | undefined): boolean =>
    !!file && (file.isHidden === true || !!file.name?.startsWith('.')),
  isSymlink: (file: { isSymlink?: boolean } | null | undefined): boolean => !!file?.isSymlink,
  isEncrypted: (file: { isEncrypted?: boolean } | null | undefined): boolean => !!file?.isEncrypted,
  isClickable: (file: unknown): boolean => !!file,
  isOpenable: (file: { openable?: boolean } | null | undefined): boolean => !!file && file.openable !== false,
  isSelectable: (file: { selectable?: boolean } | null | undefined): boolean => !!file && file.selectable !== false,
  isDraggable: (file: { draggable?: boolean; id?: string } | null | undefined): boolean => !!file && file.draggable !== false,
  isDroppable: (file: { droppable?: boolean; isDir?: boolean } | null | undefined): boolean =>
    !!file && !!file.isDir && file.droppable !== false,
  isDndOpenable: (file: { isDir?: boolean } | null | undefined): boolean => !!file?.isDir,
  getItemSize: (file: { size?: number } | null | undefined): number | null => file?.size ?? null,
}
