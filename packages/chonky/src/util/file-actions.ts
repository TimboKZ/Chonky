import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { reduxActions } from '../redux/reducers';
import {
    selectFileActionData,
    selectFileActionRequester,
    selectFileViewConfig,
    selectOptionValue,
    selectParentFolder,
    selectSelectedFilesForActionCount,
    selectSortActionId,
    selectSortOrder,
} from '../redux/selectors';
import { useDTE, useParamSelector } from '../redux/store';
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
    useDTE(reduxActions.setFileActionDispatcher, safeInternalFileActionDispatcher);

    // Prepare file action requester (used to request a file action to be dispatched
    // internally)
    const internalFileActionRequester = useInternalFileActionRequester();
    // Recoil state: Put file action requester into Recoil state, in a way that will
    // not cause unnecessary re-renders.
    const safeInternalFileActionRequester = useRefCallbackWithErrorHandling(
        internalFileActionRequester,
        'the internal file action requester'
    );
    useDTE(reduxActions.setFileActionRequester, safeInternalFileActionRequester);

    return { internalFileActionDispatcher, internalFileActionRequester };
};

export const useFileActionTrigger = (fileActionId: string) => {
    const requestFileAction = useSelector(selectFileActionRequester);
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

    const actionSelectionSize = useParamSelector(
        selectSelectedFilesForActionCount,
        fileActionId
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
