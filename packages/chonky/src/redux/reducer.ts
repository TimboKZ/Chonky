import { createSlice } from '@reduxjs/toolkit';

import { FileArray } from '../types/files.types';

export interface RootState {
    rawFiles: FileArray | any;
}

const initialState: RootState = {
    rawFiles: [],
};

export const { actions: reduxActions, reducer: rootReducer } = createSlice({
    name: 'root',
    initialState,
    reducers: {},
});
