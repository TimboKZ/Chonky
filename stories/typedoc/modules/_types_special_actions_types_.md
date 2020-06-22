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
* [SpecialToggleSearchBarAction](../interfaces/_types_special_actions_types_.specialtogglesearchbaraction.md)

### Type aliases

* [InternalSpecialActionDispatcher](_types_special_actions_types_.md#internalspecialactiondispatcher)
* [SpecialActionData](_types_special_actions_types_.md#specialactiondata)

## Type aliases

###  InternalSpecialActionDispatcher

Ƭ **InternalSpecialActionDispatcher**: *function*

*Defined in [src/types/special-actions.types.ts:55](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/types/special-actions.types.ts#L55)*

#### Type declaration:

▸ (`actionData`: [SpecialActionData](_types_special_actions_types_.md#specialactiondata)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [SpecialActionData](_types_special_actions_types_.md#specialactiondata) |

___

###  SpecialActionData

Ƭ **SpecialActionData**: *[SpecialFileMouseClickAction](../interfaces/_types_special_actions_types_.specialfilemouseclickaction.md) | [SpecialFileKeyboardClickAction](../interfaces/_types_special_actions_types_.specialfilekeyboardclickaction.md) | [SpecialToggleSearchBarAction](../interfaces/_types_special_actions_types_.specialtogglesearchbaraction.md) | [SpecialDragNDropStartAction](../interfaces/_types_special_actions_types_.specialdragndropstartaction.md) | [SpecialDragNDropEndAction](../interfaces/_types_special_actions_types_.specialdragndropendaction.md)*

*Defined in [src/types/special-actions.types.ts:48](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/types/special-actions.types.ts#L48)*
