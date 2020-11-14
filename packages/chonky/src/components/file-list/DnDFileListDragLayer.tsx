/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useDragLayer } from 'react-dnd';
import { useSelector } from 'react-redux';
import { Nullable } from 'tsdef';

import { selectSelectionSize } from '../../redux/selectors';
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
    const selectionSize = useSelector(selectSelectionSize);
    const classes = useStyles();

    const {
        itemType,
        item,
        initialCursorOffset,
        initialFileOffset,
        currentFileOffset,
        isDragging,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem() as ChonkyDndFileEntryItem,
        itemType: monitor.getItemType(),
        initialCursorOffset: monitor.getInitialClientOffset(),
        initialFileOffset: monitor.getInitialSourceClientOffset(),
        currentFileOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    function renderItem() {
        if (!item.file || itemType !== ChonkyDndFileEntryType) return;

        return (
            <div className={classes.fileDragPreview}>
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

const useStyles = makeGlobalChonkyStyles((theme) => ({
    fileDragPreview: {
        backgroundColor: theme.dragLayer.backgroundColor,
        borderRadius: theme.dragLayer.borderRadius,
        fontSize: theme.fontSizes.rootPrimary,
        boxShadow: theme.dragLayer.boxShadow,
        padding: theme.dragLayer.padding,
        border: theme.dragLayer.border,
        display: 'inline-block',
    },
}));
