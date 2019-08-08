
# Installation & usage

First, add Chonky your project:

```bash
npm install --save chonky
```

You can then use Chonky components by importing them from the `chonky` package. You will also need to import the CSS 
file to style the component. Take a look at this example of a file browser (try double-clicking on `README.md`):

<!-- STORY -->

You can use the following code snippet to recreate it in React:

```js
// Import React as you normally would
import React from 'react';

// Import Chonky styles and relevant components
import 'chonky/style/main.css';
import {FileBrowser, FolderView} from 'chonky';

// Define a handler for "open file" action
const handleFileOpen = (file) => {
    const type = file.isDir ? 'folder' : 'file';
    alert(`You tried to open a ${type}: ${file.base}`);
};

// Define some files and folders
const readmeFile = {
    id: 'abcd1234',
    base: 'README.md',
    name: 'README',
    ext: '.md',
    isDir: false,
};
const myFiles = [readmeFile, null];
const parentFolder = {
    id: 'qwer5678',
    base: 'Simple example',
    name: 'Simple example',
    ext: '',
    isDir: true,
};
const folderChain = [parentFolder];

// Render the file browser
const ExampleComponent = () => <FileBrowser files={myFiles} folderChain={folderChain}
                                            onFileOpen={handleFileOpen}
                                            view={FolderView.SmallThumbs}/>;
export default ExampleComponent;
```
