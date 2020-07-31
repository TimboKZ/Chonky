import 'chonky/style/main.css';

import {
    ChonkyActions,
    FileAction,
    FileActionData,
    FileArray,
    FileBrowser,
    FileData,
    FileList,
    FileSearch,
    FileToolbar,
} from 'chonky';
import React from 'react';

import { createDocsObject, StoryCategories } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './10-Selections.md';

const category = StoryCategories.FileBrowserBasics;
const title = 'Managing file selections';

// eslint-disable-next-line import/no-default-export
export default {
    title: `${category}/${title}`,
    parameters: {
        docs: createDocsObject({ category, title, markdown }),
    },
};

export const SelectionsExample = () => {
    const files = React.useMemo<FileArray>(
        () => [
            { id: 'AswQ', name: '01.psd' },
            { id: 'SdaW', name: '02.jpg' },
            { id: 'VsWq', name: '03.pdf' },
            { id: 'MsdR', name: '04.pub' },
        ],
        []
    );
    const [selectedFiles, setSelectedFiles] = React.useState<FileData[]>([]);
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        if (action.id === ChonkyActions.ChangeSelection.id) {
            setSelectedFiles(data.files!);
        }
    };

    const selectedFilesString =
        selectedFiles.length === 0
            ? 'None'
            : selectedFiles.map((f) => f.name).join(', ');
    return (
        <div style={{ height: 500 }}>
            <div style={{ fontSize: 20 }}>Selected files: {selectedFilesString}</div>
            <br />
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
