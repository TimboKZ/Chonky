/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { filesState } from '../../recoil/files.recoil';
import { selectionSizeState } from '../../recoil/selection.recoil';
import { important, makeChonkyStyles } from '../../util/styles';

export interface ToolbarInfoProps {}

export const ToolbarInfo: React.FC<ToolbarInfoProps> = () => {
    const classes = useStyles();

    const files = useRecoilValue(filesState);
    const selectionSize = useRecoilValue(selectionSizeState);

    return (
        <div className={classes.infoContainer}>
            <Typography className={classes.infoTypography} variant="body1">
                {files.length} files
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
