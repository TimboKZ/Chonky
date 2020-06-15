/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useContext } from 'react';
import { useDragLayer } from 'react-dnd';

import { ChonkySelectionContext } from '../../util/context';
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
function getItemStyles(initialOffset: any, currentOffset: any) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
}

export const DnDFileListDragLayer: React.FC<DnDFileListDragLayerProps> = () => {
    // TODO: Reset selection if we drag & drop a file outside of the selection.
    const selection = useContext(ChonkySelectionContext);
    let selectionSize = 0;
    for (const fileId in selection) {
        if (selection[fileId] === true) selectionSize++;
    }

    const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(
        (monitor) => ({
            item: monitor.getItem() as DnDFileEntryItem,
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
        })
    );
    function renderItem() {
        if (!item.file) return;

        switch (itemType) {
            case DnDFileEntryType:
                return (
                    <div className="chonky-file-drag-preview">
                        <b>{item.file.name}</b>
                        {selectionSize ? ` and ${selectionSize - 1} other files` : null}
                    </div>
                );
            default:
                return null;
        }
    }
    if (!isDragging) {
        return null;
    }
    return (
        <div style={layerStyles}>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {renderItem()}
            </div>
        </div>
    );
};
