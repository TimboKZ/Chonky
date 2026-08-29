import { Progress as GuiProgress } from '@fsg/gui-bytes/components/ui'
import { cn } from '../../util/cn'

/** Determinate progress. `value` is 0–1 here; gui-bytes takes a percentage. */
export function Progress({ value, className }: { value: number; className?: string }) {
  const fraction = Math.min(1, Math.max(0, value))
  return <GuiProgress value={Math.round(fraction * 100)} className={cn('h-1.5', className)} />
}

/**
 * Indeterminate spinner.
 *
 * Kept local rather than adapted: gui-bytes' loaders are branded, full-surface
 * treatments, and this is a 16px inline mark inside a panel or a tree row. It
 * carries no design decisions worth centralising.
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary', className)}
    />
  )
}
