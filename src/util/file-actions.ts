import Promise from 'bluebird';
import { useCallback, useMemo } from 'react';
import { Nullable } from 'tsdef';

import {
    FileAction,
    FileActionHandler,
    InternalFileActionDispatcher,
} from '../types/file-actions.types';
import { ChonkyIconName } from '../types/icons.types';
import { SpecialAction } from '../types/special-actions.types';
import { FileHelper } from './file-helper';
import { Logger } from './logger';
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

export const DefaultActions: FileAction[] = [
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
    onFileAction: Nullable<FileActionHandler>
): InternalFileActionDispatcher => {
    const actionMapDeps = [fileActions];
    const actionMap = useMemo(() => {
        const actionMap = {};
        if (Array.isArray(fileActions)) {
            for (const fileAction of fileActions) {
                actionMap[fileAction.id] = fileAction;
            }
        }
        return actionMap;
    }, actionMapDeps);

    const dispatchFileActionDeps = [actionMap, onFileAction];
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
        dispatchFileActionDeps
    );

    return dispatchFileAction;
};
