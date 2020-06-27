[chonky](../README.md) › [Globals](../globals.md) › ["components/file-entry/DnDFileEntry"](_components_file_entry_dndfileentry_.md)

# Module: "components/file-entry/DnDFileEntry"

## Index

### Interfaces

* [DnDProps](../interfaces/_components_file_entry_dndfileentry_.dndprops.md)

### Type aliases

* [DnDFileEntryItem](_components_file_entry_dndfileentry_.md#dndfileentryitem)

### Variables

* [DnDFileEntry](_components_file_entry_dndfileentry_.md#const-dndfileentry)
* [DnDFileEntryType](_components_file_entry_dndfileentry_.md#const-dndfileentrytype)

## Type aliases

###  DnDFileEntryItem

Ƭ **DnDFileEntryItem**: *DragObjectWithType & object*

*Defined in [src/components/file-entry/DnDFileEntry.tsx:20](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/components/file-entry/DnDFileEntry.tsx#L20)*

## Variables

### `Const` DnDFileEntry

• **DnDFileEntry**: *React.FC‹[FileEntryProps](../interfaces/_components_file_entry_basefileentry_.fileentryprops.md)›* = React.memo((props) => {
    const { file } = props;

    const dispatchSpecialAction = useRecoilValue(dispatchSpecialActionState);

    interface ChonkyDnDDropResult {
        dropTarget: Nilable<FileData>;
        dropEffect: 'move' | 'copy';
    }

    // For drag source
    const canDrag = FileHelper.isDraggable(file);
    const onDragStart = useCallback(() => {
        if (!FileHelper.isDraggable(file)) return;

        dispatchSpecialAction({
            actionId: SpecialAction.DragNDropStart,
            dragSource: file,
        });
    }, [dispatchSpecialAction, file]);
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

            dispatchSpecialAction({
                actionId: SpecialAction.DragNDropEnd,
                dragSource: file,
                dropTarget: dropResult.dropTarget,
                dropEffect: dropResult.dropEffect,
            });
        },
        [dispatchSpecialAction, file]
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
})

*Defined in [src/components/file-entry/DnDFileEntry.tsx:23](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/components/file-entry/DnDFileEntry.tsx#L23)*

___

### `Const` DnDFileEntryType

• **DnDFileEntryType**: *"chonky-file-entry"* = "chonky-file-entry"

*Defined in [src/components/file-entry/DnDFileEntry.tsx:21](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/components/file-entry/DnDFileEntry.tsx#L21)*
