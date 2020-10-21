import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { RootState } from './reducers';

/**
 * Hook that can be used with parametrized selectors.
 */
export const useParamSelector = <Args extends Array<any>, Value>(
    parametrizedSelector: (...args: Args) => (state: RootState) => Value,
    ...selectorParams: Args
) => {
    const selector = useCallback(
        (state: RootState) => parametrizedSelector(...selectorParams)(state),
        // eslint-disable-next-line
        [parametrizedSelector, ...selectorParams]
    );
    return useSelector(selector);
};

// ==== Selectors
export const selectFileActionMap = (state: RootState) => state.fileActionMap;
export const selectFileActionData = (fileActionId: string) => (state: RootState) =>
    selectFileActionMap(state)[fileActionId];
export const selectToolbarItems = (state: RootState) => state.toolbarItems;

export const selectFolderChain = (state: RootState) => state.folderChain;
export const selectParentFolder = (state: RootState) => {
    const folderChain = selectFolderChain(state);
    const parentFolder =
        folderChain.length > 1 ? folderChain[folderChain.length - 2] : null;
    return parentFolder;
};

export const selectFileMap = (state: RootState) => state.fileMap;
export const selectFileData = (fileId: Nullable<string>) => (state: RootState) =>
    fileId ? selectFileMap(state)[fileId] : null;

export const selectDisplayFileIds = (state: RootState) => state.displayFileIds;

export const selectFileViewConfig = (state: RootState) => state.fileViewConfig;

export const selectSortActionId = (state: RootState) => state.sortActionId;
export const selectSortOrder = (state: RootState) => state.sortOrder;

export const selectOptionMap = (state: RootState) => state.optionMap;
export const selectOptionValue = (optionId: string) => (state: RootState) =>
    selectOptionMap(state)[optionId];
