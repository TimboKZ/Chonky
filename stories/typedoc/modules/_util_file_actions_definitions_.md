[chonky](../README.md) › [Globals](../globals.md) › ["util/file-actions-definitions"](_util_file_actions_definitions_.md)

# Module: "util/file-actions-definitions"

## Index

### Variables

* [ChonkyActions](_util_file_actions_definitions_.md#const-chonkyactions)
* [DefaultFileActions](_util_file_actions_definitions_.md#const-defaultfileactions)

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

    // Most important action of all - opening files!
    OpenFiles: {
        id: 'open_files',
        requiresSelection: true,
        hotkeys: ['enter'],
        fileFilter: FileHelper.isOpenable,
        toolbarButton: {
            name: 'Open selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.openFiles,
        },
    },

    // Toolbar related action
    OpenParentFolder: {
        id: 'open_parent_folder',
        hotkeys: ['backspace'],
        toolbarButton: {
            name: 'Go up a directory',
            icon: ChonkyIconName.openParentFolder,
            iconOnly: true,
        },

        specialActionToDispatch: SpecialAction.OpenParentFolder,
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

    // Actions related to selection
    SelectAllFiles: {
        id: 'select_all_files',
        hotkeys: ['ctrl+a'],
        toolbarButton: {
            name: 'Select all files',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.selectAllFiles,
            iconOnly: true,
        },

        specialActionToDispatch: SpecialAction.SelectAllFiles,
    },
    ClearSelection: {
        id: 'clear_selection',
        hotkeys: ['escape'],
        toolbarButton: {
            name: 'Clear selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.clearSelection,
            iconOnly: true,
        },

        specialActionToDispatch: SpecialAction.ClearSelection,
    },

    // Sorting actions
    SortFilesByName: {
        id: 'sort_files_by_name',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.name : undefined),
        toolbarButton: {
            name: 'Sort by name',
            group: 'Sort',
            dropdown: true,
        },
    },
    SortFilesBySize: {
        id: 'sort_files_by_size',
        sortKeySelector: (file: Nullable<FileData>) => (file ? file.size : undefined),
        toolbarButton: {
            name: 'Sort by size',
            group: 'Sort',
            dropdown: true,
        },
    },
    SortFilesByDate: {
        id: 'sort_files_by_date',
        sortKeySelector: (file: Nullable<FileData>) =>
            file ? file.modDate : undefined,
        toolbarButton: {
            name: 'Sort by date',
            group: 'Sort',
            dropdown: true,
        },
    },

    // Toggleable options
    ToggleHiddenFiles: {
        id: 'toggle_hidden_files',
        option: {
            id: 'show_hidden_files',
            defaultValue: true,
        },
        toolbarButton: {
            name: 'Show hidden files',
            group: 'Options',
            dropdown: true,
        },
    },
    ToggleShowFoldersFirst: {
        id: 'toggle_show_folders_first',
        option: {
            id: 'show_folders_first',
            defaultValue: true,
        },
        toolbarButton: {
            name: 'Show folders first',
            group: 'Options',
            dropdown: true,
        },
    },

    // Optional actions
    CopyFiles: {
        id: 'copy_files',
        requiresSelection: true,
        hotkeys: ['ctrl+c'],
        toolbarButton: {
            name: 'Copy selection',
            group: 'Actions',
            dropdown: true,
            icon: ChonkyIconName.copy,
        },
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
    DeleteFiles: {
        id: 'delete_files',
        requiresSelection: true,
        hotkeys: ['delete'],
        toolbarButton: {
            name: 'Delete files',
            group: 'Actions',
            tooltip: 'Delete files',
            dropdown: true,
            icon: ChonkyIconName.trash,
        },
    },
} as const

*Defined in [src/util/file-actions-definitions.ts:9](https://github.com/TimboKZ/Chonky/blob/603fef8/src/util/file-actions-definitions.ts#L9)*

#### Type declaration:

* ### **ClearSelection**: *object*

  * **hotkeys**: *["escape"]* = ['escape']

  * **id**: *"clear_selection"* = "clear_selection"

  * **specialActionToDispatch**: *[ClearSelection](../enums/_types_special_actions_types_.specialaction.md#clearselection)* = SpecialAction.ClearSelection

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[clearSelection](../enums/_types_icons_types_.chonkyiconname.md#clearselection)* = ChonkyIconName.clearSelection

    * **iconOnly**: *true* = true

    * **name**: *"Clear selection"* = "Clear selection"

* ### **CopyFiles**: *object*

  * **hotkeys**: *["ctrl+c"]* = ['ctrl+c']

  * **id**: *"copy_files"* = "copy_files"

  * **requiresSelection**: *true* = true

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[copy](../enums/_types_icons_types_.chonkyiconname.md#copy)* = ChonkyIconName.copy

    * **name**: *"Copy selection"* = "Copy selection"

* ### **CreateFolder**: *object*

  * **id**: *"create_folder"* = "create_folder"

  * **toolbarButton**: *object*

    * **icon**: *[folderCreate](../enums/_types_icons_types_.chonkyiconname.md#foldercreate)* = ChonkyIconName.folderCreate

    * **name**: *"Create folder"* = "Create folder"

    * **tooltip**: *"Create a folder"* = "Create a folder"

* ### **DeleteFiles**: *object*

  * **hotkeys**: *["delete"]* = ['delete']

  * **id**: *"delete_files"* = "delete_files"

  * **requiresSelection**: *true* = true

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[trash](../enums/_types_icons_types_.chonkyiconname.md#trash)* = ChonkyIconName.trash

    * **name**: *"Delete files"* = "Delete files"

    * **tooltip**: *"Delete files"* = "Delete files"

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

  * **hotkeys**: *["enter"]* = ['enter']

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

  * **specialActionToDispatch**: *[OpenParentFolder](../enums/_types_special_actions_types_.specialaction.md#openparentfolder)* = SpecialAction.OpenParentFolder

  * **toolbarButton**: *object*

    * **icon**: *[openParentFolder](../enums/_types_icons_types_.chonkyiconname.md#openparentfolder)* = ChonkyIconName.openParentFolder

    * **iconOnly**: *true* = true

    * **name**: *"Go up a directory"* = "Go up a directory"

* ### **SelectAllFiles**: *object*

  * **hotkeys**: *["ctrl+a"]* = ['ctrl+a']

  * **id**: *"select_all_files"* = "select_all_files"

  * **specialActionToDispatch**: *[SelectAllFiles](../enums/_types_special_actions_types_.specialaction.md#selectallfiles)* = SpecialAction.SelectAllFiles

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Actions"* = "Actions"

    * **icon**: *[selectAllFiles](../enums/_types_icons_types_.chonkyiconname.md#selectallfiles)* = ChonkyIconName.selectAllFiles

    * **iconOnly**: *true* = true

    * **name**: *"Select all files"* = "Select all files"

* ### **SortFilesByDate**: *object*

  * **id**: *"sort_files_by_date"* = "sort_files_by_date"

  * **sortKeySelector**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *undefined | string | Date*

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Sort"* = "Sort"

    * **name**: *"Sort by date"* = "Sort by date"

* ### **SortFilesByName**: *object*

  * **id**: *"sort_files_by_name"* = "sort_files_by_name"

  * **sortKeySelector**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *undefined | string*

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Sort"* = "Sort"

    * **name**: *"Sort by name"* = "Sort by name"

* ### **SortFilesBySize**: *object*

  * **id**: *"sort_files_by_size"* = "sort_files_by_size"

  * **sortKeySelector**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *undefined | number*

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Sort"* = "Sort"

    * **name**: *"Sort by size"* = "Sort by size"

* ### **ToggleHiddenFiles**: *object*

  * **id**: *"toggle_hidden_files"* = "toggle_hidden_files"

  * **option**: *object*

    * **defaultValue**: *true* = true

    * **id**: *"show_hidden_files"* = "show_hidden_files"

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Options"* = "Options"

    * **name**: *"Show hidden files"* = "Show hidden files"

* ### **ToggleSearch**: *object*

  * **hotkeys**: *["ctrl+f"]* = ['ctrl+f']

  * **id**: *"toggle_search"* = "toggle_search"

  * **specialActionToDispatch**: *[ToggleSearchBar](../enums/_types_special_actions_types_.specialaction.md#togglesearchbar)* = SpecialAction.ToggleSearchBar

  * **toolbarButton**: *object*

    * **icon**: *[search](../enums/_types_icons_types_.chonkyiconname.md#search)* = ChonkyIconName.search

    * **iconOnly**: *true* = true

    * **name**: *"Search"* = "Search"

* ### **ToggleShowFoldersFirst**: *object*

  * **id**: *"toggle_show_folders_first"* = "toggle_show_folders_first"

  * **option**: *object*

    * **defaultValue**: *true* = true

    * **id**: *"show_folders_first"* = "show_folders_first"

  * **toolbarButton**: *object*

    * **dropdown**: *true* = true

    * **group**: *"Options"* = "Options"

    * **name**: *"Show folders first"* = "Show folders first"

* ### **UploadFiles**: *object*

  * **id**: *"upload_files"* = "upload_files"

  * **toolbarButton**: *object*

    * **icon**: *[upload](../enums/_types_icons_types_.chonkyiconname.md#upload)* = ChonkyIconName.upload

    * **name**: *"Upload files"* = "Upload files"

    * **tooltip**: *"Upload files"* = "Upload files"

___

### `Const` DefaultFileActions

• **DefaultFileActions**: *[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]* = [
    ChonkyActions.MoveFilesTo,
    ChonkyActions.DuplicateFilesTo,

    ChonkyActions.OpenParentFolder,
    ChonkyActions.ToggleSearch,

    ChonkyActions.OpenFiles,
    ChonkyActions.SelectAllFiles,
    ChonkyActions.ClearSelection,

    ChonkyActions.SortFilesByName,
    ChonkyActions.SortFilesBySize,
    ChonkyActions.SortFilesByDate,

    ChonkyActions.ToggleHiddenFiles,
    ChonkyActions.ToggleShowFoldersFirst,
]

*Defined in [src/util/file-actions-definitions.ts:193](https://github.com/TimboKZ/Chonky/blob/603fef8/src/util/file-actions-definitions.ts#L193)*
