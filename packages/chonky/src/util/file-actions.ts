import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Nilable, Nullable } from 'tsdef';

import {
    dispatchFileActionState,
    fileActionMapState,
    fileActionSelectedFilesCountState,
    fileActionsState,
    requestFileActionState,
} from '../recoil/file-actions.recoil';
import {
    selectFileActionData,
    selectFileViewConfig,
    selectOptionValue,
    selectParentFolder,
    selectSortActionId,
    selectSortOrder,
    useParamSelector,
} from '../redux/selectors';
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
    externalFileActonHandler: Nullable<FileActionHandler>,
    defaultFileViewActionId: Nilable<string>
) => {
    // Recoil state: Put file actions and file action map into state
    const setFileActions = useSetRecoilState(fileActionsState);
    const setFileActionMap = useSetRecoilState(fileActionMapState);
    useEffect(
        () => {
            const fileActionMap: { [actionId: string]: FileAction } = {};
            for (const action of fileActions) fileActionMap[action.id] = action;

            setFileActions(fileActions);
            setFileActionMap(fileActionMap);
        },
        // XXX: We deliberately don't add `defaultFileViewActionId` to deps below.
        // eslint-disable-next-line
        [fileActions, setFileActions, setFileActionMap]
    );

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
    const parentFolder = useSelector(selectParentFolder);
    const fileViewConfig = useSelector(selectFileViewConfig);

    const sortActionId = useSelector(selectSortActionId);
    const sortOrder = useSelector(selectSortOrder);

    const action = useParamSelector(selectFileActionData, fileActionId);
    const optionValue = useParamSelector(selectOptionValue, action?.option?.id);

    const actionSelectionSize = useRecoilValue(
        fileActionSelectedFilesCountState(fileActionId)
    );

    const actionSelectionEmpty = actionSelectionSize === 0;

    return useMemo(() => {
        if (!action) return { icon: null, active: false, disabled: true };

        let icon = action.toolbarButton?.icon ?? null;
        if (action.sortKeySelector) {
            if (sortActionId === action.id) {
                if (sortOrder === SortOrder.ASC) {
                    icon = ChonkyIconName.sortAsc;
                } else {
                    icon = ChonkyIconName.sortDesc;
                }
            } else {
                icon = ChonkyIconName.placeholder;
            }
        } else if (action.option) {
            if (optionValue) {
                icon = ChonkyIconName.toggleOn;
            } else {
                icon = ChonkyIconName.toggleOff;
            }
        }

        const isSortButtonAndCurrentSort = action.id === sortActionId;
        const isFileViewButtonAndCurrentView = action.fileViewConfig === fileViewConfig;
        const isOptionAndEnabled = action.option ? !!optionValue : false;

        const active =
            isSortButtonAndCurrentSort ||
            isFileViewButtonAndCurrentView ||
            isOptionAndEnabled;
        let disabled: boolean = !!action.requiresSelection && actionSelectionEmpty;

        if (action.id === ChonkyActions.OpenParentFolder.id) {
            // We treat `open_parent_folder` file action as a special case as it
            // requires the parent folder to be present to work...
            disabled = disabled || !FileHelper.isOpenable(parentFolder);
        }

        return { icon, active, disabled };
    }, [
        parentFolder,
        fileViewConfig,
        sortActionId,
        sortOrder,
        action,
        optionValue,
        actionSelectionEmpty,
    ]);
};
