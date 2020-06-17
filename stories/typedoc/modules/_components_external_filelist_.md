[chonky](../README.md) › [Globals](../globals.md) › ["components/external/FileList"](_components_external_filelist_.md)

# Module: "components/external/FileList"

## Index

### Interfaces

* [FileListProps](../interfaces/_components_external_filelist_.filelistprops.md)

### Variables

* [FileList](_components_external_filelist_.md#const-filelist)

## Variables

### `Const` FileList

• **FileList**: *React.FC‹[FileListProps](../interfaces/_components_external_filelist_.filelistprops.md)›* = React.memo(() => {
    const files = useContext(ChonkyFilesContext);

    const entryRenderer = useEntryRenderer(files);

    // Thumbs grid ref is not used at the moment but will be necessary later. It is
    // used to recompute the height of rows in the `List` from `react-virtualized`.
    // Consult Chonky v0.x implementation for details.
    const thumbsGridRef = useRef<Grid>();

    // TODO: Read this value from somewhere.
    const fillParentContainer = true;

    const gridRenderer = useGridRenderer(
        files,
        entryRenderer,
        thumbsGridRef,
        fillParentContainer
    );

    if (!files) {
        const errorMessage =
            `${FileList.name} cannot find the "files" array via React context. This ` +
            `happens when ${FileList.name} is placed outside of ${FileBrowser.name}` +
            `component.`;
        Logger.error(errorMessage);
        return <ErrorMessage message={errorMessage} />;
    }

    return (
        <div className="chonky-file-list">
            <AutoSizer disableHeight={!fillParentContainer}>{gridRenderer}</AutoSizer>
        </div>
    );
})

*Defined in [src/components/external/FileList.tsx:12](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList.tsx#L12)*
