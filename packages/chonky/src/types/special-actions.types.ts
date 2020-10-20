import { FileData } from './files.types';

export enum SpecialAction {
    MouseClickFile = 'mouse_click_file',
    KeyboardClickFile = 'keyboard_click_file',

    OpenParentFolder = 'open_parent_folder',
    OpenFolderChainFolder = 'open_folder_chain_folder',
    ToggleSearchBar = 'toggle_search_bar',

    SelectAllFiles = 'select_all_files',
    ClearSelection = 'clear_selection',

    DragNDropStart = 'drag_n_drop_start',
    DragNDropEnd = 'drag_n_drop_end',
}

export interface SpecialFileMouseClickAction {
    actionId: SpecialAction.MouseClickFile;
    file: FileData;
    fileDisplayIndex: number;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    clickType: 'single' | 'double';
}

export interface SpecialFileKeyboardClickAction {
    actionId: SpecialAction.KeyboardClickFile;
    file: FileData;
    fileDisplayIndex: number;
    enterKey: boolean;
    spaceKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}

export interface SpecialOpenFolderChainFolderAction {
    actionId: SpecialAction.OpenFolderChainFolder;
    file: FileData;
}

export interface SpecialDragNDropStartAction {
    actionId: SpecialAction.DragNDropStart;
    dragSource: FileData;
}

export interface SpecialDragNDropEndAction {
    actionId: SpecialAction.DragNDropEnd;
    dragSource: FileData;
    dropTarget: FileData;
    dropEffect: 'move' | 'copy';
}

export interface SpecialSimpleAction {
    actionId:
        | SpecialAction.OpenParentFolder
        | SpecialAction.ToggleSearchBar
        | SpecialAction.SelectAllFiles
        | SpecialAction.ClearSelection;
}

export type SpecialActionData =
    | SpecialFileMouseClickAction
    | SpecialFileKeyboardClickAction
    | SpecialOpenFolderChainFolderAction
    | SpecialDragNDropStartAction
    | SpecialDragNDropEndAction
    | SpecialSimpleAction;

export type InternalSpecialActionDispatcher = (actionData: SpecialActionData) => void;

export type SpecialActionHandlerMap = {
    [actionId in SpecialAction]: (data: SpecialActionData) => void;
};
