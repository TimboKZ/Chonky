import { MaybePromise, Nullable } from 'tsdef';

import { FileActionState } from './action-handler.types';
import { FileViewConfig } from './file-view.types';
import { FileFilter, FileMap } from './file.types';
import { ChonkyIconName } from './icons.types';
import { ChonkyDispatch, RootState } from './redux.types';
import { FileSortKeySelector } from './sort.types';

export interface FileAction {
  /**
   * Unique file action ID. If you set the action ID to one of the built-in Chonky
   * action action IDs, you custom action definition will override the built-in
   * definition.
   */
  id: string;
  /**
   * When set to `true`, the action will only be active (dispatchable) when user
   * selects one or more files. If `fileFilter` is defined, it will be applied to
   * selection before checking if its empty.
   */
  requiresSelection?: boolean; // Requires selection of 1+ files
  /**
   * A predicate that determines whether a file should be included in the selection
   * for this action.
   */
  fileFilter?: FileFilter;
  /**
   * List of hotkeys that should trigger this action, defined using `hotkey-js`
   * notation.
   * @see https://www.npmjs.com/package/hotkeys-js
   */
  hotkeys?: string[] | readonly string[];
  /**
   * When button is defined and `toolbar` or `contextMenu` is set to `true`, a
   * button will be added to the relevant UI component. Clicking on this button
   * will active this action. The appearance of the button will change based on
   * the action definition and the current Chonky state.
   */
  button?: FileActionButton;
  /**
   * When `sortKeySelector` is specified, the action becomes a sorting toggle. When
   * this action is activated, it will sort files using the key selector, toggling
   * between Ascending and Descending orders.
   */
  sortKeySelector?: FileSortKeySelector;
  /**
   * When `fileViewConfig` is specified, triggering this action will apply the
   * provided config to Chonky's file view.
   */
  fileViewConfig?: FileViewConfig;
  /**
   * When `option` is specified, the action becomes an option toggle. When the action
   * is activated, the boolean value of the option will be toggled.
   */
  option?: FileActionOption;
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
  /**
   * When customVisibility is defined, it will change the display state of the file action
   * The function must return the visibility as one of the CustomVisibilityState values:
   *  - Hidden
   *  - Disabled
   *  - Default
   *  - Active
   */
  customVisibility?: () => CustomVisibilityState;
  /**
   * Field used to infer the type of action payload. It is used solely for Typescript
   * type inference and action validation.
   */
  __payloadType?: any;
  /**
   * Field used to infer the type of extra state for this action. It is used solely
   * for Typescript type inference and action validation.
   */
  __extraStateType?: any;
}

export interface FileActionButton {
  name: string; // Button name
  toolbar?: boolean; // Whether to show the button in the toolbar
  contextMenu?: boolean; // Whether to show the button in the context menu
  group?: string; // Button group (dropdown in toolbar or section in context menu)
  tooltip?: string; // Help tooltip text
  icon?: ChonkyIconName | string | any; // Icon name
  iconOnly?: boolean; // Whether to only display the icon
}

export interface FileActionOption {
  id: string; // Unique option ID
  defaultValue: boolean; // Whether the option is enabled by default (required)
}

export type FileSelectionTransform = (data: {
  prevSelection: Set<string>;
  fileIds: ReadonlyArray<string>;
  fileMap: Readonly<FileMap>;
  hiddenFileIds: Set<string>;
}) => Nullable<Set<string>>;

export type FileActionEffect<Action extends FileAction = any> = (data: {
  action: Action;
  payload: Action['__payloadType'];
  state: FileActionState<{}>; // extra state is empty on purpose
  reduxDispatch: ChonkyDispatch;
  getReduxState: () => RootState;
}) => MaybePromise<undefined | boolean | void>;

export type FileActionMap = { [actonId: string]: FileAction };

export enum CustomVisibilityState {
  Hidden,
  Disabled,
  Default,
  Active,
}
