import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    reducers: {
        setRawFiles(state, action: PayloadAction<FileArray | any>) {
            if (state.rawFiles === action.payload) return;
            state.rawFiles = action.payload;
        },
        setSanitizedFiles(state, action: PayloadAction<FileArray>) {
            if (state.sanitizedFiles === action.payload) return;
            state.sanitizedFiles = action.payload;
        },
    },
});
