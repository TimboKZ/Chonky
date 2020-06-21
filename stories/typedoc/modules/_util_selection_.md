[chonky](../README.md) › [Globals](../globals.md) › ["util/selection"](_util_selection_.md)

# Module: "util/selection"

## Index

### Classes

* [SelectionHelper](../classes/_util_selection_.selectionhelper.md)
* [SelectionUtil](../classes/_util_selection_.selectionutil.md)
* [UpdateableSelectionUtil](../classes/_util_selection_.updateableselectionutil.md)

### Functions

* [useSelection](_util_selection_.md#const-useselection)
* [useSelectionModifiers](_util_selection_.md#const-useselectionmodifiers)

## Functions

### `Const` useSelection

▸ **useSelection**(`files`: [FileArray](_types_files_types_.md#filearray), `disableSelection`: boolean): *object*

*Defined in [src/util/selection.ts:13](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/selection.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`disableSelection` | boolean |

**Returns:** *object*

* **clearSelection**: *(Anonymous function)*

* **selectFiles**: *(Anonymous function)*

* **selection**: *[FileSelection](../interfaces/_types_files_types_.fileselection.md)*

* **selectionSize**: *number*

* **selectionUtilRef**: *MutableRefObject‹[SelectionUtil](../classes/_util_selection_.selectionutil.md)‹››*

* **toggleSelection**: *(Anonymous function)*

___

### `Const` useSelectionModifiers

▸ **useSelectionModifiers**(`disableSelection`: boolean, `setSelection`: React.Dispatch‹React.SetStateAction‹[FileSelection](../interfaces/_types_files_types_.fileselection.md)››): *object*

*Defined in [src/util/selection.ts:49](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/selection.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`disableSelection` | boolean |
`setSelection` | React.Dispatch‹React.SetStateAction‹[FileSelection](../interfaces/_types_files_types_.fileselection.md)›› |

**Returns:** *object*

* **clearSelection**: *(Anonymous function)*

* **selectFiles**: *(Anonymous function)*

* **toggleSelection**: *(Anonymous function)*
