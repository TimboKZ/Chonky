import React from 'react';
import { Description, Primary, Title } from '@storybook/addon-docs/blocks';

import 'chonky/style/main.css';
import { FileBrowser } from 'chonky';

// @ts-ignore
// eslint-disable-next-line
import markdown from './01-Invalid-props.md';

// eslint-disable-next-line import/no-default-export
export default {
    title: '2 File Browser examples|Passing invalid props',
    parameters: {
        docs: {
            page: () => {
                return (
                    <React.Fragment>
                        <Title />
                        <Description markdown={markdown} />
                        <Primary />
                    </React.Fragment>
                );
            },
        },
    },
};

export const InvalidPropsExample = () => {
    const badFiles = [
        12312, // Not an object or `null`!
        {}, // Missing all required fields!
        { id: '2xf4' }, // Missing some required fields!
        { id: '2xf4', name: 'Some other file!' }, // Duplicate ID!
    ];

    // @ts-ignore
    return <FileBrowser files={badFiles} />;
};
