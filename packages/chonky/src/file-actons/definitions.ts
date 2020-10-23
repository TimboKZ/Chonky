import { WritableProps } from 'tsdef';

import { FileData } from '../types/files.types';
import { ChonkyIconName } from '../types/icons.types';
import { FileHelper } from '../util/file-helper';
import { NOOP_FUNCTION } from '../util/helpers';
import { FileAction, FileActionEffect } from './actions.types';

export const defineFileAction = <Action extends FileAction>(
    action: Action
): WritableProps<Action> => action as any;

const MouseClickFile = defineFileAction({
    id: 'mouse_click_file',
    effect: NOOP_FUNCTION as FileActionEffect,
    __payloadType: {} as MouseClickFilePayload,
} as const);
export interface MouseClickFilePayload {
    file: FileData;
    fileDisplayIndex: number;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    clickType: 'single' | 'double';
}

const KeyboardClickFile = defineFileAction({
    id: 'keyboard_click_file',
    effect: NOOP_FUNCTION as FileActionEffect,
    __payloadType: {} as KeyboardClickFilePayload,
} as const);
export interface KeyboardClickFilePayload {
    file: FileData;
    fileDisplayIndex: number;
    enterKey: boolean;
    spaceKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}

const StartDragNDrop = defineFileAction({
    id: 'start_drag_n_drop',
    effect: NOOP_FUNCTION as FileActionEffect,
    __payloadType: {} as StartDragNDropPayload,
} as const);
export interface StartDragNDropPayload {
    dragSource: FileData;
}

const EndDragNDrop = defineFileAction({
    id: 'end_drag_n_drop',
    effect: NOOP_FUNCTION as FileActionEffect,
    __payloadType: {} as EndDragNDropPayload,
} as const);
export interface EndDragNDropPayload {
    dragSource: FileData;
    dropTarget: FileData;
    dropEffect: 'move' | 'copy';
}

const OpenFiles = defineFileAction({
    id: 'open_files',
    requiresSelection: true,
    hotkeys: ['enter'],
    fileFilter: FileHelper.isOpenable,
    button: {
        name: 'Open selection',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        dropdown: true,
        icon: ChonkyIconName.openFiles,
    },
    __payloadType: {} as OpenFilesPayload,
} as const);
export interface OpenFilesPayload {
    mainFiles?: FileData;
    files: FileData[];
}

export const NewChonkyActions = {
    MouseClickFile,
    KeyboardClickFile,
    StartDragNDrop,
    EndDragNDrop,
    OpenFiles,
};

export const EssentialFileActions = [
    MouseClickFile,
    KeyboardClickFile,
    StartDragNDrop,
    EndDragNDrop,
    OpenFiles,
];
