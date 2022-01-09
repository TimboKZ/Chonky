import { AnyObject, Nullable } from 'tsdef';

import { FileAction } from './action.types';
import { FileData } from './file.types';

export type FileActionData<Action extends FileAction> = {
  id: Action['id'];
  action: Action;
  payload: Action['__payloadType'];
  state: FileActionState<Action['__extraStateType']>;
};

export type FileActionState<ExtraState extends object = AnyObject> = {
  /**
   * The ID of the Chonky instance that dispatched this action. This is useful if
   * you're reusing the same action handler for multiple Chonky instances.
   */
  instanceId: string;
  /**
   * All selected files at the time the action was requested. Note that this does not
   * reflect the changes applied by action's selection transform, if one is defined.
   */
  selectedFiles: FileData[];
  /**
   * Selected files filtered using actions file filter. If not file filter is defined,
   * this is the same as `selectedFiles`. Note that this does not reflect the changes
   * applied by action's selection transform, if one is defined.
   */
  selectedFilesForAction: FileData[];
  /**
   * If this action was requested using the file context menu, this field will hold
   * the file that user right-clicked on to open the menu. If this action was not
   * triggered using the context menu or right click was not on any file, this will be
   * `null`.
   */
  contextMenuTriggerFile: Nullable<FileData>;
} & ExtraState;

export type MapFileActionsToData<U> = U extends FileAction ? FileActionData<U> : never;

export type GenericFileActionHandler<T> = (data: MapFileActionsToData<T>) => void | Promise<void>;
