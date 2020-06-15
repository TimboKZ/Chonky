import { useCallback, useMemo } from 'react';

import {
    FileData,
    InternalFileActionDispatcher,
    InternalSpecialActionDispatcher,
} from '../typedef';
import { ChonkyActions } from './file-actions';
import { Logger } from './logger';

export enum SpecialAction {
    MouseClickFile = 'mouse_click_file',
    KeyboardClickFile = 'keyboard_click_file',

    DragNDropFiles = 'drag_n_drop_files',
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

export interface SpecialDndDropAction {
    actionName: SpecialAction.DragNDropFiles;
    dragSource: FileData;
    dropTarget: FileData;
    dropEffect: 'move' | 'copy';
}

export type SpecialActionData =
    | SpecialFileMouseClickAction
    | SpecialFileKeyboardClickAction
    | SpecialDndDropAction;

/**
 * Returns a dispatch method meant to be used by child components. This dispatch
 * method is meant for "special" internal actions. It takes a special action, and
 * transforms it into a "file action" that can be handled by the user.
 */
export const useSpecialActionDispatcher = (
    selectFiles: (fileIds: string[]) => void,
    toggleSelection: (fileId: string) => void,
    clearSelection: () => void,
    dispatchFileAction: InternalFileActionDispatcher
): InternalSpecialActionDispatcher => {
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
                    if (data.clickType === 'double') {
                        dispatchFileAction({
                            actionName: ChonkyActions.OpenFiles.name,
                            target: data.file,
                            // TODO: Replace with selection
                            files: [data.file],
                        });
                    } else {
                        if (data.ctrlKey) {
                            toggleSelection(data.file.id);
                        } else {
                            selectFiles([data.file.id]);
                        }
                        // TODO: Handle range selections.
                    }
                },
                [SpecialAction.KeyboardClickFile]: (
                    data: SpecialFileKeyboardClickAction
                ) => {
                    if (data.enterKey) {
                        dispatchFileAction({
                            actionName: ChonkyActions.OpenFiles.name,
                            target: data.file,
                            // TODO: Replace with selection
                            files: [data.file],
                        });
                    } else if (data.spaceKey) {
                        if (data.ctrlKey) {
                            selectFiles([data.file.id]);
                        } else {
                            toggleSelection(data.file.id);
                        }
                        // TODO: Handle range selections.
                    }
                },
                [SpecialAction.DragNDropFiles]: (data: SpecialDndDropAction) => {
                    dispatchFileAction({
                        actionName:
                            data.dropEffect === 'copy'
                                ? ChonkyActions.DuplicateFilesTo.name
                                : ChonkyActions.MoveFilesTo.name,
                        target: data.dropTarget,
                        // TODO: Replace with selection
                        files: [data.dragSource],
                    });
                },
            } as { [actionName in SpecialAction]: (data: SpecialActionData) => void }),
        specialActionHandlerMapDeps
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
