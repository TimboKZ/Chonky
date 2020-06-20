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
        name: 'move_files_to',
    },
    DuplicateFilesTo: {
        name: 'duplicate_files_to',
    },

    OpenParentFolder: {
        name: 'open_parent_folder',
        requiresParentFolder: true,
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
        name: 'open_files',
        requiresSelection: true,
        fileFilter: FileHelper.isOpenable,
        toolbarButton: {
            name: 'Open selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    },
    Search: {
        name: 'search',
        hotkeys: ['ctrl+f'],
        toolbarButton: {
            name: 'Search',
            icon: ChonkyIconName.search,
            iconOnly: true,
        },
    },

    CopyFiles: {
        name: 'copy_files',
        requiresSelection: true,
    },

    CreateFolder: {
        name: 'create_folder',
        toolbarButton: {
            name: 'Create folder',
            tooltip: 'Create a folder',
            icon: ChonkyIconName.folderCreate,
        },
    },
    UploadFiles: {
        name: 'upload_files',
        toolbarButton: {
            name: 'Upload files',
            tooltip: 'Upload files',
            icon: ChonkyIconName.upload,
        },
    },
    DownloadFiles: {
        name: 'download_files',
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

*Defined in [src/util/file-actions.ts:15](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/file-actions.ts#L15)*

#### Type declaration:

* ### **CopyFiles**: *object*

  * **name**: *"copy_files"* = "copy_files"

  * **requiresSelection**: *true* = true

* ### **CreateFolder**: *object*

  * **name**: *"create_folder"* = "create_folder"

  * **toolbarButton**: *object*

    * **icon**: *[folderCreate](../enums/_components_external_chonkyicon_.chonkyiconname.md#foldercreate)* = ChonkyIconName.folderCreate

    * **name**: *"Create folder"* = "Create folder"

    * **tooltip**: *"Create a folder"* = "Create a folder"

* ### **DownloadFiles**: *object*

  * **name**: *"download_files"* = "download_files"

  * **requiresSelection**: *true* = true

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[download](../enums/_components_external_chonkyicon_.chonkyiconname.md#download)* = ChonkyIconName.download

    * **name**: *"Download files"* = "Download files"

    * **tooltip**: *"Download files"* = "Download files"

* ### **DuplicateFilesTo**: *object*

  * **name**: *"duplicate_files_to"* = "duplicate_files_to"

* ### **MoveFilesTo**: *object*

  * **name**: *"move_files_to"* = "move_files_to"

* ### **OpenFiles**: *object*

  * **fileFilter**: *[isOpenable](../classes/_util_file_helper_.filehelper.md#static-isopenable)* = FileHelper.isOpenable

  * **name**: *"open_files"* = "open_files"

  * **requiresSelection**: *true* = true

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[openFiles](../enums/_components_external_chonkyicon_.chonkyiconname.md#openfiles)* = ChonkyIconName.openFiles

    * **name**: *"Open selection"* = "Open selection"

* ### **OpenParentFolder**: *object*

  * **hotkeys**: *["backspace"]* = ['backspace']

  * **name**: *"open_parent_folder"* = "open_parent_folder"

  * **requiresParentFolder**: *true* = true

  * **toolbarButton**: *object*

    * **icon**: *[openParentFolder](../enums/_components_external_chonkyicon_.chonkyiconname.md#openparentfolder)* = ChonkyIconName.openParentFolder

    * **iconOnly**: *true* = true

    * **name**: *"Go up a directory"* = "Go up a directory"

    * **tooltip**: *"Go up a directory"* = "Go up a directory"

* ### **Search**: *object*

  * **hotkeys**: *["ctrl+f"]* = ['ctrl+f']

  * **name**: *"search"* = "search"

  * **toolbarButton**: *object*

    * **icon**: *[search](../enums/_components_external_chonkyicon_.chonkyiconname.md#search)* = ChonkyIconName.search

    * **iconOnly**: *true* = true

    * **name**: *"Search"* = "Search"

* ### **UploadFiles**: *object*

  * **name**: *"upload_files"* = "upload_files"

  * **toolbarButton**: *object*

    * **icon**: *[upload](../enums/_components_external_chonkyicon_.chonkyiconname.md#upload)* = ChonkyIconName.upload

    * **name**: *"Upload files"* = "Upload files"

    * **tooltip**: *"Upload files"* = "Upload files"

___

### `Const` DefaultActions

• **DefaultActions**: *[FileAction](../interfaces/_typedef_.fileaction.md)[]* = [
    ChonkyActions.MoveFilesTo,
    ChonkyActions.DuplicateFilesTo,

    ChonkyActions.OpenParentFolder,
    ChonkyActions.OpenFiles,
    ChonkyActions.Search,
]

*Defined in [src/util/file-actions.ts:92](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/file-actions.ts#L92)*

## Functions

### `Const` useFileActionDispatcher

▸ **useFileActionDispatcher**(`fileActions`: [FileAction](../interfaces/_typedef_.fileaction.md)[], `onFileAction`: Nullable‹[FileActionHandler](_typedef_.md#fileactionhandler)›): *[InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher)*

*Defined in [src/util/file-actions.ts:107](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/file-actions.ts#L107)*

Returns a dispatch method meant to be used by child components. This dispatch method
is meant for actions that should be handled directly by the user. If you want to
transform the action internally before sending it to the user, use the "special
action dispatcher".

**Parameters:**

Name | Type |
------ | ------ |
`fileActions` | [FileAction](../interfaces/_typedef_.fileaction.md)[] |
`onFileAction` | Nullable‹[FileActionHandler](_typedef_.md#fileactionhandler)› |

**Returns:** *[InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher)*
