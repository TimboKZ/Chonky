import { cn } from '../util/cn'

/** How many trailing characters to protect from truncation. */
const TAIL_LENGTH = 14

export interface TruncatedNameProps {
  name: string
  className?: string
}

/**
 * A filename that min-w-0 truncates in the middle rather than at the end.
 *
 * End-truncation makes versions of the same document indistinguishable — the part
 * that tells them apart is almost always the tail:
 *
 *   Site Survey v1 FINAL.pdf              ─┐  both render as
 *   Site Survey v1 FINAL-signed-rev2.pdf  ─┘  "Site Survey v1 FIN…"
 *
 * CSS has no middle-ellipsis, so this splits the name in two: the head is allowed
 * to min-w-0 truncate, the tail is not. No character counting and no measurement — the
 * head absorbs whatever space there is, so it adapts to any column width for free,
 * and a name that fits shows whole with no ellipsis at all.
 */
export function TruncatedName({ name, className }: TruncatedNameProps) {
  // Short enough that a middle ellipsis would hide more than it clarifies.
  if (name.length <= TAIL_LENGTH + 4) {
    return <span className={cn('min-w-0 truncate', className)}>{name}</span>
  }

  const head = name.slice(0, name.length - TAIL_LENGTH)
  const tail = name.slice(-TAIL_LENGTH)

  return (
    <span className={cn('flex min-w-0 overflow-hidden', className)}>
      {/* `truncate` sets overflow:hidden, which is also what lets this shrink: a
          flex item's automatic minimum size collapses to zero once overflow is not
          visible. No min-w-0 needed here — the wrapper carries it because it has
          no overflow of its own to trigger the same rule. */}
      <span className="truncate">{head}</span>
      <span className="shrink-0">{tail}</span>
    </span>
  )
}
