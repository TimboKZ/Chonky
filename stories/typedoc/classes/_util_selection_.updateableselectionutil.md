[chonky](../README.md) › [Globals](../globals.md) › ["util/selection"](../modules/_util_selection_.md) › [UpdateableSelectionUtil](_util_selection_.updateableselectionutil.md)

# Class: UpdateableSelectionUtil

## Hierarchy

* [SelectionUtil](_util_selection_.selectionutil.md)

  ↳ **UpdateableSelectionUtil**

## Index

### Constructors

* [constructor](_util_selection_.updateableselectionutil.md#constructor)

### Methods

* [getSelectedFiles](_util_selection_.updateableselectionutil.md#getselectedfiles)
* [getSelection](_util_selection_.updateableselectionutil.md#getselection)
* [getSelectionSize](_util_selection_.updateableselectionutil.md#getselectionsize)
* [isSelected](_util_selection_.updateableselectionutil.md#isselected)
* [protectedUpdate](_util_selection_.updateableselectionutil.md#protected-protectedupdate)
* [update](_util_selection_.updateableselectionutil.md#update)

## Constructors

###  constructor

\+ **new UpdateableSelectionUtil**(`files`: [FileArray](../modules/_types_files_types_.md#filearray), `selection`: [FileSelection](../interfaces/_types_selection_types_.fileselection.md)): *[UpdateableSelectionUtil](_util_selection_.updateableselectionutil.md)*

*Inherited from [SelectionUtil](_util_selection_.selectionutil.md).[constructor](_util_selection_.selectionutil.md#constructor)*

*Defined in [src/util/selection.ts:136](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L136)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`files` | [FileArray](../modules/_types_files_types_.md#filearray) | [] |
`selection` | [FileSelection](../interfaces/_types_selection_types_.fileselection.md) | {} |

**Returns:** *[UpdateableSelectionUtil](_util_selection_.updateableselectionutil.md)*

## Methods

###  getSelectedFiles

▸ **getSelectedFiles**(...`filters`: [FileFilter](../modules/_types_files_types_.md#filefilter)[]): *ReadonlyArray‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››*

*Inherited from [SelectionUtil](_util_selection_.selectionutil.md).[getSelectedFiles](_util_selection_.selectionutil.md#getselectedfiles)*

*Defined in [src/util/selection.ts:150](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L150)*

**Parameters:**

Name | Type |
------ | ------ |
`...filters` | [FileFilter](../modules/_types_files_types_.md#filefilter)[] |

**Returns:** *ReadonlyArray‹Readonly‹[FileData](../interfaces/_types_files_types_.filedata.md)››*

___

###  getSelection

▸ **getSelection**(): *Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›*

*Inherited from [SelectionUtil](_util_selection_.selectionutil.md).[getSelection](_util_selection_.selectionutil.md#getselection)*

*Defined in [src/util/selection.ts:147](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L147)*

**Returns:** *Readonly‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›*

___

###  getSelectionSize

▸ **getSelectionSize**(...`filters`: [FileFilter](../modules/_types_files_types_.md#filefilter)[]): *number*

*Inherited from [SelectionUtil](_util_selection_.selectionutil.md).[getSelectionSize](_util_selection_.selectionutil.md#getselectionsize)*

*Defined in [src/util/selection.ts:155](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`...filters` | [FileFilter](../modules/_types_files_types_.md#filefilter)[] |

**Returns:** *number*

___

###  isSelected

▸ **isSelected**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *boolean*

*Inherited from [SelectionUtil](_util_selection_.selectionutil.md).[isSelected](_util_selection_.selectionutil.md#isselected)*

*Defined in [src/util/selection.ts:158](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L158)*

**Parameters:**

Name | Type |
------ | ------ |
`file` | Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)› |

**Returns:** *boolean*

___

### `Protected` protectedUpdate

▸ **protectedUpdate**(`files`: [FileArray](../modules/_types_files_types_.md#filearray), `selection`: [FileSelection](../interfaces/_types_selection_types_.fileselection.md)): *void*

*Inherited from [SelectionUtil](_util_selection_.selectionutil.md).[protectedUpdate](_util_selection_.selectionutil.md#protected-protectedupdate)*

*Defined in [src/util/selection.ts:142](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](../modules/_types_files_types_.md#filearray) |
`selection` | [FileSelection](../interfaces/_types_selection_types_.fileselection.md) |

**Returns:** *void*

___

###  update

▸ **update**(...`args`: Parameters‹SelectionUtil["protectedUpdate"]›): *void*

*Defined in [src/util/selection.ts:164](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/selection.ts#L164)*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Parameters‹SelectionUtil["protectedUpdate"]› |

**Returns:** *void*
