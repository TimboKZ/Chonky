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

*Defined in [src/util/selection.ts:13](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/selection.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`disableSelection` | boolean |

**Returns:** *object*

* **selection**: *[FileSelection](../interfaces/_types_selection_types_.fileselection.md)*

* **selectionModifiers**: *[SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)*

* **selectionSize**: *number*

* **selectionUtilRef**: *MutableRefObject‹[SelectionUtil](../classes/_util_selection_.selectionutil.md)‹››*

___

### `Const` useSelectionModifiers

▸ **useSelectionModifiers**(`disableSelection`: boolean, `setSelection`: React.Dispatch‹React.SetStateAction‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)››): *[SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)*

*Defined in [src/util/selection.ts:44](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/selection.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`disableSelection` | boolean |
`setSelection` | React.Dispatch‹React.SetStateAction‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›› |

**Returns:** *[SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)*
