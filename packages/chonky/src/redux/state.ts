import { ChonkyActions } from '../file-actons/definitions/index';
import { SortOrder } from '../types/sort.types';
import { RootState } from './types';

export const initialRootState: RootState = {
    instanceId: 'CHONKY_INVALID_ID', // should be overwritten by preloaded state

    externalFileActionHandler: null,

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

    selectionMap: {},
    disableSelection: false,

    fileViewConfig: ChonkyActions.EnableGridView.fileViewConfig,

    sortActionId: ChonkyActions.SortFilesByName.id,
    sortOrder: SortOrder.ASC,

    optionMap: {},

    thumbnailGenerator: null,
    doubleClickDelay: 300,
    disableDragAndDrop: false,
    clearSelectionOnOutsideClick: true,

    lastClickIndex: null,
};
