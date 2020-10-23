import { Nullable } from 'tsdef';

import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import { defineFileAction } from '../../util/helpers';
import { FileSelectionTransform } from '../actions.types';
import { OpenFiles } from './essential';

export const OpenSelection = defineFileAction(
    {
        id: 'open_selection',
        hotkeys: ['enter'],
        requiresSelection: true,
        fileFilter: FileHelper.isOpenable,
        button: {
            name: 'Open selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    } as const,
    ({ state, reduxDispatch }) => {
        reduxDispatch(
            thunkRequestFileAction(OpenFiles, { files: state.selectedFilesForAction! })
        );
        return undefined;
    }
);

export const SelectAllFiles = defineFileAction({
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
    selectionTransform: (({ fileIds, hiddenFileIds }) => {
        const newSelection = new Set<string>();
        fileIds.map((fileId) => {
            // We don't need to check if file is selectable because Chonky does
            // it own checks internally.
            if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
        });
        return newSelection;
    }) as FileSelectionTransform,
} as const);
export const ClearSelection = defineFileAction({
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
    selectionTransform: (({ prevSelection }) => {
        if (prevSelection.size === 0) return null;
        return new Set<string>();
    }) as FileSelectionTransform,
} as const);

export const EnableListView = defineFileAction({
    id: 'enable_list_view',
    fileViewConfig: { entryHeight: 30 },
    button: {
        name: 'Switch to List view',
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.list,
        iconOnly: true,
    },
} as const);
export const EnableGridView = defineFileAction({
    id: 'enable_grid_view',
    fileViewConfig: { entryWidth: 165, entryHeight: 130 },
    button: {
        name: 'Switch to Grid view',
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.smallThumbnail,
        iconOnly: true,
    },
} as const);

export const SortFilesByName = defineFileAction({
    id: 'sort_files_by_name',
    sortKeySelector: (file: Nullable<FileData>) => (file ? file.name : undefined),
    button: {
        name: 'Sort by name',
        toolbar: true,
        contextMenu: true,
        group: 'Options',
        dropdown: true,
    },
} as const);
export const SortFilesBySize = defineFileAction({
    id: 'sort_files_by_size',
    sortKeySelector: (file: Nullable<FileData>) => (file ? file.size : undefined),
    button: {
        name: 'Sort by size',
        toolbar: true,
        contextMenu: true,
        group: 'Options',
        dropdown: true,
    },
} as const);
export const SortFilesByDate = defineFileAction({
    id: 'sort_files_by_date',
    sortKeySelector: (file: Nullable<FileData>) => (file ? file.modDate : undefined),
    button: {
        name: 'Sort by date',
        toolbar: true,
        contextMenu: true,
        group: 'Options',
        dropdown: true,
    },
} as const);

export const ToggleHiddenFiles = defineFileAction({
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
} as const);
export const ToggleShowFoldersFirst = defineFileAction({
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
} as const);
