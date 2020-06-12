/* eslint-disable import/first,import/newline-after-import */
import React from 'react';
import { FileBrowser } from 'chonky';

// @ts-ignore
import mdx from './File-Browser-advanced.mdx';

// eslint-disable-next-line import/no-default-export
export default {
    title: 'File Browser advanced',
    parameters: { docs: { page: mdx } },
};

// @ts-ignore
export const InvalidProps = () => {
    const badFiles = [
        12312, // Not an object or `null`!
        {}, // Missing all required fields!
        { id: '2xf4' }, // Missing some required fields!
        { id: '2xf4', name: 'Some other file!' }, // Duplicate ID!
    ];

    // @ts-ignore
    return <FileBrowser files={badFiles} />;
};
