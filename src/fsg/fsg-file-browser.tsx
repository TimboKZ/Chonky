import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { toast } from 'sonner'
import { FileBrowser as CoreFileBrowser } from '../ui/file-browser'
import { FileActionId } from '../core/actions'
import { FilePreviewPanel } from '../preview/preview-panel'
import { ImageOptimizationDialog } from '../images/optimization-dialog'
import { useImageOptimization } from '../images/use-image-optimization'
import { createFsgAdapter } from '../adapter/fsg/fsg-adapter'
import { createFsgRequest } from '../adapter/fsg/request'
import { ensureRootDirectory } from '../adapter/fsg/ensure-root'
import { entryToFileItem } from './converters'
import type { AutoOptimizePreset, ImageOptimizationMode } from '../images/use-image-optimization'
import type { FileActionEvent, FileBrowserHandle, FileEntry, Notification, ViewMode } from '../core/types'
import type { FileBrowserApiConfig, FileBrowserItem, FileItem } from './types'

export interface FsgFileBrowserProps {
  /** Unique identifier for the root entity (work order number, ticket number, etc.) */
  entityId: string
  /** API configuration: baseUrl and area */
  apiConfig: FileBrowserApiConfig
  /** Optional root path override. Defaults to `entityId`. */
  rootPath?: string
  /** Display title for the root folder */
  title?: string
  /** Callback when a file is selected for preview */
  setPreviewFile?: React.Dispatch<React.SetStateAction<FileItem | undefined>>
  /** Callback to toggle the preview panel */
  setPreviewPanelOpen?: React.Dispatch<React.SetStateAction<boolean>>
  /** Initial view mode. `'icon'` is the grid of tiles. */
  initialViewMode?: 'icon' | 'list' | 'details'
  showToolbar?: boolean
  /** Renders the preview panel beside the listing, driven by the selection. */
  showPreviewPanel?: boolean
  onSelectionChange?: (selectedFiles: FileItem[]) => void
  /**
   * Called after the listing is reloaded following a mutation — upload, delete,
   * rename, move, paste, create-folder, HEIC convert — but not on first load.
   */
  onFilesChanged?: () => void
  /**
   * URL search-param integration for folder navigation. Browser back and forward
   * work without a popstate listener: the router owns the history entry.
   */
  urlIntegration?: {
    searchParams: URLSearchParams
    navigate: (url: string) => void
  }
  /** Overrides the default of opening a file in a new browser tab. */
  onFileOpen?: (file: FileItem) => void
  /**
   * Hides every mutating action (upload, create folder, rename, delete, cut,
   * paste, drag-move). Browsing, downloading, and previewing still work.
   * @default false
   */
  readOnly?: boolean
  /**
   * Locks individual items against rename, delete, cut, and drag-move while
   * leaving them open to browse and download. Unlike `readOnly`, which locks the
   * whole browser, this locks only the matching items.
   */
  isFileLocked?: (file: FileBrowserItem) => boolean
  /**
   * Admits folders to Delete. Off by default: a folder takes its whole subtree.
   * @default false
   */
  allowFolderDelete?: boolean
  /**
   * HEIC/HEIF → JPG conversion on upload, plus a "Convert to JPG" action for
   * files already stored. A HEIC that fails to decode uploads unchanged, with a
   * warning.
   * @default true
   */
  heicConversion?: boolean
  /**
   * What happens to the original after a manual "Convert to JPG": `'archive'`
   * moves it under `/Archive/...` (matching Delete), `'keep'` leaves it in place.
   * @default 'archive'
   */
  heicOriginalDisposition?: 'archive' | 'keep'
  /** Override the HEIC → JPEG converter. Useful in tests and Storybook. */
  heicConverter?: (bytes: Uint8Array, quality?: number) => Promise<Uint8Array>
  /**
   * How oversized images (> 2 MB) are handled on upload.
   * @default 'auto-mobile'
   */
  imageOptimizationMode?: ImageOptimizationMode
  /** Resolution preset used when resizing without the wizard. @default 'full-hd' */
  imageOptimizationPreset?: AutoOptimizePreset
  className?: string
}

const VIEW_MODES: Record<NonNullable<FsgFileBrowserProps['initialViewMode']>, ViewMode> = {
  icon: 'grid',
  list: 'list',
  details: 'details',
}

/**
 * The file browser wired to the FSG file-storage v2 service.
 *
 * A thin composition over `<FileBrowser>`: it builds the storage adapter, ensures
 * the entity's root folder exists, routes messages into `sonner`, and adds the
 * HEIC and image-optimization upload pass. Everything else lives in the core
 * component.
 *
 * Import the core `<FileBrowser>` instead if you have your own adapter.
 */
