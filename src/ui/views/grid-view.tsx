import { useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../util/cn'
import { truncateMiddle } from '../../util/names'
import { formatBytes } from '../../util/bytes'
import { Thumbnail } from '../thumbnail'
import { useFileBrowserContext } from '../../core/context'
import type { EntryInteraction } from '../use-entry-interaction'
import type { FileEntry } from '../../core/types'

const TILE = {
  comfortable: { width: 152, height: 148, thumb: 'h-[84px]', icon: 'size-10' },
  compact: { width: 116, height: 112, thumb: 'h-[60px]', icon: 'size-7' },
} as const

export interface GridViewProps {
  entries: FileEntry[]
  interaction: EntryInteraction
  scrollRef: React.RefObject<HTMLDivElement | null>
  onColumnsChange: (columns: number) => void
}

export function GridView({ entries, interaction, scrollRef, onColumnsChange }: GridViewProps) {
  const { state } = useFileBrowserContext()
  const tile = TILE[state.density]
  const [columns, setColumns] = useState(1)

  // Column count drives both the virtual row model and what ArrowDown means, so it
  // is measured from the real element rather than assumed from a breakpoint.
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const measure = () => {
      const width = element.clientWidth - 16
      const next = Math.max(1, Math.floor(width / tile.width))
      setColumns(next)
      onColumnsChange(next)
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [scrollRef, tile.width, onColumnsChange])

  const rowCount = Math.ceil(entries.length / columns)
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => tile.height,
    overscan: 3,
  })

  return (
    <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((row) => {
        const start = row.index * columns
        const rowEntries = entries.slice(start, start + columns)
        return (
          <div
            key={row.key}
            className="absolute left-0 top-0 grid w-full gap-2 px-2"
            style={{
              transform: `translateY(${row.start}px)`,
              height: row.size,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {rowEntries.map((entry, offset) => (
              <GridTile key={entry.id} entry={entry} index={start + offset} interaction={interaction} tile={tile} />
            ))}
          </div>
        )
      })}
    </div>
  )
}

function GridTile({
  entry,
  index,
  interaction,
  tile,
}: {
  entry: FileEntry
  index: number
  interaction: EntryInteraction
  tile: (typeof TILE)[keyof typeof TILE]
}) {
  const { ref, ...props } = interaction.getEntryProps(entry, index)

  return (
    <div
      {...props}
      ref={ref}
      title={entry.name}
      className={cn(
        'fsg-fb-entry group flex cursor-default flex-col items-center gap-1.5 rounded-lg border border-transparent p-2 text-center transition-colors',
        'hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/10',
        entry.disabled && 'pointer-events-none opacity-50',
      )}
    >
      <Thumbnail
        entry={entry}
        className={cn('w-full shrink-0 rounded-md bg-muted/60', tile.thumb)}
        iconClassName={tile.icon}
      />
      <div className="flex w-full min-w-0 flex-col">
        <span className="line-clamp-2 break-all text-xs font-medium leading-tight">{truncateMiddle(entry.name, 34)}</span>
        {!entry.isDir && <span className="mt-0.5 text-[11px] text-muted-foreground">{formatBytes(entry.size)}</span>}
      </div>
    </div>
  )
}
