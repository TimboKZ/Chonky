You might notice that drag & drop does not work out-of-the-box in Chonky. This is
because Chonky uses [react-dnd](https://react-dnd.github.io/react-dnd/) library to
handle drag & drop, which is not turned by default.

To enable drag & drop, you will need to wrap your application root with the
`<DndProvider>` component from react-dnd:

```tsx
import React, { ReactDOM } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <App />
    </DndProvider>,
    document.getElementById('app')
);
```

Next, enable drag & drop in your `<FileBrowser>`:

```tsx
<FileBrowser
    files={files}
    enableDragAndDrop={true} // <----
>
    <FileToolbar />
    <FileList />
</FileBrowser>
```

Once you do this, drag & drop should start working in all Chonky instances. FYI, you
don't have to use `HTML5Backend`, you can replace it with any backend you want. Consult
[react-dnd docs](https://react-dnd.github.io/react-dnd/docs/overview) for details.
