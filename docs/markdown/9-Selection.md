First of all, you should know you can turn off file selection functionality at any time by setting the 
`disableSelection` property of `FileBrowser` to `false`. Note that this will only prevent the user from selecting 
files, but you (as a developer) can still select them programmatically.

### The `Selection` object

Chonky file selection is expressed as a `Selection` object. It's an object where keys represent file IDs, and entries
 who value is `true` represent selected files. The formal type is:
```typescript { "typeName" : "Selection" }
```

### Selection handlers and methods

* `onSelectionChange` handler can be passed to `FileBrowser`. It takes a `Selection` object as its only argument. 
This handlers is called whenever the selection changes - this includes clicks, keypresses, and changes 
triggered programmatically changes.
* `ref.getSelection()` can be used to get the current selection. It returns the current `Selection` object. This 
method can be called using the `FileBrowser` ref. See implementation of the example below.
* `ref.setSelection(selection)` can be used to set current file selection. This method can be called using the
`FileBrowser` ref. See implementation of the example below. 

The example below shows how these selection handlers can be used. Try pressing on the button at the top of the example.

```js { "componentPath": "../components/Selection.js" }
```


