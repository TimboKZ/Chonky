import type { Meta, StoryObj } from '@storybook/react-vite'
import { useCallback, useMemo, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { FileBrowser } from './file-browser'
import { FilePicker } from './file-picker'
import { FilePreviewPanel } from '../preview/preview-panel'
import { createMemoryAdapter, type MemoryNode } from '../adapter/memory-adapter'
import { useImageOptimization } from '../images/use-image-optimization'
import { ImageOptimizationDialog } from '../images/optimization-dialog'
import type { FileEntry, Notification } from '../core/types'
import {
  Sheet,
  SheetActionButtons,
  SheetBody,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetLayout,
  SheetTitle,
  SheetTrigger,
} from '@fsg/gui-bytes/components/ui'
import { Button } from './primitives/button'
import {
  APPROVAL_EML,
  BRACKET_STL,
  CONTRACT_PDF,
  FIELD_NOTES_TXT,
  PUNCH_LIST_CSV,
  SITE_PHOTO_SVG,
  SITE_SUMMARY_HTML,
  toDataUrl,
} from './story-fixtures'

const day = 24 * 60 * 60 * 1000
const ago = (days: number) => Date.now() - days * day

/**
 * A work-order folder, shaped like what the FSG apps actually store.
 *
 * Most files carry real `content`, so the preview panel previews them for real.
 * `Scope of Work.docx` and `Cost Breakdown.xlsx` deliberately do not: they show
 * what the panel does when the backend cannot produce the bytes.
 */
function sampleTree(): MemoryNode[] {
  return [
    {
      name: 'Site Photos',
      isDir: true,
      modifiedAt: ago(2),
      children: [
        {
          name: 'front-elevation.svg',
          isDir: false,
          mimeType: 'image/svg+xml',
          modifiedAt: ago(2),
          content: SITE_PHOTO_SVG,
          thumbnailUrl: toDataUrl(SITE_PHOTO_SVG, 'image/svg+xml'),
        },
        { name: 'roof-detail.heic', isDir: false, size: 3_902_000, mimeType: 'image/heic', modifiedAt: ago(2), content: 'HEIC placeholder bytes' },
        {
          name: 'Before',
          isDir: true,
          modifiedAt: ago(4),
          children: [
            {
              name: 'damage.svg',
              isDir: false,
              mimeType: 'image/svg+xml',
              content: SITE_PHOTO_SVG,
              thumbnailUrl: toDataUrl(SITE_PHOTO_SVG, 'image/svg+xml'),
            },
          ],
        },
      ],
    },
    { name: 'Submittals', isDir: true, modifiedAt: ago(9), children: [] },
    {
      name: 'Invoices',
      isDir: true,
      modifiedAt: ago(1),
      children: [
        { name: 'INV-40112.pdf', isDir: false, mimeType: 'application/pdf', modifiedAt: ago(1), content: CONTRACT_PDF },
        { name: 'INV-40118.pdf', isDir: false, mimeType: 'application/pdf', modifiedAt: ago(1), content: CONTRACT_PDF },
      ],
    },
    { name: 'Scope of Work.docx', isDir: false, size: 48_200, modifiedAt: ago(12) },
    { name: 'Site Survey v1.2 Final (signed).pdf', isDir: false, mimeType: 'application/pdf', modifiedAt: ago(8), content: CONTRACT_PDF },
    { name: 'daily-backups.tar.gz', isDir: false, size: 18_400_000, modifiedAt: ago(1) },
    { name: 'Cost Breakdown.xlsx', isDir: false, size: 91_800, modifiedAt: ago(6) },
    { name: 'Punch List.csv', isDir: false, mimeType: 'text/csv', modifiedAt: ago(3), content: PUNCH_LIST_CSV },
    { name: 'Weekly Summary.html', isDir: false, mimeType: 'text/html', modifiedAt: ago(2), content: SITE_SUMMARY_HTML },
    { name: 'Approval.eml', isDir: false, mimeType: 'message/rfc822', modifiedAt: ago(2), content: APPROVAL_EML },
    { name: 'Signed Contract.pdf', isDir: false, mimeType: 'application/pdf', modifiedAt: ago(30), content: CONTRACT_PDF },
    { name: 'field-notes.txt', isDir: false, mimeType: 'text/plain', modifiedAt: ago(1), content: FIELD_NOTES_TXT },
    { name: 'bracket.stl', isDir: false, modifiedAt: ago(20), content: BRACKET_STL },
    { name: '.internal-metadata', isDir: false, size: 96, modifiedAt: ago(40) },
  ]
}

/** A folder big enough that virtualization is doing real work. */
function largeTree(count = 2500): MemoryNode[] {
  const kinds = ['pdf', 'jpg', 'xlsx', 'docx', 'txt', 'csv']
  return [
    { name: 'Archive', isDir: true, modifiedAt: ago(60), children: [] },
    ...Array.from({ length: count }, (_, index) => ({
      name: `scan-${String(index + 1).padStart(5, '0')}.${kinds[index % kinds.length]}`,
      isDir: false,
      size: 20_000 + ((index * 7919) % 4_000_000),
      modifiedAt: ago(index % 365),
    })),
  ]
}

/** Storybook stands in for the app's toast layer. */
function useStoryNotify(): (notification: Notification) => void {
  return (notification) => console.log(`[${notification.level}] ${notification.message}`)
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="h-[calc(100vh-2rem)] w-full">{children}</div>
}

const meta = {
  title: 'File Browser/FileBrowser',
  component: FileBrowser,
  parameters: { layout: 'fullscreen' },
  // The component has a required `adapter`, so Storybook wants args even though
  // every story below builds its own inside `render`. These are the defaults an
  // args-driven story would start from.
  args: {
    adapter: createMemoryAdapter({ tree: sampleTree() }),
    rootLabel: 'Job 40112',
    persistKey: false as const,
  },
} satisfies Meta<typeof FileBrowser>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Every capability wired at once.
 *
 * Open this one when something elsewhere appears to do nothing: the other stories
 * deliberately leave pieces out — no preview panel, no toast host, no HEIC
 * converter — and an action whose whole effect lands in a piece that isn't mounted
 * looks identical to a broken one. Here everything is present, and the log records
 * each action as it is dispatched, so "wired but quiet" is distinguishable from
 * "actually broken".
 */
export const Everything: Story = {
  render: function Render() {
    const nodes = useMemo(() => sampleTree(), [])
    const adapter = useMemo(() => createMemoryAdapter({ tree: nodes, latency: 140 }), [nodes])
    const optimization = useImageOptimization({ mode: 'modal' })
    const [log, setLog] = useState<string[]>([])

    const record = useCallback((line: string) => {
      const at = new Date().toLocaleTimeString([], { hour12: false })
      setLog((entries) => [`${at}  ${line}`, ...entries].slice(0, 60))
    }, [])

    return (
      <Frame>
        {/* The browser routes every message — upload failures, locked items, HEIC
            fallbacks — through a notify adapter. Without a host they vanish. */}
        <Toaster position="bottom-right" richColors />

        <div className="flex h-full gap-3">
          <div className="min-w-0 flex-1">
            <FileBrowser
              adapter={adapter}
              rootLabel="Job 40112"
              persistKey={false}
              allowFolderDelete
              aside={<FilePreviewPanel overlayWhenNarrow />}
              transformUpload={optimization.transform}
              heicConverter={heicToJpeg}
              isEntryLocked={(entry) => entry.name === 'Signed Contract.pdf'}
              notify={(notification) => {
                record(`notify.${notification.level}: ${notification.message}`)
                toast[notification.level](notification.message)
              }}
              onFileAction={(event) => {
                const targets = event.targets.map((entry) => entry.name).join(', ')
                record(`${event.id}${targets ? ` → ${targets}` : ''}`)
              }}
              onSelectionChange={(selected) => record(`selection: ${selected.length || 'none'}`)}
              onPathChange={(path) => record(`path: ${path || '/'}`)}
            />
          </div>

          <aside className="hidden w-72 shrink-0 flex-col rounded-lg border border-border bg-background lg:flex">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <h2 className="text-sm font-semibold">Action log</h2>
              <button
                type="button"
                onClick={() => setLog([])}
                className="rounded-sm px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Clear
              </button>
            </div>
            <ol className="min-h-0 flex-1 overflow-auto p-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {log.length === 0 ? (
                <li className="p-2 font-sans text-xs">Nothing yet. Click, drag, rename, upload — every dispatch lands here.</li>
              ) : (
                log.map((line, index) => (
                  <li key={`${line}-${index}`} className="border-b border-border/40 py-1 last:border-0">
                    {line}
                  </li>
                ))
              )}
            </ol>
          </aside>
        </div>

        <ImageOptimizationDialog
          open={optimization.open}
          onOpenChange={optimization.onOpenChange}
          oversizedFiles={optimization.oversizedFiles}
          onConfirm={optimization.confirm}
          onSkip={optimization.skip}
        />
      </Frame>
    )
  },
}

