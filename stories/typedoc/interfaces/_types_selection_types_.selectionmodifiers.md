[chonky](../README.md) › [Globals](../globals.md) › ["types/selection.types"](../modules/_types_selection_types_.md) › [SelectionModifiers](_types_selection_types_.selectionmodifiers.md)

# Interface: SelectionModifiers

## Hierarchy

* **SelectionModifiers**

## Index

### Properties

* [clearSelection](_types_selection_types_.selectionmodifiers.md#clearselection)
* [selectFiles](_types_selection_types_.selectionmodifiers.md#selectfiles)
* [toggleSelection](_types_selection_types_.selectionmodifiers.md#toggleselection)

## Properties

###  clearSelection

• **clearSelection**: *function*

*Defined in [src/types/selection.types.ts:11](https://github.com/TimboKZ/Chonky/blob/3d6eae9/src/types/selection.types.ts#L11)*

#### Type declaration:

▸ (): *void*

___

###  selectFiles

• **selectFiles**: *function*

*Defined in [src/types/selection.types.ts:9](https://github.com/TimboKZ/Chonky/blob/3d6eae9/src/types/selection.types.ts#L9)*

#### Type declaration:

▸ (`fileIds`: string[], `reset?`: undefined | false | true): *void*

**Parameters:**

Name | Type |
------ | ------ |
`fileIds` | string[] |
`reset?` | undefined &#124; false &#124; true |

___

###  toggleSelection

• **toggleSelection**: *function*

*Defined in [src/types/selection.types.ts:10](https://github.com/TimboKZ/Chonky/blob/3d6eae9/src/types/selection.types.ts#L10)*

#### Type declaration:

▸ (`fileId`: string, `exclusive?`: undefined | false | true): *void*

**Parameters:**

Name | Type |
------ | ------ |
`fileId` | string |
`exclusive?` | undefined &#124; false &#124; true |
