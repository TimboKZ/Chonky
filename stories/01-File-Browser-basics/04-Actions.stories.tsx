import 'chonky/style/main.css';

import { FileAction, FileActionData, FileBrowser, FileList, FileToolbar } from 'chonky';
import React from 'react';

import { createDocsObject, showNotification } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './04-Actions.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Using file actions',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const ActionsExample = () => {
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        const textParts = [];
        textParts.push(`<b>Action:</b> ${action.name}`);
        if (data.target) {
            textParts.push(`<b>Target:</b> "${data.target.name}"`);
        }
        if (data.files) {
            const fileNames = data.files.map((f) => `"${f.name}"`).join(', ');
            textParts.push(`<b>Files:</b> ${fileNames}`);
        }

        showNotification({
            text: textParts.join('<br/><br/>'),
        });

        // eslint-disable-next-line no-console
        console.log('\nAction object:', action, '\nAction data:', data);
    };

    const folderChain = [{ id: 'gBt4z3', name: 'My Documents', isDir: true }];
    const files = [
        { id: 'mHe4A1', name: 'Meaning of life.txt', size: 31415 },
        { id: 'hunter2', name: 'Password.txt' },
        { id: 'bEf24q', name: 'Drag & drop files here', isDir: true },
    ];

    return (
        <div className="live-example" style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
