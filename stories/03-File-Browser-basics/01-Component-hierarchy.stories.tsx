import {
    FileAction,
    FileActionData,
    FileBrowser,
    FileList,
    FileSearch,
    FileToolbar,
} from 'chonky';
import 'chonky/style/main.css';
import React from 'react';

import {
    createDocsObject,
    showActionNotification,
    StoryCategories,
} from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './01-Component-hierarchy.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Component hierarchy';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
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
