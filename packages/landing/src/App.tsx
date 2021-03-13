/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Container from '@material-ui/core/Container';
import React from 'react';
import { Demo } from './sections/Demo';
import { Docs } from './sections/Docs';
import { Features } from './sections/Features';
import { Header } from './sections/Header';
import { Links } from './sections/Links';

export const App: React.FC = () => {
    return (
        <Container maxWidth="md">
            <Header />
            <Links />
            <Features />
            <Demo />
            <Docs />
        </Container>
    );
};
