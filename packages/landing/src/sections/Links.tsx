/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { LinkButton } from '../components/LinkButton';
import { Title } from '../components/Title';
import {
    DiscordLink,
    GitHubLink,
    MostRecentDocs,
    MostRecentStorybook,
    NpmLink,
} from '../util/links';

export interface LinksProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonWrapper: {
            textAlign: 'center',
            margin: 'auto',
            maxWidth: 700,
        },
    })
);

export const Links: React.FC<LinksProps> = (props) => {
    const classes = useStyles();

    return (
        <>
            <Title>Quick links</Title>
            <Box className={classes.buttonWrapper}>
                <LinkButton linkData={GitHubLink} />
                <LinkButton linkData={NpmLink} />
                <LinkButton linkData={DiscordLink} />
                <LinkButton linkData={MostRecentDocs} />
                <LinkButton linkData={MostRecentStorybook} />
            </Box>
        </>
    );
};
