/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

export interface HeaderProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            textAlign: 'center',
            marginTop: 40,
        },
        logo: {
            maxWidth: 400,
            width: '100%',
        },
        subtitle: {
            marginTop: -30,
        },
        shields: {
            padding: '20px 10px',
            '& > *': {
                margin: 4,
            },
        },
        warning: {
            backgroundColor: '#ffcc8a',
            margin: 'auto',
            maxWidth: 700,
        },
    })
);

export const Header: React.FC<HeaderProps> = (props) => {
    const classes = useStyles();

    return (
        <header className={classes.header}>
            <img
                className={classes.logo}
                alt="Chonky - A File Browser for React"
                src="./chonky-logo-v2.png"
            />
            <Typography className={classes.subtitle} variant="h5">
                A File Browser for React
            </Typography>
            <div className={classes.shields}>
                <a href="https://www.npmjs.com/package/chonky">
                    <img
                        alt="NPM package"
                        src="https://img.shields.io/npm/v/chonky.svg?style=flat&colorB=ffac5c"
                    />
                </a>
                <a href="https://tldrlegal.com/license/mit-license">
                    <img
                        alt="MIT license"
                        src="https://img.shields.io/npm/l/chonky?style=flat&colorB=dcd67a"
                    />
                </a>
                <a href="https://www.npmjs.com/package/chonky">
                    <img
                        alt="NPM downloads"
                        src="https://img.shields.io/npm/dt/chonky?style=flat&colorB=aef498"
                    />
                </a>
                <a href="https://github.com/TimboKZ/Chonky">
                    <img
                        alt="GitHub stars"
                        src="https://img.shields.io/github/stars/TimboKZ/Chonky?style=flat&colorB=50f4cc"
                    />
                </a>
                <a href="https://discord.gg/4HJaFn9">
                    <img
                        alt="Chat on Discord"
                        src="https://img.shields.io/discord/696033621986770957?label=discord&style=flat&colorB=08acee"
                    />
                </a>
            </div>
            <br />
            <Alert className={classes.warning} severity="warning">
                Chonky 2.x was released on November 8th, 2020. There will likely be some
                minor bugs in the code base. Please{' '}
                <a href="https://github.com/TimboKZ/Chonky/issues">
                    create an issue on GitHub
                </a>{' '}
                if you run into any such bugs.
            </Alert>
        </header>
    );
};
