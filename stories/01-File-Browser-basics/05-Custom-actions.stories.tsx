import 'chonky/style/main.css';

import { FileAction, FileActionData, FileBrowser, FileList, FileToolbar } from 'chonky';
import React from 'react';

import { createDocsObject, showActionNotification } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './04-Actions.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Custom file actions',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const CustomActionsExample = () => {
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <FileBrowser files={[]} onFileAction={handleFileAction}>
            <FileList />
            <FileToolbar />
        </FileBrowser>
    );
};
