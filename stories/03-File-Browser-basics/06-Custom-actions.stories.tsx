import 'chonky/style/main.css';

import {
    ChonkyIconName,
    FileAction,
    FileActionData,
    FileBrowser,
    FileData,
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
import markdown from './06-Custom-actions.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Custom file actions';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const CustomActionsExample = () => {
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    const downloadPsdAction: FileAction = {
        id: 'download_psd',
        requiresSelection: true,
        fileFilter: (file: FileData) => file.name.endsWith('.psd'),
        hotkeys: ['ctrl+q'],
        toolbarButton: {
            name: 'Download Photoshop files',
            icon: ChonkyIconName.download,
        },
    };

    const customFileActions = [downloadPsdAction];
    const files = [
        { id: 'xVdE', name: 'Flowers.psd' },
        { id: 'bTeX', name: 'Mountains.psd' },
        { id: 'mGeX', name: 'Sky.psd' },
        { id: 'mFte', name: 'Stars.psd' },
        { id: 'tLwZ', name: 'Parser.rs' },
        { id: 'mGrQ', name: 'package.json' },
    ];

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                onFileAction={handleFileAction}
                fileActions={customFileActions}
                enableDragAndDrop={true}
            >
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};
