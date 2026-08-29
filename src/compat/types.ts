/**
 * Chonky 2.x type shapes, reproduced so a consuming app's existing annotations keep
 * compiling. These are structural copies, not re-exports — the `chonky` package is
 * not a dependency of this one.
 */

export interface ChonkyFileData {
  id: string
  name: string
  ext?: string
  isDir?: boolean
  isHidden?: boolean
  isSymlink?: boolean
  isEncrypted?: boolean
  openable?: boolean
  selectable?: boolean
  draggable?: boolean
  droppable?: boolean
  size?: number
  /** Epoch ms or a Date — Chonky accepted both. */
  modDate?: Date | string | number
  childrenCount?: number
  color?: string
  icon?: unknown
  thumbnailUrl?: string
  [key: string]: unknown
}

/** Chonky modelled "still loading" as a null slot in the array. */
export type ChonkyFileArray = (ChonkyFileData | null)[]

export type ChonkyFileFilter = (file: ChonkyFileData | null) => boolean

export interface ChonkyFileActionButton {
  name: string
  toolbar?: boolean
  contextMenu?: boolean
  group?: string
  tooltip?: string
  icon?: unknown
  iconOnly?: boolean
}

export interface ChonkyFileAction {
  id: string
  hotkeys?: readonly string[]
  button?: ChonkyFileActionButton
  fileFilter?: ChonkyFileFilter
  requiresSelection?: boolean
  sortKeySelector?: unknown
  fileViewConfig?: unknown
  option?: unknown
  selectionTransform?: unknown
  effect?: unknown
  payload?: unknown
  readonly?: boolean
  [key: string]: unknown
}

export interface ChonkyFileActionData {
  id: string
  action: ChonkyFileAction
  payload?: any
  state: {
    selectedFiles: ChonkyFileData[]
    selectedFilesForAction: ChonkyFileData[]
    contextMenuTriggerFile: ChonkyFileData | null
    instanceId: string
  }
}

export type ChonkyFileActionHandler = (data: ChonkyFileActionData) => void | Promise<void>
