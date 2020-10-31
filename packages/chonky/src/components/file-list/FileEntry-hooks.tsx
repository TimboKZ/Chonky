import path from 'path';
import React, {
    HTMLProps,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { ExcludeKeys, Nilable, Nullable, Undefinable } from 'tsdef';

import { ChonkyActions } from '../../action-definitions/index';
import {
    selectCurrentFolder,
    selectInstanceId,
    selectThumbnailGenerator,
} from '../../redux/selectors';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { DndEntryState } from '../../types/file-list.types';
import { FileData } from '../../types/file.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import {
    ChonkyIconContext,
    ColorsDark,
    ColorsLight,
    useIconData,
} from '../../util/icon-helper';
import { Logger } from '../../util/logger';
import { TextPlaceholder } from '../external/TextPlaceholder';
import { KeyboardClickEvent, MouseClickEvent } from '../internal/ClickableWrapper';
import { DnDFileEntryItem, DnDFileEntryType } from './DnDFileEntry';
import { FileEntryState } from './GridEntryPreview';

export const useFileEntryHtmlProps = (
    file: Nullable<FileData>
): HTMLProps<HTMLDivElement> => {
    return useMemo(() => {
        const dataProps: { [prop: string]: Undefinable<string> } = {
            'data-test-id': 'file-entry',
            'data-chonky-file-id': file ? file.id : undefined,
        };

        return {
            role: 'listitem',
            ...dataProps,
        };
    }, [file]);
};

export const useFileEntryState = (
    file: Nullable<FileData>,
    selected: boolean,
    focused: boolean
) => {
    const iconData = useIconData(file);
    const { thumbnailUrl, thumbnailLoading } = useThumbnailUrl(file);

    return useMemo<FileEntryState>(() => {
        const fileColor = thumbnailUrl
            ? ColorsDark[iconData.colorCode]
            : ColorsLight[iconData.colorCode];
        const iconSpin = thumbnailLoading || !file;
        const icon = thumbnailLoading ? ChonkyIconName.loading : iconData.icon;

        return {
            childrenCount: FileHelper.getChildrenCount(file),
            icon: file && file.icon !== undefined ? file.icon : icon,
            iconSpin: iconSpin,
            thumbnailUrl: thumbnailUrl,
            color: file && file.color !== undefined ? file.color : fileColor,
            selected: selected,
            focused: !!focused,
        };
    }, [file, focused, iconData, selected, thumbnailLoading, thumbnailUrl]);
};

export const useDndIcon = (dndState: DndEntryState) => {
    let dndIconName: Nullable<ChonkyIconName> = null;
    let dndIconColor: Undefinable<string> = 'inherit';
    if (dndState.dndIsOver) {
        const showDropIcon = dndState.dndCanDrop;
        dndIconName = showDropIcon
            ? ChonkyIconName.dndCanDrop
            : ChonkyIconName.dndCannotDrop;
        dndIconColor = showDropIcon ? 'green' : 'red';
    } else if (dndState.dndIsDragging) {
        dndIconName = ChonkyIconName.dndDragging;
    }

    return { dndIconName, dndIconColor };
};

export const useModifierIconComponents = (file: Nullable<FileData>) => {
    const modifierIcons: ChonkyIconName[] = useMemo(() => {
        const modifierIcons: ChonkyIconName[] = [];
        if (FileHelper.isHidden(file)) modifierIcons.push(ChonkyIconName.hidden);
        if (FileHelper.isSymlink(file)) modifierIcons.push(ChonkyIconName.symlink);
        if (FileHelper.isEncrypted(file)) modifierIcons.push(ChonkyIconName.lock);
        return modifierIcons;
    }, [file]);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const modifierIconComponents = useMemo(
        () =>
            modifierIcons.map((icon, index) => (
                <ChonkyIcon key={`file-modifier-${index}`} icon={icon} />
            )),
        [ChonkyIcon, modifierIcons]
    );
    return modifierIconComponents;
};

