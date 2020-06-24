import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    dispatchFileActionState,
    requestFileActionState,
} from '../recoil/file-actions.recoil';
import { parentFolderState } from '../recoil/files.recoil';
import { searchBarVisibleState } from '../recoil/search.recoil';
import { dispatchSpecialActionState } from '../recoil/special-actions.recoil';
import { FileArray } from '../types/files.types';
import { FileSelection, SelectionModifiers } from '../types/selection.types';
import {
    SpecialAction,
    SpecialActionData,
    SpecialActionHandlerMap,
    SpecialDragNDropEndAction,
    SpecialDragNDropStartAction,
    SpecialFileKeyboardClickAction,
    SpecialFileMouseClickAction,
    SpecialOpenFolderChainFolderAction,
} from '../types/special-actions.types';
import { ChonkyActions } from './file-actions-definitions';
import { FileHelper } from './file-helper';
import { useInstanceVariable } from './hooks-helpers';
import { Logger } from './logger';
import { SelectionUtil } from './selection';

/**
 * Returns a dispatch method meant to be used by child components. This dispatch
 * method is meant for "special" internal actions. It takes a special action, and
 * transforms it into a "file action" that can be handled by the user.
 */
export const useSpecialActionDispatcher = (
    files: FileArray,
    selection: FileSelection,
    selectionUtil: SelectionUtil,
    selectionModifiers: SelectionModifiers
) => {
    // Create the special action handler map
    const specialActionHandlerMap = useSpecialFileActionHandlerMap(
        selectionUtil,
        selectionModifiers
    );

    // Process special actions using the handlers from the map
    const dispatchSpecialAction = useCallback(
        (actionData: SpecialActionData) => {
            Logger.debug(`SPECIAL ACTION REQUEST:`, actionData);
            const { actionId } = actionData;
            const handler = specialActionHandlerMap[actionId];
            if (handler) {
                try {
                    handler(actionData);
                } catch (error) {
                    Logger.error(
                        `Handler for special action "${actionId}" threw an error.`,
                        error
                    );
                }
            } else {
                Logger.error(
                    `Internal components dispatched a "${actionId}" special action, ` +
                        `but no internal handler is available to process it.`
                );
            }
        },
        [specialActionHandlerMap]
    );

    const setRecoilDispatchSpecialAction = useSetRecoilState(
        dispatchSpecialActionState
    );
    useEffect(() => {
        setRecoilDispatchSpecialAction(() => dispatchSpecialAction);
    }, [dispatchSpecialAction, setRecoilDispatchSpecialAction]);
};

export const useSpecialFileActionHandlerMap = (
    selectionUtil: SelectionUtil,
    selectionModifiers: SelectionModifiers
) => {
    const parentFolderRef = useInstanceVariable(useRecoilValue(parentFolderState));
    const dispatchFileActionRef = useInstanceVariable(
        useRecoilValue(dispatchFileActionState)
    );
    const requestFileActionRef = useInstanceVariable(
        useRecoilValue(requestFileActionState)
    );
    const setSearchBarVisible = useSetRecoilState(searchBarVisibleState);

    // Define handlers in a map
    const specialActionHandlerMap = useMemo<SpecialActionHandlerMap>(() => {
        return {
            [SpecialAction.MouseClickFile]: (data: SpecialFileMouseClickAction) => {
                if (data.clickType === 'double' && FileHelper.isOpenable(data.file)) {
                    dispatchFileActionRef.current({
                        actionId: ChonkyActions.OpenFiles.id,
                        target: data.file,

                        // To simulate Windows Explorer and Nautilus behaviour,
                        // a double click on a file only opens that file even if
                        // there is a selection.
                        files: [data.file],
                    });
                } else {
                    if (FileHelper.isSelectable(data.file)) {
                        selectionModifiers.toggleSelection(data.file.id, !data.ctrlKey);
                        // TODO: Handle range selections.
                    } else {
                        if (!data.ctrlKey) selectionModifiers.clearSelection();
                    }
                }
            },
            [SpecialAction.KeyboardClickFile]: (
                data: SpecialFileKeyboardClickAction
            ) => {
                if (data.enterKey) {
                    requestFileActionRef.current(ChonkyActions.OpenFiles.id);
                } else if (data.spaceKey && FileHelper.isSelectable(data.file)) {
                    selectionModifiers.toggleSelection(data.file.id, data.ctrlKey);

                    // TODO: Handle range selections.
                }
            },
            [SpecialAction.OpenParentFolder]: () => {
                if (FileHelper.isOpenable(parentFolderRef.current)) {
                    dispatchFileActionRef.current({
                        actionId: ChonkyActions.OpenFiles.id,
                        target: parentFolderRef.current,
                        files: [parentFolderRef.current],
                    });
                } else {
                    Logger.warn(
                        `Special action "${SpecialAction.OpenParentFolder}" was ` +
                            `dispatched even though the parent folder is not ` +
                            `openable. This indicates a bug in presentation components.`
                    );
                }
            },
            [SpecialAction.OpenFolderChainFolder]: (
                data: SpecialOpenFolderChainFolderAction
            ) => {
                dispatchFileActionRef.current({
                    actionId: ChonkyActions.OpenFiles.id,
                    target: data.file,
                    files: [data.file],
                });
            },
            [SpecialAction.ToggleSearchBar]: () => {
                setSearchBarVisible((visible: any) => !visible);
            },
            [SpecialAction.DragNDropStart]: (data: SpecialDragNDropStartAction) => {
                const file = data.dragSource;
                if (!selectionUtil.isSelected(file)) {
                    selectionModifiers.clearSelection();
                    if (FileHelper.isSelectable(file)) {
                        selectionModifiers.selectFiles([file.id]);
                    }
                }
            },
            [SpecialAction.DragNDropEnd]: (data: SpecialDragNDropEndAction) => {
                if (selectionUtil.isSelected(data.dropTarget)) {
                    // Can't drop a selection into itself
                    return;
                }

                const selectedFiles = selectionUtil.getSelectedFiles(
                    FileHelper.isDraggable
                );
                const droppedFiles =
                    selectedFiles.length > 0 ? selectedFiles : [data.dragSource];
                dispatchFileActionRef.current({
                    actionId:
                        data.dropEffect === 'copy'
                            ? ChonkyActions.DuplicateFilesTo.id
                            : ChonkyActions.MoveFilesTo.id,
                    target: data.dropTarget,
                    files: droppedFiles,
                });
            },
        } as SpecialActionHandlerMap;
    }, [
        selectionUtil,
        selectionModifiers,
        parentFolderRef,
        dispatchFileActionRef,
        requestFileActionRef,
        setSearchBarVisible,
    ]);
    return specialActionHandlerMap;
};
