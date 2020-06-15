TODO Explain:

-   Chonky is a presentation layer.
-   `FileBrowser` and `FileList` is the minimum required.
-   Files array is the source of truth.
-   The `FileData` type.

```js
const files = [
    {
        id: 'gBt4z3',
        name: 'README.md',
    },
    {
        id: 'gM5tTe',
        name: 'Blueprints',
        isDir: true,
    },
    {
        id: 'mT7Et',
        name: 'I am not selectable!',
        selectable: false,
    },
    null, // Loading animation will be shown for this file
];
```

<span style="color: red; font-weight: bold;">
It is very important that file IDs are unique:
</span>

If file IDs are not unique, the consequences can be dire - for example, your user can
accidentally delete the wrong file. Chonky tries to protect you by scanning the files
array for duplicate IDs, but you should put some extra checks in your code too. You can
never be too safe.
