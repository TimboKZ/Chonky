# @fsg/file-browser

A file browser component for React, built on the FSG design tokens.

This is the FSG rebuild of [Chonky](https://chonky.io/), whose upstream project is
no longer maintained. It keeps Chonky's conceptual model — selectable entries,
switchable views, a pluggable file-action system — and replaces the implementation:
Material-UI v4, react-jss, Redux Toolkit, react-dnd, react-window and react-intl are
all gone.

```bash
pnpm add @fsg/file-browser
```

```tsx
import { FileBrowser } from '@fsg/file-browser'
import { createFsgAdapter } from '@fsg/file-browser/adapters/fsg'

const adapter = createFsgAdapter({ baseUrl: import.meta.env.VITE_API_URL, area: 'jobs' })

<FileBrowser adapter={adapter} rootPath={`jobs/${jobId}`} rootLabel={`Job ${jobId}`} />
```

## Styles

The package ships utility CSS that resolves against the shadcn token set. In an FSG
app those tokens already exist:

```ts
import '@fsg/gui-bytes/styles'   // defines --background, --primary, --radius, …
```

Outside one, import the bundled fallback palette instead:

```ts
import '@fsg/file-browser/tokens'
```

Import **one or the other**, never both — whichever lands last in the cascade wins.
Theming follows the `.dark` / `.dracula` class on the root element, so it picks up
`next-themes` (or anything else that sets that class) with no extra wiring.

## Adapters

The browser talks to storage through a `FileSystemAdapter`. Only `list` is required;
each remaining method a backend implements lights up the matching action, and the UI
hides the rest rather than offering buttons that fail.

```ts
interface FileSystemAdapter {
  readonly id: string
  list(path: string, options?: { signal?: AbortSignal }): Promise<ListResult>

  createDirectory?(path: string, name: string): Promise<void>
  move?(request: MoveRequest): Promise<void>       // rename is a move within the same folder
  copy?(request: MoveRequest): Promise<void>
  remove?(entry: FileEntry): Promise<void>
  upload?(request: UploadRequest): Promise<void>

  getOpenUrl?(entry: FileEntry): string
  getDownloadUrl?(entry: FileEntry): string
  read?(entry: FileEntry): Promise<ArrayBuffer>    // viewers and HEIC conversion
}
```

Three come with the package:

| Adapter | Import | Use |
| --- | --- | --- |
| `createFsgAdapter` | `@fsg/file-browser/adapters/fsg` | The FSG file-storage v2 service |
| `createMemoryAdapter` | `@fsg/file-browser` | Stories, tests, prototypes |
| compat | `@fsg/file-browser/chonky-compat` | Migrating an app off Chonky |

`createFsgAdapter` handles two quirks of the v2 service so they don't leak into app
code: directories and files come from separate endpoints and are merged, and Delete
archives under `/Archive/<original path>` because the backend has no hard delete.

New entity folders don't exist until something creates them:

```ts
import { createFsgRequest, ensureRootDirectory } from '@fsg/file-browser/adapters/fsg'

await ensureRootDirectory({ request: createFsgRequest(baseUrl), area: 'jobs', rootPath: `jobs/${jobId}` })
```

## Actions

Actions are data. Merge your own in by id — a matching id replaces in place, which is
what lets you narrow a built-in rather than shadowing it:

```tsx
import { FileActionId, deleteAction } from '@fsg/file-browser'

<FileBrowser
  adapter={adapter}
  fileActions={[
    { ...deleteAction, appliesTo: (entry) => !entry.isDir && entry.name !== 'Signed Contract.pdf' },
    { id: 'send_to_client', label: 'Send to client', icon: Send, contextMenu: true, requiresSelection: true },
  ]}
  onFileAction={async (event) => {
    if (event.id === 'send_to_client') await sendToClient(event.targets)
  }}
/>
```

`appliesTo` narrows the selection an action receives **and** disables the control when
nothing survives it. That distinction matters: refusing inside the handler leaves a
protected item offering a Delete that looks live right up until the click.

`onFileAction` runs before the built-in behaviour. Call `event.preventDefault()` to
own the action outright:

```tsx
onFileAction={(event) => {
  if (event.id === FileActionId.OpenFiles && !event.origin?.isDir) {
    event.preventDefault()
    navigate(`/files/${event.origin!.id}`)
  }
}}
```

## Permissions

| Prop | Effect |
| --- | --- |
| `readOnly` | Hides every mutating action and refuses them defensively |
| `isEntryLocked` | Pins individual entries against rename, delete, cut, and drag-move |
| `allowFolderDelete` | Admits directories to Delete (off by default — a folder takes its subtree) |
| `disableDragAndDrop` | Turns off drag-to-move, leaving other mutations available |

## Preview

```tsx
import { FilePreviewPanel } from '@fsg/file-browser/viewers'

<FileBrowser adapter={adapter} aside={<FilePreviewPanel />} />
```

Images, video, audio and PDFs render from the adapter's URLs. CSV, HTML, EML, DOCX,
XLSX and STL render through viewers that load on demand — one chunk each, so opening
a CSV doesn't pull in three.js.

Those viewers depend on **optional peers**. Install only what you need:

| Peer | Enables |
| --- | --- |
| `xlsx` | `.xlsx` / `.xls` |
| `docx-preview` | `.docx` |
| `three`, `@react-three/fiber`, `@react-three/drei` | `.stl` |
| `libheif-js` | HEIC/HEIF conversion |

Without one, that file type falls back to an Open/Download prompt.

## Uploads

Drag-and-drop, the file picker, and the folder picker all run one pipeline: system
files filtered, directory trees recreated (including empty directories, where the
browser supports the File System Access API), names sanitized and de-duplicated
against the destination, and per-file progress in the upload queue.

`transformUpload` sits in the middle of that pipeline. The FSG apps use it to decode
HEIC and downscale oversized images:

```tsx
import { useImageOptimization, ImageOptimizationDialog } from '@fsg/file-browser/images'

const optimization = useImageOptimization({ mode: 'auto-mobile' })

<>
  <FileBrowser adapter={adapter} transformUpload={optimization.transform} />
  <ImageOptimizationDialog
    open={optimization.open}
    onOpenChange={optimization.onOpenChange}
    oversizedFiles={optimization.oversizedFiles}
    onConfirm={optimization.confirm}
    onSkip={optimization.skip}
  />
</>
```

## Notifications

The package has no toast dependency. Pass `notify` to route messages into yours:

```tsx
import { toast } from 'sonner'

<FileBrowser adapter={adapter} notify={({ level, message }) => toast[level](message)} />
```

Without it, messages go to the console.

## Custom layouts

`<FileBrowser>` is one arrangement of parts that are all exported. For a different
one, render `<FileBrowserRoot>` and compose them yourself:

```tsx
<FileBrowserRoot adapter={adapter}>
  <FileToolbar />
  <div className="flex min-h-0 flex-1">
    <FolderTree />
    <FileDropzone><FileListing /></FileDropzone>
  </div>
  <UploadQueue />
</FileBrowserRoot>
```

`useFileBrowserContext()` gives any child the state, the selection, and the handle.

## Keyboard and accessibility

The listing is an ARIA listbox with roving tabindex, so Tab moves past it rather than
through every row.

| Key | Action |
| --- | --- |
| Arrows | Move focus and selection (a row at a time in list/details, a tile at a time in grid) |
| Shift + arrows / click | Extend the selection from the anchor |
| ⌘/Ctrl + click | Add or remove one entry |
| ⌘/Ctrl + A | Select all |
| Enter | Open |
| F2 | Rename |
| Delete | Delete |
| ⌘/Ctrl + C / X / V | Copy, cut, paste |
| ⌘/Ctrl + ⇧ + N | New folder |
| Escape | Clear the selection |
| ⌘/Alt + Backspace | Up one folder |

Hotkeys are bound to the browser's root element, not the document — two browsers on
one page don't both fire, and the host app keeps its own shortcuts.

## Migrating from Chonky

`@fsg/file-browser/chonky-compat` maps the Chonky 2.x API onto this one so an app can
switch package first and migrate properly afterwards. See [MIGRATION.md](./MIGRATION.md).

## Development

```bash
pnpm install
pnpm dev              # Storybook on :6007
pnpm test             # node tests
pnpm test:browser     # real-browser tests (Playwright via Vitest Browser Mode)
pnpm lint
pnpm build
```

## License

MIT. A derivative work of Chonky, © 2020 Tim Kuzhagaliyev — see [NOTICE](./NOTICE).
