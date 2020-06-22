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

import { createDocsObject, showActionNotification } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './03-Disable-default-actions.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '2 File Browser examples|Disabling default file actions',
    parameters: {
        docs: createDocsObject({ markdown }),
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
            id: ChonkyActions.OpenFiles.id,
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
