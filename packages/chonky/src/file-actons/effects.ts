import { reduxActions } from '../redux/reducers';
import {
    getIsFileSelected,
    getSelectedFiles,
    selectLastClickIndex,
    selectParentFolder,
    selectSelectionSize,
} from '../redux/selectors';
import { thunkDispatchFileAction } from '../redux/thunks/file-action-dispatchers.thunks';
import { ChonkyActions } from '../util/file-actions-definitions';
import { FileHelper } from '../util/file-helper';
import { Logger } from '../util/logger';
import { FileActionEffect } from './actions.types';
import { NewChonkyActions } from './definitions';

export const mouseClickFileEffect: FileActionEffect<typeof NewChonkyActions.MouseClickFile> = ({
    payload,
    dispatch,
    getState,
}) => {
    if (payload.clickType === 'double') {
        if (FileHelper.isOpenable(payload.file)) {
            dispatch(
                thunkDispatchFileAction({
                    actionId: NewChonkyActions.OpenFiles.id,
                    target: payload.file,

                    // To simulate Windows Explorer and Nautilus behaviour,
                    // a double click on a file only opens that file even if
                    // there is a selection.
                    files: [payload.file],
                })
            );
        }
    } else {
        // We're dealing with a single click
        if (FileHelper.isSelectable(payload.file)) {
            if (payload.ctrlKey) {
                // Multiple selection
                dispatch(
                    reduxActions.toggleSelection({
                        fileId: payload.file.id,
                        exclusive: false,
                    })
                );
                dispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
            } else if (payload.shiftKey) {
                // Range selection
                const lastClickIndex = selectLastClickIndex(getState());
                if (typeof lastClickIndex === 'number') {
                    // We have the index of the previous click
                    let rangeStart = lastClickIndex;
                    let rangeEnd = payload.fileDisplayIndex;
                    if (rangeStart > rangeEnd) {
                        [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
                    }

                    dispatch(reduxActions.selectRange({ rangeStart, rangeEnd }));
                } else {
                    // Since we can't do a range selection, do a
                    // multiple selection
                    dispatch(
                        reduxActions.toggleSelection({
                            fileId: payload.file.id,
                            exclusive: false,
                        })
                    );
                    dispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
                }
            } else {
                // Exclusive selection
                dispatch(
                    reduxActions.toggleSelection({
                        fileId: payload.file.id,
                        exclusive: true,
                    })
                );
                dispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
            }
        } else {
            if (!payload.ctrlKey) dispatch(reduxActions.clearSelection());
            dispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
        }
    }
    return false;
};
NewChonkyActions.MouseClickFile.effect = mouseClickFileEffect;

export const keyboardClickFileEffect: FileActionEffect<typeof NewChonkyActions.KeyboardClickFile> = ({
    payload,
    dispatch,
    getState,
}) => {
    dispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
    if (payload.enterKey) {
        // We only dispatch the Open Files action here when the selection is
        // empty. Otherwise, `Enter` key presses are handled by the
        // hotkey manager for the Open Files action.
        if (selectSelectionSize(getState()) === 0) {
            dispatch(
                thunkDispatchFileAction({
                    actionId: ChonkyActions.OpenFiles.id,
                    target: payload.file,
                    files: [payload.file],
                })
            );
        }
    } else if (payload.spaceKey && FileHelper.isSelectable(payload.file)) {
        dispatch(
            reduxActions.toggleSelection({
                fileId: payload.file.id,
                exclusive: payload.ctrlKey,
            })
        );
    }
    return false;
};
NewChonkyActions.KeyboardClickFile.effect = keyboardClickFileEffect;

export const startDragNDropEffect: FileActionEffect<typeof NewChonkyActions.StartDragNDrop> = ({
    payload,
    dispatch,
    getState,
}) => {
    const file = payload.dragSource;
    if (!getIsFileSelected(getState(), file)) {
        if (FileHelper.isSelectable(file)) {
            dispatch(
                reduxActions.selectFiles({
                    fileIds: [file.id],
                    reset: true,
                })
            );
        }
    }
    return false;
};
NewChonkyActions.StartDragNDrop.effect = startDragNDropEffect;

export const endDragNDropEffect: FileActionEffect<typeof NewChonkyActions.EndDragNDrop> = ({
    payload,
    dispatch,
    getState,
}) => {
    if (getIsFileSelected(getState(), payload.dropTarget)) {
        // Can't drop a selection into itself
        return;
    }

    const selectedFiles = getSelectedFiles(getState(), FileHelper.isDraggable);
    const droppedFiles =
        selectedFiles.length > 0 ? selectedFiles : [payload.dragSource];
    dispatch(
        thunkDispatchFileAction({
            actionId:
                payload.dropEffect === 'copy'
                    ? ChonkyActions.DuplicateFilesTo.id
                    : ChonkyActions.MoveFilesTo.id,
            target: payload.dropTarget,
            files: droppedFiles,
        })
    );
    return false;
};
NewChonkyActions.EndDragNDrop.effect = endDragNDropEffect;

export const openParentFolderEffect: FileActionEffect<typeof NewChonkyActions.OpenFiles> = ({
    dispatch,
    getState,
}) => {
    const parentFolder = selectParentFolder(getState());
    if (FileHelper.isOpenable(parentFolder)) {
        dispatch(
            thunkDispatchFileAction({
                actionId: NewChonkyActions.OpenFiles.id,
                target: parentFolder,
                files: [parentFolder],
            })
        );
    } else {
        Logger.warn(
            'Open parent folder effect was triggered  even though the parent folder' +
                ' is not openable. This indicates a bug in presentation components.'
        );
    }
    return false;
};
