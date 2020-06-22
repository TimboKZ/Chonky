import { atom } from 'recoil';

import { ErrorMessageData } from '../types/validation.types';

//
// ==== Atoms
export const validationErrorsState = atom<ErrorMessageData[]>({
    key: 'validationErrorState',
    default: [],
});
