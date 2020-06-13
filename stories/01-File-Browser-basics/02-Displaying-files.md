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
