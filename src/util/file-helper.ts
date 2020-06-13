import { Nullable } from 'tsdef';

import { FileData } from '../typedef';

export class FileHelper {
    public static isOpenable(file: Nullable<FileData>): boolean {
        // Openable by default
        return !!file && file.openable !== false;
    }
}