/**
 * Stands in for the real HEIC decoder, which is a WASM dependency the package
 * deliberately does not carry. Paints the file's size onto a canvas and encodes
 * that as JPEG — enough that a converted file is a real, previewable image rather
 * than the original bytes under a new extension.
 */
async function heicToJpeg(bytes: Uint8Array): Promise<Uint8Array> {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 480
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No 2D context in this browser')
  context.fillStyle = '#1e3a5f'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#e2e8f0'
  context.font = '24px system-ui, sans-serif'
  context.textAlign = 'center'
  context.fillText('Converted from HEIC', canvas.width / 2, canvas.height / 2 - 12)
  context.font = '16px system-ui, sans-serif'
  context.fillText(`${bytes.byteLength.toLocaleString()} bytes in`, canvas.width / 2, canvas.height / 2 + 20)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
  if (!blob) throw new Error('Could not encode the converted image')
  return new Uint8Array(await blob.arrayBuffer())
}

export const Default: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), latency: 180 }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" notify={useStoryNotify()} persistKey={false} />
      </Frame>
    )
  },
}

export const ListView: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" initialViewMode="list" persistKey={false} />
      </Frame>
    )
  },
}

export const DetailsView: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" initialViewMode="details" persistKey={false} />
      </Frame>
    )
  },
}

