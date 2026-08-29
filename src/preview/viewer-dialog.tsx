import { useOptionalFileBrowserContext } from '../core/context'
import { Button } from '../ui/primitives/button'
import { Spinner } from '../ui/primitives/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/primitives/dialog'
import { getPreviewStrategy } from './registry'
import { useEntryContent } from './use-entry-content'
import { DocxViewer, XlsxViewer } from './lazy-viewers'
import type { FileEntry } from '../core/types'
import type { FileSystemAdapter } from '../adapter/types'

/** Strategies worth a full-screen surface: documents and spreadsheets are unreadable
 * in a 320px side panel. */
const FULLSCREEN_STRATEGIES = new Set(['docx', 'xlsx'])

export interface FileViewerDialogProps {
  entry: FileEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Backend to read from. Required when the dialog is rendered on its own; inside a
   * `<FileBrowser>` it defaults to that browser's adapter.
   */
  adapter?: FileSystemAdapter
  /**
   * Replaces the built-in spreadsheet renderer. FSG apps pass a renderer backed by
   * gui-bytes' AG Grid, which brings filtering, column tools, and CSV export that
   * the lightweight built-in table doesn't have.
   */
  renderSpreadsheet?: (content: ArrayBuffer, entry: FileEntry) => React.ReactNode
}

/**
 * Full-screen viewer for the formats that need room. Returns null for anything the
 * side panel already handles well, so it can be rendered unconditionally.
 */
export function FileViewerDialog({ entry, open, onOpenChange, adapter: adapterProp, renderSpreadsheet }: FileViewerDialogProps) {
  const engine = useOptionalFileBrowserContext()
  const adapter = adapterProp ?? engine?.adapter
  const strategy = entry ? getPreviewStrategy(entry) : 'none'
  const supported = entry !== null && adapter !== undefined && FULLSCREEN_STRATEGIES.has(strategy)

  // The hook must run on every render — bail out after it, not before.
  const { binary, loading, error } = useEntryContent(supported && open ? entry : null, strategy, adapter as FileSystemAdapter)

  if (!supported) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="full" className="gap-2">
        <DialogHeader>
          <DialogTitle className="truncate pr-4">{entry.name}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          )}
          {error && <p className="p-6 text-center text-sm text-destructive">{error}</p>}
          {!loading &&
            !error &&
            binary &&
            (strategy === 'docx' ? (
              <DocxViewer content={binary} />
            ) : renderSpreadsheet ? (
              renderSpreadsheet(binary, entry)
            ) : (
              <XlsxViewer content={binary} maxRows={5000} />
            ))}
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
