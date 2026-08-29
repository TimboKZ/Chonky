import { useCallback, useEffect, useMemo, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '../../util/cn'
import { formatBytes } from '../../util/bytes'
import { getFileKind, getKindLabel } from '../../util/mime'
import { formatDateTime } from '../format-date'
import { Thumbnail } from '../thumbnail'
import { useFileBrowserContext } from '../../core/context'
import { useCoarsePointer } from '../use-coarse-pointer'
import type { EntryInteraction } from '../use-entry-interaction'
import type { FileEntry, SortKey } from '../../core/types'

export interface DetailsColumn {
  id: string
  label: string
  /** Starting width in px. Name is the flexible column and ignores this. */
  width: number
  align?: 'left' | 'right'
  /** Sorts by this key when the header is clicked. Omit to make the column unsortable. */
  sortKey?: SortKey
  /**
   * Drop the column when the listing is narrower than this many pixels.
   *
   * Measured against the listing, not the viewport, so a browser rendered inside a
   * narrow panel sheds columns the same way it does on a phone. Without this the
   * fixed columns outrun the available width and the flexible Name column is what
   * collapses — leaving rows of icons with no filenames at all.
   */
  hideBelow?: number
  render: (entry: FileEntry) => React.ReactNode
}

/* Ordered by what survives a narrow listing: the name always, then size, then the
 * date, and the type label last — it is the most inferable from the icon. */
export const defaultDetailsColumns: DetailsColumn[] = [
  { id: 'name', label: 'Name', width: 0, sortKey: 'name', render: (entry) => entry.name },
  {
    id: 'size',
    label: 'Size',
    width: 100,
    align: 'right',
    sortKey: 'size',
    render: (entry) => (entry.isDir ? '' : formatBytes(entry.size)),
  },
  { id: 'kind', label: 'Type', width: 130, sortKey: 'kind', hideBelow: 780, render: (entry) => getKindLabel(getFileKind(entry)) },
  {
    id: 'modifiedAt',
    label: 'Modified',
    width: 180,
    sortKey: 'modifiedAt',
    // 500 rather than a rounder number: at a 768px viewport the folder tree takes
    // 224px, leaving the listing ~510px, and the modified date is worth more there
    // than the ~100px of name width it costs.
    hideBelow: 500,
    render: (entry) => formatDateTime(entry.modifiedAt),
  },
]

const ROW_HEIGHT = { comfortable: 36, compact: 28 } as const
/** A virtualized row's height is declared in advance, so it has to be set in JS. */
const TOUCH_ROW_HEIGHT = { comfortable: 48, compact: 42 } as const
const MIN_COLUMN_WIDTH = 64

export interface DetailsViewProps {
  entries: FileEntry[]
  interaction: EntryInteraction
  scrollRef: React.RefObject<HTMLDivElement | null>
  columns?: DetailsColumn[]
}

export function DetailsView({ entries, interaction, scrollRef, columns: allColumns = defaultDetailsColumns }: DetailsViewProps) {
  const { state, handle } = useFileBrowserContext()
  const coarse = useCoarsePointer()
  const rowHeight = (coarse ? TOUCH_ROW_HEIGHT : ROW_HEIGHT)[state.density]

  // Column visibility follows the listing's own width, not the viewport's.
  const [available, setAvailable] = useState<number>(Number.POSITIVE_INFINITY)
  useEffect(() => {
    const element = scrollRef.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const measure = () => setAvailable(element.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [scrollRef])

  const columns = useMemo(
    () => allColumns.filter((column) => column.hideBelow === undefined || available >= column.hideBelow),
    [allColumns, available],
  )

  const [widths, setWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(columns.filter((column) => column.width > 0).map((column) => [column.id, column.width])),
  )

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  })

  const template = useMemo(
    () => columns.map((column) => (column.width > 0 ? `${widths[column.id] ?? column.width}px` : 'minmax(0, 1fr)')).join(' '),
    [columns, widths],
  )

  const startResize = useCallback((columnId: string, event: React.PointerEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const header = (event.currentTarget as HTMLElement).parentElement
    const startWidth = header?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH

    const onMove = (move: PointerEvent) => {
      // The handle sits on the column's LEFT edge, so it drags the boundary this
      // column shares with the flexible Name column. Dragging right widens Name and
      // narrows this one — hence minus, not plus.
      setWidths((current) => ({ ...current, [columnId]: Math.max(MIN_COLUMN_WIDTH, startWidth - (move.clientX - startX)) }))
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [])

  return (
    <div role="presentation" className="min-w-fit">
      {/* Sticky within the scroll container so headers stay put while rows scroll. */}
      <div
        role="row"
        className="sticky top-0 z-10 grid items-center border-b border-border bg-background text-xs font-medium text-muted-foreground"
        style={{ gridTemplateColumns: template, height: 32 }}
      >
        {columns.map((column) => {
          const sorted = column.sortKey && state.sortKey === column.sortKey
          const Arrow = state.sortDirection === 'asc' ? ArrowUp : ArrowDown
          return (
            <div
              key={column.id}
              role="columnheader"
              aria-sort={sorted ? (state.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              className={cn('relative flex h-full items-center gap-1 px-2', column.align === 'right' && 'justify-end')}
            >
              {column.sortKey ? (
                <button
                  type="button"
                  onClick={() => handle.setSort(column.sortKey!)}
                  className="flex items-center gap-1 rounded-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {column.label}
                  {sorted && <Arrow className="size-3" />}
                </button>
              ) : (
                <span>{column.label}</span>
              )}
              {column.width > 0 && (
                <span
                  role="separator"
                  aria-orientation="vertical"
                  aria-label={`Resize ${column.label} column`}
                  onPointerDown={(event) => startResize(column.id, event)}
                  className="absolute -left-1 top-0 h-full w-2 cursor-col-resize touch-none"
                />
              )}
            </div>
          )
        })}
      </div>

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
              style={{ transform: `translateY(${row.start}px)`, height: row.size, gridTemplateColumns: template }}
              className={cn(
                'fsg-fb-entry absolute left-0 top-0 grid w-full cursor-default items-center border-b border-border/40 transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50',
                'data-[selected=true]:bg-primary/10',
                entry.disabled && 'pointer-events-none opacity-50',
              )}
            >
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={cn(
                    'flex min-w-0 items-center gap-2 px-2 text-xs text-muted-foreground',
                    column.align === 'right' && 'justify-end tabular-nums',
                  )}
                >
                  {column.id === 'name' && <Thumbnail entry={entry} className="size-5 shrink-0 rounded-sm" iconClassName="size-4" />}
                  <span className={cn('truncate', column.id === 'name' && 'text-sm text-foreground')}>{column.render(entry)}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
