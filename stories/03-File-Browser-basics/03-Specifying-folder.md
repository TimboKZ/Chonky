Like any other file browser, Chonky can display the path to the current folder in the
toolbar above the files. To enable this functionality, you will need to add the
`<FileToolbar />` to your component and pass the `folderChain` array to `FileBrowser`:

```tsx
const FolderChainExample = () => {
    const folderChain = [{ id: 'gMTe', name: 'My Documents', isDir: true }];

    return (
        <FileBrowser files={[]} folderChain={folderChain}>
            <FileToolbar /> {/* <----- */}
            <FileList />
        </FileBrowser>
    );
};
```

Folder chain follows the exact same rules as the `files` array described in
_Displaying files_ section. It can also contain `null` values to indicate loading
files, and the objects inside it should follow the `FileData` type.

Some notes:

-   The files in the `folderChain` array don't need to have `isDir` set to `true`.
-   Clicking on an item in the folder chain will open it, unless it is `null` or has
    `openable` set to false.
-   The "Go up a directory" button only works when the second-to-last file in the
    folder chain is openable.
