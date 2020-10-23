/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { reduxActions } from '../../redux/reducers';
import { initialRootState } from '../../redux/state';
import { useDTE } from '../../redux/store';
import {
    thunkUpdateDefaultFileViewActionId,
    thunkUpdateRawFileActions,
} from '../../redux/thunks/file-actions.thunks';
import {
    thunkUpdateRawFiles,
    thunkUpdateRawFolderChain,
} from '../../redux/thunks/files.thunks';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { useFileBrowserHandle } from '../../util/file-browser-handle';

export const ChonkyBusinessLogicInner = React.forwardRef<
    FileBrowserHandle,
    FileBrowserProps
>((props, ref) => {
    // ==== Update Redux state
    useDTE(thunkUpdateRawFiles, props.files ?? initialRootState.rawFiles);
    useDTE(thunkUpdateRawFolderChain, props.folderChain);
    useDTE(
        thunkUpdateRawFileActions,
        props.fileActions ?? initialRootState.rawFileActions,
        !!props.disableDefaultFileActions
    );
    useDTE(
        reduxActions.setExternalFileActionHandler,
        props.onFileAction ?? initialRootState.externalFileActionHandler
    );
    useDTE(thunkUpdateDefaultFileViewActionId, props.defaultFileViewActionId);

    useDTE(
        reduxActions.setThumbnailGenerator,
        props.thumbnailGenerator ?? initialRootState.thumbnailGenerator
    );
    useDTE(
        reduxActions.setDoubleClickDelay,
        props.doubleClickDelay ?? initialRootState.doubleClickDelay
    );
    useDTE(reduxActions.setDisableDragAndDrop, !!props.disableDragAndDrop);
    useDTE(
        reduxActions.setClearSelectionOnOutsideClick,
        typeof props.clearSelectionOnOutsideClick === 'boolean'
            ? props.clearSelectionOnOutsideClick
            : true
    );

    // ==== Setup the imperative handle for external use
    useFileBrowserHandle(ref);

    return null;
});
ChonkyBusinessLogicInner.displayName = 'ChonkyBusinessLogicInner';

export const ChonkyBusinessLogic = React.memo(ChonkyBusinessLogicInner);
ChonkyBusinessLogic.displayName = 'ChonkyBusinessLogic';
