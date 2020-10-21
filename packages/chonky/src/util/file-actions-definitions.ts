import { Nullable } from 'tsdef';

import { FileAction } from '../types/file-actions.types';
import { FileData } from '../types/files.types';
import { ChonkyIconName } from '../types/icons.types';
import { SpecialAction } from '../types/special-actions.types';
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
        toolbarButton: {
            name: 'Open selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    },

    // Toolbar related action
    OpenParentFolder: {
        id: 'open_parent_folder',
        hotkeys: ['backspace'],
        toolbarButton: {
            name: 'Go up a directory',
            icon: ChonkyIconName.openParentFolder,
            iconOnly: true,
        },

        specialActionToDispatch: SpecialAction.OpenParentFolder,
    },

    // Actions related to selection
    SelectAllFiles: {
        id: 'select_all_files',
        hotkeys: ['ctrl+a'],
        toolbarButton: {
            name: 'Select all files',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.selectAllFiles,
        },

        specialActionToDispatch: SpecialAction.SelectAllFiles,
    },
    ClearSelection: {
        id: 'clear_selection',
        hotkeys: ['escape'],
        toolbarButton: {
            name: 'Clear selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.clearSelection,
        },

        specialActionToDispatch: SpecialAction.ClearSelection,
    },

    // File views
    EnableListView: {
        id: 'enable_list_view',
        fileViewConfig: { entryHeight: 30 },
        toolbarButton: {
            name: 'Switch to List view',
            icon: ChonkyIconName.list,
            iconOnly: true,
        },
    },
    EnableGridView: {
        id: 'enable_grid_view',
        fileViewConfig: { entryWidth: 165, entryHeight: 130 },
        toolbarButton: {
            name: 'Switch to Grid view',
            icon: ChonkyIconName.smallThumbnail,
            iconOnly: true,
        },
    },

    // Sorting actions
    SortFilesByName: {
        id: 'sort_files_by_name',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.name : undefined),
        toolbarButton: {
            name: 'Sort by name',
            group: 'Options',
            dropdown: true,
        },
    },
    SortFilesBySize: {
        id: 'sort_files_by_size',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.size : undefined),
        toolbarButton: {
            name: 'Sort by size',
            group: 'Options',
            dropdown: true,
        },
    },
    SortFilesByDate: {
        id: 'sort_files_by_date',
        sortKeySelector: (file: Nullable<FileData>) =>
            file ? file.modDate : undefined,
        toolbarButton: {
            name: 'Sort by date',
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
        toolbarButton: {
            name: 'Show hidden files',
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
        toolbarButton: {
            name: 'Show folders first',
            group: 'Options',
            dropdown: true,
        },
    },

    // Optional actions
    CopyFiles: {
        id: 'copy_files',
        requiresSelection: true,
        hotkeys: ['ctrl+c'],
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
    DeleteFiles: {
        id: 'delete_files',
        requiresSelection: true,
        hotkeys: ['delete'],
        toolbarButton: {
            name: 'Delete files',
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
