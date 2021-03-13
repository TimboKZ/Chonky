/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Grid from '@material-ui/core/Grid';
import React from 'react';
import { LinkCard } from '../components/LinkCard';
import { Title } from '../components/Title';
import { Docs0x, Docs1x, Docs2x, Storybook2x } from '../util/links';

export interface DocsProps {}

export const Docs: React.FC<DocsProps> = (props) => {
    return (
        <>
            <Title>Read the docs</Title>
            <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                    <LinkCard linkData={Docs2x} />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <LinkCard linkData={Storybook2x} />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <LinkCard linkData={Docs1x} />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <LinkCard linkData={Docs0x} />
                </Grid>
            </Grid>
            <br/>
            <br/>
            <br/>
        </>
    );
};
