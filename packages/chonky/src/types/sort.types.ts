import { Nullable } from 'tsdef';

import { FileData } from './files.types';

export type FileSortKeySelector = (file: Nullable<FileData>) => any;

export enum SortOrder {
    Asc = 'asc',
    Desc = 'desc',
}

export interface SortConfig {
    fileActionId: string;
    sortKeySelector: FileSortKeySelector;
    order: SortOrder;
}
