[chonky](../README.md) › [Globals](../globals.md) › ["util/hooks-helpers"](_util_hooks_helpers_.md)

# Module: "util/hooks-helpers"

## Index

### Functions

* [useDebounce](_util_hooks_helpers_.md#const-usedebounce)
* [useOutsideClickListener](_util_hooks_helpers_.md#const-useoutsideclicklistener)

## Functions

### `Const` useDebounce

▸ **useDebounce**‹**T**›(`value`: T, `delay`: number): *T*

*Defined in [src/util/hooks-helpers.ts:3](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/hooks-helpers.ts#L3)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`delay` | number |

**Returns:** *T*

___

### `Const` useOutsideClickListener

▸ **useOutsideClickListener**‹**T**›(`onOutsideClick`: function): *RefObject‹T›*

*Defined in [src/util/hooks-helpers.ts:19](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/hooks-helpers.ts#L19)*

**Type parameters:**

▪ **T**: *HTMLElement*

**Parameters:**

▪ **onOutsideClick**: *function*

▸ (`event`: MouseEvent): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | MouseEvent |

**Returns:** *RefObject‹T›*
