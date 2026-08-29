import { cn } from '../util/cn'

export interface ExtensionBadgeProps {
  extension: string
  className?: string
}

/**
 * The file's extension, shown apart from its name.
 *
 * Lifting it out of the name string is what lets the name truncate without
 * hiding the one part that identifies the file type. `aria-hidden` because the
 * entry already carries its full name as an `aria-label` — announcing "PDF"
 * again after "Site Survey v1 FINAL dot pdf" is noise.
 */
export function ExtensionBadge({ extension, className }: ExtensionBadgeProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'shrink-0 truncate rounded border border-border/60 bg-background/85 px-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-muted-foreground',
        className,
      )}
    >
      {extension}
    </span>
  )
}
