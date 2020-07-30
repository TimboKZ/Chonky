import 'chonky/style/main.css';

import { FileAction, FileActionData, FileBrowser, FileList, FileToolbar } from 'chonky';
import React from 'react';

import {
    createDocsObject,
    showActionNotification,
    StoryCategories,
} from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './03-Specifying-folder.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Specifying current folder';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const FolderChainExample = () => {
    const folderChain = [
        {
            id: 'gM5tTe',
            name: 'My Documents',
            isDir: true,
        },
        {
            id: 'mTxYeA',
            name: 'Not Openable',
            isDir: true,
            openable: false, // This button will not be clickable
        },
        null, // Loading animation will be shown for this file
        {
            id: 'vxWtA',
            name: 'Unity Projects',
            isDir: true,
        },
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
