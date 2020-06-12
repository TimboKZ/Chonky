import React from 'react';

import { FileBrowser, FileList } from 'chonky';
import '../../style/main.css';

// eslint-disable-next-line import/no-default-export
export default {
    title: 'File Browser basics',
};

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
FilesArrayExample.story = {
    name: 'The files array',
};
