import { useState } from 'react'
import { Download, ExternalLink, X } from 'lucide-react'
import { cn } from '../util/cn'
import { formatBytes } from '../util/bytes'
import { formatDateTime } from '../ui/format-date'
import { getFileKind, getKindLabel } from '../util/mime'
import { FileTypeIcon } from '../ui/file-icon'
import { Button } from '../ui/primitives/button'
import { Spinner } from '../ui/primitives/progress'
import { useOptionalFileBrowserContext } from '../core/context'
import { getPreviewStrategy } from './registry'
import { useEntryContent } from './use-entry-content'
import { CsvViewer, DocxViewer, EmlViewer, HtmlViewer, StlViewer, XlsxViewer } from './lazy-viewers'
import type { FileEntry } from '../core/types'
import type { FileSystemAdapter } from '../adapter/types'

export interface FilePreviewPanelProps {
  className?: string
  /** Entry to preview. Defaults to whatever the enclosing browser has selected. */
  entry?: FileEntry | null
  /**
   * Backend to read from. Required when the panel is rendered on its own; inside a
   * `<FileBrowser>` it defaults to that browser's adapter.
   */
  adapter?: FileSystemAdapter
  onClose?: () => void
}

/**
 * The side panel: metadata header plus an inline preview of the selected file.
 *
 * Inside a `<FileBrowser>` it follows the selection by itself. It also stands alone
 * — on a dedicated preview page, or beside something that is not a file browser —
 * given an `entry` and an `adapter`.
 */
export function FilePreviewPanel({ className, entry: entryProp, adapter: adapterProp, onClose }: FilePreviewPanelProps) {
  const engine = useOptionalFileBrowserContext()
  const adapter = adapterProp ?? engine?.adapter

  const entry = entryProp !== undefined ? entryProp : (engine?.previewEntry ?? engine?.selection.find((candidate) => !candidate.isDir) ?? null)

  const close =
    onClose ??
    (() => {
      engine?.setPreviewEntry(null)
      engine?.setDetailsOpen(false)
    })

  if (!adapter) {
    throw new Error('FilePreviewPanel needs an `adapter` prop when rendered outside a <FileBrowser>')
  }

  return (
    <aside
      aria-label="File details"
      // fsg-fb-surface: the panel is also rendered standalone, outside a browser root.
      className={cn('fsg-fb-surface flex w-80 shrink-0 flex-col border-l border-border bg-card', className)}
      // Clicks inside the panel must not reach the listing's clear-selection handler.
      onClick={(event) => event.stopPropagation()}
    >
      {!entry ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
          <p className="text-sm">Select a file to see its details.</p>
        </div>
      ) : (
        <>
          <PreviewHeader entry={entry} adapter={adapter} onClose={close} />
          <div className="min-h-0 flex-1 overflow-auto">
            <PreviewBody entry={entry} adapter={adapter} />
          </div>
          <PreviewMetadata entry={entry} />
        </>
      )}
    </aside>
  )
}

function PreviewHeader({ entry, adapter, onClose }: { entry: FileEntry; adapter: FileSystemAdapter; onClose: () => void }) {
  const openUrl = adapter.getOpenUrl?.(entry)
  const downloadUrl = adapter.getDownloadUrl?.(entry)

  return (
    <div className="flex items-start gap-2 border-b border-border p-3">
      <FileTypeIcon entry={entry} className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <h2 className="break-words text-sm font-semibold leading-tight" title={entry.name}>
          {entry.name}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {getKindLabel(getFileKind(entry))}
          {entry.size != null && ` · ${formatBytes(entry.size)}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {openUrl && (
          <Button variant="ghost" size="icon-sm" asChild aria-label="Open in a new tab">
            <a href={openUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
            </a>
          </Button>
        )}
        {downloadUrl && (
          <Button variant="ghost" size="icon-sm" asChild aria-label="Download">
            <a href={downloadUrl} download={entry.name}>
              <Download className="size-4" />
            </a>
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" aria-label="Close details" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function PreviewMetadata({ entry }: { entry: FileEntry }) {
  const rows: [string, string][] = [
    ['Type', getKindLabel(getFileKind(entry))],
    ['Size', entry.isDir ? '—' : formatBytes(entry.size)],
    ['Modified', formatDateTime(entry.modifiedAt)],
  ]
  if (entry.createdAt) rows.push(['Created', formatDateTime(entry.createdAt)])

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border p-3 text-xs">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="truncate text-right" title={value}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function PreviewBody({ entry, adapter }: { entry: FileEntry; adapter: FileSystemAdapter }) {
  const strategy = getPreviewStrategy(entry)
  const { text, binary, loading, error } = useEntryContent(entry, strategy, adapter)
  const [mediaLoading, setMediaLoading] = useState(true)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <p className="p-4 text-center text-sm text-destructive">{error}</p>
  }

  const openUrl = adapter.getOpenUrl?.(entry)

  switch (strategy) {
    case 'image':
      return openUrl ? (
        <div className="relative flex h-full items-center justify-center bg-muted/40">
          {mediaLoading && <Spinner className="absolute" />}
          <img
            src={openUrl}
            alt={entry.name}
            className="max-h-full w-full object-contain"
            onLoad={() => setMediaLoading(false)}
            onError={() => setMediaLoading(false)}
          />
        </div>
      ) : (
        <UnsupportedPreview entry={entry} adapter={adapter} />
      )

    case 'video':
      return openUrl ? (
        <div className="flex h-full items-center justify-center bg-black/80">
          <video src={openUrl} controls className="max-h-full w-full" />
        </div>
      ) : (
        <UnsupportedPreview entry={entry} adapter={adapter} />
      )

    case 'audio':
      return openUrl ? (
        <div className="flex h-full items-center justify-center p-4">
          <audio src={openUrl} controls className="w-full" />
        </div>
      ) : (
        <UnsupportedPreview entry={entry} adapter={adapter} />
      )

    case 'iframe':
    case 'server-render':
      return openUrl ? (
        // Sandboxed: a previewed file is rarely one this app authored.
        <iframe src={openUrl} title={entry.name} sandbox="" className="h-full min-h-96 w-full border-0" />
      ) : (
        <UnsupportedPreview entry={entry} adapter={adapter} />
      )

    case 'csv':
      return text ? <CsvViewer content={text} /> : null
    case 'html':
      return text ? <HtmlViewer content={text} /> : null
    case 'eml':
      return text ? <EmlViewer content={text} /> : null
    case 'stl':
      return binary ? <StlViewer content={binary} /> : null
    case 'xlsx':
      return binary ? <XlsxViewer content={binary} /> : null
    case 'docx':
      return binary ? <DocxViewer content={binary} /> : null

    default:
      return <UnsupportedPreview entry={entry} adapter={adapter} />
  }
}

function UnsupportedPreview({ entry, adapter }: { entry: FileEntry; adapter: FileSystemAdapter }) {
  const openUrl = adapter.getOpenUrl?.(entry)
  const downloadUrl = adapter.getDownloadUrl?.(entry)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <FileTypeIcon entry={entry} className="size-12" />
      <p className="text-sm text-muted-foreground">There’s no preview for this file type.</p>
      <div className="flex gap-2">
        {openUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={openUrl} target="_blank" rel="noopener noreferrer">
              Open
            </a>
          </Button>
        )}
        {downloadUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={downloadUrl} download={entry.name}>
              Download
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
