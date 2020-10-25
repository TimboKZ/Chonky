import { configureStore } from '@reduxjs/toolkit';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../types/redux.types';
import { useStaticValue } from '../util/hooks-helpers';
import { ThunkExtraArgument } from './middleware';
import { rootReducer } from './reducers';
import { initialRootState } from './state';
import { useStoreWatchers } from './watchers';

export const useChonkyStore = (chonkyInstanceId: string) => {
    const store = useStaticValue(() => {
        const preloadedState: RootState = {
            ...initialRootState,
            instanceId: chonkyInstanceId,
        };

        const thunkExtraArgument = new ThunkExtraArgument();

        return configureStore({
            preloadedState: preloadedState as any,
            reducer: rootReducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: false,
                    thunk: { extraArgument: thunkExtraArgument },
                }),
            devTools: { name: `chonky_${chonkyInstanceId}` },
        });
    });
    useStoreWatchers(store);
    return store;
};

/**
 * Hook that can be used with parametrized selectors.
 */
export const useParamSelector = <Args extends Array<any>, Value>(
    parametrizedSelector: (...args: Args) => (state: RootState) => Value,
    ...selectorParams: Args
) => {
    const selector = useCallback(
        (state: RootState) => parametrizedSelector(...selectorParams)(state),
        // eslint-disable-next-line
        [parametrizedSelector, ...selectorParams]
    );
    return useSelector(selector);
};

/**
 * DTE - DispatchThunkEffect. This method is used to decrease code duplication in
 * main Chonky method.
 */
export const useDTE = <Args extends Array<any>, Value>(
    actionCreator: (...args: Args) => any,
    ...selectorParams: Args
) => {
    const dispatch = useDispatch();
    useEffect(
        () => {
            dispatch(actionCreator(...selectorParams));
        },
        // eslint-disable-next-line
        [dispatch, actionCreator, ...selectorParams]
    );
};
