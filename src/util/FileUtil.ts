/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {Nullable} from 'tsdef';
import filesize from 'filesize';
import dateFormat from 'dateformat';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import {isFunction, isNil} from './Util';
import {fileMap as demoFileMap, rootFolderId as demoRootFolderId} from './demo.fs_map.json';
import {FileArray, FileData, FileIndexMap, FileMap, Option, Options, SortOrder} from '../typedef';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

for (const id in demoFileMap) {
    demoFileMap[id].modDate = new Date(demoFileMap[id].modDate);
}

const CurrentYear = new Date().getFullYear();

export class FileUtil {

    public static relativeDate = (date: Date) => timeAgo.format(date);
    public static readableDate = (date: Date) => {
        const currentYear = date.getFullYear() === CurrentYear;
        if (currentYear) return dateFormat(date, 'd mmmm, HH:MM');
        return dateFormat(date, 'd mmmm yyyy, HH:MM');
    };
    public static readableSize = (size: number) => {
        const sizeData = filesize(size, {bits: false, output: 'object'}) as any;
        if (sizeData.symbol === 'B') {
            return `${Math.round(sizeData.value / 10) / 100.0} KB`;
        } else if (sizeData.symbol === 'KB') {
            return `${Math.round(sizeData.value)} ${sizeData.symbol}`;
        }
        return `${sizeData.value} ${sizeData.symbol}`;
    };

    public static prepareComparator = (foldersFirst: boolean,
                                       sortProperty: string | ((file: FileData) => any),
                                       sortOrder: SortOrder) => {
        return (fileA: Nullable<FileData>, fileB: Nullable<FileData>) => {
            // If file is `null` (i.e. is loading) show it last
            if (isNil(fileA)) return 1;
            if (isNil(fileB)) return -1;

            if (foldersFirst) {
                if (fileA.isDir === true && fileB.isDir !== true) return -1;
                else if (fileA.isDir !== true && fileB.isDir === true) return 1;
            }
            let returnVal = sortOrder === SortOrder.Asc ? 1 : -1;
            let propA;
            let propB;
            if (isFunction(sortProperty)) {
                propA = sortProperty(fileA);
                propB = sortProperty(fileB);
            } else {
                propA = fileA[sortProperty];
                propB = fileB[sortProperty];
            }

            const aIsNil = isNil(propA);
            const bIsNil = isNil(propB);

            if (aIsNil && bIsNil) return 0;
            else if (aIsNil) return -returnVal;
            else if (bIsNil) return returnVal;
            else if (propA > propB) return returnVal;
            else if (propA === propB) return 0;
            else return -returnVal;
        };
    };

    public static sortFiles(rawFiles: Nullable<FileData>[],
                            options: Options,
                            sortProperty: string | ((file: FileData) => any),
                            sortOrder: SortOrder): [FileArray, FileIndexMap] {
        let files = rawFiles.slice(0);
        if (!options[Option.ShowHidden]) {
            files = files.filter(f => f === null || f.name.charAt(0) !== '.');
        }
        const comparator = FileUtil.prepareComparator(options[Option.FoldersFirst], sortProperty, sortOrder);
        files.sort(comparator);

        const fileIndexMap = {};
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            if (isNil(file)) continue;
            fileIndexMap[file.id] = i;
        }

        return [files, fileIndexMap];
    }

    public static getDemoFs(): { demoFileMap: FileMap; demoRootFolderId: string } {
        // @ts-ignore
        return {demoFileMap, demoRootFolderId};
    }

}
