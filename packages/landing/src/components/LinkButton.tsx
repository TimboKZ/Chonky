/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';
import { LinkData } from '../util/links';

export interface LinkButtonProps {
    linkData: LinkData;
}

export const getButtonStyles = (theme: Theme, color: string): CSSProperties => ({
    color: theme.palette.getContrastText(color),
    backgroundColor: color,
    '&:hover': {
        backgroundColor: color,
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: (linkData: LinkData) => ({
            textTransform: 'none',
            fontWeight: 'bold',
            margin: 5,
            ...getButtonStyles(theme, linkData.color),
        }),
    })
);

export const LinkButton: React.FC<LinkButtonProps> = ({ linkData }) => {
    const classes = useStyles(linkData);

    return (
        <Button
            className={classes.button}
            href={linkData.url}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={linkData.icon} fixedWidth={true} />}
        >
            {linkData.title}
        </Button>
    );
};
