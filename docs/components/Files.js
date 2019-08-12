// Import React as usual
import React from 'react';

// Import Noty for nice file open notifications
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';

// Import Chonky
import 'chonky/style/main.css';
import {FileBrowser, FileView} from 'chonky';

// Define a handler for "open file" action
const handleFileOpen = (file) => {
    const type = file.isDir ? 'folder' : 'file';
    const text = `You tried to open a ${type}: ${file.name}`;
    new Noty({text: text, type: 'success', theme: 'relax', timeout: 3000}).show();
};

const files = [
    null,
    null,
    {
        id: 'zxc',
        name: 'Hidden file.mp4',
        isDir: false,
        isHidden: true,
        size: 890,
    },
    {
        id: 'bnm',
        name: 'Normal folder',
        isDir: true,
        childrenIds: ['random-id-1', 'random-id-2'],
    },
    {
        id: 'vfr',
        name: 'Symlink folder',
        isDir: true,
        isSymlink: true,
    },
    {
        id: 'qwe',
        name: 'Not selectable.tar.gz',
        ext: '.tar.gz',
        isDir: false,
        selectable: false,
        size: 54300000000,
        modDate: new Date(),
    },
    {
        id: 'rty',
        name: 'Not openable.pem',
        isDir: false,
        openable: false,
        size: 100000000,
    },
];

// Render the file browser
const ExampleComponent = () => <FileBrowser files={files}
                                            onFileOpen={handleFileOpen}
                                            view={FileView.SmallThumbs}/>;
export default ExampleComponent;
