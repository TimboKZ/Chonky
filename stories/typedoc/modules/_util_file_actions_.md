[chonky](../README.md) › [Globals](../globals.md) › ["util/file-actions"](_util_file_actions_.md)

# Module: "util/file-actions"

## Index

### Variables

* [ChonkyActions](_util_file_actions_.md#const-chonkyactions)
* [DefaultActions](_util_file_actions_.md#const-defaultactions)

### Functions

* [useFileActionDispatcher](_util_file_actions_.md#const-usefileactiondispatcher)

## Variables

### `Const` ChonkyActions

• **ChonkyActions**: *object* = {
    // Actions triggered by drag & drop
    MoveFilesTo: {
        id: 'move_files_to',
    },
    DuplicateFilesTo: {
        id: 'duplicate_files_to',
    },

    OpenParentFolder: {
        id: 'open_parent_folder',
        requiresParentFolder: true,
        fileFilter: (file: FileData) => FileHelper.isOpenable(file),
        hotkeys: ['backspace'],
        toolbarButton: {
            name: 'Go up a directory',
            tooltip: 'Go up a directory',
            icon: ChonkyIconName.openParentFolder,
            iconOnly: true,
        },
    },
    OpenFiles: {
        // We don't specify the 'enter' hotkey here because it is handled inside
        // `<ClickableFileEntry>` component.
        id: 'open_files',
        requiresSelection: true,
        fileFilter: FileHelper.isOpenable,
        toolbarButton: {
            name: 'Open selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    },
    ToggleSearch: {
        id: 'toggle_search',
        hotkeys: ['ctrl+f'],
        toolbarButton: {
            name: 'Search',
            icon: ChonkyIconName.search,
            iconOnly: true,
        },

        specialActionToDispatch: SpecialAction.ToggleSearchBar,
    },

    CopyFiles: {
        id: 'copy_files',
        requiresSelection: true,
    },

    CreateFolder: {
        id: 'create_folder',
        toolbarButton: {
            name: 'Create folder',
            tooltip: 'Create a folder',
            icon: ChonkyIconName.folderCreate,
        },
    },
    UploadFiles: {
        id: 'upload_files',
        toolbarButton: {
            name: 'Upload files',
            tooltip: 'Upload files',
            icon: ChonkyIconName.upload,
        },
    },
    DownloadFiles: {
        id: 'download_files',
        requiresSelection: true,
        toolbarButton: {
            name: 'Download files',
            group: 'Actions',
            tooltip: 'Download files',
            dropdown: true,
            icon: ChonkyIconName.download,
        },
    },
} as const

*Defined in [src/util/file-actions.ts:17](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/file-actions.ts#L17)*

#### Type declaration:

* ### **CopyFiles**: *object*

  * **id**: *"copy_files"* = "copy_files"

  * **requiresSelection**: *true* = true

* ### **CreateFolder**: *object*

  * **id**: *"create_folder"* = "create_folder"

  * **toolbarButton**: *object*

    * **icon**: *[folderCreate](../enums/_types_icons_types_.chonkyiconname.md#foldercreate)* = ChonkyIconName.folderCreate

    * **name**: *"Create folder"* = "Create folder"

    * **tooltip**: *"Create a folder"* = "Create a folder"

* ### **DownloadFiles**: *object*

  * **id**: *"download_files"* = "download_files"

  * **requiresSelection**: *true* = true

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[download](../enums/_types_icons_types_.chonkyiconname.md#download)* = ChonkyIconName.download

    * **name**: *"Download files"* = "Download files"

    * **tooltip**: *"Download files"* = "Download files"

* ### **DuplicateFilesTo**: *object*

  * **id**: *"duplicate_files_to"* = "duplicate_files_to"

* ### **MoveFilesTo**: *object*

  * **id**: *"move_files_to"* = "move_files_to"

* ### **OpenFiles**: *object*

  * **fileFilter**: *[isOpenable](../classes/_util_file_helper_.filehelper.md#static-isopenable)* = FileHelper.isOpenable

  * **id**: *"open_files"* = "open_files"

  * **requiresSelection**: *true* = true

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[openFiles](../enums/_types_icons_types_.chonkyiconname.md#openfiles)* = ChonkyIconName.openFiles

    * **name**: *"Open selection"* = "Open selection"

* ### **OpenParentFolder**: *object*

  * **hotkeys**: *["backspace"]* = ['backspace']

  * **id**: *"open_parent_folder"* = "open_parent_folder"

  * **requiresParentFolder**: *true* = true

  * **fileFilter**(`file`: [FileData](../interfaces/_types_files_types_.filedata.md)): *boolean*

  * **toolbarButton**: *object*

    * **icon**: *[openParentFolder](../enums/_types_icons_types_.chonkyiconname.md#openparentfolder)* = ChonkyIconName.openParentFolder

    * **iconOnly**: *true* = true

    * **name**: *"Go up a directory"* = "Go up a directory"

    * **tooltip**: *"Go up a directory"* = "Go up a directory"

* ### **ToggleSearch**: *object*

  * **hotkeys**: *["ctrl+f"]* = ['ctrl+f']

  * **id**: *"toggle_search"* = "toggle_search"

  * **specialActionToDispatch**: *[ToggleSearchBar](../enums/_types_special_actions_types_.specialaction.md#togglesearchbar)* = SpecialAction.ToggleSearchBar

  * **toolbarButton**: *object*

    * **icon**: *[search](../enums/_types_icons_types_.chonkyiconname.md#search)* = ChonkyIconName.search

    * **iconOnly**: *true* = true

    * **name**: *"Search"* = "Search"

* ### **UploadFiles**: *object*

  * **id**: *"upload_files"* = "upload_files"

  * **toolbarButton**: *object*

    * **icon**: *[upload](../enums/_types_icons_types_.chonkyiconname.md#upload)* = ChonkyIconName.upload

    * **name**: *"Upload files"* = "Upload files"

    * **tooltip**: *"Upload files"* = "Upload files"

___

### `Const` DefaultActions

• **DefaultActions**: *[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]* = [
    ChonkyActions.MoveFilesTo,
    ChonkyActions.DuplicateFilesTo,

    ChonkyActions.OpenParentFolder,
    ChonkyActions.OpenFiles,
    ChonkyActions.ToggleSearch,
]

*Defined in [src/util/file-actions.ts:97](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/file-actions.ts#L97)*

## Functions

### `Const` useFileActionDispatcher

▸ **useFileActionDispatcher**(`fileActions`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[], `onFileAction`: Nullable‹[FileActionHandler](_types_file_actions_types_.md#fileactionhandler)›): *[InternalFileActionDispatcher](_types_file_actions_types_.md#internalfileactiondispatcher)*

*Defined in [src/util/file-actions.ts:112](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/file-actions.ts#L112)*

Returns a dispatch method meant to be used by child components. This dispatch method
is meant for actions that should be handled directly by the user. If you want to
transform the action internally before sending it to the user, use the "special
action dispatcher".

**Parameters:**

Name | Type |
------ | ------ |
`fileActions` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[] |
`onFileAction` | Nullable‹[FileActionHandler](_types_file_actions_types_.md#fileactionhandler)› |

**Returns:** *[InternalFileActionDispatcher](_types_file_actions_types_.md#internalfileactiondispatcher)*
