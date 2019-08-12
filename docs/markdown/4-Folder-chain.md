The current folder is shown in the status bar at the top of the `FileBrowser` component. You can specify the current 
folder hierarchy by passing an array of file objects as the `folderChain` property of `FileBrowser`:

```jsx
export const ExampleComponent = () => {
    const files = [];
    const folderChain = [
        {
            id: 'my_folder_abcd',
            name: 'My Folder',
            isDir: true,
        },
    ];
    return <FileBrowser files={myFiles} folderChain={folderChain}/>
}
```

The `folderChain` property is very similar to the `files` array from the previous section. Each file in the array has
to satisfy the `FileData` type. Since we're dealing with folders here, ideally `file.isDir` should be set to true, 
but it is not required. Just like with `files`, you can add some `null` elements to your `folderChain` and they 
will be replaced with loading placeholders during render.

The first element of `folderChain` should be the top level folder, and the last element is the folder that user is 
currently in. All folders except for the current folder are clickable, unless `file.openable` is set to `false`.

### Example folder chain

Here's the folder chain we will use: 

```js
const folderChain = [
    {
        id: 'folder-1',
        name: 'Folder 1',
        isDir: true,
    },
    {
        id: 'folder-2',
        name: 'Folder 2',
        isDir: true,
    },
    null,
    {
        id: 'folder-3',
        name: 'Folder 3',
        isDir: true,
        openable: false,
    },
    {
        id: 'folder-4',
        name: 'Folder 4',
        isDir: true,
    },
];
```

Try clicking on folder names in the status bar. Note that `Folder 3` in the example below is not clickable, since it's `openable` property is set to false. Note also how "go up a directory" button is disabled - this is because second to last folder in the `folderChain` is not openable. 

```js { "componentPath" : "../components/Folder-chain.js" }
```
