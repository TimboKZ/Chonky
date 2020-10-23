import { MaybePromise, Undefinable } from 'tsdef';

import { FileAction, FileActionData } from '../../file-actons/actions.types';
import { ActionData } from '../../file-actons/handler.types';
import { isPromise } from '../../util/helpers';
import { Logger } from '../../util/logger';
import { reduxActions } from '../reducers';
import { getSelectedFilesForAction, selectFileActionMap, } from '../selectors';
import { ChonkyDispatch, ChonkyThunk } from '../types';
import {
    thunkActivateSortAction,
    thunkApplySelectionTransform,
    thunkToggleOption,
} from './file-actions.thunks';

/**
 * Thunk that dispatches actions to the external (user-provided) action handler.
 */
export const thunkNewDispatchFileAction = (
    data: ActionData<FileAction>
): ChonkyThunk => (dispatch, getState) => {
    Logger.debug(`FILE ACTION DISPATCH: [${data.id}]`, 'data:', data);
    const state = getState();
    const action = selectFileActionMap(state)[data.id];
    if (action) {
        if (state.newExternalFileActionHandler) {
            Promise.resolve(state.newExternalFileActionHandler(data)).catch((error) =>
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
export const thunkNewRequestFileAction = <Action extends FileAction>(
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

    if (!selectFileActionMap(state)[action.id]) {
        Logger.warn(
            `The action "${action.id}" was requested, but it is not registered. The ` +
                `action will still be dispatched, but this might indicate a bug in ` +
                `the code. Please register your actions by passing them to ` +
                `"fileActions" prop.`
        );
    }

    // Determine files for the action if action requires selection
    const selectedFilesForAction = getSelectedFilesForAction(state, action.id);
    if (
        action.requiresSelection &&
        (!selectedFilesForAction || selectedFilesForAction.length === 0)
    ) {
        Logger.warn(
            `Internal components requested the "${action.id}" file ` +
                `action, but the selection for this action was empty. This ` +
                `might a bug in the code of the presentational components.`
        );
        return;
    }
    const actionData: FileActionData = {
        actionId: action.id,
        target: undefined,
        files: selectedFilesForAction,
    };
    if (actionData) {
        console.log('Hello!');
    }

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
    let maybeEffectPromise: MaybePromise<boolean | undefined> | undefined = undefined;
    if (effect) {
        try {
            maybeEffectPromise = effect({ action, payload, dispatch, getState });
        } catch (error) {
            Logger.error(
                `User-defined effect function for action ${action.id} threw an ` +
                    `error: ${error.message}`
            );
        }
    }

    // Dispatch the action to user code. Deliberately call it after all other
    // operations are over.
    Promise.resolve(maybeEffectPromise)
        .then((effectResult) => {
            const data: ActionData<Action> = {
                id: action.id,
                action,
                payload,
                state: { instanceId: 'zxc' },
            };
            triggerNewDispatchAfterEffect(dispatch, data, effectResult);
        })
        .catch((error) => {
            Logger.error(
                `User-defined effect function for action ${action.id} returned a ` +
                    `promise that was rejected: ${error.message}`
            );
            const data: ActionData<Action> = {
                id: action.id,
                action,
                payload,
                state: { instanceId: 'zxc' },
            };
            triggerNewDispatchAfterEffect(dispatch, data, undefined);
        });
};

export const triggerNewDispatchAfterEffect = <Action extends FileAction>(
    dispatch: ChonkyDispatch,
    data: ActionData<Action>,
    effectResult: Undefinable<boolean>
) => {
    const preventDispatch = effectResult === true;
    if (!preventDispatch) dispatch(thunkNewDispatchFileAction(data));
};

/**
 * Thunk that dispatches actions to the external (user-provided) action handler.
 */
export const thunkDispatchFileAction = (actionData: FileActionData): ChonkyThunk => (
    dispatch,
    getState
) => {
    Logger.debug(`FILE ACTION DISPATCH:`, actionData);
    const state = getState();
    const { actionId } = actionData;

    const action = selectFileActionMap(state)[actionId];
    if (action) {
        if (state.externalFileActionHandler) {
            Promise.resolve(
                state.externalFileActionHandler(action, actionData)
            ).catch((error) =>
                Logger.error(
                    `User-defined file action handler threw an error: ${error.message}`
                )
            );
        }
    } else {
        Logger.error(
            `Internal components dispatched a "${actionId}" file action, ` +
                `but such action was not registered.`
        );
    }
};

/**
 * Thunk that is used by internal components (and potentially the user) to "request"
 * actions. When action is requested, Chonky "prepares" the action data by extracting it
 * from Redux state. Once action data is ready, Chonky executes some side effect and/or
 * dispatches the action to the external action handler.
 */
export const thunkRequestFileAction = (fileActionId: string): ChonkyThunk => (
    dispatch,
    getState
) => {
    Logger.debug(`FILE ACTION REQUEST:`, fileActionId);
    const state = getState();

    const action: Undefinable<FileAction> = selectFileActionMap(state)[fileActionId];
    if (!action) {
        Logger.warn(
            `Internal components requested the "${fileActionId}" file ` +
                `action, but such action was not registered.`
        );
        return;
    }

    // Determine files for the action if action requires selection
    const selectedFilesForAction = getSelectedFilesForAction(state, action.id);

    if (
        action.requiresSelection &&
        (!selectedFilesForAction || selectedFilesForAction.length === 0)
    ) {
        Logger.warn(
            `Internal components requested the "${fileActionId}" file ` +
                `action, but the selection for this action was empty. This ` +
                `might a bug in the code of the presentational components.`
        );
        return;
    }

    const actionData: FileActionData = {
        actionId: action.id,
        target: undefined,
        files: selectedFilesForAction,
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
    let effectResult: MaybePromise<boolean | undefined> | undefined = undefined;
    if (effect) {
        try {
            // @ts-ignore
            effectResult = effect({ dispatch, getState });
        } catch (error) {
            Logger.error(
                `User-defined effect function for action ${action.id} threw an ` +
                    `error: ${error.message}`
            );
        }
    }

    // Dispatch the action to user code. Deliberately call it after all other
    // operations are over.
    if (isPromise(effectResult)) {
        effectResult
            .then((effectPromiseResult) =>
                triggerDispatchAfterEffect(dispatch, actionData, effectPromiseResult)
            )
            .catch((error) => {
                Logger.error(
                    `User-defined effect function for action ${action.id} returned a ` +
                        `promise that was rejected: ${error.message}`
                );
                triggerDispatchAfterEffect(dispatch, actionData, undefined);
            });
    } else {
        triggerDispatchAfterEffect(dispatch, actionData, effectResult);
    }
};

export const triggerDispatchAfterEffect = (
    dispatch: ChonkyDispatch,
    actionData: FileActionData,
    effectResult: Undefinable<boolean>
) => {
    const preventDispatch = effectResult === true;
    if (!preventDispatch) dispatch(thunkDispatchFileAction(actionData));
};
