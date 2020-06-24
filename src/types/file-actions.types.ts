import { FileData, FileFilter } from './files.types';
import { ChonkyIconName } from './icons.types';
import { SpecialAction } from './special-actions.types';

export interface FileAction {
    id: string; // Unique action ID
    metadata?: any; // Any user-defined value
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: readonly string[]; // Hotkeys using `hotkey-js` notation
    toolbarButton?: ToolbarButtonData; // Description below

    // Special action that should be dispatched on activation of this action. This
    // is used by Chonky internally, keep it `undefined` unless you know what you're
    // doing.
    specialActionToDispatch?: SpecialAction;
}

export interface FileActionData {
    actionId: string;
    target?: Readonly<FileData>;
    files?: ReadonlyArray<Readonly<FileData>>;
}

export type FileActionHandler = (
    action: FileAction,
    data: FileActionData
) => void | Promise<void>;

export type InternalFileActionDispatcher = (actionData: FileActionData) => void;
export type InternalFileActionRequester = (actionId: string) => void;

export interface ActionGroupData {
    name?: string;
    dropdown?: boolean;
    fileActionIds: string[];
}

export interface ToolbarButtonData {
    name: string; // Button name
    group?: string; // Group to add the button too
    dropdown?: boolean; // Whether to display group as dropdown
    tooltip?: string; // Help tooltip text
    icon?: ChonkyIconName | string; // Icon name
    iconOnly?: boolean; // Whether to only display the icon
}
