import React from 'react';
import { RecoilRoot } from 'recoil';

import { FileActionListener, FileArray } from '../..';
import { FileAction } from '../../types/file-actions.types';
import { ThumbnailGenerator } from '../../types/thumbnails.types';
import { ChonkyBusinessLogic } from '../internal/ChonkyBusinessLogic';
import { ChonkyPresentationLayer } from '../internal/ChonkyPresentationLayer';

if (process.env.NODE_ENV === 'development') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });
}

export interface FileBrowserProps {
    /**
     * List of files that will be displayed in the main container. The provided value
     * **must** be an array, where each element is either `null` or an object that
     * satisfies the `FileData` type. If an element is `null`, a loading placeholder
     * will be displayed in its place.
     */
    files: FileArray;

    /**
     * The current folder hierarchy. This should be an array of `files`, every
     * element should either be `null` or an object of `FileData` type. The first
     * element should represent the top-level directory, and the last element
     * should be the current folder.
     */
    folderChain?: FileArray;

    fileActions?: FileAction[];
    onFileAction?: FileActionListener;

    /**
     * The function that determines the thumbnail image URL for a file. It gets a file object as the input, and
     * should return a `string` or `null`. It can also return a promise that resolves into a `string` or `null`.
     * [See relevant section](#section-displaying-file-thumbnails).
     */
    thumbnailGenerator?: ThumbnailGenerator;

    /**
     * Maximum delay between the two clicks in a double click, in milliseconds.
     */
    doubleClickDelay?: number;

    /**
     * The flag that completely disables file selection functionality. If any handlers depend on file selections, their
     * input will look like no files are selected.
     */
    disableSelection?: boolean;

    disableDefaultFileActions?: boolean;

    /**
     * The flag that completely disables drag & drop functionality.
     * [See relevant section](#section-managing-file-selection).
     */
    enableDragAndDrop?: boolean;

    /**
     * The flag that determines whether Chonky should fill the height parent container. When set to `true`, the maximum
     * height of the file browser will be limited to the height of the parent container, and scrollbar will be shown
     * when necessary. When set to `false`, file browser height will be extended to display all files at the same time.
     */
    fillParentContainer?: boolean;
}

export const FileBrowser: React.FC<FileBrowserProps> = (props) => {
    const { children } = props;

    return (
        <RecoilRoot>
            <ChonkyBusinessLogic {...props} />
            <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
        </RecoilRoot>
    );
};
