import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import { FileBrowser } from './file-browser'
import { FilePicker } from './file-picker'
import { FilePreviewPanel } from '../preview/preview-panel'
import { createMemoryAdapter, type MemoryNode } from '../adapter/memory-adapter'
import { useImageOptimization } from '../images/use-image-optimization'
import { ImageOptimizationDialog } from '../images/optimization-dialog'
import type { FileEntry, Notification } from '../core/types'

const day = 24 * 60 * 60 * 1000
const ago = (days: number) => Date.now() - days * day

/** A work-order folder, shaped like what the FSG apps actually store. */
function sampleTree(): MemoryNode[] {
  return [
    {
      name: 'Site Photos',
      isDir: true,
      modifiedAt: ago(2),
      children: [
        { name: 'front-elevation.jpg', isDir: false, size: 2_411_000, mimeType: 'image/jpeg', modifiedAt: ago(2) },
        { name: 'roof-detail.heic', isDir: false, size: 3_902_000, mimeType: 'image/heic', modifiedAt: ago(2) },
        { name: 'Before', isDir: true, modifiedAt: ago(4), children: [{ name: 'damage.jpg', isDir: false, size: 1_204_000, mimeType: 'image/jpeg' }] },
      ],
    },
    { name: 'Submittals', isDir: true, modifiedAt: ago(9), children: [] },
    {
      name: 'Invoices',
      isDir: true,
      modifiedAt: ago(1),
      children: [
        { name: 'INV-40112.pdf', isDir: false, size: 184_000, mimeType: 'application/pdf', modifiedAt: ago(1) },
        { name: 'INV-40118.pdf', isDir: false, size: 172_400, mimeType: 'application/pdf', modifiedAt: ago(1) },
      ],
    },
    { name: 'Scope of Work.docx', isDir: false, size: 48_200, modifiedAt: ago(12) },
    { name: 'Cost Breakdown.xlsx', isDir: false, size: 91_800, modifiedAt: ago(6) },
    { name: 'Punch List.csv', isDir: false, size: 4_120, mimeType: 'text/csv', modifiedAt: ago(3) },
    { name: 'Signed Contract.pdf', isDir: false, size: 1_820_000, mimeType: 'application/pdf', modifiedAt: ago(30) },
    { name: 'field-notes.txt', isDir: false, size: 2_048, mimeType: 'text/plain', modifiedAt: ago(1) },
    { name: 'bracket.stl', isDir: false, size: 612_000, modifiedAt: ago(20) },
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
        <FileBrowser adapter={adapter} rootLabel="Job 40112" persistKey={false} aside={<FilePreviewPanel />} />
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
