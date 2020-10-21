import { Nullable } from 'tsdef';

import { FileData } from './files.types';

export type FileSortKeySelector = (file: Nullable<FileData>) => any;

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}
