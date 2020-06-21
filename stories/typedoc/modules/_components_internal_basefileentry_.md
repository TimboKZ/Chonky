[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/BaseFileEntry"](_components_internal_basefileentry_.md)

# Module: "components/internal/BaseFileEntry"

## Index

### Interfaces

* [FileEntryProps](../interfaces/_components_internal_basefileentry_.fileentryprops.md)

### Variables

* [BaseFileEntry](_components_internal_basefileentry_.md#const-basefileentry)

## Variables

### `Const` BaseFileEntry

• **BaseFileEntry**: *React.FC‹[FileEntryProps](../interfaces/_components_internal_basefileentry_.fileentryprops.md)›* = React.memo((props) => {
    const { file, selected, style, dndIsDragging, dndIsOver, dndCanDrop } = props;

    // Deal with thumbnails
    const [thumbnailUrl, setThumbnailUrl] = useState<Nullable<string>>(null);
    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
    useThumbnailUrl(file, setThumbnailUrl, setThumbnailLoading);

    // Deal with file icon
    const iconData = useIconData(file);
    const backgroundColor = thumbnailUrl
        ? ColorsDark[iconData.colorCode]
        : ColorsLight[iconData.colorCode];
    const iconSpin = thumbnailLoading || !file;
    const icon = thumbnailLoading ? ChonkyIconName.loading : iconData.icon;

    // Deal with drag & drop
    const dndIcon = useDndIcon(selected, dndIsDragging, dndIsOver, dndCanDrop);

    // Render the component
    const className = c({
        'chonky-file-entry': true,
        'chonky-file-entry-selected': selected,
        'chonky-file-entry-dragging': dndIsDragging,
        'chonky-file-entry-drop-hovered': dndIsOver && dndCanDrop,
    });
    return (
        <div className={className} style={style}>
            <div className="chonky-file-entry-inside">
                {dndIcon && (
                    <div className="chonky-file-entry-dnd-indicator">
                        <ChonkyIconFA icon={dndIcon} />
                    </div>
                )}
                <div className="chonky-file-entry-preview">
                    <div className="chonky-file-icon">
                        <div className="chonky-file-icon-inside">
                            <ChonkyIconFA icon={icon} spin={iconSpin} />
                        </div>
                    </div>
                    <div className="chonky-file-selection" />
                    <FileThumbnail thumbnailUrl={thumbnailUrl} />
                    <div
                        className="chonky-file-background"
                        style={{ backgroundColor }}
                    />
                </div>
                <div className="chonky-file-entry-description">
                    {file ? (
                        file.name
                    ) : (
                        <TextPlaceholder minLength={15} maxLength={20} />
                    )}
                </div>
            </div>
        </div>
    );
})

*Defined in [src/components/internal/BaseFileEntry.tsx:24](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/components/internal/BaseFileEntry.tsx#L24)*
