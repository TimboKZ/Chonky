## Listening to selection changes

Every time user changes the file selection, Chonky dispatches the
`ChonkyActions.ChangeSelection` action. The data for this action contains an
 array of `FileData` objects corresponding to selected files. For example, to print
 the names of all files in the selection, you can put the following code in your file
action handler:

```tsx
// Define the action handler
const handleFileAction = (action: FileAction, data: FileActionData) => {
    if (action.id === ChonkyActions.ChangeSelection.id) {
        const selectedFiles = data.files!;
        const selectedFileNames = selectedFiles.map(f => f.name);
        console.log('Selected file names:', selectedFileNames)
    }
};

// Pass the action handler to Chonky
<FileBrowser files={[]} onFileAction={handleFileAction}>
    // ...
</FileBrowser>
```

See *Using file actions* section for more details about file actions.
