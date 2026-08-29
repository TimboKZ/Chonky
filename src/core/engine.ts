import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { FileSystemAdapter } from '../adapter/types'
import { adapterCan } from '../adapter/types'
import {
  FileActionId,
  MUTATING_ACTION_IDS,
  convertHeicAction,
  defaultFileActions,
  mergeFileActions,
} from './actions'
import { createInitialState, createStore } from './store'
import { pruneSelection, selectedEntries } from './selection'
import { visibleEntries } from './sort'
import { readPreferences, writePreferences } from './persist'
import { runUploadPipeline } from './upload'
import { getExtension, joinPath, uniqueName, validateName } from '../util/names'
import { pickDirectory, pickFiles } from '../util/file-drop'
import { isHeic } from '../util/mime'
import type {
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
  Notification,
  NotificationAdapter,
  PromptOptions,
  SortDirection,
  SortKey,
  UploadTask,
  ViewMode,
} from './types'

export interface UseFileBrowserOptions {
  adapter: FileSystemAdapter
  /** Directory the browser opens in and treats as its ceiling. Defaults to `''`. */
  rootPath?: string
  /** Name shown for the root crumb. Defaults to the last segment of `rootPath`. */
  rootLabel?: string
  /** Controlled path. Supply with `onPathChange` to drive navigation from the URL. */
  path?: string
  onPathChange?: (path: string) => void
  defaultPath?: string

  /** Replaces or extends the default action set. Matching ids replace in place. */
  fileActions?: FileAction[]
  onFileAction?: FileActionHandler
  /** Hides every mutating action and refuses them defensively in the handler. */
  readOnly?: boolean
  /**
   * Turns off drag-to-move within the browser, leaving the rest of the mutating
   * actions available. Separate from `readOnly` because the two are different
   * questions: whether the user may change anything, and whether dragging is the
   * right way to do it.
   */
  disableDragAndDrop?: boolean
  /**
   * Locks individual entries against rename, delete, cut, and drag-move while
   * leaving them open to browse and download.
   */
  isEntryLocked?: (entry: FileEntry) => boolean
  /** Admits directories to Delete. Off by default: a folder takes its subtree with it. */
  allowFolderDelete?: boolean

  initialViewMode?: ViewMode
  density?: Density
  /** Key under which view preferences persist. Defaults to the adapter's id. */
  persistKey?: string | false

  onSelectionChange?: (entries: FileEntry[]) => void
  /** Fires after the listing is reloaded following a mutation, not on first load. */
  onEntriesChanged?: () => void
  onError?: (error: Error) => void
  notify?: NotificationAdapter
  /** Transforms files before upload — HEIC decode, image downscale. */
  transformUpload?: (files: File[]) => Promise<{ files: File[]; cancelled?: boolean }>
  /**
   * Keep the original after a manual "Convert to JPG", instead of removing it.
   *
   * Off by default: leaving both means the folder now holds the same photo twice,
   * and on a backend that archives rather than erases (FSG's does) the original is
   * recoverable anyway.
   * @default false
   */
  heicKeepOriginal?: boolean
  /**
   * Override the HEIC → JPEG converter. Mainly for tests and Storybook, which would
   * otherwise download the libheif WASM bundle.
   */
  heicConverter?: (bytes: Uint8Array, quality?: number) => Promise<Uint8Array>
}

export interface DialogRequest {
  kind: 'prompt' | 'confirm'
  options: PromptOptions | ConfirmOptions
  resolve: (value: any) => void
}

