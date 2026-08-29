# @fsg/file-browser

A file browser component for React, built out of [`@fsg/gui-bytes`](https://github.com/facilitysolutionsgroup/gui-bytes).

This is the FSG rebuild of [Chonky](https://chonky.io/), whose upstream project is
no longer maintained. It keeps Chonky's conceptual model — selectable entries,
switchable views, a pluggable file-action system — and replaces the implementation:
Material-UI v4, react-jss, Redux Toolkit, react-dnd, react-window and react-intl are
all gone.

Every control it renders — buttons, dialogs, inputs, tooltips, menus — is a real
gui-bytes component, so it looks and behaves like the rest of an FSG app by
construction rather than by imitation.

```bash
pnpm add @fsg/file-browser @fsg/gui-bytes
```

Most FSG apps want the ready-wired entry, which brings the file-storage adapter,
`sonner` notifications, and the HEIC and image-optimization upload pass:

```tsx
import { FileBrowser } from '@fsg/file-browser/fsg'

<FileBrowser entityId={jobId} apiConfig={{ baseUrl, area: 'jobs' }} title={`Job ${jobId}`} />
```

Use the core component when you have your own backend:

```tsx
import { FileBrowser } from '@fsg/file-browser'

<FileBrowser adapter={myAdapter} rootPath="projects/42" rootLabel="Project 42" />
```

## Styles

`@fsg/gui-bytes` supplies the tokens, the fonts, and the base reset. Import its
stylesheet once, as you already do:

```ts
import '@fsg/gui-bytes/styles'
```

That is the only stylesheet needed — this package's own CSS is injected on import.
Theming follows the `.dark` / `.dracula` class on the root element, so it picks up
`next-themes` (or anything else that sets that class) with no extra wiring.

## Dependency direction

`@fsg/file-browser` depends on `@fsg/gui-bytes`, never the reverse. gui-bytes is the
design system; this is one of its consumers. Its meetings entry declares this package
as an *optional* peer for the attachments tab, and the imports here deliberately
target `@fsg/gui-bytes/components/ui` — which imports nothing from meetings or the
file browser — so the module graph stays acyclic.

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
| `createFsgAdapter` | `@fsg/file-browser/adapters/fsg` | The FSG file-storage v2 service (already wired by `/fsg`) |
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

## Filenames

Names are never shortened in the data — `entry.name` is always the real name, and
every mutation uses it. Shortening is a rendering concern, handled for you:

- **The extension is held apart from the name** — on the icon in the grid, beside
  the name in the list and details views — so truncating a name can never hide
  what kind of file it is. Set `extensionDisplay="inline"` to leave it in the
  name string instead.
- **Names truncate in the middle, never at the end.** End-truncation makes
  versions of one document indistinguishable: `Site Survey v1 FINAL.pdf` and
  `Site Survey v1 FINAL-signed-rev2.pdf` both render as `Site Survey v1 FIN…`,
  and the part that tells them apart is exactly the part it removes. The name is
  split into a head that may truncate and a tail that may not, so CSS does the
  work and it adapts to any column width. This applies in both extension modes.
- **Grid tiles** clamp the stem to two lines, middle-truncating first to a limit
  taken from the tile width — so it tracks density and narrow listings on its own.

The full name is always the element's `aria-label` and `title`, whatever the
rendering does.

`EntryName`, `ExtensionBadge` and `TruncatedName` are exported if you are building
a custom row.

`splitFileName` is exported if you need the same split elsewhere. It is aware of
the cases `lastIndexOf('.')` gets wrong: `archive.tar.gz` splits as
`archive` + `tar.gz`, `Report v1.2 Final.pdf` keeps the dots in its name, and
`.gitignore` is all stem. `jquery.min.js` is a `.js` — `min` is part of the name,
not the extension.

## Responsive behaviour

The browser is a **query container**, so its layout follows its own width rather
than the window's. A browser in a 380px panel on a desktop behaves like a browser
on a phone, because as far as it is concerned it is one — which is how gui-bytes'
meetings view renders it.

| Container width | Behaviour |
| --- | --- |
| < 576px | Primary actions fold into the overflow menu; grid switches to a smaller tile |
| < 768px | Folder tree gives way to the breadcrumb trail; the preview panel covers the listing instead of sitting beside it |
| < 780px | Details view drops the Type column |
| < 500px | Details view drops the Modified column |
| any | The Name column never collapses, and the listing never scrolls sideways |

Touch is handled by pointer type, not width — a small window on a laptop still has
a mouse, and a tablet in landscape still has a finger. On a coarse pointer, rows
grow (52px in the list view, 48px in details) and controls take a 44px minimum.
Row heights are set in JS rather than CSS because the virtualizer is told each
row's height in advance; a `min-height` would desynchronise the two and rows would
overlap.

Right-click becomes a 700ms long-press on touch, which Radix handles. Drag-to-move
is mouse-only — HTML5 drag events do not fire for touch — so cut and paste is the
path on a phone.

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

Most stories run against an in-memory backend. **File Browser → Dev file storage**
runs against the real file-storage service instead:

```bash
pnpm dev   # then open File Browser -> Dev file storage
```

It defaults to the `engage-v2` area at `/`, which lists every entity folder in it,
so there is nothing to configure to get started. Copy `.env.example` to `.env.local`
to change the area or open one entity folder directly; both are also editable in the
Controls panel, so you can retarget a story without restarting.

Auth is your `fsg_apps_session` cookie — the story probes the identity service and
offers a sign-in link before it tries to load anything. The gateway already allows
`http://localhost:*` as a credentialed CORS origin, so no proxy is needed.

A bearer token is deliberately not offered: image, PDF and video previews load
through `<img>` and `<iframe>` `src` attributes, which cannot carry an
Authorization header. Only the cookie makes those work.

These stories write to real storage. `Live (read only)` is the safe one to open if
you only want to look.

## License

MIT. A derivative work of Chonky, © 2020 Tim Kuzhagaliyev — see [NOTICE](./NOTICE).

Note that the package now depends on `@fsg/gui-bytes`, which is private, so it is no
longer independently publishable outside FSG.
