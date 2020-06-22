import { atom, selector } from 'recoil';

import { FileSelection, SelectionModifiers } from '../types/selection.types';
import { NOOP_FUNCTION } from '../util/constants';

//
// ==== Atoms
export const selectionState = atom<FileSelection>({
    key: 'selectionState',
    default: {},
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
export const selectionSizeState = selector({
    key: 'selectionSizeState',
    get: ({ get }) => {
        const selection = get(selectionState);

        let selectionSize = 0;
        for (const fileId in selection) {
            if (selection.hasOwnProperty(fileId)) {
                if (selection[fileId] === true) selectionSize++;
            }
        }

        return selectionSize;
    },
});
