import { Nullable } from 'tsdef';

export enum ChonkyView {
    Details = 'details',
    SmallThumbs = 'small_thumbs',
}

export interface FileViewConfig {
    entryWidth?: Nullable<number>;
    entryHeight: number;
}

export interface FileEntrySize {


    width?: Nullable<number>;
    height: number;
}
