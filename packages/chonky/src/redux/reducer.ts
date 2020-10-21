import { createSlice } from '@reduxjs/toolkit';

import { FileArray } from '../types/files.types';

export interface RootState {
    rawFiles: FileArray | any;
    sanitizedFiles: FileArray;
}

const initialState: RootState = {
    // Raw files input
    rawFiles: [],
    // Sanitized files
    sanitizedFiles: [],
};

export const { actions: reduxActions, reducer: rootReducer } = createSlice({
    name: 'root',
    initialState,
    reducers: {},
});
