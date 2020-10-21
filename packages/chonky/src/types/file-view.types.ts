import { Nullable } from 'tsdef';

export interface FileViewConfig {
    entryWidth?: Nullable<number>;
    entryHeight: number;
}

export interface FileEntrySize {
    width?: Nullable<number>;
    height: number;
}
