/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { reduxActions } from '../../redux/reducers';
import { initialRootState } from '../../redux/state';
import { useDTE, usePropReduxUpdate } from '../../redux/store';
import {
    thunkActivateSortAction, thunkUpdateDefaultFileViewActionId, thunkUpdateRawFileActions
} from '../../redux/thunks/file-actions.thunks';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { defaultConfig } from '../../util/default-config';
import { useFileBrowserHandle } from '../../util/file-browser-handle';
import { getValueOrFallback } from '../../util/helpers';

export const ChonkyBusinessLogicInner = React.memo(
    React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
        // ==== Update Redux state
        usePropReduxUpdate(reduxActions.setRawFiles, props.files ?? initialRootState.rawFiles);
        usePropReduxUpdate(reduxActions.setRawFolderChain, props.folderChain);
        useDTE(
            thunkUpdateRawFileActions,
            getValueOrFallback(props.fileActions, defaultConfig.fileActions),
            getValueOrFallback(props.disableDefaultFileActions, defaultConfig.disableDefaultFileActions)
        );
        useDTE(
            reduxActions.setExternalFileActionHandler,
            getValueOrFallback(props.onFileAction, defaultConfig.onFileAction) as any
        );
        useDTE(
            reduxActions.setSelectionDisabled,
            getValueOrFallback(props.disableSelection, defaultConfig.disableSelection, 'boolean')
        );
        useDTE(
            thunkActivateSortAction,
            getValueOrFallback(props.defaultSortActionId, defaultConfig.defaultSortActionId)
        );
        useDTE(
            thunkUpdateDefaultFileViewActionId,
            getValueOrFallback(props.defaultFileViewActionId, defaultConfig.defaultFileViewActionId, 'string')
        );

        useDTE(
            reduxActions.setThumbnailGenerator,
            getValueOrFallback(props.thumbnailGenerator, defaultConfig.thumbnailGenerator)
        );
        useDTE(
            reduxActions.setDoubleClickDelay,
            getValueOrFallback(props.doubleClickDelay, defaultConfig.doubleClickDelay, 'number')
        );
        useDTE(
            reduxActions.setDisableDragAndDrop,
            getValueOrFallback(props.disableDragAndDrop, defaultConfig.disableDragAndDrop, 'boolean')
        );
        useDTE(
            reduxActions.setClearSelectionOnOutsideClick,
            getValueOrFallback(
                props.clearSelectionOnOutsideClick,
                defaultConfig.clearSelectionOnOutsideClick,
                'boolean'
            )
        );

        // ==== Setup the imperative handle for external use
        useFileBrowserHandle(ref);

        return null;
    })
);
ChonkyBusinessLogicInner.displayName = 'ChonkyBusinessLogicInner';

export const ChonkyBusinessLogic = React.memo(ChonkyBusinessLogicInner);
ChonkyBusinessLogic.displayName = 'ChonkyBusinessLogic';
