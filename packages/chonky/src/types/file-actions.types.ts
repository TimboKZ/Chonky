import { Nullable } from 'tsdef';

import { FileViewConfig } from './file-view.types';
import { FileData, FileFilter, FileMap } from './files.types';
import { ChonkyIconName } from './icons.types';
import { FileSortKeySelector } from './sort.types';
import { SpecialAction } from './special-actions.types';

export interface FileAction {
    id: string; // Unique action ID
    metadata?: any; // Any user-defined value
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: string[]; // Hotkeys using `hotkey-js` notation

    /**
     * When button is defined and `toolbar` or `contextMenu` is set to `true`, a
     * button will be added to the relevant UI component. Clicking on this button
     * will active this action. The appearance of the button will change based on
     * the action definition and the current Chonky state.
     */
    button?: {
        name: string; // Button name
        toolbar?: boolean; // Whether to show the button in the toolbar
        contextMenu?: boolean; // Whether to show the button in the context menu
        group?: string; // Group to add the button too
        dropdown?: boolean; // Whether to display group as dropdown
        tooltip?: string; // Help tooltip text
        icon?: ChonkyIconName | string; // Icon name
        iconOnly?: boolean; // Whether to only display the icon
    };

    // When `sortKeySelector` is specified, the action becomes a sorting toggle.
    // When this action is activated, it will sort files using the key selector,
    // toggling between Ascending and Descending orders.
    sortKeySelector?: FileSortKeySelector;

    // When `fileViewConfig` is specified, triggering this action will apply the
    // provided config to Chonky's file view.
    fileViewConfig?: FileViewConfig;

    // When `option` is specified, the action becomes an option toggle. When the action
    // is activated, the boolean value of the option will be toggled.
    option?: {
        id: string; // Unique option ID
        defaultValue: boolean; // Whether the option is enabled by default (required)
    };

    /**
     * When selection transform is defined, activating this action will update the file
     * selection. If the transform function returns `null`, selection will be left
     * untouched.
     */
    selectionTransform?: (data: {
        prevSelection: Set<string>;
        fileIds: ReadonlyArray<string>;
        fileMap: Readonly<FileMap>;
        hiddenFileIds: Set<string>;
    }) => Nullable<Set<string>>;

    // Special action that should be dispatched on activation of this action. This
    // is used by Chonky internally, keep it `undefined` unless you know what you're
    // doing.
    specialActionToDispatch?: SpecialAction;
}
export type FileActionButton = FileAction['button'];
export type FileSelectionTransform = FileAction['selectionTransform'];

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

export type FileActionMap = { [actonId: string]: FileAction };

export interface ToolbarItemGroup {
    name: string;
    fileActionIds: string[];
}