export interface FileBrowserEngine {
  state: FileBrowserState
  /** Entries after hidden-filter, search, and sort — the order rendered on screen. */
  visible: FileEntry[]
  selection: FileEntry[]
  actions: FileAction[]
  actionContext: FileActionContext
  handle: FileBrowserHandle
  adapter: FileSystemAdapter
  readOnly: boolean
  /** Whether drag-to-move is live: the adapter can move, and nothing has disabled it. */
  dragAndDropEnabled: boolean
  dialog: DialogRequest | null
  closeDialog: (value: unknown) => void
  /** Entry the preview panel is showing, if any. */
  previewEntry: FileEntry | null
  setPreviewEntry: (entry: FileEntry | null) => void
  detailsOpen: boolean
  setDetailsOpen: (open: boolean) => void
  dispatch: (id: string, options?: { origin?: FileEntry; targets?: FileEntry[] }) => Promise<void>
  isActionEnabled: (action: FileAction) => boolean
  isEntryLocked: (entry: FileEntry) => boolean
  /** Roots the tree sidebar and bounds `navigateUp`. */
  rootPath: string
}

function buildFolderChain(path: string, rootPath: string, rootLabel: string): FolderChainItem[] {
  const root: FolderChainItem = { id: rootPath || '/', name: rootLabel, path: rootPath, isRoot: true }
  const relative = path.slice(rootPath.length).replace(/^\/+/, '')
  if (!relative) return [root]

  const chain = [root]
  let current = rootPath
  for (const segment of relative.split('/').filter(Boolean)) {
    current = joinPath(current, segment)
    chain.push({ id: current, name: segment, path: current })
  }
  return chain
}

