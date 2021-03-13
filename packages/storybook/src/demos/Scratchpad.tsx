/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { ChonkyIconName, FileArray, FullFileBrowser, setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React from 'react';

import { useStoryLinks } from '../util';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const storyName = 'Scratchpad';
export const Scratchpad: React.FC = () => {
    const files = [
        { id: 'zxc', name: 'zxc' },
        { id: 'vfd', name: 'zxc' },
        { id: 'sdasd', name: 'zxc' },
        { id: 'drwg', name: 'zxc' },
    ];

    const folderChain: FileArray = [
        {
            id: 'zxc',
            name: 'Bucket',
            isDir: true,
            folderChainIcon: ChonkyIconName.trash,
        },
        { id: 'dfg', name: 'Subfolder', isDir: true },
        null,
        { id: 'bfr', name: 'Home' },
        {
            id: 'ltr',
            name: 'Documents',
            openable: false,
            folderChainIcon: ChonkyIconName.compact,
        },
        null,
        { id: 'nrg', name: 'Payslips', openable: false },
    ];

    return (
        <div className="story-wrapper">
            <div className="story-description">
                <h1 className="story-title">{storyName}</h1>
                <p>Please ignore this page. It is used to test new Chonky features.</p>
                <div className="story-links">
                    {useStoryLinks([
                        { gitPath: '2.x_storybook/src/demos/Scratchpad.tsx' },
                    ])}
                </div>
            </div>
            <div style={{ height: 600 }}>
                <FullFileBrowser
                    files={files}
                    folderChain={folderChain}
                    darkMode={true}
                />
            </div>
        </div>
    );
};
(Scratchpad as any).storyName = storyName;
