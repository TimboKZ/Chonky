import { FileData, FileFilter } from './files.types';
import { ChonkyIconName } from './icons.types';
import { FileSortKeySelector } from './sort.types';
import { SpecialAction } from './special-actions.types';

export interface FileAction {
    id: string; // Unique action ID
    metadata?: any; // Any user-defined value
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: readonly string[]; // Hotkeys using `hotkey-js` notation
    toolbarButton?: ToolbarButtonData; // Description below

    // When `sortKeySelector` is specified, the action becomes a sorting toggle.
    // When this action is activated, it will sort files using the key selector,
    // toggling between Ascending and Descending orders.
    sortKeySelector?: FileSortKeySelector;

    // When `option` is specified, the action becomes an option toggle. When the action
    // is activated, the boolean value of the option will be toggled.
    option?: {
        id: string; // Unique option ID
        defaultValue: boolean; // Whether the option is enabled by default (required)
    }

    // Special action that should be dispatched on activation of this action. This
    // is used by Chonky internally, keep it `undefined` unless you know what you're
    // doing.
    specialActionToDispatch?: SpecialAction;
}

export interface FileActionData {
    actionId: string;
    target?: FileData;
    files?: FileData[];
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
