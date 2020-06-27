import { atom, selectorFamily } from 'recoil';
import { Undefinable } from 'tsdef';

import { OptionMap } from '../types/options.types';

//
// ==== Atoms
export const optionMapState = atom<OptionMap>({
    key: 'optionMapState',
    default: {},
});

//
// ==== Selectors
export const optionState = selectorFamily<Undefinable<boolean>, string>({
    key: 'optionEnabledState',
    get: (optionId) => ({ get }) => {
        return get(optionMapState)[optionId];
    },
});
