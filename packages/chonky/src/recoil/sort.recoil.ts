import { atom } from 'recoil';

import { SortConfig, SortOrder } from '../types/sort.types';
import { ChonkyActions } from '../util/file-actions-definitions';

//
// ==== Atoms
export const sortConfigState = atom<SortConfig>({
    key: 'sortConfigState',
    default: {
        fileActionId: ChonkyActions.SortFilesByName.id,
        sortKeySelector: ChonkyActions.SortFilesByName.sortKeySelector,
        order: SortOrder.Asc,
    },
});
