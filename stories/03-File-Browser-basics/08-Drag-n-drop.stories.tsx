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
import markdown from './08-Drag-n-drop.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Enabling drag & drop';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const DragNDropExample = () => {
    const folderChain = [
        { id: 'gBt4z3', name: 'My Documents', isDir: true },
        { id: 'gM5tTe', name: 'Other', isDir: true },
    ];
    const files = [
        { id: 'mHe4A1', name: 'Meaning of life.txt', size: 31415 },
        { id: 'yt43Ax', name: 'SCP-3930 Photos', isDir: true },
    ];

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div className="live-example" style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
                enableDragAndDrop={true}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
