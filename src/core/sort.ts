import type { FileEntry, SortDirection, SortKey } from './types'
import { getFileKind, getKindLabel } from '../util/mime'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function compareBy(key: SortKey, a: FileEntry, b: FileEntry): number {
  switch (key) {
    case 'size':
      // Directories have no meaningful size; keep them in name order among themselves
      // rather than letting an undefined size scatter them.
      return (a.size ?? -1) - (b.size ?? -1)
    case 'modifiedAt':
      return (a.modifiedAt ?? 0) - (b.modifiedAt ?? 0)
    case 'kind':
      return collator.compare(getKindLabel(getFileKind(a)), getKindLabel(getFileKind(b)))
    case 'name':
    default:
      return collator.compare(a.name, b.name)
  }
}

/**
 * Sorts a listing. Directories always lead regardless of key or direction — the
 * convention every desktop file manager follows, and the reason a descending
 * name sort doesn't bury the folders at the bottom.
 *
 * Ties fall back to name so the order is total and a re-sort never reshuffles
 * equal rows.
 */
export function sortEntries(entries: FileEntry[], key: SortKey, direction: SortDirection): FileEntry[] {
  const sign = direction === 'desc' ? -1 : 1
  return [...entries].sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
    const primary = compareBy(key, a, b)
    if (primary !== 0) return primary * sign
    return collator.compare(a.name, b.name) * sign
  })
}

/** Case-insensitive substring match on the name. */
export function filterEntries(entries: FileEntry[], query: string): FileEntry[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return entries
  return entries.filter((entry) => entry.name.toLowerCase().includes(trimmed))
}

/** Dotfiles, hidden unless the user asks for them. */
export function filterHidden(entries: FileEntry[], showHidden: boolean): FileEntry[] {
  if (showHidden) return entries
  return entries.filter((entry) => !entry.name.startsWith('.'))
}

/** The display pipeline: hidden → search → sort. The order the UI renders and the
 * order range-selection measures against. */
export function visibleEntries(
  entries: FileEntry[],
  options: { search: string; showHidden: boolean; sortKey: SortKey; sortDirection: SortDirection },
): FileEntry[] {
  return sortEntries(filterEntries(filterHidden(entries, options.showHidden), options.search), options.sortKey, options.sortDirection)
}
