/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {Nilable, Nullable} from 'tsdef';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

declare global {
    interface Window {
        _chonkyData: {
            kbListenerSet: Set<InputListener>;
        };
    }
}

// Required properties are marked with `!!`
export interface FileData {
    id: string; // !! String that uniquely identifies the file

    name: string; // !! Full name, e.g. `MyImage.jpg`
    ext?: string; // File extension, e.g. `.jpg`

    isDir?: boolean; // Is a directory, default: false
    isHidden?: boolean; // Is a hidden file, default: false
    isSymlink?: boolean; // Is a symlink, default: false
    openable?: boolean; // Can be opened, default: true
    selectable?: boolean; // Can be selected, default: true

    size?: number; // File size in bytes
    modDate?: Date; // Last change date

    parentId?: string; // ID of the parent folder
    childrenIds?: string[]; // An array of IDs of children (only for folders)
}

export type FileArray = Nullable<FileData>[];

export interface FileIndexMap {[id: string]: number}

export interface FileMap {
    [id: string]: FileData;
}

export interface Selection {
    [fileId: string]: boolean | undefined;
}

export enum SelectionType {
    Single,
    Multiple,
    Range,
    All,
    None,
}

export enum SelectionStatus {
    NeedsCleaning,
    NeedsResetting,
    Ok,
}

export interface IconData {
    icon: IconProp;
    colorCode: number;
}

export enum KbKey {
    Backspace = 'backspace',
    Enter = 'enter',
    Escape = 'escape',
    Space = 'space',
    Delete = 'delete',
    A = 'a',
}

// From https://keycode.info/
export const kbCodeMap: { [code: string]: KbKey } = {
    Backspace: KbKey.Backspace,
    Enter: KbKey.Enter,
    Escape: KbKey.Escape,
    Space: KbKey.Space,
    Delete: KbKey.Delete,
    KeyA: KbKey.A,
};
export const kbKeyMap: { [code: string]: KbKey } = {
    Enter: KbKey.Enter,
    ' ': KbKey.Space,
};
export const kbKeyCodeMap: { [keyCode: number]: KbKey } = {
    [8]: KbKey.Backspace,
    [13]: KbKey.Enter,
    [27]: KbKey.Escape,
    [32]: KbKey.Space,
    [46]: KbKey.Delete,
    [65]: KbKey.A,
};

export enum InputEventType {
    Mouse = 'mouse',
    Keyboard = 'keyboard',
}

export interface InputEvent {
    type: InputEventType;
    ctrlKey: boolean;
    shiftKey: boolean;
    key?: Nilable<KbKey>; // For keyboard events only
}

export type InputListener = (event: InputEvent) => boolean;

export type ActionHandlerResult = Nilable<boolean> | Promise<Nilable<boolean>>;
export type SingleFileActionHandler = <T extends FileData = FileData>(file: T, event?: InputEvent) => ActionHandlerResult;
export type MultiFileActionHandler = <T extends FileData = FileData>(files: T[], event?: InputEvent) => ActionHandlerResult;

export type InternalClickHandler = (file: FileData, fileIndex: number, event: InputEvent) => void;

export type ThumbnailGenerator = (file: FileData) => Nilable<string> | Promise<Nilable<string>>;

export enum FileView {
    Details = 'details',
    SmallThumbs = 'small-thumbs',
    LargeThumbs = 'large-thumbs',
}

export interface EntrySize {
    width: number;
    height: number;
}

export enum Option {
    ShowHidden = 'showHidden',
    FoldersFirst = 'foldersFirst',
    ShowRelativeDates = 'showRelativeDates',
    DisableTextSelection = 'disableTextSelection',
}

export interface Options {
    showHidden: boolean;
    foldersFirst: boolean;
    showRelativeDates: boolean;
    disableTextSelection: boolean;
}

export enum SortProperty {
    Name = 'name',
    Size = 'size',
    ModDate = 'modDate',
}

export enum SortOrder {
    Asc = 'asc',
    Desc = 'desc',
}

