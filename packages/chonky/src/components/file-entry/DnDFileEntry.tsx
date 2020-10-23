import React, { useCallback, useEffect } from 'react';
import { DragObjectWithType, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { ExcludeKeys, Nilable, Nullable } from 'tsdef';

import { ChonkyActions } from '../../file-actons/definitions/index';
import { selectInstanceId, selectParentFolder } from '../../redux/selectors';
import { thunkRequestFileAction } from '../../redux/thunks/file-action-dispatchers.thunks';
import { FileData } from '../../types/files.types';
import { FileHelper } from '../../util/file-helper';
import { ClickableFileEntry } from './ClickableFileEntry';
import { FileEntryProps } from './FileEntry';

export type DnDFileEntryItem = DragObjectWithType & { file: Nullable<FileData> };
export const DnDFileEntryType = 'chonky-file-entry';

export const DnDFileEntry: React.FC<FileEntryProps> = React.memo((props) => {
    const { file } = props;

    const dispatch = useDispatch();
    const instanceId = useSelector(selectInstanceId);
    const parentFolder = useSelector(selectParentFolder);

    interface ChonkyDnDDropResult {
        dropTarget: Nilable<FileData>;
        dropEffect: 'move' | 'copy';
    }

    // For drag source
    const canDrag = FileHelper.isDraggable(file);
    const onDragStart = useCallback(() => {
        if (!FileHelper.isDraggable(file)) return;

        dispatch(
            thunkRequestFileAction(ChonkyActions.StartDragNDrop, {
                dragSource: file,
            })
        );
    }, [dispatch, file]);
    const onDragEnd = useCallback(
        (item: DnDFileEntryItem, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult() as ChonkyDnDDropResult;
            if (
                !FileHelper.isDraggable(file) ||
                !dropResult ||
                !dropResult.dropTarget
            ) {
                return;
            }

            dispatch(
                thunkRequestFileAction(ChonkyActions.EndDragNDrop, {
                    sourceInstanceId: instanceId,
                    source: parentFolder,
                    draggedFile: file,
                    destination: dropResult.dropTarget,
                    copy: dropResult.dropEffect === 'copy',
                })
            );
        },
        [dispatch, file, instanceId, parentFolder]
    );

    // For drop target
    const onDrop = useCallback(
        (item: DnDFileEntryItem, monitor) => {
            if (!monitor.canDrop()) return;
            const customDropResult: ExcludeKeys<ChonkyDnDDropResult, 'dropEffect'> = {
                dropTarget: file,
            };
            return customDropResult;
        },
        [file]
    );
    const canDrop = useCallback(
        (item: DnDFileEntryItem) => {
            const isSameFile = file && item.file && file.id === item.file.id;
            return FileHelper.isDroppable(file) && !isSameFile;
        },
        [file]
    );

    // Create refs for react-dnd hooks
    const [{ isDragging: dndIsDragging }, drag, preview] = useDrag({
        item: { type: DnDFileEntryType, file } as DnDFileEntryItem,
        canDrag,
        begin: onDragStart,
        end: onDragEnd,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const [{ isOver: dndIsOver, canDrop: dndCanDrop }, drop] = useDrop({
        accept: DnDFileEntryType,
        drop: onDrop,
        canDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    useEffect(() => {
        // Set drag preview to an empty image because `DnDFileListDragLayer` will
        // provide its own preview.
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    return (
        <div
            ref={drop}
            className="chonky-file-entry-droppable-wrapper chonky-fill-parent"
        >
            <div
                ref={FileHelper.isDraggable(file) ? drag : null}
                className="chonky-file-entry-draggable-wrapper chonky-fill-parent"
            >
                <ClickableFileEntry
                    {...props}
                    dndIsDragging={dndIsDragging}
                    dndIsOver={dndIsOver}
                    dndCanDrop={dndCanDrop}
                />
            </div>
        </div>
    );
});
