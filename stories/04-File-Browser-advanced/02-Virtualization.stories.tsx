import 'chonky/style/main.css';

import {
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
import markdown from './02-Virtualization.md';

const category = StoryCategories.FileBrowserExamples;
const title = 'Virtualization with 10,000 files';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const VirtualizationExample = () => {
    const files: FileData[] = [];

    for (let i = 0; i < 10000; ++i) {
        files.push({
            id: `file-${i}`,
            name: i ? `Chrome (${i}).exe` : 'Chrome.exe',
        });
    }

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div style={{ height: 500 }}>
            <FileBrowser
                files={files}
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
