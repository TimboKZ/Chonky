import { Action, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { Nullable } from 'tsdef';

import { GenericFileActionHandler } from './action-handler.types';
import { FileActionMenuItem } from './action-menus.types';
import { FileAction, FileActionMap } from './action.types';
import { ContextMenuConfig } from './context-menu.types';
import { FileViewConfig } from './file-view.types';
import { FileArray, FileIdTrueMap, FileMap } from './file.types';
import { OptionMap } from './options.types';
import { FileSelection } from './selection.types';
import { SortOrder } from './sort.types';
import { ThumbnailGenerator } from './thumbnails.types';

export type RootState = {
    instanceId: string;

    externalFileActionHandler: Nullable<GenericFileActionHandler<FileAction>>;

    // Raw and sanitized file actions
    rawFileActions: FileAction[] | any;
    fileActionsErrorMessages: string[];
    fileActionMap: FileActionMap;
    fileActionIds: string[];
    toolbarItems: FileActionMenuItem[];
    contextMenuItems: FileActionMenuItem[];

    // Raw and sanitized folder chain
    rawFolderChain: Nullable<FileArray> | any;
    folderChainErrorMessages: string[];
    folderChain: FileArray;

    // Raw and sanitized files
    rawFiles: FileArray | any;
    filesErrorMessages: string[];
    fileMap: FileMap;
    fileIds: Nullable<string>[];
    cleanFileIds: string[];

    // Derivative files
    sortedFileIds: Nullable<string>[];
    hiddenFileIdMap: FileIdTrueMap;
    displayFileIds: Nullable<string>[]; // Files that should be shown to the user

    // Search
    focusSearchInput: Nullable<() => void>;
    searchString: string;
    searchMode: 'currentFolder';

    // Selection
    selectionMap: FileSelection;
    disableSelection: boolean;

    // File views
    fileViewConfig: FileViewConfig;

    // Sorting
    sortActionId: Nullable<string>;
    sortOrder: SortOrder;

    // Options
    optionMap: OptionMap;

    // Other settings
    thumbnailGenerator: Nullable<ThumbnailGenerator>;
    doubleClickDelay: number;
    disableDragAndDrop: boolean;
    clearSelectionOnOutsideClick: boolean;

    // State to use inside effects
    lastClickIndex: Nullable<number>;

    // Context menu
    contextMenuMounted: boolean;
    contextMenuConfig: Nullable<ContextMenuConfig>;
};

export interface ChonkyThunkExtraArgument {
    getCachedSearch(
        cleanFileIds: string[],
        fileMap: FileMap,
        searchString: string
    ): Set<string>;
}

export type ChonkyThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    ChonkyThunkExtraArgument,
    Action<string>
>;

export type ChonkyDispatch = ThunkDispatch<
    RootState,
    ChonkyThunkExtraArgument,
    Action<string>
>;
