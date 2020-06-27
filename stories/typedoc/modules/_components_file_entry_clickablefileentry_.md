[chonky](../README.md) › [Globals](../globals.md) › ["components/file-entry/ClickableFileEntry"](_components_file_entry_clickablefileentry_.md)

# Module: "components/file-entry/ClickableFileEntry"

## Index

### Variables

* [ClickableFileEntry](_components_file_entry_clickablefileentry_.md#const-clickablefileentry)

## Variables

### `Const` ClickableFileEntry

• **ClickableFileEntry**: *React.FC‹[FileEntryProps](../interfaces/_components_file_entry_basefileentry_.fileentryprops.md)›* = React.memo((props) => {
    const { file, displayIndex } = props;

    const fileClickHandlers = useFileClickHandlers(file, displayIndex);

    const wrapperProps: ClickableWrapperProps = {
        wrapperTag: 'div',
        passthroughProps: {
            className: 'chonky-file-entry-clickable-wrapper chonky-fill-parent',
        },
        ...(FileHelper.isClickable(file) ? fileClickHandlers : undefined),
    };

    return (
        <ClickableWrapper {...wrapperProps}>
            <BaseFileEntry {...props} />
        </ClickableWrapper>
    );
})

*Defined in [src/components/file-entry/ClickableFileEntry.tsx:8](https://github.com/TimboKZ/Chonky/blob/3d6eae9/src/components/file-entry/ClickableFileEntry.tsx#L8)*
