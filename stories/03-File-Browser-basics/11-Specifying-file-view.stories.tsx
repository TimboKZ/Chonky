import 'chonky/style/main.css';

import {
    ChonkyActions,
    FileAction,
    FileActionData,
    FileArray,
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
import markdown from './11-Specifying-file-view.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Specifying default file view';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const FileViewExample = () => {
    const files: FileArray = [
        { id: 'VdWw', name: 'dash_fragment_init.mp4' },
        { id: 'vdZq', name: 'dash_fragment_01.mp4' },
        { id: 'mGex', name: 'dash_fragment_02.mp4' },
        { id: 'lrqZ', name: 'dash_fragment_03.mp4' },
    ];

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
                onFileAction={handleFileAction}
                enableDragAndDrop={true}
                defaultFileViewActionId={ChonkyActions.EnableListView.id}
            >
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};
