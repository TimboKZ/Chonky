### Quick demo

Things you could try: Enter a folder, open a file, select multiple files using `Ctrl+Click`, select all files using 
`Ctrl+A`, toggle file view between thumbnails and detailed list using the controls at the top.

```js { "componentPath": "../components/FullDemo.js" }
```

### Chonky features:

* It's file system agnostic - data can come from an arbitrary source as long as it follows the required format.
* Supports async file system logic - via thumb lazy-loading and loading placeholders.
* Users can choose between 3 views: Details, medium thumbnails, large thumbnails.
* Developers can pass file action handlers to define custom behaviour for file opening, moving or deleting.
* Supports file selections and *drag & drop (WIP)*, sorting and *text search (WIP)*.
* Supports [windowing](https://reactjs.org/docs/optimizing-performance.html#virtualize-long-lists) (a.k.a.
virtualization) for long file lists ([see example](#section-virtualization-with-10000-files)).
* Supports common keyboard shortcuts.
* Supports file thumbnails (e.g. generated from videos or images).
* Detects common file types, showing appropriate icons.

### Philosophy

Chonky tries to stay **unopinionated** when it comes to interactions with the file system (FS). To be precise, Chonky
doesn't make any assumptions about where the files come from. You pass an array of file objects to the `FileBrowser` 
component, and as long as [each file satisfies the `FileData` type](#section-passing-files-to-chonky), everything
will be displayed correctly.

Additionally, Chonky doesn't provide implementation for any FS operations. It does, however, let you specify your own
handlers for things like opening a file or moving multiple files. For example, you can define your own `onFileOpen`
handler, which is called every time a user double clicks a file or a folder.

At the same time, Chonky tries to cover all possible interactions with the user. This includes support for keyboard 
navigation and common keyboard shortcuts, support for file selections, drag & drop, different file views, and much more.
