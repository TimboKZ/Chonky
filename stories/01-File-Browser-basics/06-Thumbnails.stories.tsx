import 'chonky/style/main.css';

import Promise from 'bluebird';
import {
    FileAction,
    FileActionData,
    FileBrowser,
    FileData,
    FileList,
    FileToolbar,
} from 'chonky';
import React from 'react';

import { createDocsObject, showActionNotification } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './06-Thumbnails.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|File thumbnails',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const ActionsExample = () => {
    const thumbnailGenerator = (file: FileData & { delay: number }) => {
        return new Promise((resolve) => {
            // Delay loading by `file.delay` seconds to simulate thumb generation.
            setTimeout(() => resolve('./Lenna.png'), file.delay * 1000);
        });
    };

    const folderChain = [{ id: 'gBt4z3', name: 'My Pictures', isDir: true }];
    const files: FileData[] = [];
    for (let i = 0; i < 20; ++i) {
        const delay = i * 2;
        files.push({
            id: `image-${i}`,
            name: `Delay - ${delay} seconds.jpg`,
            delay: delay,
        });
    }

    const handleFileAction = (action: FileAction, data: FileActionData) => {
        showActionNotification({ action, data });
    };

    return (
        <div className="live-example" style={{ height: 500 }}>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                thumbnailGenerator={thumbnailGenerator} // <----
                enableDragAndDrop={true}
                onFileAction={handleFileAction}
            >
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
