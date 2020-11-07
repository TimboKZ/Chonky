import { Nilable, Nullable } from 'tsdef';

import { FileData, FileFilter } from '../types/file.types';
import { RootState } from '../types/redux.types';

export const selectInstanceId = (state: RootState) => state.instanceId;
export const selectExternalFileActionHandler = (state: RootState) =>
    state.externalFileActionHandler;

export const selectFileActionMap = (state: RootState) => state.fileActionMap;
export const selectFileActionIds = (state: RootState) => state.fileActionIds;
export const selectFileActionData = (fileActionId: string) => (state: RootState) =>
    selectFileActionMap(state)[fileActionId];
export const selectToolbarItems = (state: RootState) => state.toolbarItems;
export const selectContextMenuItems = (state: RootState) => state.contextMenuItems;

export const selectFolderChain = (state: RootState) => state.folderChain;
export const selectCurrentFolder = (state: RootState) => {
    const folderChain = selectFolderChain(state);
    const currentFolder =
        folderChain.length > 0 ? folderChain[folderChain.length - 1] : null;
    return currentFolder;
};
export const selectParentFolder = (state: RootState) => {
    const folderChain = selectFolderChain(state);
    const parentFolder =
        folderChain.length > 1 ? folderChain[folderChain.length - 2] : null;
    return parentFolder;
};

export const selectRawFiles = (state: RootState) => state.rawFiles;
export const selectFileMap = (state: RootState) => state.fileMap;
export const selectCleanFileIds = (state: RootState) => state.cleanFileIds;
export const selectFileData = (fileId: Nullable<string>) => (state: RootState) =>
    fileId ? selectFileMap(state)[fileId] : null;

export const selectHiddenFileIdMap = (state: RootState) => state.hiddenFileIdMap;
export const selectHiddenFileCount = (state: RootState) =>
    Object.keys(selectHiddenFileIdMap(state)).length;
export const selectDisplayFileIds = (state: RootState) => state.displayFileIds;

export const selectFocusSearchInput = (state: RootState) => state.focusSearchInput;
export const selectSearchString = (state: RootState) => state.searchString;

export const selectSelectionMap = (state: RootState) => state.selectionMap;
export const selectSelectedFileIds = (state: RootState) =>
    Object.keys(selectSelectionMap(state));
export const selectSelectionSize = (state: RootState) =>
    selectSelectedFileIds(state).length;
export const selectIsFileSelected = (fileId: Nullable<string>) => (state: RootState) =>
    !!fileId && !!selectSelectionMap(state)[fileId];
export const selectSelectedFiles = (state: RootState) => {
    const fileMap = selectFileMap(state);
    return Object.keys(selectSelectionMap(state)).map((id) => fileMap[id]);
};
export const selectSelectedFilesForAction = (fileActionId: string) => (
    state: RootState
) => {
    const { fileActionMap } = state;
    const action = fileActionMap[fileActionId];
    if (!action || !action.requiresSelection) return undefined;

    return getSelectedFiles(state, action.fileFilter);
};
export const selectSelectedFilesForActionCount = (fileActionId: string) => (
    state: RootState
) => getSelectedFilesForAction(state, fileActionId)?.length;
export const selectDisableSelection = (state: RootState) => state.disableSelection;

export const selectFileViewConfig = (state: RootState) => state.fileViewConfig;

export const selectSortActionId = (state: RootState) => state.sortActionId;
export const selectSortOrder = (state: RootState) => state.sortOrder;

export const selectOptionMap = (state: RootState) => state.optionMap;
export const selectOptionValue = (optionId: string) => (state: RootState) =>
    selectOptionMap(state)[optionId];

export const selectThumbnailGenerator = (state: RootState) => state.thumbnailGenerator;
export const selectDoubleClickDelay = (state: RootState) => state.doubleClickDelay;
export const selectIsDnDDisabled = (state: RootState) => state.disableDragAndDrop;
export const selectClearSelectionOnOutsideClick = (state: RootState) =>
    state.clearSelectionOnOutsideClick;

export const selectLastClickIndex = (state: RootState) => state.lastClickIndex;

export const selectContextMenuMounted = (state: RootState) => state.contextMenuMounted;
export const selectContextMenuConfig = (state: RootState) => state.contextMenuConfig;
export const selectContextMenuTriggerFile = (state: RootState) => {
    const config = selectContextMenuConfig(state);
    if (!config || !config.triggerFileId) return null;
    const fileMap = selectFileMap(state);
    return fileMap[config.triggerFileId] ?? null;
};

// Selectors meant to be used outside of Redux code
export const getFileData = (state: RootState, fileId: Nullable<string>) =>
    fileId ? selectFileMap(state)[fileId] : null;
export const getIsFileSelected = (state: RootState, file: FileData) => {
    // !!! We deliberately don't use `FileHelper.isSelectable` here as we want to
    //     reflect the state of Redux store accurately.
    return !!selectSelectionMap(state)[file.id];
};
export const getSelectedFiles = (
    state: RootState,
    ...filters: Nilable<FileFilter>[]
) => {
    const { fileMap, selectionMap } = state;

    const selectedFiles = Object.keys(selectionMap).map((id) => fileMap[id]);
    const filteredSelectedFiles = filters.reduce(
        (prevFiles, filter) => (filter ? prevFiles.filter(filter) : prevFiles),
        selectedFiles
    );
    return filteredSelectedFiles;
};
export const getSelectedFilesForAction = (state: RootState, fileActionId: string) =>
    selectSelectedFilesForAction(fileActionId)(state);
