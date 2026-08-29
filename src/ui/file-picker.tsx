import { useCallback, useRef, useState } from 'react'
import { FileUp, FolderOpen } from 'lucide-react'
import { cn } from '../util/cn'
import { Progress } from './primitives/progress'
import { attachRelativePaths, pickFiles, traverseDroppedItems, unreadableDirsMessage } from '../util/file-drop'
import { isSystemFile } from '../util/system-files'
import { runUploadPipeline } from '../core/upload'
import type { FileSystemAdapter } from '../adapter/types'
import type { Notification, UploadTask } from '../core/types'

export interface FilePickerProps {
  adapter: FileSystemAdapter
  /** Directory uploads land in, relative to the adapter root. */
  destination: string
  /** Headline shown in the idle state. */
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  /** Transforms files before upload — pass `useImageOptimization().transform`. */
  transformUpload?: (files: File[]) => Promise<{ files: File[]; cancelled?: boolean }>
  onUploaded?: (count: number) => void
  notify?: (notification: Notification) => void
}

/**
 * A standalone drop target for uploading into a folder, without the full browser.
 *
 * Uses the same upload pipeline as `<FileBrowser>`, so directory drops, empty
 * directories, system-file filtering, and collision-safe naming behave identically
 * in both.
 */
export function FilePicker({
  adapter,
  destination,
  label = 'Upload files',
  description = 'Drag and drop files here, or click to browse',
  disabled = false,
  className,
  transformUpload,
  onUploaded,
  notify,
}: FilePickerProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploads, setUploads] = useState<UploadTask[]>([])
  const [uploading, setUploading] = useState(false)
  const depth = useRef(0)

  const report = useCallback(
    (notification: Notification) => {
      if (notify) notify(notification)
      else console.log(`[file-picker] ${notification.message}`)
    },
    [notify],
  )

  const upload = useCallback(
    async (files: File[], emptyDirs?: string[]) => {
      if (files.length === 0 && !emptyDirs?.length) return
      setUploading(true)
      try {
        const result = await runUploadPipeline({
          adapter,
          files,
          emptyDirs,
          destination,
          transform: transformUpload,
          onTaskUpdate: setUploads,
          notify: report,
        })
        if (!result.cancelled && result.uploaded > 0) {
          report({ level: 'success', message: `Uploaded ${result.uploaded} ${result.uploaded === 1 ? 'file' : 'files'}.` })
          onUploaded?.(result.uploaded)
        }
      } catch (e) {
        console.error('Upload failed', e)
        report({ level: 'error', message: e instanceof Error ? e.message : 'Upload failed' })
      } finally {
        setUploading(false)
        setUploads([])
      }
    },
    [adapter, destination, transformUpload, report, onUploaded],
  )

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()
      depth.current = 0
      setDragActive(false)
      if (disabled || uploading) return

      // Read the flat list before the first await — dataTransfer becomes protected
      // once the task yields.
      const flat = Array.from(event.dataTransfer.files).filter((file) => !isSystemFile(file.name))
      const { files, emptyDirs, unreadableDirs, sawEntries } = await traverseDroppedItems(Array.from(event.dataTransfer.items))

      const warning = unreadableDirsMessage(unreadableDirs)
      if (warning) report({ level: 'warning', message: warning })

      if (files.length > 0 || emptyDirs.length > 0) {
        await upload(attachRelativePaths(files), emptyDirs)
      } else if (!sawEntries && flat.length > 0) {
        // Fall back only when the browser exposed no webkit entries at all.
        await upload(flat)
      }
    },
    [disabled, uploading, upload, report],
  )

  const progress = uploads.length > 0 ? uploads.reduce((sum, task) => sum + task.progress, 0) / uploads.length : 0
  const done = uploads.filter((task) => task.status === 'done').length

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || uploading}
      aria-label={label}
      onClick={() => !disabled && !uploading && void pickFiles().then((files) => upload(files))}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (!disabled && !uploading) void pickFiles().then((files) => upload(files))
        }
      }}
      onDragEnter={(event) => {
        if (disabled || !event.dataTransfer.types.includes('Files')) return
        depth.current++
        setDragActive(true)
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setDragActive(false)
      }}
      onDragOver={(event) => {
        if (disabled || !event.dataTransfer.types.includes('Files')) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(event) => void onDrop(event)}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-all',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        dragActive ? 'scale-[1.01] border-primary bg-primary/10' : 'border-border hover:border-muted-foreground hover:bg-muted',
        (disabled || uploading) && 'pointer-events-none opacity-60',
        className,
      )}
    >
      {uploading ? (
        <div className="w-full max-w-xs space-y-2">
          <p className="text-sm text-muted-foreground">
            Uploading {done} of {uploads.length}…
          </p>
          <Progress value={progress} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="size-6" />
            <FileUp className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground">{dragActive ? 'Drop to upload' : label}</p>
          <p className="text-xs text-muted-foreground">{dragActive ? 'Release to start the upload' : description}</p>
        </>
      )}
    </div>
  )
}
