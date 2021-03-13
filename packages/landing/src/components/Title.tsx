/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

export interface TitleProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            position: 'relative',
            textAlign: 'center',
            marginBottom: 20,
            marginTop: 60,
        },
        text: {
            backgroundColor: '#f2f2f2',
            padding: '0 20px',
        },
        line: {
            backgroundColor: '#ccc',
            position: 'absolute',
            width: '100%',
            zIndex: -1,
            top: '50%',
            height: 2,
        },
    })
);

export const Title: React.FC<TitleProps> = (props) => {
    const classes = useStyles();

    return (
        <Typography className={classes.title} variant="h4">
            <div className={classes.line} />
            <span className={classes.text}>{props.children}</span>
        </Typography>
    );
};
