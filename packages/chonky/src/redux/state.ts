import { FileViewMode } from '../types/file-view.types';
import { RootState } from '../types/redux.types';
import { SortOrder } from '../types/sort.types';

export const initialRootState: RootState = {
    instanceId: 'CHONKY_INVALID_ID', // should be overwritten by preloaded state

    externalFileActionHandler: null,

    rawFileActions: [],
    fileActionsErrorMessages: [],
    fileActionMap: {},
    fileActionIds: [],
    toolbarItems: [],
    contextMenuItems: [],

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

    focusSearchInput: null,
    searchString: '',
    searchMode: 'currentFolder',

    selectionMap: {},
    disableSelection: false,

    // HAX(tkuzh, 20230710): Dirty hack to fix a circular import, need to fix this later.
    // fileViewConfig: ChonkyActions.EnableGridView.fileViewConfig,
    fileViewConfig: { mode: FileViewMode.Grid, entryWidth: 165, entryHeight: 130 },

    sortActionId: null,
    sortOrder: SortOrder.ASC,

    optionMap: {},

    thumbnailGenerator: null,
    doubleClickDelay: 300,
    disableDragAndDrop: false,
    clearSelectionOnOutsideClick: true,

    lastClick: null,

    contextMenuMounted: false,
    contextMenuConfig: null,
};
