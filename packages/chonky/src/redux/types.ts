import { Action, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { Nullable } from 'tsdef';

import { FileAction, FileActionMap } from '../file-actons/actions.types';
import { GenericFileActionHandler } from '../file-actons/handler.types';
import { ToolbarItemArray } from '../file-actons/presentation.types';
import { FileViewConfig } from '../types/file-view.types';
import { FileArray, FileIdTrueMap, FileMap } from '../types/files.types';
import { OptionMap } from '../types/options.types';
import { FileSelection } from '../types/selection.types';
import { SortOrder } from '../types/sort.types';
import { ThumbnailGenerator } from '../types/thumbnails.types';

export type RootState = {
    instanceId: string;

    externalFileActionHandler: Nullable<GenericFileActionHandler<FileAction>>;

    // Raw and sanitized file actions
    rawFileActions: FileAction[] | any;
    fileActionsErrorMessages: string[];
    fileActionMap: FileActionMap;
    fileActionIds: string[];
    toolbarItems: ToolbarItemArray;

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

    // Selection
    selectionMap: FileSelection;
    disableSelection: boolean;

    // File views
    fileViewConfig: FileViewConfig;

    // Sorting
    sortActionId: string;
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
};

export type ChonkyThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export type ChonkyDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
