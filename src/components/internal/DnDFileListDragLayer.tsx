/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useContext } from 'react';
import { useDragLayer } from 'react-dnd';

import { ChonkySelectionContext } from '../../util/context';
import { DnDFileEntryItem, DnDFileEntryType } from './DnDFileEntry';
import { Nullable } from 'tsdef';

export interface DnDFileListDragLayerProps {}

const layerStyles: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};
const getItemStyles = (
    initialCursorOffset: Nullable<{ x: number; y: number }>,
    initialFileOffset: Nullable<{ x: number; y: number }>,
    currentFileOffset: Nullable<{ x: number; y: number }>
) => {
    if (!initialCursorOffset || !initialFileOffset || !currentFileOffset) {
        return {
            display: 'none',
        };
    }
    const x = initialCursorOffset.x + (currentFileOffset.x - initialFileOffset.x);
    const y = initialCursorOffset.y + (currentFileOffset.y - initialFileOffset.y);
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
};

export const DnDFileListDragLayer: React.FC<DnDFileListDragLayerProps> = () => {
    // TODO: Reset selection if we drag & drop a file outside of the selection.
    const selection = useContext(ChonkySelectionContext);
    let selectionSize = 0;
    for (const fileId in selection) {
        if (selection[fileId] === true) selectionSize++;
    }

    const {
        itemType,
        item,
        initialCursorOffset,
        initialFileOffset,
        currentFileOffset,
        isDragging,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem() as DnDFileEntryItem,
        itemType: monitor.getItemType(),
        initialCursorOffset: monitor.getInitialClientOffset(),
        initialFileOffset: monitor.getInitialSourceClientOffset(),
        currentFileOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    function renderItem() {
        if (!item.file || itemType !== DnDFileEntryType) return;

        return (
            <div className="chonky-file-drag-preview">
                <b>{item.file.name}</b>
                {selectionSize > 1 && (
                    <>
                        {' and '}
                        <strong>
                            {selectionSize - 1} file{selectionSize - 1 !== 1 ? 's' : ''}
                        </strong>
                    </>
                )}
            </div>
        );
    }
    if (!isDragging) {
        return null;
    }
    return (
        <div style={layerStyles}>
            <div
                style={getItemStyles(
                    initialCursorOffset,
                    initialFileOffset,
                    currentFileOffset
                )}
            >
                {renderItem()}
            </div>
        </div>
    );
};
