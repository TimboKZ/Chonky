import React from 'react';

import 'chonky/style/main.css';
import { FileBrowser, FileList } from 'chonky';

import { createDocsObject } from '../story-helpers';

// @ts-ignore
// eslint-disable-next-line
import markdown from './01-Displaying-files.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Displaying files',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const FilesArrayExample = () => {
    const files = [
        {
            id: 'gBt4z3',
            name: 'README.md',
        },
        {
            id: 'gM5tTe',
            name: 'Blueprints',
            isDir: true,
        },
        {
            id: 'mT7Et',
            name: 'I am not selectable!',
            selectable: false,
        },
        null, // Loading animation will be shown for this file
    ];

    return (
        <div style={{ height: 500 }}>
            <FileBrowser files={files}>
                <FileList />
            </FileBrowser>
        </div>
    );
};
