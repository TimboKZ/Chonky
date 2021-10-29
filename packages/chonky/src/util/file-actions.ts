import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { ChonkyActions } from '../action-definitions/index';
import {
    selectFileActionData,
    selectFileViewConfig,
    selectOptionValue,
    selectParentFolder,
    selectSelectedFilesForActionCount,
    selectSortActionId,
    selectSortOrder,
} from '../redux/selectors';
import { useParamSelector } from '../redux/store';
import { thunkRequestFileAction } from '../redux/thunks/dispatchers.thunks';
import { ChonkyIconName } from '../types/icons.types';
import { CustomVisibilityState } from '../types/action.types';
import { SortOrder } from '../types/sort.types';
import { FileHelper } from './file-helper';

export const useFileActionTrigger = (fileActionId: string) => {
    const dispatch = useDispatch();
    const fileAction = useParamSelector(selectFileActionData, fileActionId);
    return useCallback(() => dispatch(thunkRequestFileAction(fileAction, undefined)), [
        dispatch,
        fileAction,
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
    // @ts-ignore
    const optionValue = useParamSelector(selectOptionValue, action?.option?.id);

    const actionSelectionSize = useParamSelector(
        selectSelectedFilesForActionCount,
        fileActionId
    );

    const actionSelectionEmpty = actionSelectionSize === 0;

    return useMemo(() => {
        if (!action) return { icon: null, active: false, disabled: true };

        let icon = action.button?.icon ?? null;
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

        let customDisabled = false;
        let customActive = false;
        if (action.customVisibility !== undefined) {
            customDisabled = action.customVisibility() === CustomVisibilityState.Disabled;
            customActive = action.customVisibility() === CustomVisibilityState.Active;
        }
        const active =
            isSortButtonAndCurrentSort ||
            isFileViewButtonAndCurrentView ||
            isOptionAndEnabled ||
            customActive;
        
        let disabled: boolean = (!!action.requiresSelection && actionSelectionEmpty) || customDisabled;

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
