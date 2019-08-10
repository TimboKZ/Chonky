
# Specifying the current folder

The current folder is shown in the status bar of `FileBrowser` component. You can specify the current folder 
hierarchy by passing an array of file objects as `folderChain` property of `FileBrowser`.

The `folderChain` property is very similar to `files` from the previous section. Each file in the array has to satisfy 
the `FileData` type. Since we're dealing with folders here, ideally `file.isDir` should be set to true, but it is not
required. Just like with `files`, you can add some `null` values to the `folderChain` array and loading placeholders
 will be display in their place.

It is assumed that the first element in `folderChain` is the top level folder, and the last element is the folder that 
user is currently in. All folders except for the current folder are clickable, unless `file.openable` is set to `false`.

## Example

Try clicking on folder names in the status bar. Note that `Folder 3` in the example below is not clickable, since it's 
`openable` property is set to false. Note also how "go up a directory" button is disabled - this is because second to
last folder in the `folderChain` is not openable.

<!-- STORY -->

```javascript
import React from 'react';

import 'chonky/style/main.css';
import {FileBrowser} from 'chonky';

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

export default class ExampleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {infoFile: null};
    }

    handleFileOpen = (file) => {
        this.setState({
            infoFile: {
                id: 'info-file',
                name: `You opened "${file.name}"`,
                isDir: false,
                openable: false,
            },
        });
    };

    render() {
        const {infoFile} = this.state;
        const files = [];
        if (infoFile) files.push(infoFile);

        return <FileBrowser files={files} folderChain={folderChain}
                            onFileOpen={this.handleFileOpen}/>;
    }
}
```
