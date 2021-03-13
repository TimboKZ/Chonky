/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { Title } from '../components/Title';
import { DemoComponent } from '../demo/demo-component';

export interface DemoProps {}

export const Demo: React.FC<DemoProps> = (props) => {
    return (
        <>
            <Title>Try it out</Title>
            <DemoComponent />
        </>
    );
};
