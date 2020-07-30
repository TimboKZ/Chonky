import 'chonky/style/main.css';

import {
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
import markdown from './02-Displaying-files.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Displaying files';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const FilesArrayExample = () => {
    const files: FileArray = [
        null, // Loading animation will be shown for this file
        null,
        {
            id: 'nTe',
            name: 'Normal file.yml',
            size: 890,
            modDate: new Date('2012-01-01'),
        },
        {
            id: 'zxc',
            name: 'Hidden file.mp4',
            isHidden: true,
            size: 890,
        },
        {
            id: 'bnm',
            name: 'Normal folder',
            isDir: true,
            childrenCount: 12,
        },
        {
            id: 'vfr',
            name: 'Symlink folder',
            isDir: true,
            isSymlink: true,
            childrenCount: 0,
        },
        {
            id: 'qwe',
            name: 'Not selectable.tar.gz',
            ext: '.tar.gz', // Custom extension
            selectable: false, // Disable selection
            size: 54300000000,
            modDate: new Date(),
        },
        {
            id: 'rty',
            name: 'Not openable.pem',
            openable: false, // Prevent opening
            size: 100000000,
        },
        {
            id: 'btj',
            name: 'Not draggable.csv',
            draggable: false, // Prevent this files from being dragged
        },
        {
            id: 'upq',
            name: 'Not droppable',
            isDir: true,
            droppable: false, // Prevent files from being dropped into this folder
        },
        {
            id: 'mRw',
            name: 'Unknown file name',
        },
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
            >
                <FileToolbar />
                <FileSearch />
                <FileList />
            </FileBrowser>
        </div>
    );
};
