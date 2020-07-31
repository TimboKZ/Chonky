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
        const selectedFileNames = selectedFiles.map((f) => f.name);
        console.log('Selected file names:', selectedFileNames);
    }
};

// Pass the action handler to Chonky
<FileBrowser files={[]} onFileAction={handleFileAction}>
    // ...
</FileBrowser>;
```

See _Using file actions_ section for more details about file actions.

## Getting & setting file selection imperatively

To modify the file selection imperatively, you will first need to get access to the
file browser handle using React refs:

```tsx
const MyComponent = () => {
    // `FileBrowserHandle` is an interface exported from `chonky`.
    const fileBrowserRef = React.useRef<FileBrowserHandle>(null);
    return (
        <FileBrowser ref={fileBrowserRef} files={[]}>
            // ...
        </FileBrowser>
    );
};
```

You can now use `fileBrowserRef.current` to access Chonky's instance methods. The
instance methods you can use to modify file selection are shown below. Note that file
selection in the methods above is represented as an
[ES6 Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
containing file IDs of selected files. If you prefer to work with arrays, you can
convert a set to an array using `Array.from(set)` or convert an array into a set
using `new Set(array)`.

```ts { "file": "<src>/types/file-browser.types.ts", "symbol": "FileBrowserHandle" }
'If you see this text, there was an error loading the code snippet';
```

```ts { "file": "<src>/types/selection.types.ts", "symbol": "FileSelection" }
'If you see this text, there was an error loading the code snippet';
```

For example, to print out the current file selection to console every 2 seconds, we
can do:

```tsx
const fileBrowserRef = React.useRef<FileBrowserHandle>(null);

useEffect(() => {
    const interval = setInterval(() => {
        if (!fileBrowserRef.current) return;
        console.log(fileBrowserRef.current.getFileSelection());
    }, 2000);
    return () => clearInterval(interval);
}, [fileBrowserRef]);

// ...
```

To see an example of how to use `setFileSelection`, click on "Show code" in the
example below.