export function FsgFileBrowser({
  entityId,
  apiConfig,
  rootPath: rootPathProp,
  title,
  setPreviewFile,
  setPreviewPanelOpen,
  initialViewMode = 'icon',
  showToolbar = true,
  showPreviewPanel = false,
  onSelectionChange,
  onFilesChanged,
  urlIntegration,
  onFileOpen,
  readOnly = false,
  isFileLocked,
  allowFolderDelete = false,
  heicConversion = true,
  heicOriginalDisposition = 'archive',
  heicConverter,
  imageOptimizationMode = 'auto-mobile',
  imageOptimizationPreset = 'full-hd',
  className,
}: FsgFileBrowserProps): ReactElement {
  const { baseUrl, area } = apiConfig
  const rootPath = useMemo(() => rootPathProp || String(entityId), [rootPathProp, entityId])

  const adapter = useMemo(() => createFsgAdapter({ baseUrl, area }), [baseUrl, area])
  const handleRef = useRef<FileBrowserHandle>(null)

  // The service creates area roots but not per-entity folders, so a first visit to
  // a new work order would otherwise land on a 404.
  const [rootReady, setRootReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    setRootReady(false)
    ensureRootDirectory({ request: createFsgRequest(baseUrl), area, rootPath })
      .catch((e) => console.error('Failed to prepare the root folder', e))
      .finally(() => {
        if (!cancelled) setRootReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [baseUrl, area, rootPath])

  const optimization = useImageOptimization({
    mode: imageOptimizationMode,
    autoPreset: imageOptimizationPreset,
    heic: heicConversion,
    onHeicFallback: (names) =>
      toast.warning(
        names.length === 1
          ? `${names[0]} uploaded as HEIC — it couldn't be converted to JPEG. Some viewers may not display it correctly.`
          : `${names.length} files uploaded as HEIC — conversion to JPEG failed. Some viewers may not display them correctly.`,
      ),
  })

  const notify = useCallback(({ level, message }: Notification) => toast[level](message), [])

  const isEntryLocked = useMemo(
    () => (isFileLocked ? (entry: FileEntry) => isFileLocked(entryToFileItem(entry) as FileBrowserItem) : undefined),
    [isFileLocked],
  )

  const handleSelectionChange = useCallback(
    (entries: FileEntry[]) => {
      const items = entries.map(entryToFileItem)
      onSelectionChange?.(items)
      setPreviewFile?.(items.find((item) => item.mime_type !== 'application/x-directory'))
    },
    [onSelectionChange, setPreviewFile],
  )

  const handleFileAction = useCallback(
    (event: FileActionEvent) => {
      if (event.id === FileActionId.ToggleDetails && setPreviewPanelOpen) {
        event.preventDefault()
        setPreviewPanelOpen((open) => !open)
        return
      }
      if (event.id === FileActionId.OpenFiles && onFileOpen && event.origin && !event.origin.isDir) {
        event.preventDefault()
        onFileOpen(entryToFileItem(event.origin))
      }
    },
    [onFileOpen, setPreviewPanelOpen],
  )

  const urlPath = urlIntegration?.searchParams.get('path')
  const controlledPath = urlIntegration ? [rootPath, urlPath].filter(Boolean).join('/').replace(/\/{2,}/g, '/') : undefined

  const onPathChange = useCallback(
    (next: string) => {
      if (!urlIntegration) return
      const relative = next.slice(rootPath.length).replace(/^\/+/, '')
      const params = new URLSearchParams(urlIntegration.searchParams)
      if (relative) params.set('path', relative)
      else params.delete('path')
      urlIntegration.navigate(`?${params.toString()}`)
    },
    [urlIntegration, rootPath],
  )

  return (
    <>
      {/* Mounting before the root folder exists would show a spurious load error. */}
      {rootReady && (
        <CoreFileBrowser
          ref={handleRef}
          adapter={adapter}
          rootPath={rootPath}
          rootLabel={`${title || entityId} Files`}
          path={controlledPath}
          onPathChange={urlIntegration ? onPathChange : undefined}
          initialViewMode={VIEW_MODES[initialViewMode]}
          showToolbar={showToolbar}
          readOnly={readOnly}
          isEntryLocked={isEntryLocked}
          allowFolderDelete={allowFolderDelete}
          onSelectionChange={handleSelectionChange}
          onEntriesChanged={onFilesChanged}
          onFileAction={handleFileAction}
          transformUpload={optimization.transform}
          heicKeepOriginal={heicOriginalDisposition === 'keep'}
          heicConverter={heicConverter}
          notify={notify}
          persistKey={`fsg:${area}`}
          className={className}
          aside={showPreviewPanel ? <FilePreviewPanel /> : undefined}
        />
      )}
      <ImageOptimizationDialog
        open={optimization.open}
        onOpenChange={optimization.onOpenChange}
        oversizedFiles={optimization.oversizedFiles}
        onConfirm={optimization.confirm}
        onSkip={optimization.skip}
      />
    </>
  )
}