export const VideoExtensions: string[] = [
    '3g2',
    '3gp',
    '3gpp',
    'asf',
    'asx',
    'avi',
    'dvb',
    'f4v',
    'fli',
    'flv',
    'fvt',
    'h261',
    'h263',
    'h264',
    'jpgm',
    'jpgv',
    'jpm',
    'm1v',
    'm2v',
    'm4u',
    'm4v',
    'mj2',
    'mjp2',
    'mk3d',
    'mks',
    'mkv',
    'mng',
    'mov',
    'movie',
    'mp4',
    'mp4v',
    'mpe',
    'mpeg',
    'mpg',
    'mpg4',
    'mxu',
    'ogv',
    'pyv',
    'qt',
    'smv',
    'ts',
    'uvh',
    'uvm',
    'uvp',
    'uvs',
    'uvu',
    'uvv',
    'uvvh',
    'uvvm',
    'uvvp',
    'uvvs',
    'uvvu',
    'uvvv',
    'viv',
    'vob',
    'webm',
    'wm',
    'wmv',
    'wmx',
    'wvx',
];
export const ImageExtensions: string[] = [
    '3ds',
    'apng',
    'azv',
    'bmp',
    'bmp',
    'btif',
    'cgm',
    'cmx',
    'djv',
    'djvu',
    'drle',
    'dwg',
    'dxf',
    'emf',
    'exr',
    'fbs',
    'fh',
    'fh4',
    'fh5',
    'fh7',
    'fhc',
    'fits',
    'fpx',
    'fst',
    'g3',
    'gif',
    'heic',
    'heics',
    'heif',
    'heifs',
    'ico',
    'ico',
    'ief',
    'jls',
    'jng',
    'jp2',
    'jpe',
    'jpeg',
    'jpf',
    'jpg',
    'jpg2',
    'jpm',
    'jpx',
    'jxr',
    'ktx',
    'mdi',
    'mmr',
    'npx',
    'pbm',
    'pct',
    'pcx',
    'pcx',
    'pgm',
    'pic',
    'png',
    'pnm',
    'ppm',
    'psd',
    'pti',
    'ras',
    'rgb',
    'rlc',
    'sgi',
    'sid',
    'sub',
    'svg',
    'svgz',
    't38',
    'tap',
    'tfx',
    'tga',
    'tif',
    'tiff',
    'uvg',
    'uvi',
    'uvvg',
    'uvvi',
    'vtf',
    'wbmp',
    'wdp',
    'webp',
    'wmf',
    'xbm',
    'xif',
    'xpm',
    'xwd',
];
export const AudioExtensions: string[] = [
    '3gpp',
    'aac',
    'adp',
    'aif',
    'aifc',
    'aiff',
    'au',
    'caf',
    'dra',
    'dts',
    'dtshd',
    'ecelp4800',
    'ecelp7470',
    'ecelp9600',
    'eol',
    'flac',
    'kar',
    'lvp',
    'm2a',
    'm3a',
    'm3u',
    'm4a',
    'm4a',
    'mid',
    'midi',
    'mka',
    'mp2',
    'mp2a',
    'mp3',
    'mp3',
    'mp4a',
    'mpga',
    'oga',
    'ogg',
    'pya',
    'ra',
    'ra',
    'ram',
    'rip',
    'rmi',
    'rmp',
    's3m',
    'sil',
    'snd',
    'spx',
    'uva',
    'uvva',
    'wav',
    'wav',
    'wav',
    'wax',
    'weba',
    'wma',
    'xm',
];
export const ColorsLight: string[] = [
    '#bbbbbb',
    '#d65c5c',
    '#d6665c',
    '#d6705c',
    '#d67a5c',
    '#d6855c',
    '#d68f5c',
    '#d6995c',
    '#d6a35c',
    '#d6ad5c',
    '#d6b85c',
    '#d6c25c',
    '#d6cc5c',
    '#d6d65c',
    '#ccd65c',
    '#c2d65c',
    '#b8d65c',
    '#add65c',
    '#a3d65c',
    '#99d65c',
    '#8fd65c',
    '#85d65c',
    '#7ad65c',
    '#70d65c',
    '#66d65c',
    '#5cd65c',
    '#5cd666',
    '#5cd670',
    '#5cd67a',
    '#5cd685',
    '#5cd68f',
    '#5cd699',
    '#5cd6a3',
    '#5cd6ad',
    '#5cd6b8',
    '#5cd6c2',
    '#5cd6cc',
    '#5cd6d6',
    '#5cccd6',
    '#5cc2d6',
    '#5cb8d6',
    '#5cadd6',
    '#5ca3d6',
    '#5c99d6',
    '#5c8fd6',
    '#5c85d6',
    '#5c7ad6',
    '#5c70d6',
    '#5c66d6',
    '#5c5cd6',
    '#665cd6',
    '#705cd6',
    '#7a5cd6',
    '#855cd6',
    '#8f5cd6',
    '#995cd6',
    '#a35cd6',
    '#ad5cd6',
    '#b85cd6',
    '#c25cd6',
    '#cc5cd6',
    '#d65cd6',
    '#d65ccc',
    '#d65cc2',
    '#d65cb8',
    '#d65cad',
    '#d65ca3',
    '#d65c99',
    '#d65c8f',
    '#d65c85',
    '#d65c7a',
    '#d65c70',
    '#d65c66',
];
export const ColorsDark: string[] = [
    '#777',
    '#8f3d3d',
    '#8f443d',
    '#8f4b3d',
    '#8f523d',
    '#8f583d',
    '#8f5f3d',
    '#8f663d',
    '#8f6d3d',
    '#8f743d',
    '#8f7a3d',
    '#8f813d',
    '#8f883d',
    '#8f8f3d',
    '#888f3d',
    '#818f3d',
    '#7a8f3d',
    '#748f3d',
    '#6d8f3d',
    '#668f3d',
    '#5f8f3d',
    '#588f3d',
    '#528f3d',
    '#4b8f3d',
    '#448f3d',
    '#3d8f3d',
    '#3d8f44',
    '#3d8f4b',
    '#3d8f52',
    '#3d8f58',
    '#3d8f5f',
    '#3d8f66',
    '#3d8f6d',
    '#3d8f74',
    '#3d8f7a',
    '#3d8f81',
    '#3d8f88',
    '#3d8f8f',
    '#3d888f',
    '#3d818f',
    '#3d7a8f',
    '#3d748f',
    '#3d6d8f',
    '#3d668f',
    '#3d5f8f',
    '#3d588f',
    '#3d528f',
    '#3d4b8f',
    '#3d448f',
    '#3d3d8f',
    '#443d8f',
    '#4b3d8f',
    '#523d8f',
    '#583d8f',
    '#5f3d8f',
    '#663d8f',
    '#6d3d8f',
    '#743d8f',
    '#7a3d8f',
    '#813d8f',
    '#883d8f',
    '#8f3d8f',
    '#8f3d88',
    '#8f3d81',
    '#8f3d7a',
    '#8f3d74',
    '#8f3d6d',
    '#8f3d66',
    '#8f3d5f',
    '#8f3d58',
    '#8f3d52',
    '#8f3d4b',
    '#8f3d44',
];
