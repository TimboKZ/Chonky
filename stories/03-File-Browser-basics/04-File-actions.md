Every application using Chonky will be different. Some will require a feature to
upload files, other will need to support cutting & pasting. Bottom line -
requirements will differ! Chonky tries to address this problem using **File Actions**
and **_The_ Action Handler**. This section covers file actions, and the next section,
_Defining an action handler_, covers the action handler itself.

## File actions

**File Actions** are a pretty broad concept in the Chonky framework. At their essence,
they describe what file operations the user can carry out. Through additional
configuration, file actions can be used to define **toolbar buttons** and
**keyboard shortcuts**. Here are some examples of file actions:

-   **Deleting files.** You can create a file action that will add a `Delete` button
    to the toolbar. You can also make it so the action is triggered when the user
    presses `Delete` on their keyboard. The action will only work when one or more
    files are selected.
-   **Upload files.** You could define an action that would add an `Upload files`
    button to the toolbar. The button will always be enabled, regardless of file
    selection.

For your convenience, Chonky package includes definitions for many common file
actions, including the ones described above. You can import them from the package as
`ChonkyActions`, and access specific actions like this: `ChonkyActions.DeleteFiles`.
You can find the full list of pre-defined actions
[on GitHub](https://github.com/TimboKZ/Chonky/blob/1.x/src/util/file-actions-definitions.ts).

Internally, Chonky enables some basic actions by default. These include "Open
Files", "Select All Files", "Clear Selection" and several others. You can see the
full list of default actions in the link above.

## Passing file actions to `FileBrowser`

Action definitions have to be passed to the `FileBrowser` component via the
`fileActions` props. The snippet below shows how you could enable some of the
predefined file actions.

```tsx
import { FileBrowser, FileList, FileToolbar, ChonkyActions } from 'chonky';

export const MyComponent = () => {
    const fileActions = React.useMemo(
        () => [
            ChonkyActions.CreateFolder, // Adds a button to the toolbar
            ChonkyActions.UploadFiles, // Adds a button
            ChonkyActions.DownloadFiles, // Adds a button
            ChonkyActions.CopyFiles, // Adds a button and a shortcut: Ctrl+C
            ChonkyActions.DeleteFiles, // Adds a button and a shortcut: Delete
        ],
        []
    );

    return (
        <FileBrowser files={[]} fileActions={fileActions}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    );
};
```

The _Live Example_ below show the result of running the code from above. Note the
extra buttons in the toolbar and the new shortcuts that now work - `Ctrl+C` and
`Delete`.
