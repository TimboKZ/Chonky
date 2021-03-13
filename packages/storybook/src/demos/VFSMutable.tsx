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

const storyName = 'Advanced mutable VFS';
export const MutableVirtualFileSystem: React.FC = () => {
    return (
        <div className="story-wrapper">
            <div className="story-description">
                <h1 className="story-title">
                    {storyName.replace('VFS', 'Virtual File System')}
                </h1>
                <p>
                    This example simulates a client-side file system without any backend
                    interactions. The file system is represented as a file map (a JS
                    object), where keys are file IDs and values are objects of{' '}
                    <code>FileData</code> type.
                </p>
                <p>
                    Note that this file system is <strong>mutable</strong> - you can
                    delete files, move files around using drag & drop, or even create
                    new folders.
                </p>
                <p>
                    You can see the source code of relevant components by clicking on
                    the buttons below. Note that <code>VFSBrowser</code> component's
                    source code is a bit complicated (because updating file system state
                    is hard!). If you want to start from something simpler, check out{' '}
                    <em>Simple read-only VFS</em> in the sidebar.
                </p>
                <div className="story-links">
                    {useStoryLinks([
                        { gitPath: '2.x_storybook/src/demos/VFSMutable.tsx' },
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
            <VFSBrowser instanceId={storyName} />
        </div>
    );
};
(MutableVirtualFileSystem as any).storyName = storyName;
