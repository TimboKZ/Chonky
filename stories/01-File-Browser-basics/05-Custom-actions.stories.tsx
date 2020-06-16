import 'chonky/style/main.css';

import { FileBrowser, FileList, FileToolbar } from 'chonky';
import React from 'react';

import { createDocsObject } from '../story-helpers';
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
    return (
        <FileBrowser files={[]}>
            <FileList />
            <FileToolbar />
        </FileBrowser>
    );
};
