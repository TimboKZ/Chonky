/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Typography from '@material-ui/core/Typography';
import React from 'react';

import { important, makeChonkyStyles } from '../../util/styles';

export interface ToolbarInfoProps {}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.infoContainer}>
            <Typography className={classes.infoTypography} variant="body1">
                20 files
            </Typography>
            <Typography className={classes.infoTypography} variant="body1">
                10 selected
            </Typography>
        </div>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    infoContainer: {
        height: theme.toolbar.size,
        display: 'flex',
    },
    infoTypography: {
        fontSize: important(theme.toolbar.fontSize),
        lineHeight: important(theme.toolbar.size),
        paddingRight: theme.margins.rootLayoutMargin,
        height: theme.toolbar.size,
        '&:first-child': {
            paddingLeft: theme.margins.rootLayoutMargin,
        },
    },
}));
