import React from 'react';

import 'chonky/style/main.css';
import { FileBrowser, FileList, FileToolbar } from 'chonky';

import { createDocsObject } from '../story-helpers';

// @ts-ignore
// eslint-disable-next-line
import markdown from './02-Virtualization.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '2 File Browser examples|Virtualization with 10,000 files',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const VirtualizationExample = () => {
    const files = [];

    for (let i = 0; i < 10000; ++i) {
        files.push({
            id: `file-${i}`,
            name: i ? `Chrome (${i}).exe` : 'Chrome.exe',
        });
    }

    // @ts-ignore
    return (
        <div style={{ height: 500 }}>
            <FileBrowser files={files}>
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
