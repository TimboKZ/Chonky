import { reduxActions } from '../redux/reducers';
import {
    getIsFileSelected,
    getSelectedFiles,
    selectLastClickIndex,
    selectParentFolder,
    selectSelectionSize,
} from '../redux/selectors';
import { thunkRequestFileAction } from '../redux/thunks/file-action-dispatchers.thunks';
import { FileHelper } from '../util/file-helper';
import { Logger } from '../util/logger';
import { FileActionEffect } from './actions.types';
import { ChonkyActions } from './definitions/index';

export const mouseClickFileEffect: FileActionEffect<typeof ChonkyActions.MouseClickFile> = ({
    payload,
    dispatch,
    getState,
}) => {
    if (payload.clickType === 'double') {
        if (FileHelper.isOpenable(payload.file)) {
            dispatch(
                thunkRequestFileAction(ChonkyActions.OpenFiles, {
                    targetFile: payload.file,

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
ChonkyActions.MouseClickFile.effect = mouseClickFileEffect;

export const keyboardClickFileEffect: FileActionEffect<typeof ChonkyActions.KeyboardClickFile> = ({
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
                thunkRequestFileAction(ChonkyActions.OpenFiles, {
                    targetFile: payload.file,
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
ChonkyActions.KeyboardClickFile.effect = keyboardClickFileEffect;

export const startDragNDropEffect: FileActionEffect<typeof ChonkyActions.StartDragNDrop> = ({
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
ChonkyActions.StartDragNDrop.effect = startDragNDropEffect;

export const endDragNDropEffect: FileActionEffect<typeof ChonkyActions.EndDragNDrop> = ({
    payload,
    dispatch,
    getState,
}) => {
    if (getIsFileSelected(getState(), payload.destination)) {
        // Can't drop a selection into itself
        return;
    }

    const selectedFiles = getSelectedFiles(getState(), FileHelper.isDraggable);
    const droppedFiles =
        selectedFiles.length > 0 ? selectedFiles : [payload.draggedFile];
    dispatch(
        thunkRequestFileAction(ChonkyActions.MoveFiles, {
            ...payload,
            files: droppedFiles,
        })
    );
    return false;
};
ChonkyActions.EndDragNDrop.effect = endDragNDropEffect;

export const openParentFolderEffect: FileActionEffect<typeof ChonkyActions.OpenParentFolder> = ({
    dispatch,
    getState,
}) => {
    const parentFolder = selectParentFolder(getState());
    if (FileHelper.isOpenable(parentFolder)) {
        dispatch(
            thunkRequestFileAction(ChonkyActions.OpenFiles, {
                targetFile: parentFolder,
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
ChonkyActions.OpenParentFolder.effect = openParentFolderEffect;
