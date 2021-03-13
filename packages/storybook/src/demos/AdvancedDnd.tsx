/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import {
    ChonkyDndFileEntryItem,
    ChonkyDndFileEntryType,
    FileArray,
    FullFileBrowser,
    setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React, { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useStoryLinks } from '../util';

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const CustomDropZone = () => {
    const [maybeImpostor, setMaybeImpostor] = useState<string | null>(null);
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ChonkyDndFileEntryType,
        drop: (item: ChonkyDndFileEntryItem) => {
            setMaybeImpostor(item.payload.draggedFile.name);
            console.log('DnD payload:', item.payload);
        },
        canDrop: (item: ChonkyDndFileEntryItem) => !item.payload.draggedFile.isDir,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    return (
        <div
            ref={drop}
            style={{
                boxShadow: 'inset rgba(0, 0, 0, 0.6) 0 100px 0',
                backgroundImage: 'url(./shadow-realm.gif)',
                lineHeight: '100px',
                textAlign: 'center',
                fontSize: '1.4em',
                marginBottom: 20,
                borderRadius: 4,
                color: '#fff',
                height: 100,
            }}
        >
            {isOver
                ? canDrop
                    ? "C'mon, drop 'em!"
                    : 'Folders are not allowed!'
                : maybeImpostor
                ? `${maybeImpostor} was not the impostor.`
                : 'Drag & drop a (Chonky) file here'}
        </div>
    );
};

const storyName = 'Advanced drag & drop';
export const AdvancedDnd: React.FC = () => {
    const files: FileArray = [
        { id: 'aapl', name: 'config.yml' },
        { id: 'goog', name: 'snip.png' },
        { id: 'amzn', name: 'weights.hdf5' },
        { id: 'msft', name: 'binaries.tar.gz' },
        { id: 'nflx', name: '.local', isDir: true, isHidden: true },
    ];
    const folderChain: FileArray = [
        { id: 'zxc', name: 'Folder', isDir: true },
        { id: 'ktr', name: 'Subfolder', isDir: true, droppable: false },
        null,
        { id: 'dfg', name: 'Subsubsubfolder', isDir: true },
    ];

    return (
        <div className="story-wrapper">
            <div className="story-description">
                <h1 className="story-title">{storyName}</h1>
                <p>
                    This example shows how you can define a custom drag & drop (DnD)
                    drop-zone for Chonky. Chonky uses a very powerful DnD library called{' '}
                    <a href="https://github.com/react-dnd/react-dnd">
                        <code>react-dnd</code>
                    </a>
                    . Check out{' '}
                    <a href="https://react-dnd.github.io/react-dnd/">
                        <code>react-dnd</code> documentation
                    </a>{' '}
                    to see how to use the advanced DnD features.
                </p>
                <div className="story-links">
                    {useStoryLinks([
                        { gitPath: '2.x_storybook/src/demos/AdvancedDnd.tsx' },
                    ])}
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <CustomDropZone />
                <div style={{ height: 300 }}>
                    <FullFileBrowser
                        files={files}
                        folderChain={folderChain}
                        disableDragAndDropProvider={true}
                    />
                </div>
            </DndProvider>
        </div>
    );
};
(AdvancedDnd as any).storyName = storyName;
