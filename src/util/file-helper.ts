import { Nullable } from 'tsdef';
import filesize from 'filesize';
import dateFormat from 'dateformat';

import { FileData } from '../types/files.types';

export class FileHelper {
    public static isDirectory(file: Nullable<FileData>): file is FileData {
        // Not a directory by default
        return !!file && file.isDir === true;
    }

    public static isHidden(file: Nullable<FileData>): file is FileData {
        // Not hidden by default
        return !!file && file.isHidden === true;
    }

    public static isSymlink(file: Nullable<FileData>): file is FileData {
        // Not a symlink by default
        return !!file && file.isSymlink === true;
    }

    public static isClickable(file: Nullable<FileData>): file is FileData {
        // Clickable by default
        return !!file;
    }

    public static isOpenable(file: Nullable<FileData>): file is FileData {
        // Openable by default
        return !!file && file.openable !== false;
    }

    public static isSelectable(file: Nullable<FileData>): file is FileData {
        // Selectable by default
        return !!file && file.selectable !== false;
    }

    public static isDraggable(file: Nullable<FileData>): file is FileData {
        // File & folders are draggable by default, `null` is not
        return !!file && file.draggable !== false;
    }

    public static isDroppable(file: Nullable<FileData>): file is FileData {
        // Folders are droppable by default, files are not
        if (!file) return false;
        if (file.isDir && file.droppable !== false) return true;
        return file.droppable === true;
    }

    public static getReadableFileSize(file: Nullable<FileData>): Nullable<string> {
        if (!file || typeof file.size !== 'number') return null;

        const size = file.size;
        const sizeData = filesize(size, { bits: false, output: 'object' }) as any;
        if (sizeData.symbol === 'B') {
            return `${Math.round(sizeData.value / 10) / 100.0} KB`;
        } else if (sizeData.symbol === 'KB') {
            return `${Math.round(sizeData.value)} ${sizeData.symbol}`;
        }
        return `${sizeData.value} ${sizeData.symbol}`;
    }

    public static getReadableDate(file: Nullable<FileData>): Nullable<string> {
        if (!file || !(file.modDate instanceof Date)) return null;

        const date = file.modDate;
        const currentYear = date.getFullYear() === new Date().getFullYear();
        if (currentYear) return dateFormat(date, 'd mmmm, HH:MM');
        return dateFormat(date, 'd mmm yyyy, HH:MM');
    }

    public static getChildrenCount(file: Nullable<FileData>): Nullable<number> {
        if (!file || typeof file.childrenCount !== 'number') return null;

        return file.childrenCount;
    }
}
