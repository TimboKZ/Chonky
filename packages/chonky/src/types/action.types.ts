import { MaybePromise, Nullable } from 'tsdef';

import { ChonkyDispatch, RootState } from '../redux/types';
import { FileActionState } from './action-handler.types';
import { FileViewConfig } from './file-view.types';
import { FileFilter, FileMap } from './files.types';
import { ChonkyIconName } from './icons.types';
import { FileSortKeySelector } from './sort.types';

export interface FileAction {
    id: string; // Unique action ID
    metadata?: any; // Any user-defined value
    requiresSelection?: boolean; // Requires selection of 1+ files
    fileFilter?: FileFilter; // Used to filter the files array

    hotkeys?: string[] | readonly string[]; // Hotkeys using `hotkey-js` notation

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
    selectionTransform?: FileSelectionTransform;

    /**
     * When effect is defined, it will be called right before dispatching the action to
     * the user defined action handler. If the effect function returns a promise, Chonky
     * will wait for the promise to resolve or fail before dispatching the action to the
     * handler. If this function returns `true`, the file action will NOT be dispatched
     * the the handler.
     */
    effect?: FileActionEffect;

    // Fields used for type inference; not used at runtime.
    __payloadType?: any;
    __extraStateType?: any;
}
export type FileActionButton = FileAction['button'];
export type FileSelectionTransform = (data: {
    prevSelection: Set<string>;
    fileIds: ReadonlyArray<string>;
    fileMap: Readonly<FileMap>;
    hiddenFileIds: Set<string>;
}) => Nullable<Set<string>>;
export type FileActionEffect<Action extends FileAction = any> = (data: {
    action: Action;
    payload: Action['__payloadType'];
    state: FileActionState<{}>; // empty extra state is deliberate
    reduxDispatch: ChonkyDispatch;
    getReduxState: () => RootState;
}) => MaybePromise<undefined | boolean>;

export type FileActionMap = { [actonId: string]: FileAction };
