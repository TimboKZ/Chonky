import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { FileBrowser } from '../ui/file-browser'
import { FileActionId } from '../core/actions'
import type { FileSystemAdapter } from '../adapter/types'
import type { FileAction, FileActionEvent, FileBrowserHandle, FileEntry, FolderChainItem } from '../core/types'
import type { ChonkyFileAction, ChonkyFileActionData, ChonkyFileActionHandler, ChonkyFileArray, ChonkyFileData } from './types'

/** Chonky view-mode action ids, which apps dispatched and listened for. */
const VIEW_ACTION_IDS = {
  list: 'enable_list_view',
  grid: 'enable_grid_view',
  compact: 'enable_compact_view',
} as const

function toEpoch(modDate: ChonkyFileData['modDate']): number | undefined {
  if (modDate == null) return undefined
  if (typeof modDate === 'number') return modDate
  if (modDate instanceof Date) return modDate.getTime()
  const parsed = new Date(modDate).getTime()
  return Number.isNaN(parsed) ? undefined : parsed
}

/**
 * Maps a Chonky file onto a modern entry.
 *
 * `fullName` wins over `name` where present: the FSG wrapper stored a
 * display-shortened name in `name` and the real one in `fullName`, and a mutation
 * carrying the shortened name would create a file literally called `a ... b.pdf`.
 * The original object rides along in `meta.chonky` and is handed straight back to
 * the app's handler, so identity and any custom fields survive the round trip.
 */
function toEntry(file: ChonkyFileData): FileEntry {
  const name = (typeof file.fullName === 'string' && file.fullName) || file.name
  return {
    id: file.id,
    name,
    isDir: !!file.isDir,
    size: file.size,
    modifiedAt: toEpoch(file.modDate),
    mimeType: (file.mime_type as string | undefined) ?? (file.isDir ? 'application/x-directory' : undefined),
    thumbnailUrl: file.thumbnailUrl,
    path: typeof file.path === 'string' ? file.path : undefined,
    disabled: file.selectable === false,
    meta: { chonky: file },
  }
}

/** Recovers the object the app originally passed in. */
function toChonkyFile(entry: FileEntry): ChonkyFileData {
  const original = entry.meta?.chonky as ChonkyFileData | undefined
  return (
    original ?? {
      id: entry.id,
      name: entry.name,
      isDir: entry.isDir,
      size: entry.size,
      modDate: entry.modifiedAt,
      thumbnailUrl: entry.thumbnailUrl,
    }
  )
}

/** Translates a Chonky action definition into a modern one. */
function toFileAction(action: ChonkyFileAction): FileAction {
  const button = action.button
  return {
    id: action.id,
    label: button?.name ?? action.id,
    group: button?.group,
    toolbar: button?.toolbar,
    contextMenu: button?.contextMenu,
    iconOnly: button?.iconOnly,
    destructive: action.id === FileActionId.Delete,
    requiresSelection: action.requiresSelection,
    // Chonky's fileFilter took a nullable file; the modern appliesTo never does.
    appliesTo: action.fileFilter ? (entry: FileEntry) => action.fileFilter!(toChonkyFile(entry)) : undefined,
    // Chonky hotkeys were `ctrl+c`/`command+c` pairs. `mod` covers both, so the
    // literal `command+` variants are dropped to avoid registering the same
    // shortcut twice.
    hotkey: action.hotkeys?.filter((key) => !key.startsWith('command+')).map((key) => key.replace(/^ctrl\+/, 'mod+')),
  }
}

