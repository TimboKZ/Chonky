[chonky](../README.md) › [Globals](../globals.md) › ["components/external/ChonkyIcon"](_components_external_chonkyicon_.md)

# Module: "components/external/ChonkyIcon"

## Index

### Interfaces

* [ChonkyIconProps](../interfaces/_components_external_chonkyicon_.chonkyiconprops.md)

### Variables

* [ChonkyIconFA](_components_external_chonkyicon_.md#const-chonkyiconfa)
* [IconMap](_components_external_chonkyicon_.md#const-iconmap)

## Variables

### `Const` ChonkyIconFA

• **ChonkyIconFA**: *React.FC‹[ChonkyIconProps](../interfaces/_components_external_chonkyicon_.chonkyiconprops.md)›* = React.memo((props) => {
    const { icon } = props;

    const faProps = {
        ...props,
        icon: IconMap[icon] ? IconMap[icon] : IconMap.fallbackIcon,
    } as const;
    return <FontAwesomeIcon {...faProps} />;
})

*Defined in [src/components/external/ChonkyIcon.tsx:158](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/components/external/ChonkyIcon.tsx#L158)*

___

### `Const` IconMap

• **IconMap**: *object* = {
    // Misc
    [ChonkyIconName.loading]: faCircleNotch,
    [ChonkyIconName.dropdown]: faChevronDown,
    [ChonkyIconName.circle]: faGenderless,

    // File Actions: Drag & drop
    [ChonkyIconName.dndDragging]: faFistRaised,
    [ChonkyIconName.dndCanDrop]: faArrowDown,
    [ChonkyIconName.dndCannotDrop]: faTimes,

    // File Actions: File operations
    [ChonkyIconName.openFiles]: faBoxOpen,
    [ChonkyIconName.openParentFolder]: faLevelUpAlt,
    [ChonkyIconName.copy]: faCopy,
    [ChonkyIconName.search]: faSearch,
    [ChonkyIconName.selectAllFiles]: faObjectGroup,
    [ChonkyIconName.clearSelection]: faEraser,

    // File Actions: Sorting & options
    [ChonkyIconName.sortAsc]: faSortAmountDownAlt,
    [ChonkyIconName.sortDesc]: faSortAmountUpAlt,
    [ChonkyIconName.checkActive]: faCheckCircle,
    [ChonkyIconName.checkInactive]: faCircle,

    // File Actions: Unsorted
    [ChonkyIconName.list]: faList,
    [ChonkyIconName.folder]: faFolder,
    [ChonkyIconName.folderCreate]: faFolderPlus,
    [ChonkyIconName.folderOpen]: faFolderOpen,
    [ChonkyIconName.smallThumbnail]: faTh,
    [ChonkyIconName.largeThumbnail]: faThLarge,
    [ChonkyIconName.folderChainSeparator]: faChevronRight,
    [ChonkyIconName.download]: faDownload,
    [ChonkyIconName.upload]: faUpload,
    [ChonkyIconName.trash]: faTrash,
    [ChonkyIconName.fallbackIcon]: faExclamationTriangle,

    // File modifiers
    [ChonkyIconName.symlink]: faExternalLinkAlt,
    [ChonkyIconName.hidden]: faEyeSlash,

    // Generic file types
    [ChonkyIconName.file]: faFile,
    [ChonkyIconName.license]: faBalanceScale,
    [ChonkyIconName.code]: faFileCode,
    [ChonkyIconName.config]: faCogs,
    [ChonkyIconName.model]: faCubes,
    [ChonkyIconName.database]: faDatabase,
    [ChonkyIconName.text]: faFileAlt,
    [ChonkyIconName.archive]: faFileArchive,
    [ChonkyIconName.image]: faFileImage,
    [ChonkyIconName.video]: faFilm,
    [ChonkyIconName.info]: faInfoCircle,
    [ChonkyIconName.key]: faKey,
    [ChonkyIconName.lock]: faLock,
    [ChonkyIconName.music]: faMusic,
    [ChonkyIconName.terminal]: faTerminal,
    [ChonkyIconName.users]: faUsers,

    // OS file types
    [ChonkyIconName.linux]: faLinux,
    [ChonkyIconName.ubuntu]: faUbuntu,
    [ChonkyIconName.windows]: faWindows,

    // Programming language file types
    [ChonkyIconName.rust]: faRust,
    [ChonkyIconName.python]: faPython,
    [ChonkyIconName.nodejs]: faNodeJs,
    [ChonkyIconName.php]: faPhp,

    // Development tools file types
    [ChonkyIconName.git]: faGitAlt,

    // Brands file types
    [ChonkyIconName.adobe]: faAdobe,

    // Other program file types
    [ChonkyIconName.pdf]: faFilePdf,
    [ChonkyIconName.excel]: faFileExcel,
    [ChonkyIconName.word]: faFileWord,
    [ChonkyIconName.flash]: faRunning,
} as const

*Defined in [src/components/external/ChonkyIcon.tsx:64](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/components/external/ChonkyIcon.tsx#L64)*

#### Type declaration:
