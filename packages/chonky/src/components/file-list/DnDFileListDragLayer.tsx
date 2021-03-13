/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useDragLayer } from 'react-dnd';
import { Nullable } from 'tsdef';

import { ChonkyDndFileEntryItem, ChonkyDndFileEntryType } from '../../types/dnd.types';
import { makeGlobalChonkyStyles } from '../../util/styles';

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
    const classes = useStyles();

    const {
        itemType,
        item,
        initialCursorOffset,
        initialFileOffset,
        currentFileOffset,
        isDragging,
    } = useDragLayer(monitor => ({
        item: monitor.getItem() as ChonkyDndFileEntryItem,
        itemType: monitor.getItemType(),
        initialCursorOffset: monitor.getInitialClientOffset(),
        initialFileOffset: monitor.getInitialSourceClientOffset(),
        currentFileOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    if (!isDragging || itemType !== ChonkyDndFileEntryType || !item.payload) {
        return null;
    }

    const selectionSize = item.payload.selectedFiles.length;
    return (
        <div style={layerStyles}>
            <div
                style={getItemStyles(
                    initialCursorOffset,
                    initialFileOffset,
                    currentFileOffset
                )}
            >
                <div className={classes.fileDragPreview}>
                    <b>{item.payload.draggedFile.name}</b>
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
            </div>
        </div>
    );
};

const useStyles = makeGlobalChonkyStyles(theme => ({
    fileDragPreview: {
        boxShadow: `2px 2px 5px ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.dragLayer.borderRadius,
        fontSize: theme.fontSizes.rootPrimary,
        color: theme.palette.text.primary,
        padding: theme.dragLayer.padding,
        border: theme.dragLayer.border,
        display: 'inline-block',
    },
}));
