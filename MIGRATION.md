# Migrating from Chonky 2.x

`@fsg/file-browser` is a rebuild, not a fork. This guide covers the compat layer that
lets an app switch packages first, then what a proper migration looks like.

## Step 1 — swap the import

```diff
-import { FullFileBrowser, ChonkyActions, defineFileAction, FileHelper, setChonkyDefaults } from 'chonky'
-import { ChonkyIconFA } from 'chonky-icon-fontawesome'
+import { FullFileBrowser, ChonkyActions, defineFileAction, FileHelper, setChonkyDefaults } from '@fsg/file-browser/chonky-compat'
```

If the app reached the file browser through `@fsg/gui-bytes` rather than `chonky`
directly, the move is a one-line import change and the props are unchanged:

```diff
-import { FileBrowser, FilePreviewPanel } from '@fsg/gui-bytes'
+import { FileBrowser, FilePreviewPanel } from '@fsg/file-browser/fsg'
```

The compat layer reproduces Chonky's controlled model: your app still owns `files`
and `folderChain` and still handles every action in `onFileAction`, with the same
`data.id` / `data.state.selectedFiles` / `data.state.selectedFilesForAction` shape.
Custom fields on your file objects come back untouched — the original object is
handed straight back, not a copy.

Drop `chonky-icon-fontawesome`. `setChonkyDefaults` still exists and accepts its old
arguments, but icons now come from each file's kind, so there is nothing to
configure.

### What the compat layer does not reproduce

| Gone | Why, and what to do |
| --- | --- |
| Redux store, `ChonkyBusinessLogic`, `reduxActions`, selectors | The store no longer exists. Read state through the `FileBrowserHandle` (via `ref`) or `useFileBrowserContext()`. |
| Action `effect`s | Effects existed to mutate Chonky's store. Do the work in `onFileAction`. |
| `thumbnailGenerator` | Set `thumbnailUrl` on the file instead. |
| Drag-to-move (`end_drag_n_drop`) | The rebuilt browser moves through its adapter, which a controlled adapter cannot do. Migrate to the adapter API to get dragging back. |
| `i18n` / `react-intl` | Every string is a prop on the action or component. |
| `ChonkyIconName` values | Accepted for type compatibility, then ignored. |

Hotkeys written as `['ctrl+c', 'command+c']` are collapsed to a single `mod+c`, so
they fire on ⌘ on macOS and Ctrl elsewhere without registering twice.

## Step 2 — move to the adapter API

The compat layer is a bridge, not a destination. The real win is deleting the
fetch/cache/optimistic-update code that every consuming app currently reimplements.

**Before** — the app owns state and every action:

```tsx
const [files, setFiles] = useState<FileArray>([])
const [folderChain, setFolderChain] = useState<FileArray>([])
// …several hundred lines of loading, renaming, deleting, pasting, uploading…

<FullFileBrowser files={files} folderChain={folderChain} onFileAction={handleFileActions} />
```

**After** — the adapter owns the backend, the browser owns the state:

```tsx
import { FileBrowser } from '@fsg/file-browser'
import { createFsgAdapter } from '@fsg/file-browser/adapters/fsg'

const adapter = useMemo(() => createFsgAdapter({ baseUrl, area }), [baseUrl, area])

<FileBrowser adapter={adapter} rootPath={`${area}/${entityId}`} rootLabel={`${title} Files`} />
```

### Prop mapping

| Chonky / gui-bytes wrapper | `@fsg/file-browser` |
| --- | --- |
| `files`, `folderChain` | Handled by the adapter |
| `fileActions` | `fileActions` — merged by id, so a matching id replaces in place |
| `onFileAction` | `onFileAction`, plus `event.preventDefault()` to own an action outright |
| `defaultFileViewActionId` | `initialViewMode: 'grid' \| 'list' \| 'details'` |
| `darkMode` | Follows the `.dark` / `.dracula` root class |
| `disableDragAndDrop` | `disableDragAndDrop` |
| `showToolbar` | `showToolbar` |
| `readOnly` | `readOnly` |
| `isFileLocked` | `isEntryLocked` |
| `allowFolderDelete` | `allowFolderDelete` |
| `onSelectionChange` | `onSelectionChange` |
| `onFilesChanged` | `onEntriesChanged` |
| `setPreviewFile` / `setPreviewPanelOpen` | Render `<FilePreviewPanel />` as `aside` |
| `heicConversion`, `imageOptimizationMode` | `transformUpload={useImageOptimization(...).transform}` |
| `urlIntegration` | `path` + `onPathChange` (controlled) |
| `renderLoader` | Not needed — loading is built in |

### Entry shape

```diff
-{ id, name, isDir, size, modDate: Date, thumbnailUrl }
+{ id, name, isDir, size, modifiedAt: number /* epoch ms */, mimeType, path, thumbnailUrl, meta }
```

`FileArray` allowed `null` slots for files still loading; `FileEntry[]` does not — the
browser renders its own loading state.

Anything backend-specific goes in `meta` and comes back untouched in every action
event, which is where fields like `parent_id` or `area` belong.

### URL-driven navigation

```tsx
const [searchParams, setSearchParams] = useSearchParams()
const path = searchParams.get('path') ?? rootPath

<FileBrowser
  adapter={adapter}
  path={path}
  onPathChange={(next) => setSearchParams({ path: next })}
/>
```

Browser back/forward work without a `popstate` listener: the router owns the history
entry and the browser follows the `path` prop.

### Custom actions

```diff
-const DownloadAction = defineFileAction({
+const downloadSelection: FileAction = {
   id: 'downloadSelection',
-  fileFilter: (file) => !file?.isDir,
+  appliesTo: (entry) => !entry.isDir,
   requiresSelection: true,
-  button: { name: 'Download Selection', icon: ChonkyIconName.download, contextMenu: true, group: 'Actions' },
-} as const)
+  label: 'Download selection',
+  icon: Download,
+  contextMenu: true,
+  group: 'Open',
+}
```

`appliesTo` replaces `fileFilter` and does the same two jobs: it narrows the entries
the handler receives, and it disables the control when nothing survives. Groups are
now `'Open' | 'Edit' | 'Create'` (any other name sorts to the end of the menu).

### Locked entries

Chonky had no notion of these, so the gui-bytes wrapper rebuilt Delete and Rename
with a `fileFilter` on every render. That is now one prop:

```diff
-const replacements = { [DeleteAction.id]: createDeleteAction(canDelete), … }
-const resolved = actions.map((action) => replacements[action.id] ?? action)
+<FileBrowser isEntryLocked={(entry) => entry.name === 'Signed Contract.pdf'} />
```

## Step 3 — delete what the browser now does for you

Once on the adapter API, these can go:

- folder loading, the folder chain, and path building
- collision-safe naming for uploads, copies, and moves
- the drag-and-drop directory walk and system-file filtering
- upload batching, directory creation, and progress tracking
- rename / create-folder modals and delete confirmation
- view-mode persistence

## Compat layer support

It exists to make the switch incremental and will be removed once the FSG apps are
on the adapter API. New code should import from `@fsg/file-browser` directly.
