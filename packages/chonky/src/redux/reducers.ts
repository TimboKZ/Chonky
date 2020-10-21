import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Nullable } from 'tsdef';

import { ToolbarDropdownProps } from '../components/external/ToolbarDropdown';
import { FileAction } from '../types/file-actions.types';
import { FileArray, FileData } from '../types/files.types';
import { SortOrder } from '../types/sort.types';
import { ChonkyActions } from '../util/file-actions-definitions';

export interface RootState {
    // Raw and sanitized file actions
    rawFileActions: FileAction[] | any;
    fileActionsErrorMessages: string[];
    fileActionMap: FileActionMap;
    fileActionIds: string[];
    toolbarItems: (FileAction | ToolbarDropdownProps)[];

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
    hiddenFileIdMap: FileIdMap;
    displayFileIds: Nullable<string>[]; // Files that should be shown to the user

    // Sorting
    sortActionId: string;
    sortOrder: SortOrder;

    // Options
    optionMap: OptionMap;
}
export type FileActionMap = { [actonId: string]: FileAction };
export type FileMap = { [fileId: string]: FileData };
export type FileIdMap = { [fileId: string]: boolean };
export type OptionMap = { [optionId: string]: any };

export const initialState: RootState = {
    rawFileActions: [],
    fileActionsErrorMessages: [],
    fileActionMap: {},
    fileActionIds: [],
    toolbarItems: [],

    rawFolderChain: null,
    folderChainErrorMessages: [],
    folderChain: [],

    rawFiles: [],
    filesErrorMessages: [],
    fileMap: {},
    fileIds: [],
    cleanFileIds: [],

    sortedFileIds: [],
    hiddenFileIdMap: {},
    displayFileIds: [],

    sortActionId: ChonkyActions.SortFilesByName.id,
    sortOrder: SortOrder.ASC,

    optionMap: {},
};

export const { actions: reduxActions, reducer: rootReducer } = createSlice({
    name: 'root',
    initialState,
    reducers: {
        setRawFileActions(state, action: PayloadAction<FileAction[] | any>) {
            state.rawFileActions = action.payload;
        },
        setFileActionsErrorMessages(state, action: PayloadAction<string[]>) {
            state.fileActionsErrorMessages = action.payload;
        },
        setFileActions(state, action: PayloadAction<FileAction[]>) {
            const fileActionMap: FileActionMap = {};
            action.payload.map((a) => (fileActionMap[a.id] = a));
            const fileIds = action.payload.map((a) => a.id);

            state.fileActionMap = fileActionMap;
            state.fileActionIds = fileIds;
        },
        setToolbarItems(
            state,
            action: PayloadAction<(FileAction | ToolbarDropdownProps)[]>
        ) {
            state.toolbarItems = action.payload;
        },
        setRawFolderChain(state, action: PayloadAction<FileArray | any>) {
            state.rawFolderChain = action.payload;
        },
        setFolderChainErrorMessages(state, action: PayloadAction<string[]>) {
            state.folderChainErrorMessages = action.payload;
        },
        setFolderChain(state, action: PayloadAction<FileArray>) {
            state.folderChain = action.payload;
        },
        setRawFiles(state, action: PayloadAction<FileArray | any>) {
            state.rawFiles = action.payload;
        },
        setFilesErrorMessages(state, action: PayloadAction<string[]>) {
            state.filesErrorMessages = action.payload;
        },
        setFiles(state, action: PayloadAction<FileArray>) {
            const fileMap: FileMap = {};
            action.payload.map((f) => (f ? (fileMap[f.id] = f) : null));
            const fileIds = action.payload.map((f) => (f ? f.id : null));
            const cleanFileIds = fileIds.filter((f) => !!f) as string[];

            state.fileMap = fileMap;
            state.fileIds = fileIds;
            state.cleanFileIds = cleanFileIds;
        },
        setSortedFileIds(state, action: PayloadAction<Nullable<string>[]>) {
            state.sortedFileIds = action.payload;
        },
        setHiddenFileIds(state, action: PayloadAction<FileIdMap>) {
            state.hiddenFileIdMap = action.payload;
        },
        setDisplayFileIds(state, action: PayloadAction<Nullable<string>[]>) {
            state.displayFileIds = action.payload;
        },
        setSort(state, action: PayloadAction<{ actionId: string; order: SortOrder }>) {
            state.sortActionId = action.payload.actionId;
            state.sortOrder = action.payload.order;
        },
        setOptionDefaults(state, action: PayloadAction<OptionMap>) {
            for (const optionId of Object.keys(action.payload)) {
                if (optionId in state.optionMap) continue;
                state.optionMap[optionId] = action.payload[optionId];
            }
        },
        toggleOption(state, action: PayloadAction<string>) {
            state.optionMap[action.payload] = !state.optionMap[action.payload];
        },
    },
});
