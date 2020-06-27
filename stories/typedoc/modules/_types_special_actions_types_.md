[chonky](../README.md) › [Globals](../globals.md) › ["types/special-actions.types"](_types_special_actions_types_.md)

# Module: "types/special-actions.types"

## Index

### Enumerations

* [SpecialAction](../enums/_types_special_actions_types_.specialaction.md)

### Interfaces

* [SpecialDragNDropEndAction](../interfaces/_types_special_actions_types_.specialdragndropendaction.md)
* [SpecialDragNDropStartAction](../interfaces/_types_special_actions_types_.specialdragndropstartaction.md)
* [SpecialFileKeyboardClickAction](../interfaces/_types_special_actions_types_.specialfilekeyboardclickaction.md)
* [SpecialFileMouseClickAction](../interfaces/_types_special_actions_types_.specialfilemouseclickaction.md)
* [SpecialOpenFolderChainFolderAction](../interfaces/_types_special_actions_types_.specialopenfolderchainfolderaction.md)
* [SpecialSimpleAction](../interfaces/_types_special_actions_types_.specialsimpleaction.md)

### Type aliases

* [InternalSpecialActionDispatcher](_types_special_actions_types_.md#internalspecialactiondispatcher)
* [SpecialActionData](_types_special_actions_types_.md#specialactiondata)
* [SpecialActionHandlerMap](_types_special_actions_types_.md#specialactionhandlermap)

## Type aliases

###  InternalSpecialActionDispatcher

Ƭ **InternalSpecialActionDispatcher**: *function*

*Defined in [src/types/special-actions.types.ts:72](https://github.com/TimboKZ/Chonky/blob/5b9fbdf/src/types/special-actions.types.ts#L72)*

#### Type declaration:

▸ (`actionData`: [SpecialActionData](_types_special_actions_types_.md#specialactiondata)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [SpecialActionData](_types_special_actions_types_.md#specialactiondata) |

___

###  SpecialActionData

Ƭ **SpecialActionData**: *[SpecialFileMouseClickAction](../interfaces/_types_special_actions_types_.specialfilemouseclickaction.md) | [SpecialFileKeyboardClickAction](../interfaces/_types_special_actions_types_.specialfilekeyboardclickaction.md) | [SpecialOpenFolderChainFolderAction](../interfaces/_types_special_actions_types_.specialopenfolderchainfolderaction.md) | [SpecialDragNDropStartAction](../interfaces/_types_special_actions_types_.specialdragndropstartaction.md) | [SpecialDragNDropEndAction](../interfaces/_types_special_actions_types_.specialdragndropendaction.md) | [SpecialSimpleAction](../interfaces/_types_special_actions_types_.specialsimpleaction.md)*

*Defined in [src/types/special-actions.types.ts:64](https://github.com/TimboKZ/Chonky/blob/5b9fbdf/src/types/special-actions.types.ts#L64)*

___

###  SpecialActionHandlerMap

Ƭ **SpecialActionHandlerMap**: *object*

*Defined in [src/types/special-actions.types.ts:74](https://github.com/TimboKZ/Chonky/blob/5b9fbdf/src/types/special-actions.types.ts#L74)*

#### Type declaration:
