import { useCallback, useMemo } from 'react';

import {
    FileData,
    InternalFileActionDispatcher,
    InternalSpecialActionDispatcher,
} from '../typedef';
import { ChonkyActions } from './file-actions';
import { Logger } from './logger';

export enum SpecialAction {
    ClickFile = 'click_file',

    DragNDropFiles = 'drag_n_drop_files',
}

export interface SpecialClickFileAction {
    actionName: SpecialAction.ClickFile;
    file: FileData;
    clickType: 'single' | 'double';
}

export interface SpecialDndDropAction {
    actionName: SpecialAction.DragNDropFiles;
    dragSource: FileData;
    dropTarget: FileData;
    dropEffect: 'move' | 'copy';
}

export type SpecialActionData = SpecialClickFileAction | SpecialDndDropAction;

/**
 * Returns a dispatch method meant to be used by child components. This dispatch
 * method is meant for "special" internal actions. It takes a special action, and
 * transforms it into a "file action" that can be handled by the user.
 */
export const useSpecialActionDispatcher = (
    dispatchFileAction: InternalFileActionDispatcher
): InternalSpecialActionDispatcher => {
    // Define handlers in a map
    const specialActionHandlerMapDeps = [dispatchFileAction];
    const specialActionHandlerMap = useMemo(
        () => ({
            [SpecialAction.ClickFile]: (actionData: SpecialClickFileAction) => {
                if (actionData.clickType === 'double') {
                    dispatchFileAction({
                        actionName: ChonkyActions.OpenFiles.name,
                        target: actionData.file,
                        // TODO: Replace with selection
                        files: [actionData.file],
                    });
                }
            },
            [SpecialAction.DragNDropFiles]: (actionData: SpecialDndDropAction) => {
                dispatchFileAction({
                    actionName:
                        actionData.dropEffect === 'copy'
                            ? ChonkyActions.DuplicateFilesTo.name
                            : ChonkyActions.MoveFilesTo.name,
                    target: actionData.dropTarget,
                    // TODO: Replace with selection
                    files: [actionData.dragSource],
                });
            },
        }),
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
