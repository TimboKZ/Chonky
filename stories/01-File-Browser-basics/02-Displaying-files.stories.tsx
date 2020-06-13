import React from 'react';

import 'chonky/style/main.css';
import { FileBrowser, FileList } from 'chonky';

import { createDocsObject } from '../story-helpers';

// @ts-ignore
// eslint-disable-next-line
import markdown from './02-Displaying-files.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Displaying files',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const FilesArrayExample = () => {
    const files = [
        null, // Loading animation will be shown for this file
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
            ext: '.tar.gz', // Custom extension
            selectable: false, // Disable selection
            size: 54300000000,
            modDate: new Date(),
        },
        {
            id: 'rty',
            name: 'Not openable.pem',
            openable: false, // Prevent opening
            size: 100000000,
        },
    ];

    return (
        <div style={{ height: 500 }}>
            <FileBrowser files={files}>
                <FileList />
            </FileBrowser>
        </div>
    );
};