export const CompactDensity: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" initialViewMode="details" density="compact" persistKey={false} />
      </Frame>
    )
  },
}

export const WithPreviewPanel: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} aside={<FilePreviewPanel overlayWhenNarrow />} />
      </Frame>
    )
  },
}

/**
 * The panel rendered *beside* the browser rather than inside it, which is how
 * meetings composes it — a resizable pane holding a standalone panel. The panel
 * fills whatever box it is given and adds no chrome of its own; the container
 * owns the border and the rounding.
 */
export const PanelBesideBrowser: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    const [entry, setEntry] = useState<FileEntry | null>(null)
    return (
      <Frame>
        <div className="flex h-full gap-3">
          <div className="min-w-0 flex-1">
            <FileBrowser
              adapter={adapter}
              rootLabel="Job 40112"
              initialViewMode="list"
              persistKey={false}
              onSelectionChange={(selected) => setEntry(selected.find((item) => !item.isDir) ?? null)}
            />
          </div>
          <div className="w-96 shrink-0 overflow-hidden rounded-lg border border-border">
            <FilePreviewPanel entry={entry} adapter={adapter} />
          </div>
        </div>
      </Frame>
    )
  },
}

export const ReadOnly: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112 (read only)" readOnly persistKey={false} />
      </Frame>
    )
  },
}

/** A backend that can only list. Every action the adapter cannot service is hidden
 * rather than offered and then failed. */
export const ListOnlyBackend: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), writable: false }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} />
      </Frame>
    )
  },
}

/** `isEntryLocked` pins individual items: they still open and download, but cannot
 * be renamed, deleted, cut, or dragged away. */
/** A backend that lists but cannot serve file content: no Preview, no Download,
 * and the panel says so rather than sitting blank. */
export const NoContentBackend: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), servesContent: false }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} aside={<FilePreviewPanel overlayWhenNarrow />} />
      </Frame>
    )
  },
}

export const LockedEntries: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser
          adapter={adapter}
          rootLabel="Job 40112"
          persistKey={false}
          notify={useStoryNotify()}
          isEntryLocked={(entry) => entry.name === 'Signed Contract.pdf' || entry.name === 'Invoices'}
        />
      </Frame>
    )
  },
}

export const FolderDeleteAllowed: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" allowFolderDelete persistKey={false} />
      </Frame>
    )
  },
}

export const LargeFolder: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: largeTree() }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="2,500 files" initialViewMode="details" persistKey={false} />
      </Frame>
    )
  },
}

/**
 * Phone-width, in a fixed 380px frame.
 *
 * The browser is a query container, so its layout follows its own width rather
 * than the window's — which means this frame exercises the real mobile behaviour
 * without resizing anything: primary actions fold into the overflow menu, the
 * folder tree gives way to the breadcrumb trail, and the grid switches to a
 * smaller tile. It is also what the browser does inside a narrow panel on a
 * desktop, which is how meetings renders it.
 */
/**
 * Four versions of one document, differing only in their tails.
 *
 * End-truncation renders every one of them as "Site Survey v1 FIN…". The list and
 * details views truncate in the middle instead, and the grid moves the extension
 * onto the icon and middle-truncates the stem to fit the tile.
 */
