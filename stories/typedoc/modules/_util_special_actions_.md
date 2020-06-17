[chonky](../README.md) › [Globals](../globals.md) › ["util/special-actions"](_util_special_actions_.md)

# Module: "util/special-actions"

## Index

### Enumerations

* [SpecialAction](../enums/_util_special_actions_.specialaction.md)

### Interfaces

* [SpecialDragNDropEndAction](../interfaces/_util_special_actions_.specialdragndropendaction.md)
* [SpecialDragNDropStartAction](../interfaces/_util_special_actions_.specialdragndropstartaction.md)
* [SpecialFileKeyboardClickAction](../interfaces/_util_special_actions_.specialfilekeyboardclickaction.md)
* [SpecialFileMouseClickAction](../interfaces/_util_special_actions_.specialfilemouseclickaction.md)
* [SpecialMutableChonkyState](../interfaces/_util_special_actions_.specialmutablechonkystate.md)

### Type aliases

* [SpecialActionData](_util_special_actions_.md#specialactiondata)

### Functions

* [useSpecialActionDispatcher](_util_special_actions_.md#const-usespecialactiondispatcher)
* [useSpecialFileActionHandlerMap](_util_special_actions_.md#const-usespecialfileactionhandlermap)

## Type aliases

###  SpecialActionData

Ƭ **SpecialActionData**: *[SpecialFileMouseClickAction](../interfaces/_util_special_actions_.specialfilemouseclickaction.md) | [SpecialFileKeyboardClickAction](../interfaces/_util_special_actions_.specialfilekeyboardclickaction.md) | [SpecialDragNDropStartAction](../interfaces/_util_special_actions_.specialdragndropstartaction.md) | [SpecialDragNDropEndAction](../interfaces/_util_special_actions_.specialdragndropendaction.md)*

*Defined in [src/util/special-actions.ts:55](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/special-actions.ts#L55)*

## Functions

### `Const` useSpecialActionDispatcher

▸ **useSpecialActionDispatcher**(`files`: [FileArray](_typedef_.md#filearray), `selection`: [FileSelection](../interfaces/_typedef_.fileselection.md), `selectionUtil`: [SelectionUtil](../classes/_util_selection_.selectionutil.md), `selectFiles`: ReturnType<typeof useSelection>["selectFiles"], `toggleSelection`: ReturnType<typeof useSelection>["toggleSelection"], `clearSelection`: ReturnType<typeof useSelection>["clearSelection"], `dispatchFileAction`: [InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher)): *[InternalSpecialActionDispatcher](_typedef_.md#internalspecialactiondispatcher)*

*Defined in [src/util/special-actions.ts:71](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/special-actions.ts#L71)*

Returns a dispatch method meant to be used by child components. This dispatch
method is meant for "special" internal actions. It takes a special action, and
transforms it into a "file action" that can be handled by the user.

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_typedef_.md#filearray) |
`selection` | [FileSelection](../interfaces/_typedef_.fileselection.md) |
`selectionUtil` | [SelectionUtil](../classes/_util_selection_.selectionutil.md) |
`selectFiles` | ReturnType<typeof useSelection>["selectFiles"] |
`toggleSelection` | ReturnType<typeof useSelection>["toggleSelection"] |
`clearSelection` | ReturnType<typeof useSelection>["clearSelection"] |
`dispatchFileAction` | [InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher) |

**Returns:** *[InternalSpecialActionDispatcher](_typedef_.md#internalspecialactiondispatcher)*

___

### `Const` useSpecialFileActionHandlerMap

▸ **useSpecialFileActionHandlerMap**(`selectionUtil`: [SelectionUtil](../classes/_util_selection_.selectionutil.md), `selectFiles`: ReturnType<typeof useSelection>["selectFiles"], `toggleSelection`: ReturnType<typeof useSelection>["toggleSelection"], `clearSelection`: ReturnType<typeof useSelection>["clearSelection"], `dispatchFileAction`: [InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher)): *object*

*Defined in [src/util/special-actions.ts:128](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/special-actions.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`selectionUtil` | [SelectionUtil](../classes/_util_selection_.selectionutil.md) |
`selectFiles` | ReturnType<typeof useSelection>["selectFiles"] |
`toggleSelection` | ReturnType<typeof useSelection>["toggleSelection"] |
`clearSelection` | ReturnType<typeof useSelection>["clearSelection"] |
`dispatchFileAction` | [InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher) |

**Returns:** *object*
