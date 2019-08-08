/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';
import {storiesOf} from '@storybook/react';

import IntroComp from './Introduction';
import IntroDoc from './Introduction.md';

import InstallationComp from './Installation.js';
import InstallationDoc from './Installation.md';

import PassingFilesMarkdown from './Passing-files.md';
import FileBrowserPropsMarkdown from './File-Browser-props.md';
import {getParams, wrapExample} from '../util/StoriesUtil';


storiesOf('Chonky docs', module)
    .add('Introduction', wrapExample(IntroComp, 400), getParams(IntroDoc))
    .add('Installation & usage', wrapExample(InstallationComp), getParams(InstallationDoc))
    .add('Passing files to Chonky', () => <span/>, {
        options: {showPanel: false},
        readme: {content: PassingFilesMarkdown},
    })
    .add('Custom component styling', () => <span/>, {
        options: {showPanel: false},
        readme: {content: PassingFilesMarkdown},
    })
    .add('FileBrowser props', () => <span/>, {
        options: {showPanel: false},
        readme: {content: FileBrowserPropsMarkdown},
    });
