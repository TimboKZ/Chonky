/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { initialRootState, reduxActions } from '../../redux/reducers';
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
    const {
        files: rawFiles,
        folderChain: rawFolderChain,
        fileActions: rawFileActions,
        disableDefaultFileActions,
        defaultFileViewActionId,
    } = props;

    // Instance ID used to distinguish between multiple Chonky instances on the
    // same page const chonkyInstanceId = useStaticValue(shortid.generate);

    // ==== Update Redux state
    useDTE(thunkUpdateRawFiles, rawFiles ?? initialRootState.rawFiles);
    useDTE(thunkUpdateRawFolderChain, rawFolderChain);
    useDTE(
        thunkUpdateRawFileActions,
        rawFileActions ?? initialRootState.rawFileActions,
        !!disableDefaultFileActions
    );
    useDTE(
        reduxActions.setExternalFileActionHandler,
        props.onFileAction ?? initialRootState.externalFileActionHandler
    );
    useDTE(thunkUpdateDefaultFileViewActionId, defaultFileViewActionId);

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
