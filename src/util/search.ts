import FuzzySearch from 'fuzzy-search';
import { useMemo, useState } from 'react';

import { FileArray, FileData } from '../types/files.types';
import {
    ChonkySearchBarEnabledContext,
    ChonkySearchBarVisibleContext,
    ChonkySearchFilterContext,
    ChonkySetSearchBarEnabledContext,
    ChonkySetSearchBarVisibleContext,
    ChonkySetSearchFilterContext,
    validateContextType,
} from './context';

export const useSearch = () => {
    const searchState = useSearchState();
    const searchContexts = useSearchContexts(searchState);
    return { searchState, searchContexts };
};

const useSearchState = () => {
    const [searchBarEnabled, setSearchBarEnabled] = useState<boolean>(false);
    const [searchBarVisible, setSearchBarVisible] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>('');

    return {
        searchBarEnabled,
        setSearchBarEnabled,
        searchBarVisible,
        setSearchBarVisible,
        searchFilter,
        setSearchFilter,
    };
};

const useSearchContexts = (searchState: ReturnType<typeof useSearchState>) => {
    return [
        validateContextType({
            context: ChonkySearchBarEnabledContext,
            value: searchState.searchBarEnabled,
        }),
        validateContextType({
            context: ChonkySetSearchBarEnabledContext,
            value: searchState.setSearchBarEnabled,
        }),
        validateContextType({
            context: ChonkySearchBarVisibleContext,
            value: searchState.searchBarVisible,
        }),
        validateContextType({
            context: ChonkySetSearchBarVisibleContext,
            value: searchState.setSearchBarVisible,
        }),
        validateContextType({
            context: ChonkySearchFilterContext,
            value: searchState.searchFilter,
        }),
        validateContextType({
            context: ChonkySetSearchFilterContext,
            value: searchState.setSearchFilter,
        }),
    ];
};

export const useFilteredFiles = (files: FileArray, searchFilter: string): FileArray => {
    const deps = [files, searchFilter];
    return useMemo(() => {
        if (!searchFilter) return files;
        const searcher = new FuzzySearch(
            files.filter((f) => !!f) as FileData[],
            ['name'],
            { caseSensitive: false, sort: true }
        );
        return searcher.search(searchFilter);
    }, deps);
};
