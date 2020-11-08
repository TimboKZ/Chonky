import { MaybePromise, Undefinable } from 'tsdef';

import { FileActionData, FileActionState } from '../../types/action-handler.types';
import { FileAction } from '../../types/action.types';
import { ChonkyDispatch, ChonkyThunk } from '../../types/redux.types';
import { Logger } from '../../util/logger';
import { reduxActions } from '../reducers';
import {
    selectContextMenuTriggerFile,
    selectExternalFileActionHandler,
    selectFileActionMap,
    selectInstanceId,
    selectSelectedFiles,
} from '../selectors';
import {
    thunkActivateSortAction,
    thunkApplySelectionTransform,
    thunkToggleOption,
} from './file-actions.thunks';

/**
 * Thunk that dispatches actions to the external (user-provided) action handler.
 */
export const thunkDispatchFileAction = (
    data: FileActionData<FileAction>
): ChonkyThunk => (dispatch, getState) => {
    Logger.debug(`FILE ACTION DISPATCH: [${data.id}]`, 'data:', data);
    const state = getState();
    const action = selectFileActionMap(state)[data.id];
    const externalFileActionHandler = selectExternalFileActionHandler(state);
    if (action) {
        if (externalFileActionHandler) {
            Promise.resolve(externalFileActionHandler(data)).catch((error) =>
                Logger.error(
                    `User-defined file action handler threw an error: ${error.message}`
                )
            );
        }
    } else {
        Logger.warn(
            `Internal components dispatched the "${data.id}" file action, but such ` +
                `action was not registered.`
        );
    }
};

/**
 * Thunk that is used by internal components (and potentially the user) to "request"
 * actions. When action is requested, Chonky "prepares" the action data by extracting it
 * from Redux state. Once action data is ready, Chonky executes some side effect and/or
 * dispatches the action to the external action handler.
 */
export const thunkRequestFileAction = <Action extends FileAction>(
    action: Action,
    payload: Action['__payloadType']
): ChonkyThunk => (dispatch, getState) => {
    Logger.debug(
        `FILE ACTION REQUEST: [${action.id}]`,
        'action:',
        action,
        'payload:',
        payload
    );
    const state = getState();
    const instanceId = selectInstanceId(state);

    if (!selectFileActionMap(state)[action.id]) {
        Logger.warn(
            `The action "${action.id}" was requested, but it is not registered. The ` +
                `action will still be dispatched, but this might indicate a bug in ` +
                `the code. Please register your actions by passing them to ` +
                `"fileActions" prop.`
        );
    }

    // Determine files for the action if action requires selection
    const selectedFiles = selectSelectedFiles(state);
    const selectedFilesForAction = action.fileFilter
        ? selectedFiles.filter(action.fileFilter)
        : selectedFiles;
    if (action.requiresSelection && selectedFilesForAction.length === 0) {
        Logger.warn(
            `Internal components requested the "${action.id}" file ` +
                `action, but the selection for this action was empty. This ` +
                `might a bug in the code of the presentational components.`
        );
        return;
    }

    const contextMenuTriggerFile = selectContextMenuTriggerFile(state);
    const actionState: FileActionState<{}> = {
        instanceId,
        selectedFiles,
        selectedFilesForAction,
        contextMenuTriggerFile,
    };

    // === Update sort state if necessary
    const sortKeySelector = action.sortKeySelector;
    if (sortKeySelector) dispatch(thunkActivateSortAction(action.id));

    // === Update file view state if necessary
    const fileViewConfig = action.fileViewConfig;
    if (fileViewConfig) dispatch(reduxActions.setFileViewConfig(fileViewConfig));

    // === Update option state if necessary
    const option = action.option;
    if (option) dispatch(thunkToggleOption(option.id));

    // === Apply selection transform if necessary
    const selectionTransform = action.selectionTransform;
    if (selectionTransform) dispatch(thunkApplySelectionTransform(action));

    // Apply the effect
    const effect = action.effect;
    let maybeEffectPromise: MaybePromise<boolean | undefined> = undefined;
    if (effect) {
        try {
            maybeEffectPromise = effect({
                action,
                payload,
                state: actionState,
                reduxDispatch: dispatch,
                getReduxState: getState,
            }) as MaybePromise<boolean | undefined>;
        } catch (error) {
            Logger.error(
                `User-defined effect function for action ${action.id} threw an ` +
                    `error: ${error.message}`
            );
        }
    }

    // Dispatch the action to user code. Deliberately call it after all other
    // operations are over.
    return Promise.resolve(maybeEffectPromise)
        .then((effectResult) => {
            const data: FileActionData<Action> = {
                id: action.id,
                action,
                payload,
                state: actionState,
            };
            triggerDispatchAfterEffect(dispatch, data, effectResult);
        })
        .catch((error) => {
            Logger.error(
                `User-defined effect function for action ${action.id} returned a ` +
                    `promise that was rejected: ${error.message}`
            );
            const data: FileActionData<Action> = {
                id: action.id,
                action,
                payload,
                state: actionState,
            };
            triggerDispatchAfterEffect(dispatch, data, undefined);
        });
};

export const triggerDispatchAfterEffect = <Action extends FileAction>(
    dispatch: ChonkyDispatch,
    data: FileActionData<Action>,
    effectResult: Undefinable<boolean>
) => {
    const preventDispatch = effectResult === true;
    if (!preventDispatch) dispatch(thunkDispatchFileAction(data));
};
