/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';

import {isNil} from '../../src/util/Util';
import {fileMap as picsFileMap, rootFolderId as picsFolderId} from './japan_pics.fs_map.json';
import {fileMap as chonkyFileMap, rootFolderId as chonkyFolderId} from './chonky_project.fs_map.json';

import '../documentation/FullDemo';

const processFileMapDates = (fileMap: any) => {
    for (const fileId in fileMap) {
        fileMap[fileId].modDate = new Date(fileMap[fileId].modDate);
    }
};
processFileMapDates(picsFileMap);
processFileMapDates(chonkyFileMap);

export const createFolder = (id: string, name: string, parentId?: string, childrenIds?: string[]) => ({
    id,
    base: name,
    name,
    ext: '',
    isDir: true,
    modDate: new Date(),
    parentId,
    childrenIds,
});

export const getChonkyProjectFsData = () => ({
    fileMap: JSON.parse(JSON.stringify(chonkyFileMap)),
    rootFolderId: chonkyFolderId,
});

export const getJapanPicsFsData = () => ({
    fileMap: JSON.parse(JSON.stringify(picsFileMap)),
    rootFolderId: picsFolderId,
});

export const wrapExample = (Element?: React.ElementType, minHeight?: any) => {
    if (isNil(Element)) return () => <span/>;
    const style: any = {};
    if (!isNil(minHeight)) style.minHeight = minHeight;
    return () => <div className="example-wrapper" style={style}><Element/></div>;
};

export const getParams = (readme?: string, extraParams?: object) => {
    const baseParams: any = {
        options: {showPanel: false},
    };
    if (!isNil(readme)) baseParams.readme = {content: readme};
    return {...baseParams, ...extraParams};
};
