import { atom } from 'recoil';

//
// ==== Atoms
export const enableDragAndDropState = atom<boolean>({
    key: 'enableDragAndDropState',
    default: false,
});
