[chonky](../README.md) › [Globals](../globals.md) › ["util/selection"](../modules/_util_selection_.md) › [SelectionUtil](_util_selection_.selectionutil.md)

# Class: SelectionUtil

This `SelectionUtil` contains an internal reference to `files` and `selection`
objects. It is exposed via a React context, and is meant to be used in functions
that need to access selection WITHOUT triggering re-renders.

## Hierarchy

* **SelectionUtil**

  ↳ [UpdateableSelectionUtil](_util_selection_.updateableselectionutil.md)

## Index

### Constructors

* [constructor](_util_selection_.selectionutil.md#constructor)

### Properties

* [files](_util_selection_.selectionutil.md#private-files)
* [selection](_util_selection_.selectionutil.md#private-selection)

### Methods

* [getSelectedFiles](_util_selection_.selectionutil.md#getselectedfiles)
* [getSelection](_util_selection_.selectionutil.md#getselection)
* [getSelectionSize](_util_selection_.selectionutil.md#getselectionsize)
* [isSelected](_util_selection_.selectionutil.md#isselected)
* [protectedUpdate](_util_selection_.selectionutil.md#protected-protectedupdate)

## Constructors

###  constructor

\+ **new SelectionUtil**(`files`: [FileArray](../modules/_types_files_types_.md#filearray), `selection`: [FileSelection](../interfaces/_types_selection_types_.fileselection.md)): *[SelectionUtil](_util_selection_.selectionutil.md)*

*Defined in [src/util/selection.ts:136](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L136)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`files` | [FileArray](../modules/_types_files_types_.md#filearray) | [] |
`selection` | [FileSelection](../interfaces/_types_selection_types_.fileselection.md) | {} |

**Returns:** *[SelectionUtil](_util_selection_.selectionutil.md)*

## Properties

### `Private` files

• **files**: *[FileArray](../modules/_types_files_types_.md#filearray)*

*Defined in [src/util/selection.ts:135](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L135)*

___

### `Private` selection

• **selection**: *[FileSelection](../interfaces/_types_selection_types_.fileselection.md)*

*Defined in [src/util/selection.ts:136](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L136)*

## Methods

###  getSelectedFiles

▸ **getSelectedFiles**(...`filters`: [FileFilter](../modules/_types_files_types_.md#filefilter)[]): *ReadonlyArray‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››*

*Defined in [src/util/selection.ts:150](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`...filters` | [FileFilter](../modules/_types_files_types_.md#filefilter)[] |

**Returns:** *ReadonlyArray‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››*

___

###  getSelection

▸ **getSelection**(): *Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›*

*Defined in [src/util/selection.ts:147](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L147)*

**Returns:** *Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›*

___

###  getSelectionSize

▸ **getSelectionSize**(...`filters`: [FileFilter](../modules/_types_files_types_.md#filefilter)[]): *number*

*Defined in [src/util/selection.ts:155](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`...filters` | [FileFilter](../modules/_types_files_types_.md#filefilter)[] |

**Returns:** *number*

___

###  isSelected

▸ **isSelected**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *boolean*

*Defined in [src/util/selection.ts:158](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`file` | Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)› |

**Returns:** *boolean*

___

### `Protected` protectedUpdate

▸ **protectedUpdate**(`files`: [FileArray](../modules/_types_files_types_.md#filearray), `selection`: [FileSelection](../interfaces/_types_selection_types_.fileselection.md)): *void*

*Defined in [src/util/selection.ts:142](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](../modules/_types_files_types_.md#filearray) |
`selection` | [FileSelection](../interfaces/_types_selection_types_.fileselection.md) |

**Returns:** *void*
