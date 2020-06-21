_Passing invalid props_ section shows _how_ to use file actions, but it doesn't
explain _what_ they are. A file action is a plain JavaScript object that desribes
what can happen to files.

The interface of a file action object is defined as follows:

```ts
interface FileAction {
    name: string; // Unique action name
    metadata?: any; // Any user-defined value
    requiresParentFolder?: boolean; // Requires parent folder in folder chain
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: string[]; // Hotkeys using `hotkey-js` notation
    toolbarButton?: ToolbarButtonData; // Description below
}

// Where...
type FileFilter = (file: Nullable<FileData>) => boolean;

// ...and...
interface ToolbarButtonData {
    name: string; // Button name
    group?: string; // Group to add the button too
    dropdown?: boolean; // Whether to display group as dropdown
    tooltip?: string; // Help tooltip text
    icon?: ChonkyIconName | string; // Icon name
    iconOnly?: boolean; // Whether to only display the icon
}
```

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
