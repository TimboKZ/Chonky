import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Nullable } from 'tsdef';

import { dispatchFileActionState } from '../recoil/file-actions.recoil';
import { filesState, parentFolderState } from '../recoil/files.recoil';
import { searchBarVisibleState } from '../recoil/search.recoil';
import { selectedFilesState } from '../recoil/selection.recoil';
import { dispatchSpecialActionState } from '../recoil/special-actions.recoil';
import { FileArray } from '../types/files.types';
import { FileSelection, SelectionModifiers } from '../types/selection.types';
import {
    SpecialAction,
    SpecialActionData,
    SpecialActionHandlerMap,
    SpecialDragNDropEndAction,
    SpecialDragNDropStartAction,
    SpecialFileKeyboardClickAction,
    SpecialFileMouseClickAction,
    SpecialOpenFolderChainFolderAction,
} from '../types/special-actions.types';
import { ChonkyActions } from './file-actions-definitions';
import { FileHelper } from './file-helper';
import { useInstanceVariable } from './hooks-helpers';
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
    selectionModifiers: SelectionModifiers
) => {
    // Create the special action handler map
    const specialActionHandlerMap = useSpecialFileActionHandlerMap(
        selectionUtil,
        selectionModifiers
    );

    // Process special actions using the handlers from the map
    const dispatchSpecialAction = useCallback(
        (actionData: SpecialActionData) => {
            Logger.debug(`SPECIAL ACTION REQUEST:`, actionData);
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

    const setRecoilDispatchSpecialAction = useSetRecoilState(
        dispatchSpecialActionState
    );
    useEffect(() => {
        setRecoilDispatchSpecialAction(() => dispatchSpecialAction);
    }, [dispatchSpecialAction, setRecoilDispatchSpecialAction]);
};

export const useSpecialFileActionHandlerMap = (
    selectionUtil: SelectionUtil,
    selectionModifiers: SelectionModifiers
) => {
    // Instance variables based on Recoil state
    const _recoilFiles = useRecoilValue(filesState);
    const filesRef = useInstanceVariable(_recoilFiles);
    const parentFolderRef = useInstanceVariable(useRecoilValue(parentFolderState));
    const selectedFilesRef = useInstanceVariable(useRecoilValue(selectedFilesState));
    const dispatchFileActionRef = useInstanceVariable(
        useRecoilValue(dispatchFileActionState)
    );
    const setSearchBarVisible = useSetRecoilState(searchBarVisibleState);

    // Internal instance variables used by special actions
    const lastClickDisplayIndexRef = useRef<Nullable<number>>(null);
    useEffect(() => {
        // We zero out the last click whenever files update
        lastClickDisplayIndexRef.current = null;
    }, [_recoilFiles]);

    // Define handlers in a map
    const specialActionHandlerMap = useMemo<SpecialActionHandlerMap>(() => {
        return {
            [SpecialAction.MouseClickFile]: (data: SpecialFileMouseClickAction) => {
                if (data.clickType === 'double') {
                    if (FileHelper.isOpenable(data.file)) {
                        dispatchFileActionRef.current({
                            actionId: ChonkyActions.OpenFiles.id,
                            target: data.file,

                            // To simulate Windows Explorer and Nautilus behaviour,
                            // a double click on a file only opens that file even if
                            // there is a selection.
                            files: [data.file],
                        });
                    }
                } else {
                    // We're dealing with a single click
                    if (FileHelper.isSelectable(data.file)) {
                        if (data.ctrlKey) {
                            // Multiple selection
                            selectionModifiers.toggleSelection(data.file.id, false);
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

                                const fileIds = filesRef.current
                                    .slice(rangeStart, rangeEnd + 1)
                                    .filter((file) => FileHelper.isSelectable(file))
                                    .map((file) => file!.id);
                                selectionModifiers.selectFiles(fileIds, true);
                            } else {
                                // Since we can't do a range selection, do a
                                // multiple selection
                                selectionModifiers.toggleSelection(data.file.id, false);
                                lastClickDisplayIndexRef.current =
                                    data.fileDisplayIndex;
                            }
                        } else {
                            // Exclusive selection
                            selectionModifiers.toggleSelection(data.file.id, true);
                            lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                        }
                    } else {
                        if (!data.ctrlKey) selectionModifiers.clearSelection();
                        lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                    }
                }
            },
            [SpecialAction.KeyboardClickFile]: (
                data: SpecialFileKeyboardClickAction
            ) => {
                lastClickDisplayIndexRef.current = data.fileDisplayIndex;
                if (data.enterKey) {
                    // We only dispatch the Open Files action here when the selection is
                    // empty. Otherwise, `Enter` key presses are handled by the
                    // hotkey manager for the Open Files action.
                    if (selectedFilesRef.current.length === 0) {
                        dispatchFileActionRef.current({
                            actionId: ChonkyActions.OpenFiles.id,
                            target: data.file,
                            files: [data.file],
                        });
                    }
                } else if (data.spaceKey && FileHelper.isSelectable(data.file)) {
                    selectionModifiers.toggleSelection(data.file.id, data.ctrlKey);
                }
            },
            [SpecialAction.OpenParentFolder]: () => {
                if (FileHelper.isOpenable(parentFolderRef.current)) {
                    dispatchFileActionRef.current({
                        actionId: ChonkyActions.OpenFiles.id,
                        target: parentFolderRef.current,
                        files: [parentFolderRef.current],
                    });
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
                dispatchFileActionRef.current({
                    actionId: ChonkyActions.OpenFiles.id,
                    target: data.file,
                    files: [data.file],
                });
            },
            [SpecialAction.ToggleSearchBar]: () => {
                setSearchBarVisible((visible: any) => !visible);
            },
            [SpecialAction.SelectAllFiles]: () => {
                const fileIds = filesRef.current
                    .filter((file) => FileHelper.isSelectable(file))
                    .map((file) => file!.id);
                selectionModifiers.selectFiles(fileIds, true);
            },
            [SpecialAction.ClearSelection]: () => {
                selectionModifiers.clearSelection();
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
                dispatchFileActionRef.current({
                    actionId:
                        data.dropEffect === 'copy'
                            ? ChonkyActions.DuplicateFilesTo.id
                            : ChonkyActions.MoveFilesTo.id,
                    target: data.dropTarget,
                    files: droppedFiles,
                });
            },
        } as SpecialActionHandlerMap;
    }, [
        selectionUtil,
        selectionModifiers,
        filesRef,
        parentFolderRef,
        selectedFilesRef,
        dispatchFileActionRef,
        setSearchBarVisible,
    ]);
    return specialActionHandlerMap;
};
