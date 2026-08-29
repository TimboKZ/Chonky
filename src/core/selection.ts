import type { FileEntry } from './types'

export interface SelectionInput {
  /** Entries in the order they are displayed — ranges are visual, not alphabetical. */
  visible: FileEntry[]
  selection: ReadonlySet<string>
  anchorId: string | null
  targetId: string
  /** ⌘ on macOS, Ctrl elsewhere — toggles one entry without clearing the rest. */
  toggle: boolean
  /** Shift — extends from the anchor to the target. */
  range: boolean
}

export interface SelectionResult {
  selection: Set<string>
  anchorId: string | null
  focusedId: string
}

/**
 * Resolves a click (or keyboard move) into the next selection, following the
 * platform conventions users already have from Finder and Explorer:
 *
 * - plain: select just the target, and make it the anchor
 * - toggle: add/remove the target, and make it the anchor
 * - range: select everything between the anchor and the target, anchor unmoved
 * - toggle+range: union the range onto the existing selection
 *
 * A range with no anchor degrades to a plain select rather than selecting nothing,
 * which is what happens on a first shift-click into an empty selection.
 */
export function resolveSelection(input: SelectionInput): SelectionResult {
  const { visible, selection, anchorId, targetId, toggle, range } = input

  if (range && anchorId) {
    const from = visible.findIndex((entry) => entry.id === anchorId)
    const to = visible.findIndex((entry) => entry.id === targetId)

    if (from !== -1 && to !== -1) {
      const [start, end] = from <= to ? [from, to] : [to, from]
      const ids = visible.slice(start, end + 1).map((entry) => entry.id)
      // toggle+range unions onto what's already selected; range alone replaces it.
      const next = toggle ? new Set(selection) : new Set<string>()
      for (const id of ids) next.add(id)
      return { selection: next, anchorId, focusedId: targetId }
    }
  }

  if (toggle) {
    const next = new Set(selection)
    if (next.has(targetId)) next.delete(targetId)
    else next.add(targetId)
    return { selection: next, anchorId: targetId, focusedId: targetId }
  }

  return { selection: new Set([targetId]), anchorId: targetId, focusedId: targetId }
}

/** Drops ids that are no longer present, so a refresh can't strand a phantom selection. */
export function pruneSelection(selection: ReadonlySet<string>, entries: FileEntry[]): Set<string> {
  const present = new Set(entries.map((entry) => entry.id))
  const next = new Set<string>()
  for (const id of selection) if (present.has(id)) next.add(id)
  return next
}

/**
 * Selected entries in display order. Handlers get a stable, predictable order
 * rather than Set insertion order, which follows whatever the user clicked first.
 */
export function selectedEntries(entries: FileEntry[], selection: ReadonlySet<string>): FileEntry[] {
  return entries.filter((entry) => selection.has(entry.id))
}
