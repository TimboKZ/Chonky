import Promise from 'bluebird';
import { useCallback, useMemo } from 'react';
import { Nullable } from 'tsdef';

import { ChonkyIconName } from '../components/external/ChonkyIcon';
import {
    FileAction,
    FileActionHandler,
    InternalFileActionDispatcher,
} from '../typedef';
import { Logger } from './logger';
import { isFunction } from './validation';

export const ChonkyActions = {
    MoveFilesTo: {
        name: 'move_files_to',
    },
    DuplicateFilesTo: {
        name: 'duplicate_files_to',
    },

    OpenParentFolder: {
        name: 'open_parent_folder',
        hotkeys: ['backspace'],
        toolbarButton: {
            name: 'Go up a directory',
            tooltip: 'Go up a directory',
            icon: ChonkyIconName.directoryUp,
            iconOnly: true,
        },
    },
    OpenFiles: {
        name: 'open_files',
        requiresSelection: true,
    },

    CopyFiles: {
        name: 'copy_files',
        requiresSelection: true,
    },

    CreateFolder: {
        name: 'create_folder',
        toolbarButton: {
            name: 'Create folder',
            tooltip: 'Create a folder',
            icon: ChonkyIconName.folderCreate,
        },
    },
    UploadFiles: {
        name: 'upload_files',
        toolbarButton: {
            name: 'Upload files',
            tooltip: 'Upload files',
            icon: ChonkyIconName.upload,
        },
    },
    DownloadFiles: {
        name: 'download_files',
        toolbarButton: {
            name: 'Download files',
            tooltip: 'Download files',
            icon: ChonkyIconName.download,
        },
    },
} as const;

export const DefaultActions: FileAction[] = [
    ChonkyActions.MoveFilesTo,
    ChonkyActions.DuplicateFilesTo,

    ChonkyActions.OpenParentFolder,
    ChonkyActions.OpenFiles,
    ChonkyActions.CreateFolder,
    ChonkyActions.UploadFiles,
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
                actionMap[fileAction.name] = fileAction;
            }
        }
        return actionMap;
    }, actionMapDeps);

    const dispatchFileActionDeps = [actionMap, onFileAction];
    const dispatchFileAction: InternalFileActionDispatcher = useCallback(
        (actionData) => {
            const { actionName } = actionData;

            const action = actionMap[actionName];
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
                    `Internal components dispatched a "${actionName}" file action, ` +
                    `but such action was not registered.`
                );
            }
        },
        dispatchFileActionDeps
    );

    return dispatchFileAction;
};
