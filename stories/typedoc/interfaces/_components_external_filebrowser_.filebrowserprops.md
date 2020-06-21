[chonky](../README.md) › [Globals](../globals.md) › ["components/external/FileBrowser"](../modules/_components_external_filebrowser_.md) › [FileBrowserProps](_components_external_filebrowser_.filebrowserprops.md)

# Interface: FileBrowserProps

## Hierarchy

* **FileBrowserProps**

## Index

### Properties

* [disableDefaultFileActions](_components_external_filebrowser_.filebrowserprops.md#optional-disabledefaultfileactions)
* [disableSelection](_components_external_filebrowser_.filebrowserprops.md#optional-disableselection)
* [doubleClickDelay](_components_external_filebrowser_.filebrowserprops.md#optional-doubleclickdelay)
* [enableDragAndDrop](_components_external_filebrowser_.filebrowserprops.md#optional-enabledraganddrop)
* [fileActions](_components_external_filebrowser_.filebrowserprops.md#optional-fileactions)
* [files](_components_external_filebrowser_.filebrowserprops.md#files)
* [fillParentContainer](_components_external_filebrowser_.filebrowserprops.md#optional-fillparentcontainer)
* [folderChain](_components_external_filebrowser_.filebrowserprops.md#optional-folderchain)
* [onFileAction](_components_external_filebrowser_.filebrowserprops.md#optional-onfileaction)
* [thumbnailGenerator](_components_external_filebrowser_.filebrowserprops.md#optional-thumbnailgenerator)

## Properties

### `Optional` disableDefaultFileActions

• **disableDefaultFileActions**? : *undefined | false | true*

*Defined in [src/components/external/FileBrowser.tsx:76](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L76)*

___

### `Optional` disableSelection

• **disableSelection**? : *undefined | false | true*

*Defined in [src/components/external/FileBrowser.tsx:74](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L74)*

The flag that completely disables file selection functionality. If any handlers depend on file selections, their
input will look like no files are selected.

___

### `Optional` doubleClickDelay

• **doubleClickDelay**? : *undefined | number*

*Defined in [src/components/external/FileBrowser.tsx:68](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L68)*

Maximum delay between the two clicks in a double click, in milliseconds.

___

### `Optional` enableDragAndDrop

• **enableDragAndDrop**? : *undefined | false | true*

*Defined in [src/components/external/FileBrowser.tsx:82](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L82)*

The flag that completely disables drag & drop functionality.
[See relevant section](#section-managing-file-selection).

___

### `Optional` fileActions

• **fileActions**? : *[FileAction](_types_file_actions_types_.fileaction.md)[]*

*Defined in [src/components/external/FileBrowser.tsx:55](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L55)*

___

###  files

• **files**: *[FileArray](../modules/_types_files_types_.md#filearray)*

*Defined in [src/components/external/FileBrowser.tsx:45](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L45)*

List of files that will be displayed in the main container. The provided value
**must** be an array, where each element is either `null` or an object that
satisfies the `FileData` type. If an element is `null`, a loading placeholder
will be displayed in its place.

___

### `Optional` fillParentContainer

• **fillParentContainer**? : *undefined | false | true*

*Defined in [src/components/external/FileBrowser.tsx:89](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L89)*

The flag that determines whether Chonky should fill the height parent container. When set to `true`, the maximum
height of the file browser will be limited to the height of the parent container, and scrollbar will be shown
when necessary. When set to `false`, file browser height will be extended to display all files at the same time.

___

### `Optional` folderChain

• **folderChain**? : *[FileArray](../modules/_types_files_types_.md#filearray)*

*Defined in [src/components/external/FileBrowser.tsx:53](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L53)*

The current folder hierarchy. This should be an array of `files`, every
element should either be `null` or an object of `FileData` type. The first
element should represent the top-level directory, and the last element
should be the current folder.

___

### `Optional` onFileAction

• **onFileAction**? : *[FileActionHandler](../modules/_types_file_actions_types_.md#fileactionhandler)*

*Defined in [src/components/external/FileBrowser.tsx:56](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L56)*

___

### `Optional` thumbnailGenerator

• **thumbnailGenerator**? : *[ThumbnailGenerator](../modules/_types_thumbnails_types_.md#thumbnailgenerator)*

*Defined in [src/components/external/FileBrowser.tsx:63](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/components/external/FileBrowser.tsx#L63)*

The function that determines the thumbnail image URL for a file. It gets a file object as the input, and
should return a `string` or `null`. It can also return a promise that resolves into a `string` or `null`.
[See relevant section](#section-displaying-file-thumbnails).
