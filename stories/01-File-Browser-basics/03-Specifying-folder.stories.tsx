import 'chonky/style/main.css';

import { FileAction, FileActionData, FileBrowser, FileList, FileToolbar } from 'chonky';
import React from 'react';

import { createDocsObject, showActionNotification } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './03-Specifying-folder.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Specifying current folder',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const FolderChainExample = () => {
    const folderChain = [
        {
            id: 'gBt4z3',
            name: 'Root',
            isDir: true,
        },
        {
            id: 'gM5tTe',
            name: 'My Documents',
            isDir: true,
        },
        {
            id: 'mTxYeA',
            name: 'Unity Projects',
            isDir: true,
            openable: false, // This button will not be clickable
        },
        null, // Loading animation will be shown for this file
        {
            id: 'mT7Et',
            name: 'Good Projects',
            isDir: true,
        },
    ];

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={[]}
                folderChain={folderChain}
                onFileAction={handleFileAction}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
