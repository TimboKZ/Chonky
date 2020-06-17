[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/FileIcon"](_components_internal_fileicon_.md)

# Module: "components/internal/FileIcon"

## Index

### Interfaces

* [FileIconProps](../interfaces/_components_internal_fileicon_.fileiconprops.md)

### Variables

* [FileIcon](_components_internal_fileicon_.md#const-fileicon)

## Variables

### `Const` FileIcon

• **FileIcon**: *React.FC‹[FileIconProps](../interfaces/_components_internal_fileicon_.fileiconprops.md)›* = React.memo((props) => {
    const { iconData } = props;

    return (
        <div className="chonky-file-icon">
            <ChonkyIconFA icon={iconData.icon} />
        </div>
    );
})

*Defined in [src/components/internal/FileIcon.tsx:16](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/internal/FileIcon.tsx#L16)*
