import { atom, selector, selectorFamily } from 'recoil';
import { Nullable } from 'tsdef';

import { FileSelection, SelectionModifiers } from '../types/selection.types';
import { NOOP_FUNCTION } from '../util/constants';
import { SelectionHelper } from '../util/selection';
import { filesState } from './files.recoil';

//
// ==== Atoms
export const selectionState = atom<FileSelection>({
    key: 'selectionState',
    default: new Set(),
});

export const selectionModifiersState = atom<SelectionModifiers>({
    key: 'selectionModifiersState',
    default: {
        selectFiles: NOOP_FUNCTION,
        toggleSelection: NOOP_FUNCTION,
        clearSelection: NOOP_FUNCTION,
    },
});

//
// ==== Selectors
export const selectedFilesState = selector({
    key: 'selectedFilesState',
    get: ({ get }) => {
        const files = get(filesState);
        const selection = get(selectionState);

        return SelectionHelper.getSelectedFiles(files, selection);
    },
});

export const selectionSizeState = selector({
    key: 'selectionSizeState',
    get: ({ get }) => {
        const selection = get(selectionState);
        return selection.size;
    },
});

export const fileSelectedState = selectorFamily<boolean, Nullable<string>>({
    key: 'fileSelectedState',
    get: (fileId) => ({ get }) => {
        // We deliberately don't use `FileHelper.isSelectable` here. We want
        // the UI to represent the true state of selection. This will help users
        // see what exactly the selection is before running some code.
        return !!fileId && get(selectionState).has(fileId);
    },
});
