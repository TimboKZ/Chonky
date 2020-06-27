[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/FileThumbnail"](_components_internal_filethumbnail_.md)

# Module: "components/internal/FileThumbnail"

## Index

### Interfaces

* [FileThumbnailProps](../interfaces/_components_internal_filethumbnail_.filethumbnailprops.md)

### Variables

* [FileThumbnail](_components_internal_filethumbnail_.md#const-filethumbnail)

## Variables

### `Const` FileThumbnail

• **FileThumbnail**: *React.FC‹[FileThumbnailProps](../interfaces/_components_internal_filethumbnail_.filethumbnailprops.md)›* = React.memo((props) => {
    const { thumbnailUrl } = props;

    const thumbnailStyle: React.CSSProperties = thumbnailUrl
        ? { backgroundImage: `url('${thumbnailUrl}')` }
        : {};

    const className = c({
        'chonky-file-thumbnail': true,
        'chonky-file-thumbnail-hidden': !thumbnailUrl,
    });
    return <div className={className} style={thumbnailStyle} />;
})

*Defined in [src/components/internal/FileThumbnail.tsx:15](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/components/internal/FileThumbnail.tsx#L15)*
