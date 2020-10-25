/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectSearchString } from '../../redux/selectors';
import { thunkUpdateSearchString } from '../../redux/thunks/files.thunks';
import { ChonkyIconName } from '../../types/icons.types';
import { useDebounce } from '../../util/hooks-helpers';
import { important, makeChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarSearchProps {}

export const ToolbarSearch: React.FC<ToolbarSearchProps> = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const reduxSearchString = useSelector(selectSearchString);

    const [localSearchString, setLocalSearchString] = useState(reduxSearchString);
    const [debouncedLocalSearchString] = useDebounce(localSearchString, 300);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

    useEffect(() => {
        setShowLoadingIndicator(false);
        dispatch(thunkUpdateSearchString(debouncedLocalSearchString));
    }, [debouncedLocalSearchString, dispatch]);

    const handleChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        setShowLoadingIndicator(true);
        setLocalSearchString(event.currentTarget.value);
    }, []);
    return (
        <TextField
            className={classes.searchFieldContainer}
            size="small"
            variant="outlined"
            value={localSearchString}
            placeholder="Search"
            onChange={handleChange as any}
            InputProps={{
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

const useStyles = makeChonkyStyles((theme) => ({
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
