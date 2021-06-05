/**
 * 
 */

import {useCallback, useMemo, useState} from 'react';

import {FileData, FileArray} from '../types/file.types'

export interface CustomFileData extends FileData {
    parentId?: string;
    childrenIds?: string[];
}
export interface CustomFileMap<FT extends CustomFileData> {
    [fileId: string]: FT;
}
export interface FileMapParams<FT extends CustomFileData> {
    baseFileMap: CustomFileMap<FT>;
    initialFolderId: string;
}

export const useFolderChain = <FT extends CustomFileData>(
    fileMap: CustomFileMap<FT>,
    currentFolderId: string
): FileArray<FT> => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];

        const folderChain = [currentFolder];

        let parentId = currentFolder.parentId;
        while (parentId) {
            const parentFile = fileMap[parentId];
            if (parentFile) {
                folderChain.unshift(parentFile);
                parentId = parentFile.parentId;
            } else {
                break;
            }
        }

        return folderChain;
    }, [currentFolderId, fileMap]);
};

export const useFiles = <FT extends CustomFileData>(
    fileMap: CustomFileMap<FT>,
    currentFolderId: string
): FileArray<FT> => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];
        const childrenIds = currentFolder.childrenIds!;
        const files = childrenIds.map((fileId: string) => fileMap[fileId]);
        return files;
    }, [currentFolderId, fileMap]);
};

export const useFileMap = <FT extends CustomFileData = CustomFileData>({
    baseFileMap,
    initialFolderId,
}: FileMapParams<FT>) => {
    // Base state
    const [fileMap, setFileMap] = useState(baseFileMap);
    const [currentFolderId, setCurrentFolderId] = useState(initialFolderId);

    // Derived state
    const folderChain = useFolderChain(fileMap, currentFolderId);
    const files = useFiles(fileMap, currentFolderId);

    // Methods
    const resetFileMap = useCallback(() => {
        setFileMap(baseFileMap);
        setCurrentFolderId(currentFolderId);
    }, [baseFileMap, currentFolderId]);

    const data = {
        fileMap,
        currentFolderId,
        folderChain, 
        files,
    };
    const methods = {
        setFileMap,
        resetFileMap,
        setCurrentFolderId,
    };
    return {data, methods}
};