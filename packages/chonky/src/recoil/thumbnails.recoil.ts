import { atom } from 'recoil';
import { Nullable } from 'tsdef';

import { ThumbnailGenerator } from '../types/thumbnails.types';

//
// ==== Atoms
export const thumbnailGeneratorState = atom<Nullable<ThumbnailGenerator>>({
    key: 'thumbnailGeneratorState',
    default: null,
});
