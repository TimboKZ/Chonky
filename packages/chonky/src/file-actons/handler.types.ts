// Types for file action handlers
import { FileAction, FileActionState } from './actions.types';

export type ActionData<Action extends FileAction> = {
    id: Action['id'];
    action: Action;
    payload: Action['__payloadType'];
    state: FileActionState<Action['__extraStateType']>;
};

type MapFileActionsToData<U> = U extends FileAction ? ActionData<U> : never;

export type GenericFileActionHandler<T> = (
    data: MapFileActionsToData<T>
) => void | Promise<void>;
