import { Action, ThunkAction } from '@reduxjs/toolkit';
import sort from 'fast-sort';
import { Nullable } from 'tsdef';

import { FileAction } from '../types/file-actions.types';
import { FileArray } from '../types/files.types';
import { FileSortKeySelector } from '../types/sort.types';
import { ChonkyActions } from '../util/file-actions-definitions';
import { FileHelper } from '../util/file-helper';
import { sanitizeInputArray } from './files-transforms';
import { reduxActions, RootState, SortOrder } from './reducers';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export const thunkUpdateRawFileActions = (
    rawFileActions: FileAction[] | any
): AppThunk => (dispatch, getState) => {
    if (getState().rawFileActions === rawFileActions) return;
    const { sanitizedArray, errorMessages } = sanitizeInputArray(
        'fileActions',
        rawFileActions
    );
    dispatch(reduxActions.setRawFileActions(rawFileActions));
    dispatch(reduxActions.setFileActionsErrorMessages(errorMessages));
    dispatch(reduxActions.setFileActions(sanitizedArray));
    dispatch(thunkSortFiles());
};

export const thunkUpdateRawFolderChain = (
    rawFolderChain: Nullable<FileArray> | any
): AppThunk => (dispatch, getState) => {
    if (getState().rawFolderChain === rawFolderChain) return;
    const { sanitizedArray, errorMessages } = sanitizeInputArray(
        'folderChain',
        rawFolderChain
    );
    dispatch(reduxActions.setRawFolderChain(rawFolderChain));
    dispatch(reduxActions.setFolderChainErrorMessages(errorMessages));
    dispatch(reduxActions.setFolderChain(sanitizedArray));
};

export const thunkUpdateRawFiles = (rawFiles: FileArray | any): AppThunk => (
    dispatch,
    getState
) => {
    if (getState().rawFiles === rawFiles) return;
    const { sanitizedArray, errorMessages } = sanitizeInputArray('files', rawFiles);
    dispatch(reduxActions.setRawFiles(rawFiles));
    dispatch(reduxActions.setFilesErrorMessages(errorMessages));
    dispatch(reduxActions.setFiles(sanitizedArray));
    dispatch(thunkSortFiles());
};

export const thunkSortFiles = (): AppThunk => (dispatch, getState) => {
    const {
        fileActionMap,
        fileMap,
        fileIds,
        sortActionId,
        sortOrder,
        optionMap,
    } = getState();

    const sortAction = fileActionMap[sortActionId];
    const sortKeySelector = sortAction ? sortAction.sortKeySelector : null;
    const showFolderFirst = optionMap[ChonkyActions.ToggleShowFoldersFirst.option.id];

    const prepareSortKeySelector = (selector: FileSortKeySelector) => (
        fileId: string
    ) => selector(fileId ? fileMap[fileId] : null);

    const sortFunctions: {
        asc?: (fileId: string) => any;
        desc?: (fileId: string) => any;
    }[] = [];

    if (showFolderFirst) {
        // If option is undefined (relevant actions is not enabled), we don't show
        // folders first.
        sortFunctions.push({ desc: prepareSortKeySelector(FileHelper.isDirectory) });
    }
    if (sortKeySelector) {
        const configKeyName = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
        sortFunctions.push({
            [configKeyName]: prepareSortKeySelector(sortKeySelector),
        });
    }

    if (sortFunctions.length > 0) {
        // We copy the array because `fast-sort` mutates it
        const sortedFileIds = sort([...fileIds]).by(sortFunctions as any);
        dispatch(reduxActions.setSortedFileIds(sortedFileIds));
    } else {
        // When no sorting is required, we keep the original `fileIds` order
        dispatch(reduxActions.setSortedFileIds(fileIds));
    }
};

export const thunkUpdateHiddenFiles = (): AppThunk => (dispatch, getState) => {
    const { fileMap, fileIds, optionMap } = getState();

    const showHiddenFiles = optionMap[ChonkyActions.ToggleHiddenFiles.option.id];
    if (typeof showHiddenFiles !== 'boolean') {
        // If option is undefined (relevant actions is not enabled), we show hidden
        // files.
        dispatch(reduxActions.setHiddenFileIds({}));
    } else if (!showHiddenFiles) {
        const hiddenFileIdMap = {};
        fileIds.map((id) => {
            const file = id ? fileMap[id] : null;
            if (!file) return;
            if (FileHelper.isHidden(file)) hiddenFileIdMap[file.id] = true;
        });
        dispatch(reduxActions.setHiddenFileIds(hiddenFileIdMap));
    }
};

export const thunkUpdateDisplayFiles = (): AppThunk => (dispatch, getState) => {
    const { sortedFileIds, hiddenFileIdMap } = getState();
    const displayFileIds = sortedFileIds.filter((id) => !id || !hiddenFileIdMap[id]);
    dispatch(reduxActions.setDisplayFileIds(displayFileIds));
};
