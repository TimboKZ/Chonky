import { atom } from 'recoil';

import { InternalSpecialActionDispatcher } from '../types/special-actions.types';
import { NOOP_FUNCTION } from '../util/constants';

//
// ==== Atoms
export const dispatchSpecialActionState = atom<InternalSpecialActionDispatcher>({
    key: 'dispatchSpecialActionState',
    default: NOOP_FUNCTION,
});
