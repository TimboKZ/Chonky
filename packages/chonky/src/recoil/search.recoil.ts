import { atom } from 'recoil';

//
// ==== Atoms
export const searchBarEnabledState = atom<boolean>({
    key: 'searchBarEnabledState',
    default: false,
});

export const searchBarVisibleState = atom<boolean>({
    key: 'searchBarVisibleState',
    default: false,
});

export const searchFilterState = atom<string>({
    key: 'searchFilterState',
    default: '',
});
