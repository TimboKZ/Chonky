> _A note on user experience:_ It's a good idea to ask your users for confirmation before doing any FS manipulations.
> For example, before deleting multiple files, you could show a confirmation dialog asking "Are you sure you want to
> delete X, Y, Z?".

### Action handler types

There are two types of file action handlers. Handlers that operate on a single file take a `FileData` object as the
first argument and `InputEvent` object as the second argument. They should satisfy the `SingleFileActionHandler` type:

```typescript { "typeName" : "SingleFileActionHandler" }
```

Handlers that work with multiple files are very similar. The only difference is that they take an array of file
objects as the first arguments. They should satisfy the `MultiFileActionHandler` type:

```typescript { "typeName" : "MultiFileActionHandler" }
```

Note that the return value for all types of handlers should satisfy `ActionHandlerResult`:

```typescript { "typeName" : "ActionHandlerResult" }
```

In plain english, this means that your action handlers can return a boolean or a promise that resolve into a boolean.
Returning `true` will cancel the default Chonky behaviour that is usually executed after your handler (if any). If you
have some async logic in your handlers, it's a good idea to return the promise (even if it doesn't resolve into a
boolean) so Chonky can wait for your code to finish running before doing other things.

The second argument for action handlers is an object of type `InputEvent`. This object contains information about the
input event (e.g. click or keypress) that triggered the action. The relevant types are:

```typescript { "typeName" : "InputEvent" }
```

```typescript { "typeName" : "InputEventType" }
```

```typescript { "typeName" : "KbKey" }
```

You can use the `InputEventType` and `KbKey` enums in your code by importing them from `chonky`:

```typescript
import { FileBrowser, InputEventType, KbKey } from 'chonky';

const handleSingleClick = (file, event) => {
  console.log(`File name is ${file.name}.`);
  if (event && event.type === InputEventType.Keyboard) {
    console.log('Event was triggered using a keyboard.');
    if (event.key === KbKey.Space) {
      console.log('The key pressed was Space.');
    }
  }
};
```

### `onFileOpen` and `onOpenFiles` handlers

`onFileOpen` is probably the most important file action handler. It is called whenever a file in the main `FileBrowser`
container is double-clicked. It can also be triggered if the user presses `Enter` while the file entry is tab-selected.

The `onFileOpen` handler should take in a `FileData` object as its only argument. Note that `onFileOpen` is called
for both folders _and_ files. Usually, you'd want to handle each case separately:

```js
const handleFileOpen = (file, inputEvent) => {
  console.log('Input event:', inputEvent);
  if (file.isDir) {
    // Open as a directory
  } else {
    // Open as a file
  }
};
```

`onOpenFiles` handler is very similar `onFileOpen`, except the first argument is now an array of files. This handler
is useful when you want to execute some logic when multiple files are opened (using a file selection).

The example below shows how `onFileOpen` and `onOpenFiles` handlers can be used. To trigger the `onOpenFiles`
handler, try selecting multiple files and either double-clicking them or pressing Enter.

```js { "componentPath": "../components/Open-files.js" }
```

### Explicit click handlers

There are two methods you can use to set custom behaviour for single or double clicks. These handlers are called
`onFileSingleClick` and `onFileDoubleClick`. Both of these should satisfy the `SingleFileActionHandler` type.

Recall that you can cancel default Chonky behaviour by returning `true` from your handlers. The default behaviour
for a single click is to select the current file (if applicable), and for a double click is to call `onFileOpen` and
`onOpenFiles` handlers.

**Note #1:** Using `onFileSingleClick` and `onFileDoubleClick` directly is **not recommended**: most of the time action
handlers like `onFileOpen` should provide sufficient for your needs.

**Note #2:** Single click can also be triggered by tab-selecting a file and pressing the Space key. Double click can
be triggered by tab-selecting a file and pressing Enter.

Example below shows you how to use explicit click handlers. Try single-clicking or double-clicking the file.

```js { "componentPath" : "../components/File-actions.js" }
```
