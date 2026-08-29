import { CheckCircle2, TriangleAlert, Upload } from 'lucide-react'
import { cn } from '../util/cn'
import { formatBytes } from '../util/bytes'
import { useFileBrowserContext } from '../core/context'
import { Progress } from './primitives/progress'

/**
 * Per-file upload progress. Renders nothing when the queue is empty, so it can sit
 * unconditionally in the layout without reserving space.
 */
export function UploadQueue({ className }: { className?: string }) {
  const { state } = useFileBrowserContext()
  const { uploads } = state
  if (uploads.length === 0) return null

  const done = uploads.filter((task) => task.status === 'done').length
  const failed = uploads.filter((task) => task.status === 'error').length
  const overall = uploads.reduce((sum, task) => sum + task.progress, 0) / uploads.length

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('border-t border-border bg-card px-3 py-2', className)}
    >
      <div className="mb-1.5 flex items-center gap-2 text-xs">
        {failed > 0 ? (
          <TriangleAlert className="size-4 text-destructive" />
        ) : done === uploads.length ? (
          <CheckCircle2 className="size-4 text-success" />
        ) : (
          <Upload className="size-4 text-primary" />
        )}
        <span className="font-medium">
          {done === uploads.length && failed === 0
            ? `Uploaded ${done} ${done === 1 ? 'file' : 'files'}`
            : `Uploading ${done} of ${uploads.length}`}
        </span>
        {failed > 0 && <span className="text-destructive">· {failed} failed</span>}
        <span className="ml-auto text-muted-foreground tabular-nums">{Math.round(overall * 100)}%</span>
      </div>

      <Progress value={overall} />

      {/* Only the in-flight and failed rows are listed: a completed 200-file upload
          shouldn't push a 200-row list into the layout. */}
      <ul className="mt-1.5 max-h-28 space-y-1 overflow-auto">
        {uploads
          .filter((task) => task.status === 'uploading' || task.status === 'error')
          .slice(0, 8)
          .map((task) => (
            <li key={task.id} className="flex items-center gap-2 text-[11px]">
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{task.name}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{formatBytes(task.size)}</span>
              {task.status === 'error' ? (
                <span className="shrink-0 text-destructive">Failed</span>
              ) : (
                <span className="shrink-0 tabular-nums text-muted-foreground">{Math.round(task.progress * 100)}%</span>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}
