import FuzzySearch from 'fuzzy-search';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { searchFilterState } from '../recoil/search.recoil';
import { FileArray, FileData } from '../types/files.types';

export const useFileSearch = (files: FileArray): FileArray => {
    const searchFilter = useRecoilValue(searchFilterState);

    return useMemo(() => {
        if (!searchFilter) return files;
        const searcher = new FuzzySearch(
            files.filter((f) => !!f) as FileData[],
            ['name'],
            { caseSensitive: false, sort: true }
        );
        return searcher.search(searchFilter);
    }, [files, searchFilter]);
};
