import { useCallback, useEffect, useMemo } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { ExcludeKeys, Nullable } from 'tsdef';

import { ChonkyActions } from '../action-definitions/index';
import {
    selectCurrentFolder,
    selectInstanceId,
    selectIsFileSelected,
} from '../redux/selectors';
import { useParamSelector } from '../redux/store';
import { thunkRequestFileAction } from '../redux/thunks/dispatchers.thunks';
import {
    ChonkyDndDropResult,
    ChonkyDndFileEntryItem,
    ChonkyDndFileEntryType,
} from '../types/dnd.types';
import { DndEntryState } from '../types/file-list.types';
import { FileData } from '../types/file.types';
import { FileHelper } from './file-helper';

export const useFileDrop = (file: Nullable<FileData>, allowDrop: boolean = true) => {
    const selected = useParamSelector(selectIsFileSelected, file ? file.id : null);
    const onDrop = useCallback(
        (item: ChonkyDndFileEntryItem, monitor) => {
            if (!monitor.canDrop()) return;
            const customDropResult: ExcludeKeys<ChonkyDndDropResult, 'dropEffect'> = {
                dropTarget: file,
            };
            return customDropResult;
        },
        [file]
    );
    const canDrop = useCallback(
        (item: ChonkyDndFileEntryItem) => {
            if (!allowDrop) return false;
            const isSameFile = file && item.file && file.id === item.file.id;
            return FileHelper.isDroppable(file) && !isSameFile && !selected;
        },
        [allowDrop, file, selected]
    );
    const [{ isOver: dndIsOver, canDrop: dndCanDrop }, drop] = useDrop({
        accept: ChonkyDndFileEntryType,
        drop: onDrop,
        canDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    return { dndIsOver, dndCanDrop, drop };
};

export const useFileEntryDnD = (file: Nullable<FileData>) => {
    const dispatch = useDispatch();
    const instanceId = useSelector(selectInstanceId);
    const currentFolder = useSelector(selectCurrentFolder);

    // For drag source
    const canDrag = FileHelper.isDraggable(file);
    const onDragStart = useCallback(() => {
        if (!FileHelper.isDraggable(file)) return;

        dispatch(
            thunkRequestFileAction(ChonkyActions.StartDragNDrop, {
                draggedFile: file,
            })
        );
    }, [dispatch, file]);
    const onDragEnd = useCallback(
        (item: ChonkyDndFileEntryItem, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult() as ChonkyDndDropResult;
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
                    source: currentFolder,
                    draggedFile: file,
                    destination: dropResult.dropTarget,
                    copy: dropResult.dropEffect === 'copy',
                })
            );
        },
        [dispatch, file, instanceId, currentFolder]
    );

    // Create refs for react-dnd hooks
    const [{ isDragging: dndIsDragging }, drag, preview] = useDrag({
        item: { type: ChonkyDndFileEntryType, file } as ChonkyDndFileEntryItem,
        canDrag,
        begin: onDragStart,
        end: onDragEnd,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    useEffect(() => {
        // Set drag preview to an empty image because `DnDFileListDragLayer` will
        // provide its own preview.
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    const { dndIsOver, dndCanDrop, drop } = useFileDrop(file);
    const dndState = useMemo<DndEntryState>(
        () => ({
            dndIsDragging,
            dndIsOver,
            dndCanDrop,
        }),
        [dndCanDrop, dndIsDragging, dndIsOver]
    );
    return {
        drop,
        drag,
        dndState,
    };
};
