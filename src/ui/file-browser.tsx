import { forwardRef, useImperativeHandle, useRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../util/cn'
import { FileBrowserProvider, useFileBrowserContext } from '../core/context'
import { useFileBrowser, type UseFileBrowserOptions } from '../core/engine'
import { TooltipProvider } from './primitives/tooltip'
import { FileToolbar } from './toolbar'
import { FolderTree } from './folder-tree'
import { FileListing } from './views/listing'
import { FileDropzone } from './dropzone'
import { UploadQueue } from './upload-queue'
import { FileBrowserDialogs } from './dialogs'
import { StatusBar } from './status-bar'
import { useHotkeys } from './use-hotkeys'
import { useNativeContextMenuEscape } from './use-native-context-menu'
import type { DetailsColumn } from './views/details-view'
import type { FileBrowserHandle } from '../core/types'

export interface FileBrowserProps extends UseFileBrowserOptions {
  className?: string
  /** Folder tree sidebar. @default true */
  showSidebar?: boolean
  showToolbar?: boolean
  showStatusBar?: boolean
  /** Columns for the details view. Defaults to name, size, type, modified. */
  detailsColumns?: DetailsColumn[]
  /** Rendered to the right of the listing — the preview panel slots in here. */
  aside?: ReactNode
  /** Rendered at the end of the toolbar. */
  toolbarExtra?: ReactNode
}

/**
 * The assembled file browser.
 *
 * Every piece it composes is exported separately, so an app that needs a different
 * arrangement can render `<FileBrowserRoot>` and lay out the parts itself rather
 * than fighting this component's structure.
 */
export const FileBrowser = forwardRef<FileBrowserHandle, FileBrowserProps>(function FileBrowser(props, ref) {
  const {
    className,
    showSidebar = true,
    showToolbar = true,
    showStatusBar = true,
    detailsColumns,
    aside,
    toolbarExtra,
    ...engineOptions
  } = props

  const engine = useFileBrowser(engineOptions)
  useImperativeHandle(ref, () => engine.handle, [engine.handle])

  return (
    <FileBrowserProvider engine={engine}>
      <TooltipProvider delayDuration={400}>
        <FileBrowserShell
          className={className}
          showSidebar={showSidebar}
          showToolbar={showToolbar}
          showStatusBar={showStatusBar}
          detailsColumns={detailsColumns}
          aside={aside}
          toolbarExtra={toolbarExtra}
        />
      </TooltipProvider>
    </FileBrowserProvider>
  )
})

function FileBrowserShell({
  className,
  showSidebar,
  showToolbar,
  showStatusBar,
  detailsColumns,
  aside,
  toolbarExtra,
}: Pick<FileBrowserProps, 'className' | 'showSidebar' | 'showToolbar' | 'showStatusBar' | 'detailsColumns' | 'aside' | 'toolbarExtra'>) {
  const rootRef = useRef<HTMLDivElement>(null)
  useHotkeys(rootRef)
  useNativeContextMenuEscape(rootRef)

  return (
    <div
      ref={rootRef}
      className={cn(
        // @container: the responsive behaviour below is driven by this element's
        // width, not the viewport's. A browser embedded in a 400px panel on a
        // desktop should behave like a phone, because as far as it is concerned it
        // is one — meetings renders exactly that.
        'fsg-file-browser @container flex h-full min-h-64 w-full flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground',
        className,
      )}
    >
      {showToolbar && <FileToolbar>{toolbarExtra}</FileToolbar>}

      <FileDropzone className="min-h-0 flex-1">
        {showSidebar && <FolderTree className="hidden @3xl:block" />}
        <FileListing detailsColumns={detailsColumns} />
        {aside}
      </FileDropzone>

      <UploadQueue />
      {showStatusBar && <StatusBar />}
      <FileBrowserDialogs />
    </div>
  )
}

/**
 * Provider-only shell for custom layouts. Render the exported parts
 * (`FileToolbar`, `FolderTree`, `FileListing`, `UploadQueue`, …) inside it.
 */
export const FileBrowserRoot = forwardRef<FileBrowserHandle, UseFileBrowserOptions & { className?: string; children: ReactNode }>(
  function FileBrowserRoot({ className, children, ...engineOptions }, ref) {
    const engine = useFileBrowser(engineOptions)
    const rootRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => engine.handle, [engine.handle])

    return (
      <FileBrowserProvider engine={engine}>
        <TooltipProvider delayDuration={400}>
          <HotkeyScope rootRef={rootRef}>
            <div ref={rootRef} className={cn('fsg-file-browser flex h-full w-full flex-col', className)}>
              {children}
              <FileBrowserDialogs />
            </div>
          </HotkeyScope>
        </TooltipProvider>
      </FileBrowserProvider>
    )
  },
)

/** Hooks can't be called conditionally in the parent, so the binding lives here —
 * inside the provider, where `useFileBrowserContext` resolves. */
function HotkeyScope({ rootRef, children }: { rootRef: React.RefObject<HTMLElement | null>; children: ReactNode }) {
  useHotkeys(rootRef)
  return <>{children}</>
}

export { useFileBrowserContext }
