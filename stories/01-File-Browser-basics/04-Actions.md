Every application using Chonky will be different. Some will require a feature to
upload files, other will need to support cutting & pasting. Bottom line -
requirements will differ! Chonky tries to address this problem using **File Actions**
and **Action Handlers**.

## File actions

**File Actions** define _what_ can happen. These actions can be triggered by some
hotkey, user clicking on a button, or a special event like drag & drop. Here are some
examples of file actions:

-   User deletes some files by making a selection and pressing `Delete`.
-   User initializes a file upload by clicking on "Upload File" button.
-   User moves some files from one folder to another using drag & drop.

Action definitions can be passed to the `FileBrowser` component via the `actions`.
For your convenience, Chonky includes definitions for many common actions. You just
need to import and enable them as follows:

```tsx
import { FileBrowser, FileList, FileToolbar, ChonkyActions } from 'chonky';

export const MyComponent = () => {
    const actions = [
        ChonkyActions.CreateFolder, // Adds a button to the toolbar
        ChonkyActions.UploadFiles, // Adds a button
        ChonkyActions.DownloadFiles, // Adds a button
        ChonkyActions.CopyFiles, // Adds a button and a shortcut: Ctrl+C

    ];

    return (
        <FileBrowser files={[]} actions={actions}>
            <FileToolbar />
            <FileList />
        </FileBrowser>
    );
};
```

## Action handlers

```ts
const helloWorld = '123';
```
