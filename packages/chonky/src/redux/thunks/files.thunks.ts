import sort from 'fast-sort';
import { Nullable } from 'tsdef';

import { ChonkyActions } from '../../action-definitions/index';
import { FileArray } from '../../types/file.types';
import { ChonkyThunk } from '../../types/redux.types';
import { FileSortKeySelector, SortOrder } from '../../types/sort.types';
import { FileHelper } from '../../util/file-helper';
import { sanitizeInputArray } from '../files-transforms';
import { reduxActions } from '../reducers';
import {
    selectCleanFileIds,
    selectFileMap,
    selectOptionValue,
    selectSearchString,
} from '../selectors';

export const thunkUpdateRawFolderChain = (
    rawFolderChain: Nullable<FileArray> | any
): ChonkyThunk => (dispatch, getState) => {
    if (getState().rawFolderChain === rawFolderChain) return;
    const { sanitizedArray, errorMessages } = sanitizeInputArray(
        'folderChain',
        rawFolderChain
    );
    dispatch(reduxActions.setRawFolderChain(rawFolderChain));
    dispatch(reduxActions.setFolderChainErrorMessages(errorMessages));
    dispatch(reduxActions.setFolderChain(sanitizedArray));
};

export const thunkUpdateRawFiles = (rawFiles: FileArray | any): ChonkyThunk => (
    dispatch,
    getState
) => {
    if (getState().rawFiles === rawFiles) return;
    const { sanitizedArray, errorMessages } = sanitizeInputArray('files', rawFiles);
    dispatch(reduxActions.setRawFiles(rawFiles));
    dispatch(reduxActions.setFilesErrorMessages(errorMessages));
    dispatch(reduxActions.setFiles(sanitizedArray));
    dispatch(thunkSortFiles());
    dispatch(thunkUpdateHiddenFiles());
    dispatch(thunkUpdateDisplayFiles());
    dispatch(reduxActions.cleanUpSelection());
};

export const thunkSortFiles = (): ChonkyThunk => (dispatch, getState) => {
    const {
        fileActionMap,
        fileMap,
        fileIds,
        sortActionId,
        sortOrder,
        optionMap,
    } = getState();

    if (!sortActionId) {
        // We allow users to set the sort action ID to `null` if they want to use their
        // own sorting mechanisms instead of relying on Chonky built-in sort.
        dispatch(reduxActions.setSortedFileIds(fileIds));
        return;
    }

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

export const thunkUpdateHiddenFiles = (): ChonkyThunk => (
    dispatch,
    getState,
    { getCachedSearch }
) => {
    const state = getState();

    const showHiddenFiles = selectOptionValue(
        ChonkyActions.ToggleHiddenFiles.option.id
    )(state);
    const searchString = selectSearchString(state);

    if (typeof showHiddenFiles !== 'boolean' && !searchString) {
        // If option is undefined (relevant actions is not enabled), we show hidden
        // files.
        dispatch(reduxActions.setHiddenFileIds({}));
        return;
    }

    const cleanFileIds = selectCleanFileIds(state);
    const fileMap = selectFileMap(state);

    const foundFileIds = searchString
        ? getCachedSearch(cleanFileIds, fileMap, searchString)
        : null;

    const hiddenFileIdMap = {};
    cleanFileIds.map((id) => {
        const file = id ? fileMap[id] : null;
        if (!file) return;

        const hiddenBySearch = foundFileIds ? !foundFileIds.has(file.id) : false;
        const hiddenByOptions = !showHiddenFiles && FileHelper.isHidden(file);

        if (hiddenBySearch || hiddenByOptions) hiddenFileIdMap[file.id] = true;
    });

    dispatch(reduxActions.setHiddenFileIds(hiddenFileIdMap));
};

export const thunkUpdateDisplayFiles = (): ChonkyThunk => (dispatch, getState) => {
    const { sortedFileIds, hiddenFileIdMap } = getState();
    const displayFileIds = sortedFileIds.filter((id) => !id || !hiddenFileIdMap[id]);
    dispatch(reduxActions.setDisplayFileIds(displayFileIds));
    dispatch(reduxActions.cleanUpSelection());
};

export const thunkUpdateSearchString = (searchString: string): ChonkyThunk => (
    dispatch,
    getState
) => {
    const currentSearchString = selectSearchString(getState());
    if (currentSearchString === searchString) return;
    dispatch(reduxActions.setSearchString(searchString));
    // TODO: Add thunk for setting search mode once global search is supported
    dispatch(thunkUpdateHiddenFiles());
    dispatch(thunkUpdateDisplayFiles());
};