export function useFileBrowser(options: UseFileBrowserOptions): FileBrowserEngine {
  const {
    adapter,
    rootPath = '',
    rootLabel,
    readOnly = false,
    allowFolderDelete = false,
    initialViewMode = 'grid',
    disableDragAndDrop = false,
    density,
    persistKey,
    transformUpload,
  } = options
  // onFileAction, onSelectionChange, onEntriesChanged, onError, isEntryLocked and
  // fileActions are read through optionsRef instead of being destructured, so a
  // parent passing inline callbacks doesn't invalidate every memo on each render.

  const preferenceKey = persistKey === false ? null : (persistKey ?? adapter.id)

  const [store] = useState(() => {
    const saved = preferenceKey ? readPreferences(preferenceKey) : {}
    return createStore(
      createInitialState({
        path: options.path ?? options.defaultPath ?? rootPath,
        viewMode: saved.viewMode ?? initialViewMode,
        sortKey: saved.sortKey ?? 'name',
        sortDirection: saved.sortDirection ?? 'asc',
        density: density ?? saved.density ?? 'comfortable',
        showHidden: saved.showHidden ?? false,
      }),
    )
  })

  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState)

  const [dialog, setDialog] = useState<DialogRequest | null>(null)
  const [previewEntry, setPreviewEntry] = useState<FileEntry | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Refs for values the stable callbacks below read but must not re-create on.
  const optionsRef = useRef(options)
  optionsRef.current = options
  const handleRef = useRef<FileBrowserHandle>(null as unknown as FileBrowserHandle)
  const loadTokenRef = useRef(0)
  const everLoadedRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const notify = useCallback((notification: Notification) => {
    const custom = optionsRef.current.notify
    if (custom) {
      custom(notification)
      return
    }
    const level = notification.level === 'error' ? 'error' : notification.level === 'warning' ? 'warn' : 'log'
    console[level](`[file-browser] ${notification.message}`)
  }, [])

  const fail = useCallback(
    (message: string, cause?: unknown) => {
      if (cause) console.error(message, cause)
      store.set({ status: 'error', error: message })
      notify({ level: 'error', message })
      optionsRef.current.onError?.(cause instanceof Error ? cause : new Error(message))
    },
    [store, notify],
  )

  const isEntryLocked = useCallback((entry: FileEntry) => optionsRef.current.isEntryLocked?.(entry) ?? false, [])

  // ── Loading ───────────────────────────────────────────────────────────────

  const load = useCallback(
    async (path: string, { silent = false }: { silent?: boolean } = {}) => {
      const token = ++loadTokenRef.current
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      if (!silent) store.set({ status: 'loading', error: null })

      try {
        const result = await adapter.list(path, { signal: controller.signal })
        // A newer navigation started while this listing was in flight; its result
        // is what the user is waiting for, so drop this one rather than flashing
        // the old folder's contents into the new folder's view.
        if (token !== loadTokenRef.current) return

        const chain = result.folderChain ?? buildFolderChain(path, rootPath, rootLabel ?? rootPath.split('/').filter(Boolean).pop() ?? 'Files')

        store.set((current) => ({
          path,
          entries: result.entries,
          folderChain: chain,
          status: 'ready',
          error: null,
          selection: pruneSelection(current.selection, result.entries),
        }))

        if (everLoadedRef.current) optionsRef.current.onEntriesChanged?.()
        else everLoadedRef.current = true
      } catch (e) {
        if (token !== loadTokenRef.current) return
        if ((e as Error)?.name === 'AbortError') return
        fail('Failed to load this folder', e)
      }
    },
    [adapter, rootPath, rootLabel, store, fail],
  )

  const navigate = useCallback(
    async (path: string) => {
      const normalised = path.replace(/\/+$/, '') || rootPath
      optionsRef.current.onPathChange?.(normalised)
      // Uncontrolled: drive the store ourselves. Controlled: the `path` prop effect
      // below performs the load once the parent has accepted the new path.
      if (optionsRef.current.path === undefined) {
        store.set({ path: normalised, selection: new Set<string>(), focusedId: null, anchorId: null })
        await load(normalised)
      }
    },
    [load, rootPath, store],
  )

  const refresh = useCallback(() => load(store.getState().path, { silent: true }), [load, store])

  // Initial load, and re-load whenever a controlled `path` changes.
  const controlledPath = options.path
  useEffect(() => {
    const target = controlledPath ?? store.getState().path
    void load(target)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledPath, adapter, load])

  useEffect(() => () => abortRef.current?.abort(), [])

  // ── Derived state ─────────────────────────────────────────────────────────

  const visible = useMemo(
    () =>
      visibleEntries(state.entries, {
        search: state.search,
        showHidden: state.showHidden,
        sortKey: state.sortKey,
        sortDirection: state.sortDirection,
      }),
    [state.entries, state.search, state.showHidden, state.sortKey, state.sortDirection],
  )

  const visibleRef = useRef(visible)
  visibleRef.current = visible

  const selection = useMemo(() => selectedEntries(visible, state.selection), [visible, state.selection])

  // `selection` is a fresh array on every reload, so notifying on its identity would
  // fire the callback after every refresh even when nothing was selected or
  // deselected. Compare the ids instead.
  const lastSelectionKey = useRef<string | null>(null)
  useEffect(() => {
    const key = selection.map((entry) => entry.id).join('\u0000')
    if (lastSelectionKey.current === key) return
    lastSelectionKey.current = key
    optionsRef.current.onSelectionChange?.(selection)
  }, [selection])

  useEffect(() => {
    if (!preferenceKey) return
    writePreferences(preferenceKey, {
      viewMode: state.viewMode,
      sortKey: state.sortKey,
      sortDirection: state.sortDirection,
      density: state.density,
      showHidden: state.showHidden,
    })
  }, [preferenceKey, state.viewMode, state.sortKey, state.sortDirection, state.density, state.showHidden])

  // ── Dialogs ───────────────────────────────────────────────────────────────

  const prompt = useCallback(
    (promptOptions: PromptOptions) =>
      new Promise<string | null>((resolve) => setDialog({ kind: 'prompt', options: promptOptions, resolve })),
    [],
  )

  const confirm = useCallback(
    (confirmOptions: ConfirmOptions) =>
      new Promise<boolean>((resolve) => setDialog({ kind: 'confirm', options: confirmOptions, resolve })),
    [],
  )

  const closeDialog = useCallback((value: unknown) => {
    setDialog((current) => {
      current?.resolve(value)
      return null
    })
  }, [])

  // ── Handle ────────────────────────────────────────────────────────────────

  const upload = useCallback(
    async (files: File[], uploadOptions?: { destination?: string; emptyDirs?: string[] }) => {
      if (optionsRef.current.readOnly) return
      const destination = uploadOptions?.destination ?? store.getState().path
      try {
        const result = await runUploadPipeline({
          adapter,
          files,
          emptyDirs: uploadOptions?.emptyDirs,
          destination,
          transform: transformUpload,
          onTaskUpdate: (uploads: UploadTask[]) => store.set({ uploads }),
          notify,
        })
        if (result.cancelled) {
          store.set({ uploads: [] })
          return
        }
        await refresh()
        if (result.uploaded > 0) {
          notify({
            level: 'success',
            message: result.uploaded === 1 ? 'Uploaded 1 file.' : `Uploaded ${result.uploaded} files.`,
          })
        }
      } catch (e) {
        fail(e instanceof Error ? e.message : 'Upload failed', e)
      } finally {
        // Leave completed tasks on screen briefly so the queue doesn't vanish the
        // instant the last transfer lands.
        setTimeout(() => store.set({ uploads: [] }), 2500)
      }
    },
    [adapter, store, transformUpload, notify, refresh, fail],
  )

  const open = useCallback(
    async (entry: FileEntry) => {
      if (entry.isDir) {
        await navigate(joinPath(store.getState().path, entry.name))
        return
      }
      // Routed through dispatch rather than handled here, so an app's onFileAction
      // sees a programmatic open exactly as it sees a double-click.
      await dispatchRef.current(FileActionId.OpenFiles, { origin: entry, targets: [entry] })
    },
    [navigate, store],
  )

  const handle = useMemo<FileBrowserHandle>(
    () => ({
      getState: () => store.getState(),
      navigate,
      open,
      refresh,
      navigateUp: async () => {
        const { path } = store.getState()
        if (path === rootPath) return
        const parent = path.split('/').slice(0, -1).join('/')
        await navigate(parent.length >= rootPath.length ? parent : rootPath)
      },
      setSelection: (ids) => store.set({ selection: new Set(ids) }),
      applySelection: ({ selection: ids, anchorId, focusedId }) =>
        store.set((current) => ({
          selection: new Set(ids),
          anchorId: anchorId !== undefined ? anchorId : current.anchorId,
          focusedId: focusedId !== undefined ? focusedId : current.focusedId,
        })),
      setFocus: (focusedId) => store.set({ focusedId }),
      // Reads the visible list through a ref: keeping it out of the memo's deps is
      // what makes `handle` stable, and an unstable handle would churn the ref an
      // app holds and re-fire every memo keyed on it whenever the listing changed.
      selectAll: () => store.set({ selection: new Set(visibleRef.current.map((entry) => entry.id)) }),
      clearSelection: () => store.set({ selection: new Set<string>(), anchorId: null }),
      setViewMode: (viewMode: ViewMode) => store.set({ viewMode }),
      setDensity: (nextDensity: Density) => store.set({ density: nextDensity }),
      setShowHidden: (showHidden: boolean) => store.set({ showHidden }),
      setSort: (sortKey: SortKey, direction?: SortDirection) =>
        store.set((current) => ({
          sortKey,
          sortDirection: direction ?? (current.sortKey === sortKey && current.sortDirection === 'asc' ? 'desc' : 'asc'),
        })),
      setSearch: (search: string) => store.set({ search }),
      setClipboard: (clipboard) => store.set({ clipboard }),
      upload,
      prompt,
      confirm,
      notify,
    }),
    [store, navigate, open, refresh, rootPath, upload, prompt, confirm, notify],
  )
  handleRef.current = handle

  // ── Actions ───────────────────────────────────────────────────────────────

  const actions = useMemo(() => {
    const merged = mergeFileActions(defaultFileActions, optionsRef.current.fileActions)

    // Delete and Rename are narrowed here rather than checked inside the handler:
    // an empty `appliesTo` result is what greys the control out, and refusing after
    // the click leaves a locked item offering a Delete that looks live.
    const locked = optionsRef.current.isEntryLocked
    const narrowed = merged.map((action) => {
      if (action.id === FileActionId.Delete) {
        const base = action.appliesTo
        return {
          ...action,
          appliesTo: (entry: FileEntry) => {
            if (entry.isDir && !allowFolderDelete) return false
            if (locked?.(entry)) return false
            return base ? base(entry) || entry.isDir : true
          },
        }
      }
      if (action.id === FileActionId.Rename || action.id === FileActionId.Cut) {
        const base = action.appliesTo
        return {
          ...action,
          appliesTo: (entry: FileEntry) => (locked?.(entry) ? false : (base?.(entry) ?? true)),
        }
      }
      return action
    })

    const withHeic = narrowed.some((action) => action.id === FileActionId.ConvertHeic)
      ? narrowed
      : [...narrowed, convertHeicAction]

    const available = withHeic.filter((action) => {
      switch (action.id) {
        case FileActionId.CreateFolder:
          return adapterCan.createDirectory(adapter)
        case FileActionId.UploadFiles:
        case FileActionId.UploadDirectory:
          return adapterCan.upload(adapter)
        case FileActionId.Rename:
        case FileActionId.Cut:
          return adapterCan.move(adapter)
        case FileActionId.Copy:
        case FileActionId.Paste:
          return adapterCan.copy(adapter) || adapterCan.move(adapter)
        case FileActionId.Delete:
          return adapterCan.remove(adapter)
        case FileActionId.Download:
          return adapterCan.download(adapter)
        case FileActionId.OpenInNewTab:
          return adapterCan.open(adapter)
        case FileActionId.PreviewFile:
          // A preview needs either the bytes (for the in-panel viewers) or a URL
          // (for images, video, and PDFs). With neither there is nothing to show.
          return adapterCan.read(adapter) || adapterCan.open(adapter)
        case FileActionId.ConvertHeic:
          return adapterCan.read(adapter) && adapterCan.upload(adapter)
        default:
          return true
      }
    })

    return readOnly ? available.filter((action) => !MUTATING_ACTION_IDS.has(action.id)) : available
    // `options.fileActions` and `isEntryLocked` are read through the ref, so they are
    // listed explicitly to keep the memo honest about what it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adapter, readOnly, allowFolderDelete, options.fileActions, options.isEntryLocked])

  const actionContext = useMemo<FileActionContext>(
    () => ({
      path: state.path,
      entries: visible,
      selection,
      folderChain: state.folderChain,
      clipboard: state.clipboard,
      readOnly,
    }),
    [state.path, visible, selection, state.folderChain, state.clipboard, readOnly],
  )

  const isActionEnabled = useCallback(
    (action: FileAction) => {
      if (!action.requiresSelection) return true
      const targets = action.appliesTo ? selection.filter(action.appliesTo) : selection
      return targets.length > 0
    },
    [selection],
  )

  // ── Default action behaviours ─────────────────────────────────────────────

  const runDefault = useCallback(
    async (event: FileActionEvent) => {
      const { targets, excluded } = event
      const currentPath = store.getState().path

      const reportExcluded = (verb: string) => {
        if (excluded.length === 0) return
        notify({
          level: 'warning',
          message: excluded.length === 1 ? `“${excluded[0].name}” can’t be ${verb}.` : `${excluded.length} items can’t be ${verb}.`,
        })
      }

      switch (event.id) {
        case FileActionId.OpenFiles: {
          const target = event.origin ?? targets[0]
          if (!target) return
          if (target.isDir) {
            await navigate(joinPath(currentPath, target.name))
            return
          }
          const url = adapter.getOpenUrl?.(target)
          if (url) window.open(url, '_blank', 'noopener,noreferrer')
          return
        }

        case FileActionId.OpenInNewTab: {
          for (const entry of targets) {
            const url = adapter.getOpenUrl?.(entry)
            if (url) window.open(url, '_blank', 'noopener,noreferrer')
          }
          return
        }

        case FileActionId.PreviewFile: {
          const target = event.origin ?? targets[0]
          if (target && !target.isDir) {
            setPreviewEntry(target)
            setDetailsOpen(true)
          }
          return
        }

        case FileActionId.Download: {
          for (const entry of targets) {
            const url = adapter.getDownloadUrl?.(entry)
            if (!url) continue
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = entry.name
            anchor.rel = 'noopener'
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            // Browsers throttle or drop rapid programmatic downloads; a short gap
            // keeps a multi-file download from silently losing all but the first.
            await new Promise((resolve) => setTimeout(resolve, 300))
          }
          return
        }

        case FileActionId.Refresh:
          await refresh()
          return

        case FileActionId.SelectAll:
          handleRef.current.selectAll()
          return

        case FileActionId.ClearSelection:
          handleRef.current.clearSelection()
          return

        case FileActionId.ToggleDetails:
          setDetailsOpen((open) => !open)
          return

        case FileActionId.Copy:
        case FileActionId.Cut: {
          reportExcluded(event.id === FileActionId.Cut ? 'moved' : 'copied')
          if (targets.length === 0) return
          store.set({ clipboard: { entries: targets, mode: event.id === FileActionId.Cut ? 'cut' : 'copy', sourcePath: currentPath } })
          return
        }

        case FileActionId.Paste: {
          const clipboard = store.getState().clipboard
          if (!clipboard || clipboard.entries.length === 0) return

          // Pasting onto a selected folder targets that folder; otherwise the paste
          // lands in the folder being viewed.
          const folderTarget = event.origin?.isDir ? event.origin : event.selection.find((entry) => entry.isDir)
          const destination = folderTarget ? joinPath(currentPath, folderTarget.name) : currentPath

          if (clipboard.mode === 'cut' && clipboard.sourcePath === destination) {
            store.set({ clipboard: null })
            return
          }

          store.set({ status: 'loading' })
          try {
            let taken: string[] = []
            try {
              taken = (await adapter.list(destination)).entries.map((entry) => entry.name)
            } catch {
              // Destination not listable yet — fall through and let the backend
              // arbitrate any collision.
            }

            for (const entry of clipboard.entries) {
              const name = uniqueName(entry.name, taken)
              taken.push(name)
              const request = { entry, destination, name }
              if (clipboard.mode === 'copy') {
                if (!adapter.copy) throw new Error('This backend cannot copy files.')
                await adapter.copy(request)
              } else {
                if (!adapter.move) throw new Error('This backend cannot move files.')
                await adapter.move(request)
              }
            }
            store.set({ clipboard: null })
            await refresh()
          } catch (e) {
            fail(clipboard.mode === 'copy' ? 'Failed to copy files' : 'Failed to move files', e)
          }
          return
        }

        case FileActionId.CreateFolder: {
          if (!adapter.createDirectory) return
          const name = await prompt({
            title: 'New folder',
            label: 'Folder name',
            submitLabel: 'Create',
            validate: validateName,
          })
          if (!name) return
          store.set({ status: 'loading' })
          try {
            await adapter.createDirectory(currentPath, name)
            await refresh()
          } catch (e) {
            fail('Failed to create folder', e)
          }
          return
        }

        case FileActionId.Rename: {
          reportExcluded('renamed')
          const target = targets[0]
          if (!target || !adapter.move) return
          const name = await prompt({
            title: `Rename ${target.isDir ? 'folder' : 'file'}`,
            label: 'Name',
            defaultValue: target.name,
            submitLabel: 'Rename',
            selectStemOnly: !target.isDir,
            validate: validateName,
          })
          if (!name || name === target.name) return
          store.set({ status: 'loading' })
          try {
            await adapter.move({ entry: target, destination: currentPath, name })
            await refresh()
          } catch (e) {
            fail('Failed to rename', e)
          }
          return
        }

        case FileActionId.Delete: {
          reportExcluded('deleted')
          if (targets.length === 0 || !adapter.remove) return
          const ok = await confirm({
            title: targets.length === 1 ? `Delete “${targets[0].name}”?` : `Delete ${targets.length} items?`,
            description: targets.some((entry) => entry.isDir)
              ? 'Folders are removed along with everything inside them.'
              : undefined,
            confirmLabel: 'Delete',
            destructive: true,
          })
          if (!ok) return
          store.set({ status: 'loading' })
          try {
            for (const entry of targets) {
              // The action's appliesTo already excluded locked entries; this only
              // matters if a future change drops that filter on a destructive path.
              if (isEntryLocked(entry)) continue
              await adapter.remove(entry)
            }
            await refresh()
          } catch (e) {
            fail('Failed to delete', e)
          }
          return
        }

        case FileActionId.UploadFiles: {
          const files = await pickFiles()
          if (files.length > 0) await upload(files)
          return
        }

        case FileActionId.UploadDirectory: {
          try {
            const { files, emptyDirs } = await pickDirectory()
            if (files.length > 0 || emptyDirs.length > 0) await upload(files, { emptyDirs })
          } catch (e) {
            notify({ level: 'error', message: e instanceof Error ? e.message : 'Could not open the folder picker.' })
          }
          return
        }

        case FileActionId.ConvertHeic: {
          if (targets.length === 0 || !adapter.read || !adapter.upload) return
          const { convertHeicBytesToJpeg } = await import('../images/heic')
          store.set({ status: 'loading' })
          let converted = 0
          try {
            const taken = (await adapter.list(currentPath)).entries.map((entry) => entry.name)
            for (const entry of targets) {
              if (!isHeic(entry)) continue
              const bytes = new Uint8Array(await adapter.read(entry))
              const jpeg = await convertHeicBytesToJpeg(bytes, 0.95)
              const name = uniqueName(entry.name.replace(/\.(heic|heif)$/i, '.jpg'), taken)
              taken.push(name)
              const file = new File([jpeg as BlobPart], name, { type: 'image/jpeg' })
              await adapter.upload({ file, destination: currentPath, name })
              converted++
            }
            await refresh()
            notify({ level: 'success', message: `Converted ${converted} ${converted === 1 ? 'file' : 'files'} to JPG.` })
          } catch (e) {
            fail('Failed to convert to JPG', e)
          }
          return
        }

        default:
          return
      }
    },
    [adapter, store, navigate, refresh, prompt, confirm, upload, notify, fail, isEntryLocked],
  )

  const dispatch = useCallback(
    async (id: string, dispatchOptions?: { origin?: FileEntry; targets?: FileEntry[] }) => {
      const current = store.getState()
      const currentSelection = selectedEntries(
        visibleEntries(current.entries, {
          search: current.search,
          showHidden: current.showHidden,
          sortKey: current.sortKey,
          sortDirection: current.sortDirection,
        }),
        current.selection,
      )

      if (optionsRef.current.readOnly && MUTATING_ACTION_IDS.has(id)) return

      const action = actions.find((candidate) => candidate.id === id)
      const pool = dispatchOptions?.targets ?? currentSelection
      const targets = action?.appliesTo ? pool.filter(action.appliesTo) : pool
      const excluded = pool.filter((entry) => !targets.includes(entry))

      let defaultPrevented = false
      const event: FileActionEvent = {
        id,
        targets,
        excluded,
        origin: dispatchOptions?.origin,
        path: current.path,
        entries: current.entries,
        selection: currentSelection,
        folderChain: current.folderChain,
        clipboard: current.clipboard,
        readOnly: optionsRef.current.readOnly ?? false,
        browser: handleRef.current,
        preventDefault() {
          defaultPrevented = true
        },
        get defaultPrevented() {
          return defaultPrevented
        },
      }

      await optionsRef.current.onFileAction?.(event)
      if (defaultPrevented) return
      await runDefault(event)
    },
    [store, actions, runDefault],
  )

  const dispatchRef = useRef(dispatch)
  dispatchRef.current = dispatch

  return {
    state,
    visible,
    selection,
    actions,
    actionContext,
    handle,
    adapter,
    readOnly,
    dragAndDropEnabled: adapterCan.move(adapter) && !readOnly && !disableDragAndDrop,
    dialog,
    closeDialog,
    previewEntry,
    setPreviewEntry,
    detailsOpen,
    setDetailsOpen,
    dispatch,
    isActionEnabled,
    isEntryLocked,
    rootPath,
  }
}

export { getExtension }
