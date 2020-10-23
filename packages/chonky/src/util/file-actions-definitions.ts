import { Nullable } from 'tsdef';

import { FileAction } from '../types/file-actions.types';
import { FileData } from '../types/files.types';
import { ChonkyIconName } from '../types/icons.types';
import { openParentFolderEffect } from './file-actions-effects';
import { FileHelper } from './file-helper';

const validateActionTypes = <T extends { [action: string]: FileAction }>(
    actionMap: T
): T => actionMap;

export const ChonkyActions = validateActionTypes({
    // Actions triggered by drag & drop
    MoveFilesTo: {
        id: 'move_files_to',
    },
    DuplicateFilesTo: {
        id: 'duplicate_files_to',
    },

    // Actions triggered by file selections
    ChangeSelection: {
        id: 'change_selection',
    },

    // Most important action of all - opening files!
    OpenFiles: {
        id: 'open_files',
        requiresSelection: true,
        hotkeys: ['enter'],
        fileFilter: FileHelper.isOpenable,
        button: {
            name: 'Open selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    },

    // Toolbar related action
    OpenParentFolder: {
        id: 'open_parent_folder',
        hotkeys: ['backspace'],
        button: {
            name: 'Go up a directory',
            toolbar: true,
            contextMenu: true,
            icon: ChonkyIconName.openParentFolder,
            iconOnly: true,
        },
        effect: openParentFolderEffect,
    },

    // Actions related to selection
    SelectAllFiles: {
        id: 'select_all_files',
        hotkeys: ['ctrl+a'],
        button: {
            name: 'Select all files',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.selectAllFiles,
        },
        selectionTransform: ({ fileIds, hiddenFileIds }) => {
            const newSelection = new Set<string>();
            fileIds.map((fileId) => {
                // We don't need to check if file is selectable because Chonky does
                // it own checks internally.
                if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
            });
            return newSelection;
        },
    },
    ClearSelection: {
        id: 'clear_selection',
        hotkeys: ['escape'],
        button: {
            name: 'Clear selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.clearSelection,
        },
        selectionTransform: ({ prevSelection }) => {
            if (prevSelection.size === 0) return null;
            return new Set<string>();
        },
    },

    // File views
    EnableListView: {
        id: 'enable_list_view',
        fileViewConfig: { entryHeight: 30 },
        button: {
            name: 'Switch to List view',
            toolbar: true,
            contextMenu: true,
            icon: ChonkyIconName.list,
            iconOnly: true,
        },
    },
    EnableGridView: {
        id: 'enable_grid_view',
        fileViewConfig: { entryWidth: 165, entryHeight: 130 },
        button: {
            name: 'Switch to Grid view',
            toolbar: true,
            contextMenu: true,
            icon: ChonkyIconName.smallThumbnail,
            iconOnly: true,
        },
    },

    // Sorting actions
    SortFilesByName: {
        id: 'sort_files_by_name',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.name : undefined),
        button: {
            name: 'Sort by name',
            toolbar: true,
            contextMenu: true,
            group: 'Options',
            dropdown: true,
        },
    },
    SortFilesBySize: {
        id: 'sort_files_by_size',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.size : undefined),
        button: {
            name: 'Sort by size',
            toolbar: true,
            contextMenu: true,
            group: 'Options',
            dropdown: true,
        },
    },
    SortFilesByDate: {
        id: 'sort_files_by_date',
        sortKeySelector: (file: Nullable<FileData>) =>
            file ? file.modDate : undefined,
        button: {
            name: 'Sort by date',
            toolbar: true,
            contextMenu: true,
            group: 'Options',
            dropdown: true,
        },
    },

    // Toggleable options
    ToggleHiddenFiles: {
        id: 'toggle_hidden_files',
        hotkeys: ['ctrl+h'],
        option: {
            id: 'show_hidden_files',
            defaultValue: true,
        },
        button: {
            name: 'Show hidden files',
            toolbar: true,
            contextMenu: true,
            group: 'Options',
            dropdown: true,
        },
    },
    ToggleShowFoldersFirst: {
        id: 'toggle_show_folders_first',
        option: {
            id: 'show_folders_first',
            defaultValue: true,
        },
        button: {
            name: 'Show folders first',
            toolbar: true,
            contextMenu: true,
            group: 'Options',
            dropdown: true,
        },
    },

    // Optional actions
    CopyFiles: {
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
    },
    CreateFolder: {
        id: 'create_folder',
        button: {
            name: 'Create folder',
            toolbar: true,
            contextMenu: true,
            tooltip: 'Create a folder',
            icon: ChonkyIconName.folderCreate,
        },
    },
    UploadFiles: {
        id: 'upload_files',
        button: {
            name: 'Upload files',
            toolbar: true,
            contextMenu: true,
            tooltip: 'Upload files',
            icon: ChonkyIconName.upload,
        },
    },
    DownloadFiles: {
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
    },
    DeleteFiles: {
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
    },
});

export const DefaultFileActions: FileAction[] = [
    ChonkyActions.MoveFilesTo,
    ChonkyActions.DuplicateFilesTo,

    ChonkyActions.ChangeSelection,

    ChonkyActions.OpenParentFolder,

    ChonkyActions.EnableListView,
    ChonkyActions.EnableGridView,

    ChonkyActions.OpenFiles,
    ChonkyActions.SelectAllFiles,
    ChonkyActions.ClearSelection,

    ChonkyActions.SortFilesByName,
    ChonkyActions.SortFilesBySize,
    ChonkyActions.SortFilesByDate,

    ChonkyActions.ToggleHiddenFiles,
    ChonkyActions.ToggleShowFoldersFirst,
];
