import React from 'react';

import { FileBrowser, FileList } from 'chonky';
import '../../style/main.css';

export const FilesArrayExample = () => {
    const files = [
        {
            id: 'gBt4',
            name: 'README.md',
        },
        {
            id: 'gBt4',
            name: 'Blueprints',
            isDir: true,
        },
        {
            id: 'gBt4',
            name: 'I am not selectable!',
            selectable: false,
        },
        null, // Loading animation will be shown for this file
    ];

    return (
        <FileBrowser files={files}>
            <FileList />
        </FileBrowser>
    );
};

// --- Code below is not a part of the demo, just ignore it. ---
// eslint-disable-next-line import/no-default-export
export default {
    title: 'File Browser basics',
};
FilesArrayExample.story = {
    name: 'Displaying files',
};
