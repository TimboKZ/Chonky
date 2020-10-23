import { Undefinable } from 'tsdef';

import { FileAction, FileActionData } from '../../types/file-actions.types';
import {
    SpecialAction,
    SpecialActionData,
    SpecialActionHandlerMap,
    SpecialDragNDropEndAction,
    SpecialDragNDropStartAction,
    SpecialFileKeyboardClickAction,
    SpecialFileMouseClickAction,
    SpecialOpenFolderChainFolderAction,
} from '../../types/special-actions.types';
import { ChonkyActions } from '../../util/file-actions-definitions';
import { FileHelper } from '../../util/file-helper';
import { Logger } from '../../util/logger';
import { reduxActions, RootState } from '../reducers';
import {
    getIsFileSelected,
    getSelectedFiles,
    getSelectedFilesForAction,
    selectFileActionMap,
} from '../selectors';
import { AppThunk } from '../store';
import {
    thunkActivateSortAction,
    thunkApplySelectionTransform,
    thunkToggleOption,
} from './file-actions.thunks';

/**
 * Thunk that dispatches actions to the external (user-provided) action handler.
 */
export const thunkDispatchFileAction = (actionData: FileActionData): AppThunk => (
    dispatch,
    getState
) => {
    Logger.debug(`FILE ACTION DISPATCH:`, actionData);
    const state = getState();
    const { actionId } = actionData;

    const action = selectFileActionMap(state)[actionId];
    if (action) {
        if (state.externalFileActionHandler) {
            Promise.resolve(
                state.externalFileActionHandler(action, actionData)
            ).catch((error) =>
                Logger.error(
                    `User-defined "onAction" handler threw an error: ${error.message}`
                )
            );
        }
    } else {
        Logger.error(
            `Internal components dispatched a "${actionId}" file action, ` +
                `but such action was not registered.`
        );
    }
};

/**
 * Thunk that is used by internal components (and potentially the user) to "request"
 * actions. When action is requested, Chonky "prepares" the action data by extracting it
 * from Redux state. Once action data is ready, Chonky executes some side effect and/or
 * dispatches the action to the external action handler.
 */
export const thunkRequestFileAction = (fileActionId: string): AppThunk => (
    dispatch,
    getState
) => {
    Logger.debug(`FILE ACTION REQUEST:`, fileActionId);
    const state = getState();

    const action: Undefinable<FileAction> = selectFileActionMap(state)[fileActionId];
    if (!action) {
        Logger.warn(
            `Internal components requested the "${fileActionId}" file ` +
                `action, but such action was not registered.`
        );
        return;
    }

    // Determine files for the action if action requires selection
    const selectedFilesForAction = getSelectedFilesForAction(state, action.id);

    if (
        action.requiresSelection &&
        (!selectedFilesForAction || selectedFilesForAction.length === 0)
    ) {
        Logger.warn(
            `Internal components requested the "${fileActionId}" file ` +
                `action, but the selection for this action was empty. This ` +
                `might a bug in the code of the presentational components.`
        );
        return;
    }

    const actionData: FileActionData = {
        actionId: action.id,
        target: undefined,
        files: selectedFilesForAction,
    };

    // === Dispatch a normal action, as usual
    dispatch(thunkDispatchFileAction(actionData));

    // === Update sort state if necessary
    const sortKeySelector = action.sortKeySelector;
    if (sortKeySelector) dispatch(thunkActivateSortAction(action.id));

    // === Update file view state if necessary
    const fileViewConfig = action.fileViewConfig;
    if (fileViewConfig) dispatch(reduxActions.setFileViewConfig(fileViewConfig));

    // === Update option state if necessary
    const option = action.option;
    if (option) dispatch(thunkToggleOption(option.id));

    // === Apply selection transform if necessary
    const selectionTransform = action.selectionTransform;
    if (selectionTransform) dispatch(thunkApplySelectionTransform(action));

    //
    // === Dispatch a special action if file action defines it
    const specialActionId = action.specialActionToDispatch;
    if (specialActionId) {
        // We can only dispatch "simple" special actions, i.e. special
        // actions that do not require additional parameters.
        switch (specialActionId) {
            case SpecialAction.OpenParentFolder:
                thunkDispatchSpecialAction({ actionId: specialActionId });
                break;
            default:
                Logger.warn(
                    `File action "${action.id}" tried to dispatch a ` +
                        `special action "${specialActionId}", but that ` +
                        `special action was not marked as simple. File ` +
                        `actions can only trigger simple special actions.`
                );
        }
    }
};

export const thunkDispatchSpecialAction = (actionData: SpecialActionData): AppThunk => (
    dispatch,
    getState
) => {
    Logger.debug(`SPECIAL ACTION REQUEST:`, actionData);
    const state = getState();
    const { actionId } = actionData;
    const handler = getSpecialHandler(dispatch, state)[actionId];
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
};

