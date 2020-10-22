/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import {
    thunkUpdateDefaultFileViewActionId,
    thunkUpdateRawFileActions,
} from '../../redux/file-actions.thunks';
import { initialState, reduxActions } from '../../redux/reducers';
import { useDTE } from '../../redux/store';
import { thunkUpdateRawFiles, thunkUpdateRawFolderChain } from '../../redux/thunks';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { useFileActions } from '../../util/file-actions';
import { useFileBrowserHandle } from '../../util/file-browser-handle';
import { useSelection } from '../../util/selection';
import { useSpecialActionDispatcher } from '../../util/special-actions';

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

    //
    // ==== Default values assignment
    const fileActions = props.fileActions ? props.fileActions : [];
    const onFileAction = props.onFileAction ? props.onFileAction : null;

    // ==== Update Redux state
    useDTE(thunkUpdateRawFileActions, rawFileActions, !!disableDefaultFileActions);
    useDTE(thunkUpdateRawFiles, rawFiles);
    useDTE(thunkUpdateRawFolderChain, rawFolderChain);
    useDTE(thunkUpdateDefaultFileViewActionId, defaultFileViewActionId);

    useDTE(reduxActions.setThumbnailGenerator, props.thumbnailGenerator ?? null);
    useDTE(
        reduxActions.setDoubleClickDelay,
        props.doubleClickDelay ?? initialState.doubleClickDelay
    );
    useDTE(reduxActions.setDisableDragAndDrop, !!props.disableDragAndDrop);
    useDTE(
        reduxActions.setClearSelectionOnOutsideClick,
        typeof props.clearSelectionOnOutsideClick === 'boolean'
            ? props.clearSelectionOnOutsideClick
            : true
    );

    //
    // ==== File selections
    useSelection();

    //
    // ==== File actions - actions that users can customise as they please
    useFileActions(fileActions, onFileAction);

    //
    // ==== Special actions - special actions hard-coded into Chonky that users
    //      cannot customize (easily).
    useSpecialActionDispatcher();

    //
    // ==== Setup the imperative handle for external use
    useFileBrowserHandle(ref);

    return null;
});
ChonkyBusinessLogicInner.displayName = 'ChonkyBusinessLogicInner';

export const ChonkyBusinessLogic = React.memo(ChonkyBusinessLogicInner);
ChonkyBusinessLogic.displayName = 'ChonkyBusinessLogic';
