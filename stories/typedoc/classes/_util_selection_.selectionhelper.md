[chonky](../README.md) › [Globals](../globals.md) › ["util/selection"](../modules/_util_selection_.md) › [SelectionHelper](_util_selection_.selectionhelper.md)

# Class: SelectionHelper

This helper relies on the `files` and `selection` objects to be passed from the
outside. It is safe to use in React components because it doesn't have any
internal state, and all methods are static.

## Hierarchy

* **SelectionHelper**

## Index

### Methods

* [getSelectedFiles](_util_selection_.selectionhelper.md#static-getselectedfiles)
* [getSelectionSize](_util_selection_.selectionhelper.md#static-getselectionsize)
* [isSelected](_util_selection_.selectionhelper.md#static-isselected)

## Methods

### `Static` getSelectedFiles

▸ **getSelectedFiles**(`files`: [ReadonlyFileArray](../modules/_types_files_types_.md#readonlyfilearray), `selection`: Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›, ...`filters`: Nilable‹[FileFilter](../modules/_types_files_types_.md#filefilter)›[]): *ReadonlyArray‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››*

*Defined in [src/util/selection.ts:103](https://github.com/TimboKZ/Chonky/blob/8056a68/src/util/selection.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [ReadonlyFileArray](../modules/_types_files_types_.md#readonlyfilearray) |
`selection` | Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)› |
`...filters` | Nilable‹[FileFilter](../modules/_types_files_types_.md#filefilter)›[] |

**Returns:** *ReadonlyArray‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››*

___

### `Static` getSelectionSize

▸ **getSelectionSize**(`files`: [ReadonlyFileArray](../modules/_types_files_types_.md#readonlyfilearray), `selection`: Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›, ...`filters`: Nilable‹[FileFilter](../modules/_types_files_types_.md#filefilter)›[]): *number*

*Defined in [src/util/selection.ts:117](https://github.com/TimboKZ/Chonky/blob/8056a68/src/util/selection.ts#L117)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [ReadonlyFileArray](../modules/_types_files_types_.md#readonlyfilearray) |
`selection` | Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)› |
`...filters` | Nilable‹[FileFilter](../modules/_types_files_types_.md#filefilter)›[] |

**Returns:** *number*

___

### `Static` isSelected

▸ **isSelected**(`selection`: Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›, `file`: Nullable‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››): *boolean*

*Defined in [src/util/selection.ts:124](https://github.com/TimboKZ/Chonky/blob/8056a68/src/util/selection.ts#L124)*

**Parameters:**

Name | Type |
------ | ------ |
`selection` | Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)› |
`file` | Nullable‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)›› |

**Returns:** *boolean*
