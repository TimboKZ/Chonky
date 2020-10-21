import { atom } from 'recoil';

//
// ==== Atoms
export const clearSelectionOnOutsideClickState = atom<boolean>({
    key: 'clearSelectionOnOutsideClickState',
    default: true,
});
