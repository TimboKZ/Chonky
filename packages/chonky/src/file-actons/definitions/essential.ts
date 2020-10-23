import { Nullable } from 'tsdef';

import { reduxActions } from '../../redux/reducers';
import {
    getIsFileSelected,
    getSelectedFiles,
    selectLastClickIndex,
    selectParentFolder,
    selectSelectionSize,
} from '../../redux/selectors';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import { defineFileAction } from '../../util/helpers';
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
export const MouseClickFile = defineFileAction(
    {
        id: 'mouse_click_file',
        __payloadType: {} as MouseClickFilePayload,
    } as const,
    ({ payload, reduxDispatch, getReduxState }) => {
        if (payload.clickType === 'double') {
            if (FileHelper.isOpenable(payload.file)) {
                reduxDispatch(
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
                    reduxDispatch(
                        reduxActions.toggleSelection({
                            fileId: payload.file.id,
                            exclusive: false,
                        })
                    );
                    reduxDispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
                } else if (payload.shiftKey) {
                    // Range selection
                    const lastClickIndex = selectLastClickIndex(getReduxState());
                    if (typeof lastClickIndex === 'number') {
                        // We have the index of the previous click
                        let rangeStart = lastClickIndex;
                        let rangeEnd = payload.fileDisplayIndex;
                        if (rangeStart > rangeEnd) {
                            [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
                        }

                        reduxDispatch(reduxActions.selectRange({ rangeStart, rangeEnd }));
                    } else {
                        // Since we can't do a range selection, do a
                        // multiple selection
                        reduxDispatch(
                            reduxActions.toggleSelection({
                                fileId: payload.file.id,
                                exclusive: false,
                            })
                        );
                        reduxDispatch(
                            reduxActions.setLastClickIndex(payload.fileDisplayIndex)
                        );
                    }
                } else {
                    // Exclusive selection
                    reduxDispatch(
                        reduxActions.toggleSelection({
                            fileId: payload.file.id,
                            exclusive: true,
                        })
                    );
                    reduxDispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
                }
            } else {
                if (!payload.ctrlKey) reduxDispatch(reduxActions.clearSelection());
                reduxDispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
            }
        }
        return false;
    }
);

export interface KeyboardClickFilePayload {
    file: FileData;
    fileDisplayIndex: number;
    enterKey: boolean;
    spaceKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}
export const KeyboardClickFile = defineFileAction(
    {
        id: 'keyboard_click_file',
        __payloadType: {} as KeyboardClickFilePayload,
    } as const,
    ({ payload, reduxDispatch, getReduxState }) => {
        reduxDispatch(reduxActions.setLastClickIndex(payload.fileDisplayIndex));
        if (payload.enterKey) {
            // We only dispatch the Open Files action here when the selection is
            // empty. Otherwise, `Enter` key presses are handled by the
            // hotkey manager for the Open Files action.
            if (selectSelectionSize(getReduxState()) === 0) {
                reduxDispatch(
                    thunkRequestFileAction(ChonkyActions.OpenFiles, {
                        targetFile: payload.file,
                        files: [payload.file],
                    })
                );
            }
        } else if (payload.spaceKey && FileHelper.isSelectable(payload.file)) {
            reduxDispatch(
                reduxActions.toggleSelection({
                    fileId: payload.file.id,
                    exclusive: payload.ctrlKey,
                })
            );
        }
        return false;
    }
);

export interface StartDragNDropPayload {
    dragSource: FileData;
}
export const StartDragNDrop = defineFileAction(
    {
        id: 'start_drag_n_drop',
        __payloadType: {} as StartDragNDropPayload,
    } as const,
    ({ payload, reduxDispatch, getReduxState }) => {
        const file = payload.dragSource;
        if (!getIsFileSelected(getReduxState(), file)) {
            if (FileHelper.isSelectable(file)) {
                reduxDispatch(
                    reduxActions.selectFiles({
                        fileIds: [file.id],
                        reset: true,
                    })
                );
            }
        }
        return false;
    }
);

export interface EndDragNDropPayload {
    sourceInstanceId: string;
    source: Nullable<FileData>;
    draggedFile: FileData;
    destination: FileData;
    copy: boolean;
}
export const EndDragNDrop = defineFileAction(
    {
        id: 'end_drag_n_drop',
        __payloadType: {} as EndDragNDropPayload,
    } as const,
    ({ payload, reduxDispatch, getReduxState }) => {
        if (getIsFileSelected(getReduxState(), payload.destination)) {
            // Can't drop a selection into itself
            return;
        }

        const selectedFiles = getSelectedFiles(getReduxState(), FileHelper.isDraggable);
        const droppedFiles =
            selectedFiles.length > 0 ? selectedFiles : [payload.draggedFile];
        reduxDispatch(
            thunkRequestFileAction(ChonkyActions.MoveFiles, {
                ...payload,
                files: droppedFiles,
            })
        );
        return false;
    }
);

export const MoveFiles = defineFileAction({
    id: 'move_files',
    __payloadType: {} as MoveFilesPayload,
} as const);

export type MoveFilesPayload = EndDragNDropPayload & { files: FileData[] };

export const ChangeSelection = defineFileAction({
    id: 'change_selection',
    __payloadType: {} as ChangeSelectionPayload,
} as const);

export type ChangeSelectionPayload = { selection: Set<string> };

export const OpenFiles = defineFileAction({
    id: 'open_files',
    __payloadType: {} as OpenFilesPayload,
} as const);

export interface OpenFilesPayload {
    targetFile?: FileData;
    files: FileData[];
}

export const OpenParentFolder = defineFileAction(
    {
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
    ({ reduxDispatch, getReduxState }) => {
        const parentFolder = selectParentFolder(getReduxState());
        if (FileHelper.isOpenable(parentFolder)) {
            reduxDispatch(
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
    }
);
