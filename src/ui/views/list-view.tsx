import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../util/cn'
import { formatBytes } from '../../util/bytes'
import { Thumbnail } from '../thumbnail'
import { useFileBrowserContext } from '../../core/context'
import { formatDate } from '../format-date'
import type { EntryInteraction } from '../use-entry-interaction'
import type { FileEntry } from '../../core/types'

const ROW_HEIGHT = { comfortable: 40, compact: 30 } as const

export interface ListViewProps {
  entries: FileEntry[]
  interaction: EntryInteraction
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function ListView({ entries, interaction, scrollRef }: ListViewProps) {
  const { state } = useFileBrowserContext()
  const rowHeight = ROW_HEIGHT[state.density]

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  })

  return (
    <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((row) => {
        const entry = entries[row.index]
        const { ref, ...props } = interaction.getEntryProps(entry, row.index)
        return (
          <div
            key={entry.id}
            {...props}
            ref={ref}
            title={entry.name}
            style={{ transform: `translateY(${row.start}px)`, height: row.size }}
            className={cn(
              'fsg-fb-entry absolute left-0 top-0 flex w-full cursor-default items-center gap-2 rounded-md border border-transparent px-2 transition-colors',
              'hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              'data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/10',
              entry.disabled && 'pointer-events-none opacity-50',
            )}
          >
            <Thumbnail
              entry={entry}
              className="size-6 shrink-0 rounded-sm"
              iconClassName={state.density === 'compact' ? 'size-4' : 'size-5'}
            />
            <span className="min-w-0 flex-1 truncate text-sm">{entry.name}</span>
            <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {entry.isDir ? '' : formatBytes(entry.size)}
            </span>
            <span className="hidden w-36 shrink-0 text-right text-xs text-muted-foreground sm:block">{formatDate(entry.modifiedAt)}</span>
          </div>
        )
      })}
    </div>
  )
}
