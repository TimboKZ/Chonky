import 'chonky/style/main.css';

import {
    ChonkyActions,
    FileAction,
    FileActionData,
    FileBrowser,
    FileList,
    FileSearch,
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
import markdown from './03-Disable-default-actions.md';

const category = StoryCategories.FileBrowserExamples;
const title = 'Disabling default file actions';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const DisableExample = () => {
    const folderChain = [{ id: 'gBt4z3', name: 'My Documents', isDir: true }];
    const files = [
        { id: 'mHe4A1', name: 'Meaning of life.txt', size: 31415 },
        { id: 'hunter2', name: 'Password.txt' },
        { id: 'bEf24q', name: 'Drag & drop files here', isDir: true },
    ];

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    const fileActions: FileAction[] = [
        {
            ...ChonkyActions.OpenFiles,
            toolbarButton: undefined,
        },
    ];

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
                fileActions={fileActions}
                disableDefaultFileActions={true}
            >
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};
