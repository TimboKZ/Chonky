[chonky](../README.md) › [Globals](../globals.md) › ["util/special-actions"](_util_special_actions_.md)

# Module: "util/special-actions"

## Index

### Functions

* [useSpecialActionDispatcher](_util_special_actions_.md#const-usespecialactiondispatcher)
* [useSpecialFileActionHandlerMap](_util_special_actions_.md#const-usespecialfileactionhandlermap)

## Functions

### `Const` useSpecialActionDispatcher

▸ **useSpecialActionDispatcher**(`files`: [FileArray](_types_files_types_.md#filearray), `selection`: [FileSelection](../interfaces/_types_selection_types_.fileselection.md), `selectionUtil`: [SelectionUtil](../classes/_util_selection_.selectionutil.md), `selectionModifiers`: [SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)): *void*

*Defined in [src/util/special-actions.ts:34](https://github.com/TimboKZ/Chonky/blob/4792a84/src/util/special-actions.ts#L34)*

Returns a dispatch method meant to be used by child components. This dispatch
method is meant for "special" internal actions. It takes a special action, and
transforms it into a "file action" that can be handled by the user.

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`selection` | [FileSelection](../interfaces/_types_selection_types_.fileselection.md) |
`selectionUtil` | [SelectionUtil](../classes/_util_selection_.selectionutil.md) |
`selectionModifiers` | [SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md) |

**Returns:** *void*

___

### `Const` useSpecialFileActionHandlerMap

▸ **useSpecialFileActionHandlerMap**(`selectionUtil`: [SelectionUtil](../classes/_util_selection_.selectionutil.md), `selectionModifiers`: [SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)): *object*

*Defined in [src/util/special-actions.ts:79](https://github.com/TimboKZ/Chonky/blob/4792a84/src/util/special-actions.ts#L79)*

**Parameters:**

Name | Type |
------ | ------ |
`selectionUtil` | [SelectionUtil](../classes/_util_selection_.selectionutil.md) |
`selectionModifiers` | [SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md) |

**Returns:** *object*
