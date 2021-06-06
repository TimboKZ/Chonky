import { Nullable } from 'tsdef';

import { selectFocusSearchInput } from '../redux/selectors';
import { thunkRequestFileAction } from '../redux/thunks/dispatchers.thunks';
import { FileSelectionTransform } from '../types/action.types';
import { FileViewMode } from '../types/file-view.types';
import { FileData } from '../types/file.types';
import { ChonkyIconName } from '../types/icons.types';
import { FileHelper } from '../util/file-helper';
import { defineFileAction } from '../util/helpers';
import { EssentialActions } from './essential';
import { OptionIds } from './option-ids';

export const DefaultActions = {
    /**
     * Action that can be used to open currently selected files.
     */
    OpenSelection: defineFileAction(
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
                icon: ChonkyIconName.openFiles,
            },
        } as const,
        ({ state, reduxDispatch }) => {
            reduxDispatch(
                thunkRequestFileAction(EssentialActions.OpenFiles, {
                    files: state.selectedFilesForAction!,
                })
            );
            return undefined;
        }
    ),
    /**
     * Action that selects all files.
     */
    SelectAllFiles: defineFileAction({
        id: 'select_all_files',
        hotkeys: ['ctrl+a'],
        button: {
            name: 'Select all files',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.selectAllFiles,
        },
        selectionTransform: (({ fileIds, hiddenFileIds }) => {
            const newSelection = new Set<string>();
            fileIds.map(fileId => {
                // We don't need to check if file is selectable because Chonky does
                // it own checks internally.
                if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
            });
            return newSelection;
        }) as FileSelectionTransform,
    } as const),
    /**
     * Action that clear the file selection.
     */
    ClearSelection: defineFileAction({
        id: 'clear_selection',
        hotkeys: ['escape'],
        button: {
            name: 'Clear selection',
            toolbar: true,
            contextMenu: true,
            group: 'Actions',
            icon: ChonkyIconName.clearSelection,
        },
        selectionTransform: (({ prevSelection }) => {
            if (prevSelection.size === 0) return null;
            return new Set<string>();
        }) as FileSelectionTransform,
    } as const),
    /**
     * Action that enables List view.
     */
    EnableListView: defineFileAction({
        id: 'enable_list_view',
        fileViewConfig: {
            mode: FileViewMode.List,
            entryHeight: 30,
        },
        button: {
            name: 'Switch to List view',
            toolbar: true,
            icon: ChonkyIconName.list,
            iconOnly: true,
        },
    } as const),
    /**
     * Action that enables Compact view. Note that compact view is still
     * experimental and should not be used in production.
     */
    EnableCompactView: defineFileAction({
        // TODO: Don't enable until compact view is fully supported
        id: 'enable_compact_view',
        fileViewConfig: {
            mode: FileViewMode.Compact,
            entryHeight: 40,
            entryWidth: 220,
        },
        button: {
            name: 'Switch to Compact view',
            toolbar: true,
            icon: ChonkyIconName.compact,
            iconOnly: true,
        },
    } as const),
    /**
     * Action that enables Grid view.
     */
    EnableGridView: defineFileAction({
        id: 'enable_grid_view',
        fileViewConfig: { mode: FileViewMode.Grid, entryWidth: 165, entryHeight: 130 },
        button: {
            name: 'Switch to Grid view',
            toolbar: true,
            icon: ChonkyIconName.smallThumbnail,
            iconOnly: true,
        },
    } as const),
    /**
     * Action that sorts files by `file.name`.
     */
    SortFilesByName: defineFileAction({
        id: 'sort_files_by_name',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.name.toLowerCase() : undefined),
        button: {
            name: 'Sort by name',
            toolbar: true,
            group: 'Options',
        },
    } as const),
    /**
     * Action that sorts files by `file.size`.
     */
    SortFilesBySize: defineFileAction({
        id: 'sort_files_by_size',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.size : undefined),
        button: {
            name: 'Sort by size',
            toolbar: true,
            group: 'Options',
        },
    } as const),
    /**
     * Action that sorts files by `file.modDate`.
     */
    SortFilesByDate: defineFileAction({
        id: 'sort_files_by_date',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.modDate : undefined),
        button: {
            name: 'Sort by date',
            toolbar: true,
            group: 'Options',
        },
    } as const),
    /**
     * Action that toggles whether hidden files are shown to the user or not.
     */
    ToggleHiddenFiles: defineFileAction({
        id: 'toggle_hidden_files',
        hotkeys: ['ctrl+h'],
        option: {
            id: OptionIds.ShowHiddenFiles,
            defaultValue: true,
        },
        button: {
            name: 'Show hidden files',
            toolbar: true,
            group: 'Options',
        },
    } as const),
    /**
     * Action that toggles whether folders should appear before files regardless of
     * current sort function.
     */
    ToggleShowFoldersFirst: defineFileAction({
        id: 'toggle_show_folders_first',
        option: {
            id: OptionIds.ShowFoldersFirst,
            defaultValue: true,
        },
        button: {
            name: 'Show folders first',
            toolbar: true,
            group: 'Options',
        },
    } as const),
    /**
     * Action that focuses the search input when it is dispatched.
     */
    FocusSearchInput: defineFileAction(
        {
            id: 'focus_search_input',
            hotkeys: ['ctrl+f'],
        } as const,
        ({ getReduxState }) => {
            const focusSearchInput = selectFocusSearchInput(getReduxState());
            if (focusSearchInput) focusSearchInput();
        }
    ),
    /**
     * Action that enables List view.
     */
    ToggleDarkMode: defineFileAction({
        id: 'enable_dark_mode',
        option: {
            id: OptionIds.DarkMode,
            defaultValue: false,
        },
        button: {
            name: 'Enable dark mode',
            toolbar: true,
            icon: ChonkyIconName.list,
            iconOnly: true,
        },
    } as const),
};
