import { ChonkyIconName } from '../types/icons.types';
import { defineFileAction } from '../util/helpers';

export const ExtraActions = {
    CopyFiles: defineFileAction({
        id: 'copy_files',
        requiresSelection: true,
        hotkeys: ['ctrl+c'],
        button: {
            name: 'Copy selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.copy,
        },
    } as const),
    CreateFolder: defineFileAction({
        id: 'create_folder',
        button: {
            name: 'Create folder',
            toolbar: true,
            contextMenu: true,
            tooltip: 'Create a folder',
            icon: ChonkyIconName.folderCreate,
        },
    } as const),
    UploadFiles: defineFileAction({
        id: 'upload_files',
        button: {
            name: 'Upload files',
            toolbar: true,
            contextMenu: true,
            tooltip: 'Upload files',
            icon: ChonkyIconName.upload,
        },
    } as const),
    DownloadFiles: defineFileAction({
        id: 'download_files',
        requiresSelection: true,
        button: {
            name: 'Download files',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            tooltip: 'Download files',
            dropdown: true,
            icon: ChonkyIconName.download,
        },
    } as const),
    DeleteFiles: defineFileAction({
        id: 'delete_files',
        requiresSelection: true,
        hotkeys: ['delete'],
        button: {
            name: 'Delete files',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            tooltip: 'Delete files',
            dropdown: true,
            icon: ChonkyIconName.trash,
        },
    } as const),
};
