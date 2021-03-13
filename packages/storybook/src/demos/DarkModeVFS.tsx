/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React from 'react';

import { VFSBrowser } from '../components/VFSBrowser';
import { useStoryLinks } from '../util';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const storyName = 'Dark mode VFS';
export const DarkMode: React.FC = () => {
    return (
        <div className="story-wrapper story-wrapper-dark">
            <div className="story-description">
                <h1 className="story-title">
                    {storyName.replace('VFS', 'Virtual File System')}
                </h1>
                <p>
                    This example is the same as <em>Advanced mutable VFS</em>, except it
                    uses dark mode!
                </p>
                <div className="story-links">
                    {useStoryLinks([
                        { gitPath: '2.x_storybook/src/demos/DarkModeVFS.tsx' },
                        {
                            name: 'VFSBrowser component source code',
                            gitPath: '2.x_storybook/src/components/VFSBrowser.tsx',
                        },
                        {
                            name: 'File map JSON',
                            gitPath: '2.x_storybook/src/demos/demo.fs_map.json',
                        },
                    ])}
                </div>
            </div>
            <VFSBrowser darkMode={true} instanceId={storyName} />
        </div>
    );
};
(DarkMode as any).storyName = storyName;
(DarkMode as any).parameters = {
    backgrounds: { default: 'dark' },
};
