import { cn } from '../util/cn'
import { formatBytes } from '../util/bytes'
import { useFileBrowserContext } from '../core/context'

/** Counts and the live region that announces selection changes to a screen reader. */
export function StatusBar({ className }: { className?: string }) {
  const { visible, selection, state } = useFileBrowserContext()

  const folders = visible.filter((entry) => entry.isDir).length
  const files = visible.length - folders
  const selectedSize = selection.reduce((sum, entry) => sum + (entry.size ?? 0), 0)

  const summary =
    selection.length > 0
      ? `${selection.length} selected${selectedSize > 0 ? ` · ${formatBytes(selectedSize)}` : ''}`
      : `${folders} ${folders === 1 ? 'folder' : 'folders'} · ${files} ${files === 1 ? 'file' : 'files'}`

  return (
    <div
      className={cn('flex items-center justify-between border-t border-border px-3 py-1.5 text-xs text-muted-foreground', className)}
    >
      <span aria-live="polite">{summary}</span>
      {state.search.trim() && <span>Filtered by “{state.search.trim()}”</span>}
    </div>
  )
}
