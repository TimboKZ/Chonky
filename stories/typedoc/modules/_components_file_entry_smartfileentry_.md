[chonky](../README.md) › [Globals](../globals.md) › ["components/file-entry/SmartFileEntry"](_components_file_entry_smartfileentry_.md)

# Module: "components/file-entry/SmartFileEntry"

## Index

### Interfaces

* [SmartFileEntryProps](../interfaces/_components_file_entry_smartfileentry_.smartfileentryprops.md)

### Variables

* [SmartFileEntry](_components_file_entry_smartfileentry_.md#const-smartfileentry)

## Variables

### `Const` SmartFileEntry

• **SmartFileEntry**: *React.FC‹[SmartFileEntryProps](../interfaces/_components_file_entry_smartfileentry_.smartfileentryprops.md)›* = React.memo((props) => {
    const { fileId, displayIndex } = props;

    const file = useRecoilValue(fileDataState(fileId));
    const selected = useRecoilValue(fileSelectedState(fileId));
    const enableDragAndDrop = useRecoilValue(enableDragAndDropState);

    const entryProps: FileEntryProps = {
        file,
        displayIndex,
        selected,
    };

    return enableDragAndDrop ? (
        <DnDFileEntry {...entryProps} />
    ) : (
        <ClickableFileEntry {...entryProps} />
    );
})

*Defined in [src/components/file-entry/SmartFileEntry.tsx:23](https://github.com/TimboKZ/Chonky/blob/01ce777/src/components/file-entry/SmartFileEntry.tsx#L23)*
