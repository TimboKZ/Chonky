import { reduxActions } from '../redux/reducers';
import {
    getFileData,
    getIsFileSelected,
    getSelectedFiles,
    selectLastClickIndex,
    selectParentFolder,
    selectSelectionSize,
} from '../redux/selectors';
import { thunkRequestFileAction } from '../redux/thunks/dispatchers.thunks';
import {
    ChangeSelectionPayload,
    EndDragNDropPayload,
    KeyboardClickFilePayload,
    MouseClickFilePayload,
    MoveFilesPayload,
    OpenFileContextMenuPayload,
    OpenFilesPayload,
    StartDragNDropPayload,
} from '../types/action-payloads.types';
import { ChonkyIconName } from '../types/icons.types';
import { FileHelper } from '../util/file-helper';
import { defineFileAction } from '../util/helpers';
import { Logger } from '../util/logger';
import { ChonkyActions } from './index';

export const EssentialActions = {
    MouseClickFile: defineFileAction(
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
                        reduxDispatch(
                            reduxActions.setLastClickIndex(payload.fileDisplayIndex)
                        );
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

                            reduxDispatch(
                                reduxActions.selectRange({ rangeStart, rangeEnd })
                            );
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
                        reduxDispatch(
                            reduxActions.setLastClickIndex(payload.fileDisplayIndex)
                        );
                    }
                } else {
                    if (!payload.ctrlKey) reduxDispatch(reduxActions.clearSelection());
                    reduxDispatch(
                        reduxActions.setLastClickIndex(payload.fileDisplayIndex)
                    );
                }
            }
        }
    ),
    KeyboardClickFile: defineFileAction(
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
        }
    ),
    StartDragNDrop: defineFileAction(
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
        }
    ),
    EndDragNDrop: defineFileAction(
        {
            id: 'end_drag_n_drop',
            __payloadType: {} as EndDragNDropPayload,
        } as const,
        ({ payload, reduxDispatch, getReduxState }) => {
            if (getIsFileSelected(getReduxState(), payload.destination)) {
                // Can't drop a selection into itself
                return;
            }

            const selectedFiles = getSelectedFiles(
                getReduxState(),
                FileHelper.isDraggable
            );
            const droppedFiles =
                selectedFiles.length > 0 ? selectedFiles : [payload.draggedFile];
            reduxDispatch(
                thunkRequestFileAction(ChonkyActions.MoveFiles, {
                    ...payload,
                    files: droppedFiles,
                })
            );
        }
    ),
    MoveFiles: defineFileAction({
        id: 'move_files',
        __payloadType: {} as MoveFilesPayload,
    } as const),
    ChangeSelection: defineFileAction({
        id: 'change_selection',
        __payloadType: {} as ChangeSelectionPayload,
    } as const),
    OpenFiles: defineFileAction({
        id: 'open_files',
        __payloadType: {} as OpenFilesPayload,
    } as const),
    OpenParentFolder: defineFileAction(
        {
            id: 'open_parent_folder',
            hotkeys: ['backspace'],
            button: {
                name: 'Go up a directory',
                toolbar: true,
                contextMenu: false,
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
        }
    ),
    OpenFileContextMenu: defineFileAction(
        {
            id: 'open_file_context_menu',
            __payloadType: {} as OpenFileContextMenuPayload,
        } as const,
        ({ payload, reduxDispatch, getReduxState }) => {
            // TODO: Check if the context menu component is actually enabled. There is a
            //  chance it doesn't matter if it is enabled or not - if it is not mounted,
            //  the action will simply have no effect. It also allows users to provide
            //  their own components - however, users could also flip the "context menu
            //  component mounted" switch...
            const triggerFile = getFileData(getReduxState(), payload.triggerFileId);
            if (triggerFile) {
                const fileSelected = getIsFileSelected(getReduxState(), triggerFile);
                if (!fileSelected) {
                    // If file is selected, we leave the selection as is. If it is not
                    // selected, it means user right clicked the file with no selection.
                    // We simulate the Windows Explorer/Nautilus behaviour of moving
                    // selection to this file.
                    if (FileHelper.isSelectable(triggerFile)) {
                        reduxDispatch(
                            reduxActions.selectFiles({
                                fileIds: [payload.triggerFileId],
                                reset: true,
                            })
                        );
                    } else {
                        reduxDispatch(reduxActions.clearSelection());
                    }
                }
            }

            reduxDispatch(
                reduxActions.showContextMenu({
                    triggerFileId: payload.triggerFileId,
                    mouseX: payload.clientX - 2,
                    mouseY: payload.clientY - 4,
                })
            );
        }
    ),
};
