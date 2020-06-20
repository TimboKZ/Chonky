import { useCallback, useEffect, useMemo } from 'react';

import {
    FileArray,
    FileData,
    FileSelection,
    InternalFileActionDispatcher,
    InternalSpecialActionDispatcher,
} from '../typedef';
import { INTENTIONAL_EMPTY_DEPS } from './constants';
import { ChonkyActions } from './file-actions';
import { FileHelper } from './file-helper';
import { Logger } from './logger';
import { SelectionUtil, useSelection } from './selection';

export enum SpecialAction {
    MouseClickFile = 'mouse_click_file',
    KeyboardClickFile = 'keyboard_click_file',

    ToggleSearchBar = 'toggle_search_bar',

    DragNDropStart = 'drag_n_drop_start',
    DragNDropEnd = 'drag_n_drop_end',
}

export interface SpecialFileMouseClickAction {
    actionName: SpecialAction.MouseClickFile;
    file: FileData;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    clickType: 'single' | 'double';
}

export interface SpecialFileKeyboardClickAction {
    actionName: SpecialAction.KeyboardClickFile;
    file: FileData;
    enterKey: boolean;
    spaceKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}

export interface SpecialToggleSearchBarAction {
    actionName: SpecialAction.KeyboardClickFile;
}

export interface SpecialDragNDropStartAction {
    actionName: SpecialAction.DragNDropStart;
    dragSource: FileData;
}

export interface SpecialDragNDropEndAction {
    actionName: SpecialAction.DragNDropEnd;
    dragSource: FileData;
    dropTarget: FileData;
    dropEffect: 'move' | 'copy';
}

export type SpecialActionData =
    | SpecialFileMouseClickAction
    | SpecialFileKeyboardClickAction
    | SpecialToggleSearchBarAction
    | SpecialDragNDropStartAction
    | SpecialDragNDropEndAction;

interface SpecialMutableChonkyState {
    files: FileArray;
    selection: FileSelection;
}

/**
 * Returns a dispatch method meant to be used by child components. This dispatch
 * method is meant for "special" internal actions. It takes a special action, and
 * transforms it into a "file action" that can be handled by the user.
 */
export const useSpecialActionDispatcher = (
    files: FileArray,
    selection: FileSelection,
    selectionUtil: SelectionUtil,
    selectFiles: ReturnType<typeof useSelection>['selectFiles'],
    toggleSelection: ReturnType<typeof useSelection>['toggleSelection'],
    clearSelection: ReturnType<typeof useSelection>['clearSelection'],
    dispatchFileAction: InternalFileActionDispatcher
): InternalSpecialActionDispatcher => {
    // Generate mutable Chonky state object so that special action handlers can use
    // up-to-date state without triggering re-renders
    const specialStateDeps = [files, selection];
    const specialState = useMemo<SpecialMutableChonkyState>(
        () => ({
            files,
            selection,
        }),
        INTENTIONAL_EMPTY_DEPS
    );
    useEffect(() => {
        specialState.files = files;
        specialState.selection = selection;
    }, specialStateDeps);

    // Create the special action handler map
    const specialActionHandlerMap = useSpecialFileActionHandlerMap(
        selectionUtil,
        selectFiles,
        toggleSelection,
        clearSelection,
        dispatchFileAction
    );

    // Process special actions using the handlers from the map
    const dispatchSpecialActionDeps = [specialActionHandlerMap];
    const dispatchSpecialAction = useCallback((actionData: SpecialActionData) => {
        const { actionName } = actionData;
        const handler = specialActionHandlerMap[actionName];
        if (handler) {
            try {
                handler(actionData);
            } catch (error) {
                Logger.error(
                    `Handler for special action "${actionName}" threw an error.`,
                    error
                );
            }
        } else {
            Logger.error(
                `Internal components dispatched a "${actionName}" special action, ` +
                    `but no internal handler is available to process it.`
            );
        }
    }, dispatchSpecialActionDeps);
    return dispatchSpecialAction;
};

export const useSpecialFileActionHandlerMap = (
    selectionUtil: SelectionUtil,
    selectFiles: ReturnType<typeof useSelection>['selectFiles'],
    toggleSelection: ReturnType<typeof useSelection>['toggleSelection'],
    clearSelection: ReturnType<typeof useSelection>['clearSelection'],
    dispatchFileAction: InternalFileActionDispatcher
) => {
    // Define handlers in a map
    const specialActionHandlerMapDeps = [
        selectFiles,
        toggleSelection,
        clearSelection,
        dispatchFileAction,
    ];
    const specialActionHandlerMap = useMemo(
        () =>
            ({
                [SpecialAction.MouseClickFile]: (data: SpecialFileMouseClickAction) => {
                    if (
                        data.clickType === 'double' &&
                        FileHelper.isOpenable(data.file)
                    ) {
                        dispatchFileAction({
                            actionName: ChonkyActions.OpenFiles.name,
                            target: data.file,

                            // To simulate Windows Explorer and Nautilus behaviour,
                            // a double click on a file only opens that file even if
                            // there is a selection.
                            files: [data.file],
                        });
                    } else {
                        if (FileHelper.isSelectable(data.file)) {
                            toggleSelection(data.file.id, !data.ctrlKey);
                            // TODO: Handle range selections.
                        } else {
                            if (!data.ctrlKey) clearSelection();
                        }
                    }
                },
                [SpecialAction.KeyboardClickFile]: (
                    data: SpecialFileKeyboardClickAction
                ) => {
                    if (data.enterKey && FileHelper.isOpenable(data.file)) {
                        dispatchFileAction({
                            actionName: ChonkyActions.OpenFiles.name,
                            target: data.file,
                            files: selectionUtil.getSelectedFiles(
                                FileHelper.isOpenable
                            ),
                        });
                    } else if (data.spaceKey && FileHelper.isSelectable(data.file)) {
                        toggleSelection(data.file.id, data.ctrlKey);
                        // TODO: Handle range selections.
                    }
                },
                [SpecialAction.DragNDropStart]: (data: SpecialDragNDropStartAction) => {
                    const file = data.dragSource;
                    if (!selectionUtil.isSelected(file)) {
                        clearSelection();
                        if (FileHelper.isSelectable(file)) {
                            selectFiles([file.id]);
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
                        actionName:
                            data.dropEffect === 'copy'
                                ? ChonkyActions.DuplicateFilesTo.name
                                : ChonkyActions.MoveFilesTo.name,
                        target: data.dropTarget,
                        files: droppedFiles,
                    });
                },
            } as { [actionName in SpecialAction]: (data: SpecialActionData) => void }),
        specialActionHandlerMapDeps
    );
    return specialActionHandlerMap;
};
