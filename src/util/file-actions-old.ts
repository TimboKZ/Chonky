import Promise from 'bluebird';
import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable, Undefinable } from 'tsdef';

import { dispatchFileActionState } from '../recoil/file-actions.recoil';
import { filesState, folderChainState } from '../recoil/files.recoil';
import { searchBarVisibleState } from '../recoil/search.recoil';
import { selectionState } from '../recoil/selection.recoil';
import { dispatchSpecialActionState } from '../recoil/special-actions.recoil';
import {
    FileAction,
    FileActionListener,
    InternalFileActionDispatcher,
} from '../types/file-actions.types';
import { FileData } from '../types/files.types';
import { ChonkyIconName } from '../types/icons.types';
import { SpecialAction } from '../types/special-actions.types';
import { FileHelper } from './file-helper';
import { Logger } from './logger';
import { SelectionHelper } from './selection';
import { isFunction } from './validation';

export const ChonkyActions = {
    // Actions triggered by drag & drop
    MoveFilesTo: {
        id: 'move_files_to',
    },
    DuplicateFilesTo: {
        id: 'duplicate_files_to',
    },

    OpenParentFolder: {
        id: 'open_parent_folder',
        requiresParentFolder: true,
        fileFilter: (file: FileData) => FileHelper.isOpenable(file),
        hotkeys: ['backspace'],
        toolbarButton: {
            name: 'Go up a directory',
            tooltip: 'Go up a directory',
            icon: ChonkyIconName.openParentFolder,
            iconOnly: true,
        },
    },
    OpenFiles: {
        // We don't specify the 'enter' hotkey here because it is handled inside
        // `<ClickableFileEntry>` component.
        id: 'open_files',
        requiresSelection: true,
        fileFilter: FileHelper.isOpenable,
        toolbarButton: {
            name: 'Open selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    },
    ToggleSearch: {
        id: 'toggle_search',
        hotkeys: ['ctrl+f'],
        toolbarButton: {
            name: 'Search',
            icon: ChonkyIconName.search,
            iconOnly: true,
        },

        specialActionToDispatch: SpecialAction.ToggleSearchBar,
    },

    CopyFiles: {
        id: 'copy_files',
        requiresSelection: true,
        toolbarButton: {
            name: 'Copy selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.copy,
        },
    },

    CreateFolder: {
        id: 'create_folder',
        toolbarButton: {
            name: 'Create folder',
            tooltip: 'Create a folder',
            icon: ChonkyIconName.folderCreate,
        },
    },
    UploadFiles: {
        id: 'upload_files',
        toolbarButton: {
            name: 'Upload files',
            tooltip: 'Upload files',
            icon: ChonkyIconName.upload,
        },
    },
    DownloadFiles: {
        id: 'download_files',
        requiresSelection: true,
        toolbarButton: {
            name: 'Download files',
            group: 'Actions',
            tooltip: 'Download files',
            dropdown: true,
            icon: ChonkyIconName.download,
        },
    },
} as const;

export const DefaultFileActions: FileAction[] = [
    ChonkyActions.MoveFilesTo,
    ChonkyActions.DuplicateFilesTo,

    ChonkyActions.OpenParentFolder,
    ChonkyActions.OpenFiles,
    ChonkyActions.ToggleSearch,
];

/**
 * Returns a dispatch method meant to be used by child components. This dispatch method
 * is meant for actions that should be handled directly by the user. If you want to
 * transform the action internally before sending it to the user, use the "special
 * action dispatcher".
 */
export const useFileActionDispatcher = (
    fileActions: FileAction[],
    onFileAction: Nullable<FileActionListener>
): InternalFileActionDispatcher => {
    const actionMap = useMemo(() => {
        const actionMap = {};
        if (Array.isArray(fileActions)) {
            for (const fileAction of fileActions) {
                actionMap[fileAction.id] = fileAction;
            }
        }
        return actionMap;
    }, [fileActions]);

    const dispatchFileAction: InternalFileActionDispatcher = useCallback(
        (actionData) => {
            const { actionId } = actionData;

            const action = actionMap[actionId];
            if (action) {
                if (isFunction(onFileAction)) {
                    Promise.resolve()
                        .then(() => onFileAction(action, actionData))
                        .catch((error) =>
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
        },
        [actionMap, onFileAction]
    );

    return dispatchFileAction;
};

export const useFileActionTrigger = (action: FileAction) => {
    const files = useRecoilValue(filesState);
    const folderChain = useRecoilValue(folderChainState);
    const selection = useRecoilValue(selectionState);
    const searchBarVisible = useRecoilValue(searchBarVisibleState);
    const dispatchFileAction = useRecoilValue(dispatchFileActionState);
    const dispatchSpecialAction = useRecoilValue(dispatchSpecialActionState);

    const parentFolder =
        folderChain && folderChain.length > 1
            ? folderChain[folderChain?.length - 2]
            : null;

    return useMemo(() => {
        let actionSelectionSize: Undefinable<number> = undefined;
        let actionFiles: Undefinable<ReadonlyArray<FileData>> = undefined;
        if (action.requiresSelection) {
            actionSelectionSize = SelectionHelper.getSelectionSize(
                files,
                selection,
                action.fileFilter
            );
            actionFiles = SelectionHelper.getSelectedFiles(
                files,
                selection,
                action.fileFilter
            );
        }

        const active = action.id === ChonkyActions.ToggleSearch.id && searchBarVisible;

        // Action target is tailored to the "Go up a directory" button at the moment
        let actionTarget: Undefinable<FileData> = undefined;
        if (action.requiresParentFolder && parentFolder) {
            if (action.fileFilter) {
                if (action.fileFilter(parentFolder)) actionTarget = parentFolder;
            } else {
                actionTarget = parentFolder;
            }
        }

        const disabled =
            (action.requiresSelection && actionSelectionSize === 0) ||
            (action.requiresParentFolder && !actionTarget);
        // TODO: ^^^ Decouple `actionTarget` and `parentFolder`.

        const triggerAction = () => {
            if (action.specialActionToDispatch) {
                const specialActionId = action.specialActionToDispatch;

                switch (specialActionId) {
                    case SpecialAction.ToggleSearchBar:
                        dispatchSpecialAction({
                            actionId: specialActionId,
                        });
                        break;
                    default:
                        Logger.error(
                            `File action "${action.id}" tried to dispatch the ` +
                                `special action "${specialActionId}", but no ` +
                                `transform was defined for this action.`
                        );
                }
            }
            dispatchFileAction({
                actionId: action.id,
                target: actionTarget,
                files: actionFiles,
            });
        };

        return { active, disabled, triggerAction };
    }, [
        action,
        files,
        selection,
        searchBarVisible,
        dispatchFileAction,
        dispatchSpecialAction,
        parentFolder,
    ]);
};
