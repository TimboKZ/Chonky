import { cn } from '../../util/cn'

/** Determinate progress bar. `value` is 0–1; anything outside is clamped. */
export function Progress({ value, className }: { value: number; className?: string }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
    </div>
  )
}

/** Indeterminate spinner, used while a folder or a preview is loading. */
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary', className)}
    />
  )
}
