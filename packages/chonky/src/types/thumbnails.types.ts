import { Nilable } from 'tsdef';

import { FileData } from './files.types';

export type ThumbnailGenerator = (
    file: FileData
) => Nilable<string> | Promise<Nilable<string>>;
