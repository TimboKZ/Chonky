import FuzzySearch from 'fuzzy-search';
import { Nullable } from 'tsdef';

import { FileData, FileMap } from '../types/file.types';
import { ChonkyThunkExtraArgument } from '../types/redux.types';

export class ThunkExtraArgument implements ChonkyThunkExtraArgument {
    public constructor() {
        this.getCachedSearch = this.getCachedSearch.bind(this);
    }

    private cachedCleanFileIds: Nullable<string[]> = null;
    private cachedSearcher: Nullable<FuzzySearch<FileData>> = null;
    private cachedSearchString: string = '';
    private cachedSearchResult: Nullable<Set<string>> = null;
    public getCachedSearch(
        cleanFileIds: string[],
        fileMap: FileMap,
        searchString: string
    ): Set<string> {
        let usingCachedSearcher: boolean;
        let searcher: FuzzySearch<FileData>;
        if (this.cachedSearcher && this.cachedCleanFileIds === cleanFileIds) {
            usingCachedSearcher = true;
            searcher = this.cachedSearcher;
        } else {
            usingCachedSearcher = false;
            searcher = new FuzzySearch(
                cleanFileIds.map((id) => fileMap[id]),
                ['name'],
                { caseSensitive: false }
            );
            this.cachedCleanFileIds = cleanFileIds;
            this.cachedSearcher = searcher;
        }

        if (
            usingCachedSearcher &&
            this.cachedSearchResult &&
            this.cachedSearchString === searchString
        ) {
            return this.cachedSearchResult;
        } else {
            const foundFiles = searcher.search(searchString);
            const foundFileIds = new Set<string>();
            foundFiles.map((f) => foundFileIds.add(f.id));
            this.cachedSearchString = searchString;
            this.cachedSearchResult = foundFileIds;
            return foundFileIds;
        }
    }
}
