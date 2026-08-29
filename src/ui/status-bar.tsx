import { cn } from '../util/cn'
import { formatBytes } from '../util/bytes'
import { useFileBrowserContext } from '../core/context'

/** Counts and the live region that announces selection changes to a screen reader. */
export function StatusBar({ className }: { className?: string }) {
  const { visible, selection, state } = useFileBrowserContext()

  const folders = visible.filter((entry) => entry.isDir).length
  const files = visible.length - folders
  const selectedSize = selection.reduce((sum, entry) => sum + (entry.size ?? 0), 0)

  // Grouped: a folder of several thousand files is common, and "2500 files" is
  // measurably harder to read at a glance than "2,500 files".
  const count = (value: number) => value.toLocaleString()

  const summary =
    selection.length > 0
      ? `${count(selection.length)} selected${selectedSize > 0 ? ` · ${formatBytes(selectedSize)}` : ''}`
      : `${count(folders)} ${folders === 1 ? 'folder' : 'folders'} · ${count(files)} ${files === 1 ? 'file' : 'files'}`

  return (
    <div
      className={cn('flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground', className)}
    >
      <span aria-live="polite">{summary}</span>
      {state.search.trim() && <span>Filtered by “{state.search.trim()}”</span>}
    </div>
  )
}
