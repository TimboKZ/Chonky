/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import React from 'react';

import { ChonkyIconName } from '../../types/icons.types';
import { important, makeChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarSearchProps {}

export const ToolbarSearch: React.FC<ToolbarSearchProps> = (props) => {
    const classes = useStyles();

    return (
        <TextField
            className={classes.searchFieldContainer}
            size="small"
            variant="outlined"
            InputProps={{
                startAdornment: (
                    <InputAdornment className={classes.searchIcon} position="start">
                        <ChonkyIconFA icon={ChonkyIconName.search} />
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
    searchIcon: {},
    searchFieldInput: {
        fontSize: important(theme.toolbar.fontSize),
        borderRadius: theme.toolbar.buttonRadius,
        paddingLeft: important(8),
        height: theme.toolbar.size,
    },
    searchFieldInputInner: {
        fontSize: important(theme.toolbar.fontSize),
        lineHeight: important(theme.toolbar.size),
        padding: important([0, 8, 0, 0]),
        height: theme.toolbar.size,
    },
}));
