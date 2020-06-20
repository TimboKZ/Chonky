import { Nilable, Nullable, Undefinable } from 'tsdef';

import { ChonkyIconName } from './components/external/ChonkyIcon';
import { SpecialAction, SpecialActionData } from './util/special-actions';

// If you make changes to required params in `FileData`, make sure to makes relevant
// changes `validation.ts` functions.
export interface FileData {
    id: string; // (Required) String that uniquely identifies the file

    name: string; // (Required) Full name, e.g. `MyImage.jpg`
    ext?: string; // File extension, e.g. `.jpg`

    isDir?: boolean; // Is a directory, default: false
    isHidden?: boolean; // Is a hidden file, default: false
    isSymlink?: boolean; // Is a symlink, default: false
    openable?: boolean; // Can be opened, default: true
    selectable?: boolean; // Can be selected, default: true
    draggable?: boolean; // Can be dragged, default: true
    droppable?: boolean; // Can have files dropped into it, default: true

    size?: number; // File size in bytes
    modDate?: Date; // Last change date

    parentId?: string; // ID of the parent folder
    childrenIds?: string[]; // An array of IDs of children (only for folders)

    thumbnailUrl?: string; // Automatically load thumbnail from here

    [property: string]: any;
}

export type FileArray = Nullable<FileData>[];

export type ReadonlyFileArray = ReadonlyArray<Nullable<FileData>>;

export type FileFilter = (file: Nullable<FileData>) => boolean;

export interface FileAction {
    name: string; // Unique action name
    metadata?: any; // Any user-defined value
    requiresParentFolder?: boolean; // Requires parent folder in folder chain
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: readonly string[]; // Hotkeys using `hotkey-js` notation
    toolbarButton?: ToolbarButtonData; // Description below

    // Special action that should be dispatched on activation of this action. This
    // is used by Chonky internally, keep it `undefined` unless you know what you're
    // doing.
    specialActionToDispatch?: SpecialAction;
}

export interface ToolbarButtonData {
    name: string;
    group?: string;
    dropdown?: boolean;
    tooltip?: string;
    icon?: ChonkyIconName | string;
    iconOnly?: boolean;
}

export interface FileActionData {
    actionName: string;
    target?: Readonly<FileData>;
    files?: ReadonlyArray<Readonly<FileData>>;
}

export type FileActionHandler = (
    action: FileAction,
    data: FileActionData
) => void | Promise<void>;

export type InternalFileActionDispatcher = (actionData: FileActionData) => void;
export type InternalSpecialActionDispatcher = (actionData: SpecialActionData) => void;

export interface FileSelection {
    // `true` means selected, anything else - not selected
    [fileId: string]: Undefinable<boolean>;
}

export type ThumbnailGenerator = (
    file: FileData
) => Nilable<string> | Promise<Nilable<string>>;

export interface FileIconData {
    icon: ChonkyIconName | string;
    colorCode: number;
}
