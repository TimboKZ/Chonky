import { configureStore } from '@reduxjs/toolkit';
import { DeepPartial } from 'tsdef';

import { useStaticValue } from '../util/hooks-helpers';
import { rootReducer, RootState } from './reducer';

export const useChonkyStore = (chonkyId: string) => {
    return useStaticValue(() => {
        const preloadedState: DeepPartial<RootState> = {};
        return configureStore({
            preloadedState: preloadedState as any,
            reducer: rootReducer,
            devTools: { name: chonkyId },
        });
    });
};
