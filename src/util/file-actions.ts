import { FileAction } from '../typedef';
import { ChonkyIconName } from '../components/external/ChonkyIcon';

export const ChonkyActions = {
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
    ChonkyActions.OpenParentFolder,
    ChonkyActions.OpenFiles,
    ChonkyActions.CreateFolder,
    ChonkyActions.UploadFiles,
];
