import { AnyObject } from 'tsdef';

import { FileAction } from './actions.types';

export type FileActionData<Action extends FileAction> = {
    id: Action['id'];
    action: Action;
    payload: Action['__payloadType'];
    state: FileActionState<Action['__extraStateType']>;
};

export type FileActionState<ExtraState extends object = AnyObject> = {
    instanceId: string;
    selectedFilesForAction?: FileAction[];
} & ExtraState;

export type MapFileActionsToData<U> = U extends FileAction ? FileActionData<U> : never;

export type GenericFileActionHandler<T> = (
    data: MapFileActionsToData<T>
) => void | Promise<void>;