const SIMILAR_NAMES = [
  'Site Survey v1 FINAL.pdf',
  'Site Survey v1 FINAL-signed.pdf',
  'Site Survey v1 FINAL-signed-rev2.pdf',
  'Site Survey v1 FINAL-signed-rev3.pdf',
  'daily-backups.tar.gz',
  'Q3 Reconciliation (draft, do not circulate).xlsx',
]

export const SimilarNames: Story = {
  render: function Render() {
    const adapter = useMemo(
      () => createMemoryAdapter({ tree: SIMILAR_NAMES.map((name) => ({ name, isDir: false, size: 412_000, modifiedAt: ago(3) })) }),
      [],
    )
    return (
      <Frame>
        <div className="flex h-full gap-4">
          <div className="h-full w-[320px] shrink-0">
            <FileBrowser adapter={adapter} rootLabel="Grid, 320px" initialViewMode="grid" persistKey={false} />
          </div>
          <div className="h-full w-[340px] shrink-0">
            <FileBrowser adapter={adapter} rootLabel="List, 340px" initialViewMode="list" persistKey={false} />
          </div>
          <div className="h-full min-w-0 flex-1">
            <FileBrowser adapter={adapter} rootLabel="Details, full width" initialViewMode="details" persistKey={false} />
          </div>
        </div>
      </Frame>
    )
  },
}

export const NarrowContainer: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <div className="flex h-[calc(100vh-2rem)] gap-4">
        <div className="h-full w-[380px] shrink-0">
          <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} aside={<FilePreviewPanel overlayWhenNarrow />} />
        </div>
        <p className="max-w-xs self-center text-sm text-muted-foreground">
          Same component, 380px wide. Select a file and the preview covers the listing rather than squeezing it.
        </p>
      </div>
    )
  },
}

/**
 * `extensionDisplay="inline"` puts the extension back in the name string, for apps
 * that would rather see `report.pdf` than `report` + a PDF badge. Truncation still
 * happens in the middle, so the extension survives either way.
 */
export const ExtensionInline: Story = {
  render: function Render() {
    const adapter = useMemo(
      () => createMemoryAdapter({ tree: SIMILAR_NAMES.map((name) => ({ name, isDir: false, size: 412_000, modifiedAt: ago(3) })) }),
      [],
    )
    return (
      <Frame>
        <div className="flex h-full gap-4">
          <div className="h-full min-w-0 flex-1">
            <FileBrowser adapter={adapter} rootLabel="badge (default)" initialViewMode="list" persistKey={false} />
          </div>
          <div className="h-full min-w-0 flex-1">
            <FileBrowser adapter={adapter} rootLabel="inline" initialViewMode="list" extensionDisplay="inline" persistKey={false} />
          </div>
        </div>
      </Frame>
    )
  },
}

/** Mid-width, where the toolbar has its buttons back but the tree has not returned. */
export const MediumContainer: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    return (
      <div className="h-[calc(100vh-2rem)] w-[680px]">
        <FileBrowser adapter={adapter} rootLabel="Job 40112" initialViewMode="details" persistKey={false} />
      </div>
    )
  },
}

export const Empty: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: [] }), [])
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="New job" persistKey={false} />
      </Frame>
    )
  },
}

export const LoadFailure: Story = {
  render: function Render() {
    const adapter = useMemo(
      () => ({
        id: 'failing',
        async list() {
          await new Promise((resolve) => setTimeout(resolve, 400))
          throw new Error('503 Service Unavailable')
        },
      }),
      [],
    )
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} />
      </Frame>
    )
  },
}

/** The app owns Open: `preventDefault()` stops the browser's built-in behaviour. */
export const CustomOpenHandler: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree() }), [])
    const [opened, setOpened] = useState<FileEntry | null>(null)
    return (
      <Frame>
        <div className="flex h-full flex-col gap-2">
          <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
            {opened ? `The app handled Open for “${opened.name}”.` : 'Double-click a file — the app intercepts Open.'}
          </div>
          <div className="min-h-0 flex-1">
            <FileBrowser
              adapter={adapter}
              rootLabel="Job 40112"
              persistKey={false}
              onFileAction={(event) => {
                if (event.id === 'open_files' && event.origin && !event.origin.isDir) {
                  event.preventDefault()
                  setOpened(event.origin)
                }
              }}
            />
          </div>
        </div>
      </Frame>
    )
  },
}

