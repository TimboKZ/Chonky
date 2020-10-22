import { useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Nullable, Undefinable } from 'tsdef';

import {
    thunkActivateSortAction,
    thunkApplySelectionTransform,
    thunkToggleOption,
} from '../redux/file-actions.thunks';
import { reduxActions, RootState } from '../redux/reducers';
import {
    getSelectedFilesForAction,
    selectFileActionDispatcher,
    selectFileActionMap,
    selectSpecialActionDispatcher,
} from '../redux/selectors';
import {
    FileAction,
    FileActionData,
    FileActionHandler,
    InternalFileActionDispatcher,
} from '../types/file-actions.types';
import { SpecialAction } from '../types/special-actions.types';
import { useInstanceVariable } from './hooks-helpers';
import { Logger } from './logger';
import { isFunction } from './validation';

export const useInternalFileActionDispatcher = (
    externalFileActonHandler: Nullable<FileActionHandler>
): InternalFileActionDispatcher => {
    const externalFileActonHandlerRef = useInstanceVariable(externalFileActonHandler);
    const fileActionMapRef = useInstanceVariable(useSelector(selectFileActionMap));

    const dispatchFileAction: InternalFileActionDispatcher = useCallback(
        (actionData) => {
            Logger.debug(`FILE ACTION DISPATCH:`, actionData);
            const { actionId } = actionData;

            const action = fileActionMapRef.current[actionId];
            if (action) {
                if (isFunction(externalFileActonHandlerRef.current)) {
                    Promise.resolve(
                        externalFileActonHandlerRef.current(action, actionData)
                    ).catch((error) =>
                        Logger.error(
                            `User-defined "onAction" handler threw an error: ${error.message}`
                        )
                    );
                }
            } else {
                Logger.error(
                    `Internal components dispatched a "${actionId}" file action, ` +
                        `but such action was not registered.`
                );
            }
        },
        [externalFileActonHandlerRef, fileActionMapRef]
    );

    return dispatchFileAction;
};

export const useInternalFileActionRequester = () => {
    // Write Recoil state to instance variables so we can access these values from
    // the callback below without re-creating the callback function
    const store = useStore<RootState>();
    const dispatch = useDispatch();
    const fileActionMapRef = useInstanceVariable(useSelector(selectFileActionMap));
    const dispatchFileActionRef = useInstanceVariable(
        useSelector(selectFileActionDispatcher)
    );
    const dispatchSpecialActionRef = useInstanceVariable(
        useSelector(selectSpecialActionDispatcher)
    );

    return useCallback(
        (fileActionId: string): void => {
            Logger.debug(`FILE ACTION REQUEST:`, fileActionId);

            const action: Undefinable<FileAction> =
                fileActionMapRef.current[fileActionId];
            if (!action) {
                Logger.warn(
                    `Internal components requested the "${fileActionId}" file ` +
                        `action, but such action was not registered.`
                );
                return;
            }

            // Determine files for the action if action requires selection
            const selectedFilesForAction = getSelectedFilesForAction(
                store.getState(),
                action.id
            );

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

            // === Dispatch a normal action, as usual
            dispatchFileActionRef.current(actionData);

            // === Update sort state if necessary
            const sortKeySelector = action.sortKeySelector;
            if (sortKeySelector) dispatch(thunkActivateSortAction(action.id));

            // === Update file view state if necessary
            const fileViewConfig = action.fileViewConfig;
            if (fileViewConfig)
                dispatch(reduxActions.setFileViewConfig(fileViewConfig));

            // === Update option state if necessary
            const option = action.option;
            if (option) dispatch(thunkToggleOption(option.id));

            // === Apply selection transform if necessary
            const selectionTransform = action.selectionTransform;
            if (selectionTransform) dispatch(thunkApplySelectionTransform(action));

            //
            // === Dispatch a special action if file action defines it
            const specialActionId = action.specialActionToDispatch;
            if (specialActionId) {
                // We can only dispatch "simple" special actions, i.e. special
                // actions that do not require additional parameters.
                switch (specialActionId) {
                    case SpecialAction.OpenParentFolder:
                        dispatchSpecialActionRef.current({
                            actionId: specialActionId,
                        });
                        break;
                    default:
                        Logger.warn(
                            `File action "${action.id}" tried to dispatch a ` +
                                `special action "${specialActionId}", but that ` +
                                `special action was not marked as simple. File ` +
                                `actions can only trigger simple special actions.`
                        );
                }
            }
        },
        [
            store,
            dispatch,
            fileActionMapRef,
            dispatchFileActionRef,
            dispatchSpecialActionRef,
        ]
    );
};
