import React from 'react';

import 'chonky/style/main.css';
import { FileAction, FileActionData, FileBrowser, FileList, FileToolbar } from 'chonky';

import { createDocsObject, showActionNotification } from '../story-helpers';

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

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                onFileAction={handleFileAction}
                enableDragAndDrop={true}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
