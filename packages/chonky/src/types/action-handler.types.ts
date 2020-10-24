import { AnyObject, Nullable } from 'tsdef';

import { FileAction } from './action.types';
import { FileData } from './files.types';

export type FileActionData<Action extends FileAction> = {
    id: Action['id'];
    action: Action;
    payload: Action['__payloadType'];
    state: FileActionState<Action['__extraStateType']>;
};

export type FileActionState<ExtraState extends object = AnyObject> = {
    instanceId: string;
    selectedFiles: FileData[];
    selectedFilesForAction: FileData[];
    contextMenuTriggerFile: Nullable<FileData>;
} & ExtraState;

export type MapFileActionsToData<U> = U extends FileAction ? FileActionData<U> : never;

export type GenericFileActionHandler<T> = (
    data: MapFileActionsToData<T>
) => void | Promise<void>;
