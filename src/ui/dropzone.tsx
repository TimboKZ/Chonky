import { useCallback, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../util/cn'
import { useFileBrowserContext } from '../core/context'
import { attachRelativePaths, traverseDroppedItems, unreadableDirsMessage } from '../util/file-drop'
import { isSystemFile } from '../util/system-files'
import { INTERNAL_DRAG_TYPE } from './use-entry-interaction'

/**
 * Catches OS file drops anywhere over the browser.
 *
 * Scoped to this element rather than `window`: a window-level listener means two
 * browsers on one page both claim the drop, and it hijacks drops meant for
 * unrelated parts of the host app.
 */
export function FileDropzone({ children, className }: { children: ReactNode; className?: string }) {
  const { handle, readOnly, state } = useFileBrowserContext()
  const [active, setActive] = useState(false)
  // dragenter/dragleave fire for every child element the pointer crosses, so a
  // depth counter is what keeps the overlay from flickering mid-drag.
  const depth = useRef(0)

  const isExternalFileDrag = (event: DragEvent) =>
    event.dataTransfer.types.includes('Files') && !event.dataTransfer.types.includes(INTERNAL_DRAG_TYPE)

  const onDragEnter = useCallback(
    (event: DragEvent) => {
      if (readOnly || !isExternalFileDrag(event)) return
      depth.current++
      setActive(true)
    },
    [readOnly],
  )

  const onDragLeave = useCallback(() => {
    depth.current = Math.max(0, depth.current - 1)
    if (depth.current === 0) setActive(false)
  }, [])

  const onDragOver = useCallback(
    (event: DragEvent) => {
      if (readOnly || !isExternalFileDrag(event)) return
      // Without preventDefault the browser navigates to the dropped file.
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    [readOnly],
  )

  const onDrop = useCallback(
    async (event: DragEvent) => {
      depth.current = 0
      setActive(false)
      if (readOnly || !isExternalFileDrag(event)) return
      event.preventDefault()

      // Read the flat list synchronously: dataTransfer enters a protected state
      // after the first await, so this must happen before traverseDroppedItems.
      const flat = Array.from(event.dataTransfer.files).filter((file) => !isSystemFile(file.name))
      const items = Array.from(event.dataTransfer.items)

      const { files, emptyDirs, unreadableDirs, sawEntries } = await traverseDroppedItems(items)

      const warning = unreadableDirsMessage(unreadableDirs)
      if (warning) handle.notify({ level: 'warning', message: warning })

      if (files.length > 0 || emptyDirs.length > 0) {
        await handle.upload(attachRelativePaths(files), { emptyDirs })
        return
      }

      // Only fall back to the flat list when the browser exposed no webkit entries
      // at all — an entries-based drop that yielded nothing must not upload
      // Chrome's 0-byte folder pseudo-file as a phantom.
      if (!sawEntries && flat.length > 0) await handle.upload(flat)
    },
    [readOnly, handle],
  )

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(event) => void onDrop(event)}
      className={cn('relative flex min-h-0 flex-1', className)}
    >
      {children}
      {active && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary bg-primary/10 backdrop-blur-[1px]">
          <Upload className="size-8 text-primary" />
          <p className="text-sm font-medium text-primary">Drop to upload into {state.folderChain.at(-1)?.name ?? 'this folder'}</p>
        </div>
      )}
    </div>
  )
}
