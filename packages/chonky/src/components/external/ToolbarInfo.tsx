/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectDisplayFileIds,
    selectHiddenFileCount,
    selectSelectionSize,
} from '../../redux/selectors';
import { important, makeChonkyStyles } from '../../util/styles';

export interface ToolbarInfoProps {}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = () => {
    const classes = useStyles();

    const displayFileIds = useSelector(selectDisplayFileIds);
    const selectionSize = useSelector(selectSelectionSize);
    const hiddenCount = useSelector(selectHiddenFileCount);

    const fileCountString = `${displayFileIds.length} file${
        displayFileIds.length !== 1 ? 's' : ''
    }`;
    const selectedString = selectionSize ? `${selectionSize} selected` : '';
    const hiddenString = hiddenCount ? `${hiddenCount} hidden` : '';

    return (
        <div className={classes.infoContainer}>
            <Typography className={classes.infoText} variant="body1">
                {fileCountString}
                {(selectedString || hiddenString) && (
                    <span className={classes.extraInfoSpan}>
                        (
                        <span className={classes.selectionSizeText}>
                            {selectedString}
                        </span>
                        {selectedString && hiddenString && ', '}
                        <span className={classes.hiddenCountText}>{hiddenString}</span>)
                    </span>
                )}
            </Typography>
        </div>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    infoContainer: {
        height: theme.toolbar.size,
        display: 'flex',
    },
    infoText: {
        lineHeight: important(theme.toolbar.lineHeight),
        fontSize: important(theme.toolbar.fontSize),
        marginLeft: important(12),
        height: theme.toolbar.size,
    },
    extraInfoSpan: {
        marginRight: important(8),
        marginLeft: important(8),
        opacity: 0.8,
    },
    selectionSizeText: {
        color: theme.colors.textActive,
    },
    hiddenCountText: {},
}));
