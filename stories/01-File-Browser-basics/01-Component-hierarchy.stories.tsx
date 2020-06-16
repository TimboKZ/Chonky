import 'chonky/style/main.css';

import { FileBrowser, FileList, FileToolbar } from 'chonky';
import React from 'react';

import { createDocsObject } from '../story-helpers';
// @ts-ignore
// eslint-disable-next-line
import markdown from './01-Component-hierarchy.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '1 File Browser basics|Component hierarchy',
    parameters: {
        docs: createDocsObject({ markdown }),
    },
};

export const ComponentHierarchyExample = () => {
    return (
        <div style={{ height: 500 }}>
            <FileBrowser files={[]} enableDragAndDrop={true}>
                <FileToolbar />
                <FileList />
            </FileBrowser>
        </div>
    );
};
