import 'chonky/style/main.css';

import {
    FileAction,
    FileActionData,
    FileBrowser,
    FileList,
    FileSearch,
    FileToolbar
} from 'chonky';
import React from 'react';

import { createDocsObject, showActionNotification } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './01-Component-hierarchy.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Component hierarchy',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const ComponentHierarchyExample = () => {
    const folderChain = [{ id: 'xASw', name: 'Chonky Demo Folder', isDir: true }];
    const files = [{ id: 'bEfX', name: 'Demo.ts' }];

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
                enableDragAndDrop={true}
            >
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};
