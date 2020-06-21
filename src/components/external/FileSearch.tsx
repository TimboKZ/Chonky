/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ChonkyIconName } from '../../types/icons.types';
import { INTENTIONAL_EMPTY_DEPS } from '../../util/constants';
import {
    ChonkySearchFilterContext,
    ChonkySetSearchBarEnabledContext,
    ChonkySetSearchFilterContext,
} from '../../util/context';
import { useDebounce } from '../../util/hooks-helpers';
import { ChonkyIconFA } from './ChonkyIcon';

export interface FileSearchProps {}

export const FileSearch: React.FC<FileSearchProps> = () => {
    const setSearchBarEnabled = useContext(ChonkySetSearchBarEnabledContext);
    const globalSearchFilter = useContext(ChonkySearchFilterContext);
    const setGlobalSearchFilter = useContext(ChonkySetSearchFilterContext);

    // Notify all other components that search bar is mounted.
    useEffect(() => {
        setSearchBarEnabled(true);
        return () => setSearchBarEnabled(false);
    }, INTENTIONAL_EMPTY_DEPS);

    // Define a local search filter, and update it when global search filter updates
    const [localSearchFilter, setLocalSearchFilter] = useState<string>(
        globalSearchFilter
    );
    useEffect(
        () => {
            if (globalSearchFilter === localSearchFilter) return;
            setLocalSearchFilter(globalSearchFilter);
        },

        // `localSearchFilter` is deliberately not included in the deps below. This
        // is because we don't want to re-set local search filter to itself.
        [globalSearchFilter, setLocalSearchFilter]
    );

    // Set global search filter to local search filter with debounce
    const debouncedLocalSearchFilter = useDebounce(localSearchFilter, 500);
    useEffect(() => {
        const trimmedFilter = debouncedLocalSearchFilter.trim();
        if (trimmedFilter === globalSearchFilter) return;
        setGlobalSearchFilter(trimmedFilter);
    }, [globalSearchFilter, debouncedLocalSearchFilter]);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalSearchFilter(event.target.value);
        },
        [setLocalSearchFilter]
    );

    return (
        <div className="chonky-file-search">
            <div className="chonky-file-search-input-group">
                <label htmlFor="chonky-file-search">
                    <ChonkyIconFA icon={ChonkyIconName.search} fixedWidth={true} />
                </label>
                <input
                    type="text"
                    id="chonky-file-search"
                    value={localSearchFilter}
                    placeholder="Type to search..."
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};
