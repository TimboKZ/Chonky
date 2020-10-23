import { Nullable } from 'tsdef';

import { reduxActions } from '../../redux/reducers';
import {
    getIsFileSelected,
    getSelectedFiles,
    selectLastClickIndex,
    selectParentFolder,
    selectSelectionSize,
} from '../../redux/selectors';
import { requestFileAction } from '../../redux/thunks/file-action-dispatchers.thunks';
import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import { defineActionWithEffect, defineSimpleAction } from '../../util/helpers';
import { Logger } from '../../util/logger';
import { ChonkyActions } from './index';

export interface MouseClickFilePayload {
    file: FileData;
    fileDisplayIndex: number;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    clickType: 'single' | 'double';
}
export const MouseClickFile = defineActionWithEffect({
    definition: {
        id: 'mouse_click_file',
        __payloadType: {} as MouseClickFilePayload,
    } as const,
    effect: ({ payload, dispatch, getState }) => {
        if (payload.clickType === 'double') {
            if (FileHelper.isOpenable(payload.file)) {
                dispatch(
                    requestFileAction(ChonkyActions.OpenFiles, {
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
                        dispatch(
                            reduxActions.setLastClickIndex(payload.fileDisplayIndex)
                        );
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
    },
});

export interface KeyboardClickFilePayload {
    file: FileData;
    fileDisplayIndex: number;
    enterKey: boolean;
    spaceKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}
export const KeyboardClickFile = defineActionWithEffect({
    definition: {
        id: 'keyboard_click_file',
        __payloadType: {} as KeyboardClickFilePayload,
    } as const,
    effect: ({ payload, dispatch, getState }) => {
        dispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
        if (payload.enterKey) {
            // We only dispatch the Open Files action here when the selection is
            // empty. Otherwise, `Enter` key presses are handled by the
            // hotkey manager for the Open Files action.
            if (selectSelectionSize(getState()) === 0) {
                dispatch(
                    requestFileAction(ChonkyActions.OpenFiles, {
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
    },
});

export interface StartDragNDropPayload {
    dragSource: FileData;
}
export const StartDragNDrop = defineActionWithEffect({
    definition: {
        id: 'start_drag_n_drop',
        __payloadType: {} as StartDragNDropPayload,
    } as const,
    effect: ({ payload, dispatch, getState }) => {
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
    },
});

export interface EndDragNDropPayload {
    sourceInstanceId: string;
    source: Nullable<FileData>;
    draggedFile: FileData;
    destination: FileData;
    copy: boolean;
}
export const EndDragNDrop = defineActionWithEffect({
    definition: {
        id: 'end_drag_n_drop',
        __payloadType: {} as EndDragNDropPayload,
    } as const,
    effect: ({ payload, dispatch, getState }) => {
        if (getIsFileSelected(getState(), payload.destination)) {
            // Can't drop a selection into itself
            return;
        }

        const selectedFiles = getSelectedFiles(getState(), FileHelper.isDraggable);
        const droppedFiles =
            selectedFiles.length > 0 ? selectedFiles : [payload.draggedFile];
        dispatch(
            requestFileAction(ChonkyActions.MoveFiles, {
                ...payload,
                files: droppedFiles,
            })
        );
        return false;
    },
});

export const MoveFiles = defineSimpleAction({
    id: 'move_files',
    __payloadType: {} as MoveFilesPayload,
} as const);

export type MoveFilesPayload = EndDragNDropPayload & { files: FileData[] };

export const ChangeSelection = defineSimpleAction({
    id: 'change_selection',
    __payloadType: {} as ChangeSelectionPayload,
} as const);

export type ChangeSelectionPayload = { selection: Set<string> };

export const OpenFiles = defineSimpleAction({
    id: 'open_files',
    __payloadType: {} as OpenFilesPayload,
} as const);

export interface OpenFilesPayload {
    targetFile?: FileData;
    files: FileData[];
}

export const OpenParentFolder = defineActionWithEffect({
    definition: {
        id: 'open_parent_folder',
        hotkeys: ['backspace'],
        button: {
            name: 'Go up a directory',
            toolbar: true,
            contextMenu: true,
            icon: ChonkyIconName.openParentFolder,
            iconOnly: true,
        },
    } as const,
    effect: ({ dispatch, getState }) => {
        const parentFolder = selectParentFolder(getState());
        if (FileHelper.isOpenable(parentFolder)) {
            dispatch(
                requestFileAction(ChonkyActions.OpenFiles, {
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
    },
});
