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
  /**
   * Cover the listing instead of sitting beside it when the browser is narrow.
   *
   * Set by `<FileBrowser>` for its `aside` slot. Off by default, because a panel
   * rendered on its own — beside an attachment list, on a preview page — has no
   * listing to cover and its container owns its size.
   */
  overlayWhenNarrow?: boolean
  onClose?: () => void
}

/**
 * The side panel: metadata header plus an inline preview of the selected file.
 *
 * Inside a `<FileBrowser>` it follows the selection by itself. It also stands alone
 * — on a dedicated preview page, or beside something that is not a file browser —
 * given an `entry` and an `adapter`.
 */
export function FilePreviewPanel({
  className,
  entry: entryProp,
  adapter: adapterProp,
  overlayWhenNarrow = false,
  onClose,
}: FilePreviewPanelProps) {
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
      className={cn(
        // fsg-fb-surface: the panel is also rendered standalone, outside a browser root.
        'fsg-fb-surface flex flex-col border-border',
        // gui-bytes defines --card only under .dark / .dracula, so `bg-card` is
        // transparent in light mode. Harmless for a panel sitting in the layout;
        // fatal for the fixed overlay below, which would show the listing straight
        // through it. Opaque ground first, card tint only where it exists.
        'bg-background @3xl:bg-card',
        // In a narrow browser the panel covers the listing instead of sitting
        // beside it: a 320px sidebar next to a 375px screen leaves the listing a
        // 55px sliver, and the browser becomes unusable the moment a file is
        // selected. With nothing selected there is nothing to cover it *with*, so
        // it stays out of the way entirely.
        // `absolute`, not `fixed`: fixed positions against the viewport, so an
        // embedded browser — one rendered in a 380px panel on a desktop — would
        // throw its preview across the whole page. Absolute keeps the overlay
        // inside the browser's own box, which the dropzone establishes as the
        // positioning context.
        overlayWhenNarrow
          ? cn('absolute inset-0 z-30 w-full @3xl:static @3xl:inset-auto @3xl:z-auto @3xl:w-80 @3xl:shrink-0 @3xl:border-l',
               !entry && 'hidden @3xl:flex')
          : // Standalone, the panel adds no chrome of its own. It has no way to know
            // its container's corner radius, so a border here runs straight past a
            // rounded corner and leaves a visible seam. The container owns its
            // border; pass `className="border-l"` if you want one and have none.
            'w-full',
        className,
      )}
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
        /*
         * Sandboxed, because a previewed file is rarely one this app authored.
         *
         * `allow-scripts` is granted deliberately: Chrome's built-in PDF viewer is
         * itself an HTML/JS document, and a fully empty sandbox stops it rendering
         * at all. It is safe here only because `allow-same-origin` is NOT granted —
         * the frame keeps an opaque origin, so script inside it cannot reach this
         * app's storage or session. The two together would defeat the sandbox
         * entirely; never add allow-same-origin to this.
         */
        <iframe
          src={openUrl}
          title={entry.name}
          sandbox="allow-scripts"
          className="h-full min-h-96 w-full border-0"
        />
      ) : (
        <UnsupportedPreview entry={entry} adapter={adapter} />
      )

    // The content-based viewers fall through to the same fallback when there is
    // nothing to give them. That happens whenever the adapter cannot `read` — a
    // legitimate configuration, since every adapter method except `list` is
    // optional — and rendering null there left a blank panel with no explanation
    // and no way to reach the file.
    case 'csv':
      return text ? <CsvViewer content={text} /> : <UnsupportedPreview entry={entry} adapter={adapter} />
    case 'html':
      return text ? <HtmlViewer content={text} /> : <UnsupportedPreview entry={entry} adapter={adapter} />
    case 'eml':
      return text ? <EmlViewer content={text} /> : <UnsupportedPreview entry={entry} adapter={adapter} />
    case 'stl':
      return binary ? <StlViewer content={binary} /> : <UnsupportedPreview entry={entry} adapter={adapter} />
    case 'xlsx':
      return binary ? <XlsxViewer content={binary} /> : <UnsupportedPreview entry={entry} adapter={adapter} />
    case 'docx':
      return binary ? <DocxViewer content={binary} /> : <UnsupportedPreview entry={entry} adapter={adapter} />

    default:
      return <UnsupportedPreview entry={entry} adapter={adapter} />
  }
}

function UnsupportedPreview({ entry, adapter }: { entry: FileEntry; adapter: FileSystemAdapter }) {
  const openUrl = adapter.getOpenUrl?.(entry)
  const downloadUrl = adapter.getDownloadUrl?.(entry)

  // Distinguish "this type has no viewer" from "this backend can't serve the file",
  // which are different problems and point the reader at different fixes.
  const previewable = getPreviewStrategy(entry) !== 'none'

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <FileTypeIcon entry={entry} className="size-12" />
      <p className="text-sm text-muted-foreground">
        {previewable ? 'This file can’t be previewed here.' : 'There’s no preview for this file type.'}
      </p>
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