export interface FullFileBrowserCompatProps {
  files: ChonkyFileArray
  folderChain?: ChonkyFileArray
  fileActions?: ChonkyFileAction[]
  onFileAction?: ChonkyFileActionHandler
  defaultFileViewActionId?: string
  disableDragAndDrop?: boolean
  disableSelection?: boolean
  /** Accepted and ignored — theming follows the `.dark`/`.dracula` root class. */
  darkMode?: boolean
  instanceId?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/**
 * Drop-in stand-in for Chonky's `<FullFileBrowser>`, for migrating an app one step
 * at a time.
 *
 * Faithful to Chonky's controlled model: the app owns `files` and `folderChain` and
 * handles every action itself, so the modern browser's built-in behaviours are
 * suppressed and every action is forwarded to `onFileAction` in Chonky's event
 * shape.
 *
 * Not reproduced, because they no longer exist:
 * - the Redux store, `ChonkyBusinessLogic`, and action `effect`s
 * - `setChonkyDefaults({ iconComponent })` — icons come from the file's kind
 * - `thumbnailGenerator` — set `thumbnailUrl` on the file instead
 *
 * Treat this as transitional. `<FileBrowser>` with an adapter is the API to move to;
 * see MIGRATION.md.
 */
export function FullFileBrowser({
  files,
  folderChain,
  fileActions,
  onFileAction,
  defaultFileViewActionId,
  disableDragAndDrop,
  className,
  style,
  instanceId = 'chonky-compat',
}: FullFileBrowserCompatProps) {
  const handleRef = useRef<FileBrowserHandle>(null)

  // Chonky slots a null into the array for a file that is still loading; the modern
  // browser shows its own loading state, so nulls are simply dropped.
  const entries = useMemo(() => files.filter((file): file is ChonkyFileData => !!file).map(toEntry), [files])

  const chain = useMemo<FolderChainItem[]>(() => {
    const items = (folderChain ?? []).filter((file): file is ChonkyFileData => !!file)
    return items.map((file, index) => ({
      id: file.id,
      name: (typeof file.fullName === 'string' && file.fullName) || file.name,
      // The app owns navigation, so a crumb's `path` only has to be a stable key the
      // click handler can map back to the original file.
      path: String(file.id),
      isRoot: index === 0,
    }))
  }, [folderChain])

  const entriesRef = useRef(entries)
  entriesRef.current = entries
  const chainRef = useRef(chain)
  chainRef.current = chain

  // A controlled adapter: it serves whatever the props currently hold and ignores
  // the requested path, because in Chonky's model the app answers navigation by
  // swapping the `files` prop.
  const adapter = useMemo<FileSystemAdapter>(
    () => ({
      id: `chonky-compat:${instanceId}`,
      async list() {
        return { entries: entriesRef.current, folderChain: chainRef.current }
      },
    }),
    [instanceId],
  )

  // New props mean new contents; re-read them through the adapter.
  useEffect(() => {
    void handleRef.current?.refresh()
  }, [entries, chain])

  const actions = useMemo(() => (fileActions ?? []).map(toFileAction), [fileActions])

  const emit = useCallback(
    (id: string, payload: unknown, selection: FileEntry[], targets: FileEntry[], origin?: FileEntry) => {
      const data: ChonkyFileActionData = {
        id,
        action: (fileActions ?? []).find((action) => action.id === id) ?? ({ id } as ChonkyFileAction),
        payload,
        state: {
          selectedFiles: selection.map(toChonkyFile),
          selectedFilesForAction: targets.map(toChonkyFile),
          contextMenuTriggerFile: origin ? toChonkyFile(origin) : null,
          instanceId,
        },
      }
      return onFileAction?.(data)
    },
    [fileActions, onFileAction, instanceId],
  )

  const handleAction = useCallback(
    async (event: FileActionEvent) => {
      // The app owns every behaviour in this model. Suppressing the defaults is what
      // stops the modern browser from, say, navigating into a folder the app was
      // about to load differently.
      event.preventDefault()

      const payload =
        event.id === FileActionId.OpenFiles
          ? {
              targetFile: event.origin ? toChonkyFile(event.origin) : undefined,
              files: event.targets.map(toChonkyFile),
              file: event.origin ? toChonkyFile(event.origin) : undefined,
            }
          : undefined

      await emit(event.id, payload, event.selection, event.targets, event.origin)

      // Chonky fired `mouse_click_file` alongside an open, and some handlers keyed
      // their double-click detection off it.
      if (event.id === FileActionId.OpenFiles && event.origin) {
        await emit('mouse_click_file', { file: toChonkyFile(event.origin), clickType: 'double' }, event.selection, event.targets, event.origin)
      }
    },
    [emit],
  )

  const onSelectionChange = useCallback(
    (selected: FileEntry[]) => {
      void emit('change_selection', undefined, selected, selected)
    },
    [emit],
  )

  const initialViewMode =
    defaultFileViewActionId === VIEW_ACTION_IDS.list
      ? 'list'
      : defaultFileViewActionId === VIEW_ACTION_IDS.compact
        ? 'details'
        : 'grid'

  return (
    <div className={className} style={{ height: '100%', ...style }}>
      <FileBrowser
        ref={handleRef}
        adapter={adapter}
        rootPath=""
        rootLabel={chain[0]?.name ?? 'Files'}
        fileActions={actions}
        onFileAction={handleAction}
        onSelectionChange={onSelectionChange}
        initialViewMode={initialViewMode}
        readOnly={disableDragAndDrop}
        persistKey={`chonky-compat:${instanceId}`}
        // The tree navigates by path, which a controlled adapter cannot serve.
        showSidebar={false}
      />
    </div>
  )
}

/**
 * No-op stand-in for Chonky's global configuration.
 *
 * Its main use was `iconComponent` (usually `ChonkyIconFA`); the rebuilt browser
 * derives icons from each file's kind, so there is nothing to configure. Kept so an
 * existing call site compiles and runs without change.
 */
export function setChonkyDefaults(_defaults: Record<string, unknown>): void {
  // Intentionally empty — see the note above.
}
