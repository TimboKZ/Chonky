import { useEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '../../util/cn'
import { splitFileName } from '../../util/names'
import { formatBytes } from '../../util/bytes'
import { Thumbnail } from '../thumbnail'
import { useFileBrowserContext } from '../../core/context'
import type { EntryInteraction } from '../use-entry-interaction'
import type { FileEntry } from '../../core/types'

interface TileSize {
  width: number
  height: number
  thumb: string
  icon: string
}

const TILE: Record<'comfortable' | 'compact', TileSize> = {
  comfortable: { width: 152, height: 148, thumb: 'h-[84px]', icon: 'size-10' },
  compact: { width: 116, height: 112, thumb: 'h-[60px]', icon: 'size-7' },
}

/**
 * Narrow listings get a smaller tile so a phone shows three columns rather than
 * two enormous ones. Keyed off the listing's width, not the viewport's, so a
 * browser in a narrow panel behaves the same way.
 */
const NARROW_TILE: TileSize = { width: 108, height: 116, thumb: 'h-[60px]', icon: 'size-8' }
const NARROW_LISTING = 420

export interface GridViewProps {
  entries: FileEntry[]
  interaction: EntryInteraction
  scrollRef: React.RefObject<HTMLDivElement | null>
  onColumnsChange: (columns: number) => void
}

export function GridView({ entries, interaction, scrollRef, onColumnsChange }: GridViewProps) {
  const { state } = useFileBrowserContext()
  const [narrow, setNarrow] = useState(false)
  const tile = narrow ? NARROW_TILE : TILE[state.density]
  const [columns, setColumns] = useState(1)

  // Column count drives both the virtual row model and what ArrowDown means, so it
  // is measured from the real element rather than assumed from a breakpoint.
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const measure = () => {
      setNarrow(element.clientWidth < NARROW_LISTING)
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
  tile: TileSize
}) {
  const { ref, ...props } = interaction.getEntryProps(entry, index)

  // Directories keep their whole name: a folder called `2024.backup` is not a
  // `.backup` file.
  const { stem, extension } = entry.isDir ? { stem: entry.name, extension: '' } : splitFileName(entry.name)

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
      <div className={cn('relative w-full shrink-0', tile.thumb)}>
        <Thumbnail entry={entry} className="h-full w-full rounded-md bg-muted/60" iconClassName={tile.icon} />
        {extension && (
          <span
            // The extension moves onto the icon so the name below can truncate with
            // plain CSS. Leaving it in the string meant middle-truncating at a fixed
            // character count to protect the tail, which had to be re-tuned every
            // time the tile changed size.
            aria-hidden
            className="absolute bottom-1 right-1 max-w-[70%] truncate rounded border border-border/60 bg-background/85 px-1 text-[10px] font-semibold uppercase leading-4 tracking-wide text-muted-foreground"
          >
            {extension}
          </span>
        )}
      </div>
      <div className="flex w-full min-w-0 flex-col">
        {/* break-words, not break-all: only hyphenate when a single token really is
            too long, so "Cost Breakdown" wraps at the space rather than mid-word.
            line-clamp does the shortening, so it follows the tile width for free. */}
        <span className="line-clamp-2 break-words text-xs font-medium leading-tight">{stem}</span>
        {!entry.isDir && <span className="mt-0.5 text-[11px] text-muted-foreground">{formatBytes(entry.size)}</span>}
      </div>
    </div>
  )
}
