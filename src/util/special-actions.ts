import { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';

import { searchBarVisibleState } from '../recoil/search.recoil';
import { InternalFileActionDispatcher } from '../types/file-actions.types';
import { FileArray } from '../types/files.types';
import { FileSelection, SelectionModifiers } from '../types/selection.types';
import {
    InternalSpecialActionDispatcher,
    SpecialAction,
    SpecialActionData,
    SpecialDragNDropEndAction,
    SpecialDragNDropStartAction,
    SpecialFileKeyboardClickAction,
    SpecialFileMouseClickAction,
} from '../types/special-actions.types';
import { ChonkyActions } from './file-actions-old';
import { FileHelper } from './file-helper';
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
    selectionModifiers: SelectionModifiers,
    dispatchFileAction: InternalFileActionDispatcher
): InternalSpecialActionDispatcher => {
    // Create the special action handler map
    const specialActionHandlerMap = useSpecialFileActionHandlerMap(
        selectionUtil,
        selectionModifiers,
        dispatchFileAction
    );

    // Process special actions using the handlers from the map
    const dispatchSpecialAction = useCallback(
        (actionData: SpecialActionData) => {
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
    return dispatchSpecialAction;
};

export const useSpecialFileActionHandlerMap = (
    selectionUtil: SelectionUtil,
    selectionModifiers: SelectionModifiers,
    dispatchFileAction: InternalFileActionDispatcher
) => {
    const setSearchBarVisible = useSetRecoilState(searchBarVisibleState);

    // Define handlers in a map
    const specialActionHandlerMap = useMemo(
        () =>
            ({
                [SpecialAction.MouseClickFile]: (data: SpecialFileMouseClickAction) => {
                    if (
                        data.clickType === 'double' &&
                        FileHelper.isOpenable(data.file)
                    ) {
                        dispatchFileAction({
                            actionId: ChonkyActions.OpenFiles.id,
                            target: data.file,

                            // To simulate Windows Explorer and Nautilus behaviour,
                            // a double click on a file only opens that file even if
                            // there is a selection.
                            files: [data.file],
                        });
                    } else {
                        if (FileHelper.isSelectable(data.file)) {
                            selectionModifiers.toggleSelection(
                                data.file.id,
                                !data.ctrlKey
                            );
                            // TODO: Handle range selections.
                        } else {
                            if (!data.ctrlKey) selectionModifiers.clearSelection();
                        }
                    }
                },
                [SpecialAction.KeyboardClickFile]: (
                    data: SpecialFileKeyboardClickAction
                ) => {
                    if (data.enterKey && FileHelper.isOpenable(data.file)) {
                        dispatchFileAction({
                            actionId: ChonkyActions.OpenFiles.id,
                            target: data.file,
                            files: selectionUtil.getSelectedFiles(
                                FileHelper.isOpenable
                            ),
                        });
                    } else if (data.spaceKey && FileHelper.isSelectable(data.file)) {
                        selectionModifiers.toggleSelection(data.file.id, data.ctrlKey);

                        // TODO: Handle range selections.
                    }
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
                    dispatchFileAction({
                        actionId:
                            data.dropEffect === 'copy'
                                ? ChonkyActions.DuplicateFilesTo.id
                                : ChonkyActions.MoveFilesTo.id,
                        target: data.dropTarget,
                        files: droppedFiles,
                    });
                },
            } as { [actionId in SpecialAction]: (data: SpecialActionData) => void }),
        [selectionUtil, selectionModifiers, setSearchBarVisible, dispatchFileAction]
    );
    return specialActionHandlerMap;
};
