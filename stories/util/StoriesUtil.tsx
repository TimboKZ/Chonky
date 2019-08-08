/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';

import {fileMap as picsFileMap, rootFolderId as picsFolderId} from './japan_pics.fs_map.json';
import {fileMap as chonkyFileMap, rootFolderId as chonkyFolderId} from './chonky_project.fs_map.json';
import {FileData} from '../../src/typedef';

const processFileMapDates = (fileMap: any) => {
    for (const fileId in fileMap) {
        if (!fileMap.hasOwnProperty(fileId)) continue;
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

export const getMainDemoFsData = () => {
    const rootId = 'my-root-id';
    const foreverFolderId = 'forever-id';
    const emptyId = 'empty-id';
    // @ts-ignore
    const fileMap: { [id: string]: FileData } = {
        [rootId]: {
            id: rootId,
            base: 'Demo Folder',
            name: 'Demo Folder',
            ext: '',
            isDir: true,
            modDate: new Date(),
            childrenIds: [chonkyFolderId, picsFolderId, foreverFolderId, emptyId],
        },
        [foreverFolderId]: createFolder(foreverFolderId, 'Folder that loads forever', rootId,
            ['bad-id-1', 'bad-id-2', 'bad-id-3', 'bad-id-3']),
        [emptyId]: createFolder(emptyId, 'Empty folder', rootId),
        ...chonkyFileMap,
        ...picsFileMap,
    };
    fileMap[chonkyFolderId].parentId = rootId;
    fileMap[picsFolderId].parentId = rootId;
    return {fileMap, rootFolderId: rootId};
};

const wrapperStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0 2px 3px',
    border: 'solid 1px #ddd',
    margin: '20px 0',
    borderRadius: 4,
    padding: 10,
};

export const wrapExample = (Element?: React.ElementType, minHeight?: any) => {
    if (!Element) return () => <span/>;
    const style: any = {...wrapperStyle};
    if (minHeight) style.minHeight = minHeight;
    return () => <div style={style}><Element/></div>;
};

export const getParams = (readme?: string, extraParams?: object) => {
    const baseParams: any = {
        options: {showPanel: false},
    };
    if (readme) baseParams.readme = {content: readme};
    return {...baseParams, ...extraParams};
};