export const getSpecialHandler = (dispatch: any, state: RootState) => {
    const lastClickDisplayIndexRef: any = {};
    const parentFolderRef: any = {};
    const selectionSizeRef: any = {};

    return {
        [SpecialAction.MouseClickFile]: (data: SpecialFileMouseClickAction) => {
            if (data.clickType === 'double') {
                if (FileHelper.isOpenable(data.file)) {
                    dispatch(
                        thunkDispatchFileAction({
                            actionId: ChonkyActions.OpenFiles.id,
                            target: data.file,

                            // To simulate Windows Explorer and Nautilus behaviour,
                            // a double click on a file only opens that file even if
                            // there is a selection.
                            files: [data.file],
                        })
                    );
                }
            } else {
                // We're dealing with a single click
                if (FileHelper.isSelectable(data.file)) {
                    if (data.ctrlKey) {
                        // Multiple selection
                        dispatch(
                            reduxActions.toggleSelection({
                                fileId: data.file.id,
                                exclusive: false,
                            })
                        );
                        lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                    } else if (data.shiftKey) {
                        // Range selection
                        if (typeof lastClickDisplayIndexRef.current === 'number') {
                            // We have the index of the previous click
                            let rangeStart = lastClickDisplayIndexRef.current;
                            let rangeEnd = data.fileDisplayIndex;
                            if (rangeStart > rangeEnd) {
                                [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
                            }

                            dispatch(
                                reduxActions.selectRange({ rangeStart, rangeEnd })
                            );
                        } else {
                            // Since we can't do a range selection, do a
                            // multiple selection
                            dispatch(
                                reduxActions.toggleSelection({
                                    fileId: data.file.id,
                                    exclusive: false,
                                })
                            );
                            lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                        }
                    } else {
                        // Exclusive selection
                        dispatch(
                            reduxActions.toggleSelection({
                                fileId: data.file.id,
                                exclusive: true,
                            })
                        );
                        lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                    }
                } else {
                    if (!data.ctrlKey) dispatch(reduxActions.clearSelection());
                    lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                }
            }
        },
        [SpecialAction.KeyboardClickFile]: (data: SpecialFileKeyboardClickAction) => {
            lastClickDisplayIndexRef.current = data.fileDisplayIndex;
            if (data.enterKey) {
                // We only dispatch the Open Files action here when the selection is
                // empty. Otherwise, `Enter` key presses are handled by the
                // hotkey manager for the Open Files action.
                if (selectionSizeRef.current === 0) {
                    dispatch(
                        thunkDispatchFileAction({
                            actionId: ChonkyActions.OpenFiles.id,
                            target: data.file,
                            files: [data.file],
                        })
                    );
                }
            } else if (data.spaceKey && FileHelper.isSelectable(data.file)) {
                dispatch(
                    reduxActions.toggleSelection({
                        fileId: data.file.id,
                        exclusive: data.ctrlKey,
                    })
                );
            }
        },
        [SpecialAction.OpenParentFolder]: () => {
            if (FileHelper.isOpenable(parentFolderRef.current)) {
                dispatch(
                    thunkDispatchFileAction({
                        actionId: ChonkyActions.OpenFiles.id,
                        target: parentFolderRef.current,
                        files: [parentFolderRef.current],
                    })
                );
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
            dispatch(
                thunkDispatchFileAction({
                    actionId: ChonkyActions.OpenFiles.id,
                    target: data.file,
                    files: [data.file],
                })
            );
        },
        [SpecialAction.DragNDropStart]: (data: SpecialDragNDropStartAction) => {
            const file = data.dragSource;
            if (!getIsFileSelected(state, file)) {
                dispatch(reduxActions.clearSelection());
                if (FileHelper.isSelectable(file)) {
                    reduxActions.selectFiles({
                        fileIds: [file.id],
                        reset: true,
                    });
                }
            }
        },
        [SpecialAction.DragNDropEnd]: (data: SpecialDragNDropEndAction) => {
            if (getIsFileSelected(state, data.dropTarget)) {
                // Can't drop a selection into itself
                return;
            }

            const selectedFiles = getSelectedFiles(state, FileHelper.isDraggable);
            const droppedFiles =
                selectedFiles.length > 0 ? selectedFiles : [data.dragSource];
            dispatch(
                thunkDispatchFileAction({
                    actionId:
                        data.dropEffect === 'copy'
                            ? ChonkyActions.DuplicateFilesTo.id
                            : ChonkyActions.MoveFilesTo.id,
                    target: data.dropTarget,
                    files: droppedFiles,
                })
            );
        },
    } as SpecialActionHandlerMap;
};
