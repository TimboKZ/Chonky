### `onFileOpen` handler

`onFileOpen` is probably the most important file action handler. It is called whenever a file in the main `FileBrowser`
container is double-clicked. It can also be triggered if the user presses `Enter` while the file entry is tab-selected.

The `onFileOpen` handler should take in a `FileData` object as its only argument. Note that `onFileOpen` is called 
for both folders *and* files. Usually, you'd want to handle each case separately:

```js
const handleFileOpen = (file) => {
    if (file.isDir) {
        // Open as a directory
    } else {
        // Open as a file
    }
};
```

The full demo from the top of this page (duplicated below) is a good example of how `onFileOpen` should be used, so 
make sure to look at its source code.

```js { "componentPath": "../components/FullDemo.js" }
```

### Explicit click handlers

There are two methods you can use to set custom behaviour for single or double clicks. These handlers are called
`onFileSingleClick` and `onFileDoubleClick`. Their type is defined as follows:

```typescript { "typeName" : "ClickHandler", "offset" : 1 }
```

In plain english, this type means that click handlers should take `FileData` and `InputEvent` as their arguments, and
they should return a boolean or a promise that resolves into a boolean. If the boolean value returned from the 
handler is `true`, the default Chonky behaviour will be cancelled. **Note:** Using `onFileSingleClick` and 
`onFileDoubleClick` directly is **not recommended**: most of the time action handlers like `onFileOpen` should provide 
sufficient for your needs. 

The default behaviour for a single click is to select the current file (if applicable), and for a double click is to 
call the `onFileOpen` handler. Example below shows you how to use explicit click handlers. Try single-clicking or 
double-clicking the file. 

```js { "componentPath" : "../components/File-actions.js" }
```

### Chonky's `InputEvent`

As you might've noticed, the second argument for `ClickHandler` is an object of type of `InputEvent`. This object is 
not a real event, but rather a special type defined by Chonky. The official definitions of `InputEvent` and relevant 
enums is as follows:

```typescript { "typeName" : "InputEvent" }
```
```typescript { "typeName" : "InputEventType" }
```
```typescript { "typeName" : "KbKey" }
```

You can import the enums into your code and use them in you click handlers:

```typescript
import {FileBrowser, InputEventType, KbKey} from 'chonky';

const handleSingleClick = (file, event) => {
    console.log(`File name is ${file.name}.`);
    
    if (event.type === InputEventType.Keyboard) {
        console.log('Event was triggered using a keyboard.');
        
        if (event.key === KbKey.Space) {
            console.log('The key pressed was Space.');
        }
    }
};
```