/** Upload wired to the HEIC + image-optimization pass the FSG apps use. */
export const WithImageOptimization: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), latency: 120 }), [])
    const optimization = useImageOptimization({ mode: 'modal' })
    return (
      <Frame>
        <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} transformUpload={optimization.transform} />
        <ImageOptimizationDialog
          open={optimization.open}
          onOpenChange={optimization.onOpenChange}
          oversizedFiles={optimization.oversizedFiles}
          onConfirm={optimization.confirm}
          onSkip={optimization.skip}
        />
      </Frame>
    )
  },
}

/*
 * Several apps open the browser in a sheet rather than on a page, so the two
 * stories below are the reference for that arrangement.
 *
 * `SheetLayout` is a three-row grid — header, body, footer — with the body as the
 * only flexible row, which is already what the browser wants: it fills the height
 * it is given and scrolls its own listing. Two overrides make that work:
 *
 *   - `SheetBody` scrolls by default. Left alone, the sheet scrolls the browser and
 *     the browser scrolls the listing, and the toolbar drifts out of view. `p-0`
 *     plus `overflow-hidden` hands scrolling back to the listing.
 *   - The browser draws its own border and corners, which read as a card floating
 *     inside the sheet. `rounded-none border-0` lets it meet the sheet's edges.
 *
 * Width is the other thing to know: the browser's responsive behaviour keys off its
 * own width, so a `md` (540px) or `lg` (600px) sheet gets the compact layout with no
 * folder tree. The tree comes back at `full`.
 */
export const InSheet: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), latency: 150 }), [])
    const [open, setOpen] = useState(true)
    return (
      <div className="p-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Open files</Button>
          </SheetTrigger>
          <SheetLayout side="right" size="lg">
            <SheetHeader>
              <SheetTitle>Job 40112</SheetTitle>
              <SheetDescription>Documents and photos attached to this work order.</SheetDescription>
            </SheetHeader>
            <SheetBody bodySpacing="none" className="overflow-hidden p-0">
              <FileBrowser
                adapter={adapter}
                rootLabel="Job 40112"
                notify={useStoryNotify()}
                persistKey={false}
                className="rounded-none border-0"
              />
            </SheetBody>
          </SheetLayout>
        </Sheet>
      </div>
    )
  },
}

/**
 * The picker shape: a full-width sheet that hands a selection back to the app.
 *
 * `onSelectionChange` is the whole integration — the sheet owns the confirm button
 * and the browser stays a browser. At this width the folder tree returns and the
 * preview panel sits beside the listing instead of covering it.
 */
export const InSheetPicker: Story = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), latency: 150 }), [])
    const [open, setOpen] = useState(true)
    const [selection, setSelection] = useState<FileEntry[]>([])
    const [attached, setAttached] = useState<string[]>([])
    const files = selection.filter((entry) => !entry.isDir)

    return (
      <div className="space-y-3 p-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Attach files</Button>
          </SheetTrigger>
          <SheetLayout side="right" size="full">
            <SheetHeader>
              <SheetTitle>Attach from Job 40112</SheetTitle>
              <SheetDescription>Select one or more files to attach to this message.</SheetDescription>
            </SheetHeader>
            <SheetBody bodySpacing="none" className="overflow-hidden p-0">
              <FileBrowser
                adapter={adapter}
                rootLabel="Job 40112"
                initialViewMode="details"
                persistKey={false}
                readOnly
                onSelectionChange={setSelection}
                className="rounded-none border-0"
                aside={<FilePreviewPanel overlayWhenNarrow />}
              />
            </SheetBody>
            <SheetFooter>
              <SheetActionButtons
                cancelBtn={{ buttonText: 'Cancel', onClick: () => setOpen(false) }}
                primaryAction={{
                  buttonText: files.length ? `Attach ${files.length}` : 'Attach',
                  disabled: files.length === 0,
                  onClick: () => {
                    setAttached(files.map((entry) => entry.name))
                    setOpen(false)
                  },
                }}
              />
            </SheetFooter>
          </SheetLayout>
        </Sheet>
        {attached.length > 0 && <p className="text-sm text-muted-foreground">Attached: {attached.join(', ')}</p>}
      </div>
    )
  },
}

export const Picker: StoryObj = {
  render: function Render() {
    const adapter = useMemo(() => createMemoryAdapter({ tree: sampleTree(), latency: 200 }), [])
    const [count, setCount] = useState(0)
    return (
      <div className="mx-auto max-w-lg space-y-3 p-6">
        <FilePicker adapter={adapter} destination="" label="Attach documents" onUploaded={(n) => setCount((c) => c + n)} />
        {count > 0 && <p className="text-sm text-muted-foreground">{count} uploaded so far.</p>}
      </div>
    )
  },
}
