import { Nullable } from 'tsdef';

import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { defineFileAction, NOOP_FUNCTION } from '../../util/helpers';
import { FileActionEffect } from '../actions.types';

export const MouseClickFile = defineFileAction({
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

export const KeyboardClickFile = defineFileAction({
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

export const StartDragNDrop = defineFileAction({
    id: 'start_drag_n_drop',
    effect: NOOP_FUNCTION as FileActionEffect,
    __payloadType: {} as StartDragNDropPayload,
} as const);

export interface StartDragNDropPayload {
    dragSource: FileData;
}

export const EndDragNDrop = defineFileAction({
    id: 'end_drag_n_drop',
    effect: NOOP_FUNCTION as FileActionEffect,
    __payloadType: {} as EndDragNDropPayload,
} as const);

export interface EndDragNDropPayload {
    sourceInstanceId: string;
    source: Nullable<FileData>;
    draggedFile: FileData;
    destination: FileData;
    copy: boolean;
}

export const MoveFiles = defineFileAction({
    id: 'move_files',
    __payloadType: {} as MoveFilesPayload,
} as const);

export type MoveFilesPayload = EndDragNDropPayload & { files: FileData[] };

export const ChangeSelection = defineFileAction({
    id: 'change_selection',
    __payloadType: {} as ChangeSelectionPayload,
} as const);

export type ChangeSelectionPayload = { selection: Set<string> };

export const OpenFiles = defineFileAction({
    id: 'open_files',
    __payloadType: {} as OpenFilesPayload,
} as const);

export interface OpenFilesPayload {
    targetFile?: FileData;
    files: FileData[];
}

export const OpenParentFolder = defineFileAction({
    id: 'open_parent_folder',
    hotkeys: ['backspace'],
    button: {
        name: 'Go up a directory',
        toolbar: true,
        contextMenu: true,
        icon: ChonkyIconName.openParentFolder,
        iconOnly: true,
    },
    effect: NOOP_FUNCTION as FileActionEffect,
} as const);
