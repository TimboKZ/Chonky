[chonky](../README.md) › [Globals](../globals.md) › ["types/file-browser.types"](../modules/_types_file_browser_types_.md) › [FileBrowserProps](_types_file_browser_types_.filebrowserprops.md)

# Interface: FileBrowserProps

## Hierarchy

* **FileBrowserProps**

## Index

### Properties

* [disableDefaultFileActions](_types_file_browser_types_.filebrowserprops.md#optional-disabledefaultfileactions)
* [disableSelection](_types_file_browser_types_.filebrowserprops.md#optional-disableselection)
* [doubleClickDelay](_types_file_browser_types_.filebrowserprops.md#optional-doubleclickdelay)
* [enableDragAndDrop](_types_file_browser_types_.filebrowserprops.md#optional-enabledraganddrop)
* [fileActions](_types_file_browser_types_.filebrowserprops.md#optional-fileactions)
* [files](_types_file_browser_types_.filebrowserprops.md#files)
* [fillParentContainer](_types_file_browser_types_.filebrowserprops.md#optional-fillparentcontainer)
* [folderChain](_types_file_browser_types_.filebrowserprops.md#optional-folderchain)
* [onFileAction](_types_file_browser_types_.filebrowserprops.md#optional-onfileaction)
* [thumbnailGenerator](_types_file_browser_types_.filebrowserprops.md#optional-thumbnailgenerator)

## Properties

### `Optional` disableDefaultFileActions

• **disableDefaultFileActions**? : *undefined | false | true*

*Defined in [src/types/file-browser.types.ts:44](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L44)*

___

### `Optional` disableSelection

• **disableSelection**? : *undefined | false | true*

*Defined in [src/types/file-browser.types.ts:42](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L42)*

The flag that completely disables file selection functionality. If any handlers depend on file selections, their
input will look like no files are selected.

___

### `Optional` doubleClickDelay

• **doubleClickDelay**? : *undefined | number*

*Defined in [src/types/file-browser.types.ts:36](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L36)*

Maximum delay between the two clicks in a double click, in milliseconds.

___

### `Optional` enableDragAndDrop

• **enableDragAndDrop**? : *undefined | false | true*

*Defined in [src/types/file-browser.types.ts:50](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L50)*

The flag that completely disables drag & drop functionality.
[See relevant section](#section-managing-file-selection).

___

### `Optional` fileActions

• **fileActions**? : *[FileAction](_types_file_actions_types_.fileaction.md)[]*

*Defined in [src/types/file-browser.types.ts:23](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L23)*

___

###  files

• **files**: *[FileArray](../modules/_types_files_types_.md#filearray)*

*Defined in [src/types/file-browser.types.ts:13](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L13)*

List of files that will be displayed in the main container. The provided value
**must** be an array, where each element is either `null` or an object that
satisfies the `FileData` type. If an element is `null`, a loading placeholder
will be displayed in its place.

___

### `Optional` fillParentContainer

• **fillParentContainer**? : *undefined | false | true*

*Defined in [src/types/file-browser.types.ts:57](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L57)*

The flag that determines whether Chonky should fill the height parent container. When set to `true`, the maximum
height of the file browser will be limited to the height of the parent container, and scrollbar will be shown
when necessary. When set to `false`, file browser height will be extended to display all files at the same time.

___

### `Optional` folderChain

• **folderChain**? : *Nullable‹[FileArray](../modules/_types_files_types_.md#filearray)›*

*Defined in [src/types/file-browser.types.ts:21](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L21)*

The current folder hierarchy. This should be an array of `files`, every
element should either be `null` or an object of `FileData` type. The first
element should represent the top-level directory, and the last element
should be the current folder.

___

### `Optional` onFileAction

• **onFileAction**? : *[FileActionHandler](../modules/_types_file_actions_types_.md#fileactionhandler)*

*Defined in [src/types/file-browser.types.ts:24](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L24)*

___

### `Optional` thumbnailGenerator

• **thumbnailGenerator**? : *[ThumbnailGenerator](../modules/_types_thumbnails_types_.md#thumbnailgenerator)*

*Defined in [src/types/file-browser.types.ts:31](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/file-browser.types.ts#L31)*

The function that determines the thumbnail image URL for a file. It gets a file object as the input, and
should return a `string` or `null`. It can also return a promise that resolves into a `string` or `null`.
[See relevant section](#section-displaying-file-thumbnails).