export const useFileNameComponent = (file: Nullable<FileData>) => {
    return useMemo(() => {
        if (!file) return <TextPlaceholder minLength={15} maxLength={20} />;

        let name;
        let extension = null;

        const isDir = FileHelper.isDirectory(file);
        if (isDir) {
            name = file.name;
        } else {
            extension = file.ext ?? path.extname(file.name);
            name = file.name.substr(0, file.name.length - extension.length);
        }

        return (
            <>
                {name}
                {extension && (
                    <span className="chonky-file-entry-description-title-extension">
                        {extension}
                    </span>
                )}
            </>
        );
    }, [file]);
};

export const useThumbnailUrl = (file: Nullable<FileData>) => {
    const thumbnailGenerator = useSelector(selectThumbnailGenerator);
    const [thumbnailUrl, setThumbnailUrl] = useState<Nullable<string>>(null);
    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);

    useEffect(() => {
        let loadingCancelled = false;

        if (file) {
            if (thumbnailGenerator) {
                setThumbnailLoading(true);
                Promise.resolve()
                    .then(() => thumbnailGenerator(file))
                    .then((thumbnailUrl: any) => {
                        if (loadingCancelled) return;
                        setThumbnailLoading(false);

                        if (thumbnailUrl && typeof thumbnailUrl === 'string') {
                            setThumbnailUrl(thumbnailUrl);
                        }
                    })
                    .catch((error) => {
                        if (!loadingCancelled) setThumbnailLoading(false);
                        Logger.error(
                            `User-defined "thumbnailGenerator" handler threw an error: ${error.message}`
                        );
                    });
            } else if (file.thumbnailUrl) {
                setThumbnailUrl(file.thumbnailUrl);
            }
        }

        return () => {
            loadingCancelled = true;
        };
    }, [file, setThumbnailUrl, setThumbnailLoading, thumbnailGenerator]);

    return { thumbnailUrl, thumbnailLoading };
};

export const useFileEntryDnD = (file: Nullable<FileData>, selected: boolean) => {
    const dispatch = useDispatch();
    const instanceId = useSelector(selectInstanceId);
    const currentFolder = useSelector(selectCurrentFolder);

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
                    source: currentFolder,
                    draggedFile: file,
                    destination: dropResult.dropTarget,
                    copy: dropResult.dropEffect === 'copy',
                })
            );
        },
        [dispatch, file, instanceId, currentFolder]
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
            return FileHelper.isDroppable(file) && !isSameFile && !selected;
        },
        [file, selected]
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

export const useFileClickHandlers = (
    file: Nullable<FileData>,
    displayIndex: number
) => {
    const dispatch = useDispatch();

    // Prepare base handlers
    const onMouseClick = useCallback(
        (event: MouseClickEvent, clickType: 'single' | 'double') => {
            if (!file) return;

            dispatch(
                thunkRequestFileAction(ChonkyActions.MouseClickFile, {
                    clickType,
                    file,
                    fileDisplayIndex: displayIndex,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                })
            );
        },
        [dispatch, file, displayIndex]
    );
    const onKeyboardClick = useCallback(
        (event: KeyboardClickEvent) => {
            if (!file) return;

            dispatch(
                thunkRequestFileAction(ChonkyActions.KeyboardClickFile, {
                    file,
                    fileDisplayIndex: displayIndex,
                    enterKey: event.enterKey,
                    spaceKey: event.spaceKey,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                })
            );
        },
        [dispatch, file, displayIndex]
    );

    // Prepare single/double click handlers
    const onSingleClick = useCallback(
        (event: MouseClickEvent) => onMouseClick(event, 'single'),
        [onMouseClick]
    );
    const onDoubleClick = useCallback(
        (event: MouseClickEvent) => onMouseClick(event, 'double'),
        [onMouseClick]
    );

    return {
        onSingleClick,
        onDoubleClick,
        onKeyboardClick,
    };
};
