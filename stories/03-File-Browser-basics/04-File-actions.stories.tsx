import 'chonky/style/main.css';

import {
    ChonkyActions,
    FileAction,
    FileActionData,
    FileBrowser,
    FileList,
    FileToolbar,
} from 'chonky';
import React from 'react';

import {
    createDocsObject,
    showActionNotification,
    StoryCategories,
} from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './04-File-actions.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Using file actions';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const ActionsExample = () => {
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        // Log action to console
        // eslint-disable-next-line no-console
        console.log('\nAction object:', action, '\nAction data:', data);

        showActionNotification({ action, data });
    };

    const folderChain = [{ id: 'gBt4z3', name: 'My Documents', isDir: true }];
    const files = [
        { id: 'mHe4A1', name: 'Meaning of life.txt', size: 31415 },
        { id: 'hunter2', name: 'Password.txt' },
        { id: 'bEf24q', name: 'Drag & drop files here', isDir: true },
    ];

    const fileActions = [
        ChonkyActions.CreateFolder, // Adds a button to the toolbar
        ChonkyActions.UploadFiles, // Adds a button
        ChonkyActions.DownloadFiles, // Adds a button
        ChonkyActions.CopyFiles, // Adds a button and a shortcut: Ctrl+C
        ChonkyActions.DeleteFiles, // Adds a button and a shortcut: Delete
    ];

    return (
        <div className="live-example" style={{ height: 500 }}>
            <div className="live-example-action">
                <strong>Check your browser console for logged actions!</strong>
            </div>

            <FileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={fileActions}
                onFileAction={handleFileAction}
                enableDragAndDrop={true}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
