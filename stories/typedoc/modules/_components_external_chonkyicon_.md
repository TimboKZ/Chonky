[chonky](../README.md) › [Globals](../globals.md) › ["components/external/ChonkyIcon"](_components_external_chonkyicon_.md)

# Module: "components/external/ChonkyIcon"

## Index

### Enumerations

* [ChonkyIconName](../enums/_components_external_chonkyicon_.chonkyiconname.md)

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

*Defined in [src/components/external/ChonkyIcon.tsx:196](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/components/external/ChonkyIcon.tsx#L196)*

___

### `Const` IconMap

• **IconMap**: *object* = {
    // Misc
    [ChonkyIconName.loading]: faCircleNotch,
    [ChonkyIconName.dropdown]: faChevronDown,

    // File Actions: Drag & drop
    [ChonkyIconName.dndDragging]: faFistRaised,
    [ChonkyIconName.dndCanDrop]: faArrowDown,
    [ChonkyIconName.dndCannotDrop]: faTimes,

    // File Actions: File operations
    [ChonkyIconName.openFiles]: faBoxOpen,
    [ChonkyIconName.openParentFolder]: faLevelUpAlt,
    [ChonkyIconName.search]: faSearch,

    // File Actions: Unsorted
    [ChonkyIconName.checkActive]: faCheckCircle,
    [ChonkyIconName.checkInactive]: faCircle,
    [ChonkyIconName.desc]: faArrowDown,
    [ChonkyIconName.asc]: faArrowUp,
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
    [ChonkyIconName.symlink]: faExternalLinkAlt,
    [ChonkyIconName.hidden]: faEyeSlash,

    // file types
    [ChonkyIconName.file]: faFile,
    [ChonkyIconName.license]: faBalanceScale,
    [ChonkyIconName.code]: faFileCode,
    [ChonkyIconName.config]: faCogs,
    [ChonkyIconName.model]: faCubes,
    [ChonkyIconName.database]: faDatabase,
    [ChonkyIconName.text]: faFileAlt,
    [ChonkyIconName.archive]: faFileArchive,
    [ChonkyIconName.csv]: faFileExcel,
    [ChonkyIconName.image]: faFileImage,
    [ChonkyIconName.pdf]: faFilePdf,
    [ChonkyIconName.word]: faFileWord,
    [ChonkyIconName.video]: faFilm,
    [ChonkyIconName.info]: faInfoCircle,
    [ChonkyIconName.key]: faKey,
    [ChonkyIconName.lock]: faLock,
    [ChonkyIconName.music]: faMusic,
    [ChonkyIconName.flash]: faRunning,
    [ChonkyIconName.terminal]: faTerminal,
    [ChonkyIconName.authors]: faUsers,
    [ChonkyIconName.adobe]: faAdobe,
    [ChonkyIconName.git]: faGitAlt,
    [ChonkyIconName.linux]: faLinux,
    [ChonkyIconName.windows]: faWindows,
    [ChonkyIconName.nodejs]: faNodeJs,
    [ChonkyIconName.php]: faPhp,
    [ChonkyIconName.python]: faPython,
    [ChonkyIconName.ubuntu]: faUbuntu,
} as const

*Defined in [src/components/external/ChonkyIcon.tsx:121](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/components/external/ChonkyIcon.tsx#L121)*

#### Type declaration:
