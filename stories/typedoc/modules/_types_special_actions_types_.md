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
* [SpecialOpenParentFolderAction](../interfaces/_types_special_actions_types_.specialopenparentfolderaction.md)
* [SpecialToggleSearchBarAction](../interfaces/_types_special_actions_types_.specialtogglesearchbaraction.md)

### Type aliases

* [InternalSpecialActionDispatcher](_types_special_actions_types_.md#internalspecialactiondispatcher)
* [SpecialActionData](_types_special_actions_types_.md#specialactiondata)
* [SpecialActionHandlerMap](_types_special_actions_types_.md#specialactionhandlermap)

## Type aliases

###  InternalSpecialActionDispatcher

Ƭ **InternalSpecialActionDispatcher**: *function*

*Defined in [src/types/special-actions.types.ts:68](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/special-actions.types.ts#L68)*

#### Type declaration:

▸ (`actionData`: [SpecialActionData](_types_special_actions_types_.md#specialactiondata)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [SpecialActionData](_types_special_actions_types_.md#specialactiondata) |

___

###  SpecialActionData

Ƭ **SpecialActionData**: *[SpecialFileMouseClickAction](../interfaces/_types_special_actions_types_.specialfilemouseclickaction.md) | [SpecialFileKeyboardClickAction](../interfaces/_types_special_actions_types_.specialfilekeyboardclickaction.md) | [SpecialOpenParentFolderAction](../interfaces/_types_special_actions_types_.specialopenparentfolderaction.md) | [SpecialOpenFolderChainFolderAction](../interfaces/_types_special_actions_types_.specialopenfolderchainfolderaction.md) | [SpecialToggleSearchBarAction](../interfaces/_types_special_actions_types_.specialtogglesearchbaraction.md) | [SpecialDragNDropStartAction](../interfaces/_types_special_actions_types_.specialdragndropstartaction.md) | [SpecialDragNDropEndAction](../interfaces/_types_special_actions_types_.specialdragndropendaction.md)*

*Defined in [src/types/special-actions.types.ts:59](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/special-actions.types.ts#L59)*

___

###  SpecialActionHandlerMap

Ƭ **SpecialActionHandlerMap**: *object*

*Defined in [src/types/special-actions.types.ts:70](https://github.com/TimboKZ/Chonky/blob/bceb265/src/types/special-actions.types.ts#L70)*

#### Type declaration:
