/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';

import { selectionSizeState } from '../../recoil/selection.recoil';
import { selectDisplayFileIds } from '../../redux/selectors';
import { important, makeChonkyStyles } from '../../util/styles';

export interface ToolbarInfoProps {}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = () => {
    const classes = useStyles();

    const displayFileIds = useSelector(selectDisplayFileIds);
    const selectionSize = useRecoilValue(selectionSizeState);

    return (
        <div className={classes.infoContainer}>
            <Typography className={classes.infoTypography} variant="body1">
                {displayFileIds.length} files
            </Typography>
            {!!selectionSize && (
                <Typography className={classes.infoTypography} variant="body1">
                    {selectionSize} selected
                </Typography>
            )}
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
        marginRight: important(12),
        height: theme.toolbar.size,
        '&:first-child': {
            marginLeft: 12,
        },
    },
}));
