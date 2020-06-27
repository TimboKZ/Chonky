import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Nullable } from 'tsdef';

import {
    dispatchFileActionState,
    fileActionDataState,
    fileActionMapState,
    fileActionSelectedFilesCountState,
    fileActionsState,
    requestFileActionState,
} from '../recoil/file-actions.recoil';
import { parentFolderState } from '../recoil/files.recoil';
import { optionMapState } from '../recoil/options.recoil';
import { searchBarVisibleState } from '../recoil/search.recoil';
import { sortConfigState } from '../recoil/sort.recoil';
import { FileAction, FileActionHandler } from '../types/file-actions.types';
import { ChonkyIconName } from '../types/icons.types';
import { SortOrder } from '../types/sort.types';
import {
    useInternalFileActionDispatcher,
    useInternalFileActionRequester,
} from './file-action-handlers';
import { ChonkyActions } from './file-actions-definitions';
import { FileHelper } from './file-helper';
import { useRefCallbackWithErrorHandling } from './hooks-helpers';

export const useFileActions = (
    fileActions: FileAction[],
    externalFileActonHandler: Nullable<FileActionHandler>
) => {
    // Recoil state: Put file actions and file action map into state
    const setFileActions = useSetRecoilState(fileActionsState);
    const setFileActionMap = useSetRecoilState(fileActionMapState);
    useEffect(() => {
        const fileActionMap = {};
        for (const action of fileActions) fileActionMap[action.id] = action;

        setFileActions(fileActions);
        setFileActionMap(fileActionMap);
    }, [fileActions, setFileActions, setFileActionMap]);

    // Prepare file action dispatcher (used to dispatch actions to users)
    const internalFileActionDispatcher = useInternalFileActionDispatcher(
        externalFileActonHandler
    );
    // Recoil state: Put file action dispatcher into Recoil state, in a way that will
    // not cause unnecessary re-renders.
    const safeInternalFileActionDispatcher = useRefCallbackWithErrorHandling(
        internalFileActionDispatcher,
        'the internal file action requester'
    );
    const setDispatchFileAction = useSetRecoilState(dispatchFileActionState);
    useEffect(() => setDispatchFileAction(() => safeInternalFileActionDispatcher), [
        safeInternalFileActionDispatcher,
        setDispatchFileAction,
    ]);

    // Prepare file action requester (used to request a file action to be dispatched
    // internally)
    const internalFileActionRequester = useInternalFileActionRequester();
    // Recoil state: Put file action requester into Recoil state, in a way that will
    // not cause unnecessary re-renders.
    const safeInternalFileActionRequester = useRefCallbackWithErrorHandling(
        internalFileActionRequester,
        'the internal file action requester'
    );
    const setRequestFileAction = useSetRecoilState(requestFileActionState);
    useEffect(() => setRequestFileAction(() => safeInternalFileActionRequester), [
        safeInternalFileActionRequester,
        setRequestFileAction,
    ]);

    return { internalFileActionDispatcher, internalFileActionRequester };
};

export const useFileActionTrigger = (fileActionId: string) => {
    const requestFileAction = useRecoilValue(requestFileActionState);
    return useCallback(() => requestFileAction(fileActionId), [
        fileActionId,
        requestFileAction,
    ]);
};

export const useFileActionProps = (
    fileActionId: string
): { icon: Nullable<ChonkyIconName | string>; active: boolean; disabled: boolean } => {
    const parentFolder = useRecoilValue(parentFolderState);
    const sortConfig = useRecoilValue(sortConfigState);
    const optionMap = useRecoilValue(optionMapState);
    const searchBarVisible = useRecoilValue(searchBarVisibleState);
    const action = useRecoilValue(fileActionDataState(fileActionId));
    const actionSelectionSize = useRecoilValue(
        fileActionSelectedFilesCountState(fileActionId)
    );

    const actionSelectionEmpty = actionSelectionSize === 0;

    return useMemo(() => {
        if (!action) return { icon: null, active: false, disabled: true };

        let icon = action.toolbarButton?.icon ?? null;
        if (action.sortKeySelector) {
            if (sortConfig.fileActionId === action.id) {
                if (sortConfig.order === SortOrder.Asc) {
                    icon = ChonkyIconName.sortAsc;
                } else {
                    icon = ChonkyIconName.sortDesc;
                }
            } else {
                icon = ChonkyIconName.circle;
            }
        } else if (action.option) {
            if (optionMap[action.option.id]) {
                icon = ChonkyIconName.checkActive;
            } else {
                icon = ChonkyIconName.checkInactive;
            }
        }

        const isSearchButtonAndSearchVisible =
            action.id === ChonkyActions.ToggleSearch.id && searchBarVisible;
        const isSortButtonAndCurrentSort = action.id === sortConfig.fileActionId;
        const isOptionAndEnabled = action.option
            ? !!optionMap[action.option.id]
            : false;

        const active =
            isSearchButtonAndSearchVisible ||
            isSortButtonAndCurrentSort ||
            isOptionAndEnabled;
        let disabled: boolean = !!action.requiresSelection && actionSelectionEmpty;

        if (action.id === ChonkyActions.OpenParentFolder.id) {
            // We treat `open_parent_folder` file action as a special case as it
            // requires the parent folder to be present to work...
            disabled = disabled || !FileHelper.isOpenable(parentFolder);
        }

        return { icon, active, disabled };
    }, [
        action,
        sortConfig,
        optionMap,
        searchBarVisible,
        parentFolder,
        actionSelectionEmpty,
    ]);
};
