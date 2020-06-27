This section describes how you can define your own action. After you read the
documentation on this page, it is strongly recommended that you also study
[the predefined Chonky file actions](https://github.com/TimboKZ/Chonky/blob/1.x/src/util/file-actions-definitions.ts)
to understand how they work.

The definition of a file action is a plain JavaScript object that satisfies the
interface below.

```ts
export interface FileAction {
    id: string; // Unique action ID
    metadata?: any; // Any user-defined value
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: readonly string[]; // Hotkeys using `hotkey-js` notation
    toolbarButton?: ToolbarButtonData; // Description below

    // Special action that should be dispatched on activation of this action. This
    // is used by Chonky internally, keep it `undefined` unless you know what you're
    // doing.
    specialActionToDispatch?: SpecialAction;
}

// Where...
type FileFilter = (file: Nullable<FileData>) => boolean;

// ...and...
interface ToolbarButtonData {
    name: string; // Button name
    group?: string; // Group to add the button to
    dropdown?: boolean; // Whether to display group as dropdown
    tooltip?: string; // Help tooltip text
    icon?: ChonkyIconName | string; // Icon name
    iconOnly?: boolean; // Whether to only display the icon
}
```

-   All action IDs should be unique.
-   You can overwrite default file actions by creating custom actions with the same ID.
-   Enabling `requiresSelection` flag means the action will only be triggered when
    one or more files are selected. Setting the `fileFilter` will apply the filter to
    the list of selected files to check if the action can be applied.
-   The `hotkeys` field should be an array of hotkeys following the
    [hotkeys-js](https://github.com/TimboKZ/Chonky/blob/1.x/src/util/file-actions-definitions.ts)
    notation.
-   `toolbarButton` field determines whether the action should appear in the toolbar,
    and how the button will look.
-   To combine several action buttons into a toolbar, specify the same `group` for
    them and set `dropdown` to true.
-   If one of the actions in a group includes `dropdown: true`, all actions in that
    group will be shown as a dropdown.

## Example custom action: "Download Photoshop files"

Let's define a custom action that will download the selected Photoshop `.psd` files.
We will add a button to the toolbar and a shortcut, `Ctrl+Q`. First, we define the
file action object:

```tsx
import { FileData, FileAction, ChonkyIconName } from 'chonky';

const downloadPsdAction: FileAction = {
    id: 'download_psd',
    requiresSelection: true,
    fileFilter: (file: FileData) => file.name.endsWith('.psd'),
    hotkeys: ['ctrl+q'],
    toolbarButton: {
        name: 'Download Photoshop files',
        icon: ChonkyIconName.download,
    },
};
```

Next, we need to pass this custom action to `FileBrowser`, along with some files:

```tsx
export const CustomActionsExample = () => {
    const customFileActions = [downloadPsdAction]; // <-----
    const files = [
        { id: 'xVdE', name: 'Flowers.psd' },
        { id: 'bTeX', name: 'Mountains.psd' },
        { id: 'mGeX', name: 'Sky.psd' },
        { id: 'mFte', name: 'Stars.psd' },
        { id: 'tLwZ', name: 'Parser.rs' },
        { id: 'mGrQ', name: 'package.json' },
    ];

    return (
        <div style={{ height: 500 }}>
            <FileBrowser files={files} fileActions={customFileActions /* <---- */}>
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};
```

You can see the outcome in the live example below. Note how the button only becomes
enabled when you select some `.psd` files. Also, when you click "Download Photoshop
files", the action popup only includes `.psd` files. After you make your selection,
you can also press `Ctrl+Q` to make your selection.
