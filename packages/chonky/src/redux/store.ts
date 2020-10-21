import { configureStore } from '@reduxjs/toolkit';
import { DeepPartial } from 'tsdef';

import { useStaticValue } from '../util/hooks-helpers';
import { initialState, rootReducer, RootState } from './reducers';

export const useChonkyStore = (chonkyId: string) => {
    return useStaticValue(() => {
        const preloadedState: DeepPartial<RootState> = {
            ...initialState,
        };
        return configureStore({
            preloadedState: preloadedState as any,
            reducer: rootReducer,
            devTools: { name: chonkyId },
        });
    });
};
