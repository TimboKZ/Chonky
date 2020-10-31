/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { reduxActions } from '../../redux/reducers';
import { selectSearchString } from '../../redux/selectors';
import { thunkUpdateSearchString } from '../../redux/thunks/files.thunks';
import { ChonkyIconName } from '../../types/icons.types';
import { useDebounce } from '../../util/hooks-helpers';
import { important, makeGlobalChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarSearchProps {}

export const ToolbarSearch: React.FC<ToolbarSearchProps> = () => {
    const classes = useStyles();

    const searchInputRef = useRef<HTMLInputElement>();

    const dispatch = useDispatch();
    const reduxSearchString = useSelector(selectSearchString);

    const [localSearchString, setLocalSearchString] = useState(reduxSearchString);
    const [debouncedLocalSearchString] = useDebounce(localSearchString, 300);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

    useEffect(() => {
        dispatch(
            reduxActions.setFocusSearchInput(() => {
                if (searchInputRef.current) searchInputRef.current.focus();
            })
        );
        return () => {
            dispatch(reduxActions.setFocusSearchInput(null));
        };
    }, [dispatch]);

    useEffect(() => {
        setShowLoadingIndicator(false);
        dispatch(thunkUpdateSearchString(debouncedLocalSearchString));
    }, [debouncedLocalSearchString, dispatch]);

    const handleChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        setShowLoadingIndicator(true);
        setLocalSearchString(event.currentTarget.value);
    }, []);
    const handleKeyUp = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            // Remove focus from the search input field when user presses escape.
            // Note: We use KeyUp instead of KeyPress because some browser plugins can
            //       intercept KeyPress events with Escape key.
            //       @see https://stackoverflow.com/a/37461974
            if (event.key === 'Escape') {
                setLocalSearchString('');
                dispatch(thunkUpdateSearchString(''));
                if (searchInputRef.current) searchInputRef.current.blur();
            }
        },
        [dispatch]
    );

    return (
        <TextField
            className={classes.searchFieldContainer}
            size="small"
            variant="outlined"
            value={localSearchString}
            placeholder="Search"
            onChange={handleChange as any}
            inputRef={searchInputRef}
            InputProps={{
                onKeyUp: handleKeyUp,
                startAdornment: (
                    <InputAdornment className={classes.searchIcon} position="start">
                        <ChonkyIconFA
                            icon={
                                showLoadingIndicator
                                    ? ChonkyIconName.loading
                                    : ChonkyIconName.search
                            }
                            spin={showLoadingIndicator}
                        />
                    </InputAdornment>
                ),
                className: classes.searchFieldInput,
            }}
            inputProps={{ className: classes.searchFieldInputInner }}
        />
    );
};

const useStyles = makeGlobalChonkyStyles((theme) => ({
    searchFieldContainer: {
        height: theme.toolbar.size,
        width: 150,
    },
    searchIcon: {
        fontSize: '0.9em',
        opacity: 0.75,
    },
    searchFieldInput: {
        fontSize: important(theme.toolbar.fontSize),
        borderRadius: theme.toolbar.buttonRadius,
        height: theme.toolbar.size - 4,
        paddingLeft: important(8),
        marginTop: 2,
    },
    searchFieldInputInner: {
        lineHeight: important(theme.toolbar.lineHeight),
        fontSize: important(theme.toolbar.fontSize),
        padding: important([0, 8, 0, 0]),
        height: theme.toolbar.size,
    },
}));
