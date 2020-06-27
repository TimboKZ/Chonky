import sort from 'fast-sort';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { sortConfigState } from '../recoil/sort.recoil';
import { FileArray } from '../types/files.types';
import { SortOrder } from '../types/sort.types';
import { ChonkyActions } from './file-actions-definitions';
import { FileHelper } from './file-helper';

export const useFileSorting = (files: FileArray) => {
    const sortConfig = useRecoilValue(sortConfigState);

    const sortedFiles = useMemo(() => {
        let userSort;
        if (sortConfig.order === SortOrder.Asc) {
            userSort = { asc: sortConfig.sortKeySelector };
        } else {
            userSort = { desc: sortConfig.sortKeySelector };
        }

        const sortFunctions: any[] = [
            { desc: FileHelper.isDirectory },
            userSort,
            { asc: ChonkyActions.SortFilesByName.sortKeySelector },
        ];

        // !!! We create a new array because by default `fast-sort` mutates the array!
        return sort([...files]).by(sortFunctions);
    }, [files, sortConfig]);

    return sortedFiles;
};
