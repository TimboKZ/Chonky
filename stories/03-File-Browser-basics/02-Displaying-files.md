The `FileBrowser` component has only one required prop - the `files` array:

```tsx
const FilesExample = () => {
    const files = [
        null, // Will show loading animation
        { id: 'xWbZ', name: 'Instructions.txt' },
        { id: 'xWbZ', name: 'Tools', isDir: true },
    ];

    return (
        <FileBrowser files={files}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    );
};
```

This array describes the files that Chonky should show to the user. It can contain
file descriptions (as plain JavaScript objects) and `null` values. `null` values
indicate "loading" files - a loading placeholder animation will be shown in their place.

## The `FileData` type

Formally, the Typescript type for the `files` array is:

```ts
type FileArray = Nullable<FileData>[];
// i.e. Array of nulls and `FileData` objects mixed together
```

The `FileData` type is shown below. It might look intimidating, but please note that
`id` and `name` are the only 2 required fields. All other fields are optional, and
are there to give you more control over how Chonky displays your files.

```ts { "file": "<src>/types/files.types.ts", "symbol": "FileData" }
"If you see this text, there was an error loading the code snippet";
```

<span style="color: red; font-weight: bold;">
It is very important that file IDs are unique:
</span>

> If file IDs are not unique, the consequences can be dire - for example, your user can
> accidentally delete the wrong file. Chonky tries to protect you by scanning the files
> array for duplicate IDs, but you should put some extra checks in your code too. You
> can never be too safe.

Apart from the above, there are a few other details you should know about:

-   `files` array should be **immutable**. If you're following the best Redux practices,
    you're good. If you don't know what immutability is, please read the
    _Immutability_ section from the sidebar. This is important.
-   The file extension is automatically extracted from the `name` field, so you don't
    need to provide an `ext` field yourself. In the rare case where the automatic
    extension detection fails (for example: `file.tar.gz`), you can provide the `ext`
    field explicitly. Please make sure extension is included in both `name` and `ext`,
    e.g. `{id: 'AsVz', name: 'file.tar.gz', ext: '.tar.gz'}`.

## Example file array

The _Live Example_ below tries to show case all different file configurations. Try
performing different actions (selections, drag & drop) and see how each file reacts.
Click on `Show code` at the bottom to see the file array definition.
