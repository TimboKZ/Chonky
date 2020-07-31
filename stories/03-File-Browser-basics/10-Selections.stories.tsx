import 'chonky/style/main.css';

import {
    ChonkyActions,
    FileAction,
    FileActionData,
    FileArray,
    FileBrowser,
    FileBrowserHandle,
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

    // Track selected files using the `ChangeSelection` file action
    const [selectedFiles, setSelectedFiles] = React.useState<FileData[]>([]);
    const handleFileAction = (action: FileAction, data: FileActionData) => {
        if (action.id === ChonkyActions.ChangeSelection.id) {
            setSelectedFiles(data.files!);
        }
    };

    // Pretty-print the list of selected files
    const selectedFilesString =
        selectedFiles.length === 0
            ? 'None'
            : selectedFiles.map((f) => f.name).join(', ');

    // Setup callbacks for getting/setting file selections using `FileBrowser` ref
    const fileBrowserRef = React.useRef<FileBrowserHandle>(null);
    const logFileSelection = React.useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (!fileBrowserRef.current) return;
            // eslint-disable-next-line no-console
            console.log(
                'Current selection:',
                fileBrowserRef.current.getFileSelection()
            );
        },
        [fileBrowserRef]
    );
    const randomizeSelection = React.useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (!fileBrowserRef.current) return;

            const randomFileIds = new Set<string>();
            for (const file of files) {
                if (file && Math.random() > 0.5) randomFileIds.add(file.id);
            }
            fileBrowserRef.current.setFileSelection(randomFileIds);
        },
        [files, fileBrowserRef]
    );

    return (
        <div style={{ height: 500 }}>
            <div className="live-example-action">
                Selected files (via file action handler): {selectedFilesString}
            </div>
            <div className="live-example-action">
                Selection methods (via file browser ref):
                <button type="button" onClick={logFileSelection}>
                    Log current selection to console
                </button>
                <button type="button" onClick={randomizeSelection}>
                    Select random files
                </button>
            </div>

            <FileBrowser
                ref={fileBrowserRef}
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
