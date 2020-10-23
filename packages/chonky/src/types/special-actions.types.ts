import { FileData } from './files.types';

export enum SpecialAction {
    MouseClickFile = 'mouse_click_file',
    KeyboardClickFile = 'keyboard_click_file',

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

export type SpecialActionData =
    | SpecialFileMouseClickAction
    | SpecialFileKeyboardClickAction
    | SpecialDragNDropStartAction
    | SpecialDragNDropEndAction;

export type SpecialActionHandlerMap = {
    [actionId in SpecialAction]: (data: SpecialActionData) => void;
};
