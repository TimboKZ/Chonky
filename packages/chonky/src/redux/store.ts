import { configureStore } from '@reduxjs/toolkit';
import { DeepPartial } from 'tsdef';

import { useStaticValue } from '../util/hooks-helpers';
import { rootReducer, RootState } from './reducer';

export const useChonkyStore = (chonkyId: string) => {
    const preloadedState: DeepPartial<RootState> = {};

    return useStaticValue(() =>
        configureStore({
            preloadedState,
            reducer: rootReducer,
            devTools: { name: chonkyId },
        })
    );
};
