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
export const InvalidProps = () => <FileBrowser files={null} />;
