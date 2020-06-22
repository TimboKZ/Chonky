/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useDragLayer } from 'react-dnd';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { selectionSizeState } from '../../recoil/selection.recoil';
import { DnDFileEntryItem, DnDFileEntryType } from './DnDFileEntry';

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
    const selectionSize = useRecoilValue(selectionSizeState);

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
                            {selectionSize - 1} other file
                            {selectionSize - 1 !== 1 ? 's' : ''}
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
