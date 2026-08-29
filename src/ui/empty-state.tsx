import { FolderOpen, SearchX, TriangleAlert } from 'lucide-react'
import { Button } from './primitives/button'
import { Spinner } from './primitives/progress'

export function LoadingState() {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-6" />
      <span className="text-sm">Loading…</span>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
      <TriangleAlert className="size-8 text-destructive" />
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ searching, readOnly, onUpload }: { searching: boolean; readOnly: boolean; onUpload?: () => void }) {
  if (searching) {
    return (
      <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
        <SearchX className="size-8" />
        <p className="text-sm">No files match your search.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-muted-foreground">
      <FolderOpen className="size-8" />
      <p className="text-sm">This folder is empty.</p>
      {!readOnly && onUpload && (
        <Button variant="outline" size="sm" onClick={onUpload}>
          Upload files
        </Button>
      )}
    </div>
  )
}
