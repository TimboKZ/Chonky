/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import c from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
    searchBarEnabledState,
    searchBarVisibleState,
    searchFilterState,
} from '../../recoil/search.recoil';
import { ChonkyIconName } from '../../types/icons.types';
import { useDebounce } from '../../util/hooks-helpers';
import { ChonkyIconFA } from './ChonkyIcon';

export interface FileSearchProps {}

export const FileSearch: React.FC<FileSearchProps> = () => {
    const setSearchBarEnabled = useSetRecoilState(searchBarEnabledState);
    const [searchBarVisible, setSearchBarVisible] = useRecoilState(
        searchBarVisibleState
    );
    const [globalSearchFilter, setGlobalSearchFilter] = useRecoilState(
        searchFilterState
    );

    // Notify all other components that search bar is mounted.
    useEffect(() => {
        setSearchBarEnabled(true);
        return () => setSearchBarEnabled(false);
    }, [setSearchBarEnabled]);

    // Show a loading indicator during debounce periods to help user realise that a
    // debounce period is in effect.
    const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(false);

    // Define a local search filter and its debounced version
    const [localFilter, setLocalFilter] = useState<string>(globalSearchFilter);
    const [debouncedFilter, setDebouncedFilter] = useDebounce(localFilter, 500);

    // === Debounced global filter update
    useEffect(() => {
        setShowLoadingIndicator(false);
        const trimmedFilter = debouncedFilter.trim();
        setGlobalSearchFilter(trimmedFilter);
    }, [debouncedFilter, setShowLoadingIndicator, setGlobalSearchFilter]);

    // === Search bar showing/hiding logic
    const inputRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (searchBarVisible) {
            // When the search bar is shown, focus the input
            if (inputRef.current) inputRef.current.focus();
        } else {
            // When the search bar is hidden, clear out the search filter
            setShowLoadingIndicator(false);
            setLocalFilter('');
            setDebouncedFilter('');
        }
    }, [
        inputRef,
        searchBarVisible,
        setShowLoadingIndicator,
        setLocalFilter,
        setDebouncedFilter,
    ]);

    // === Text input handler
    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setShowLoadingIndicator(true);
            setLocalFilter(event.target.value);
        },
        [setShowLoadingIndicator, setLocalFilter]
    );

    // === Callback to hide the search when Escape key is pressed inside the search
    const onInputKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.nativeEvent.code === 'Enter') {
                // Prevent submitting the form if Chonky is used inside of a form.
                event.preventDefault();
            }

            if (event.nativeEvent.code === 'Escape') {
                setSearchBarVisible(false);
            }
        },
        [setSearchBarVisible]
    );

    const className = c({
        'chonky-file-search': true,
        'chonky-file-search-hidden': !searchBarVisible,
    });
    return (
        <div className={className}>
            <div className="chonky-file-search-input-group">
                <label htmlFor="chonky-file-search">
                    <ChonkyIconFA icon={ChonkyIconName.search} fixedWidth={true} />
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    id="chonky-file-search"
                    value={localFilter}
                    placeholder="Type to search..."
                    onChange={handleInputChange}
                    onKeyDown={onInputKeyDown}
                />
                <div className="chonky-file-search-input-group-loading">
                    {showLoadingIndicator && (
                        <span className="chonky-file-search-input-group-loading-indicator">
                            <ChonkyIconFA icon={ChonkyIconName.loading} spin={true} />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
