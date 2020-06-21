[chonky](../README.md) › [Globals](../globals.md) › ["util/hooks-helpers"](_util_hooks_helpers_.md)

# Module: "util/hooks-helpers"

## Index

### Interfaces

* [UseClickListenerParams](../interfaces/_util_hooks_helpers_.useclicklistenerparams.md)

### Variables

* [UNINITIALIZED_SENTINEL](_util_hooks_helpers_.md#const-uninitialized_sentinel)

### Functions

* [useClickListener](_util_hooks_helpers_.md#const-useclicklistener)
* [useDebounce](_util_hooks_helpers_.md#const-usedebounce)
* [useStaticValue](_util_hooks_helpers_.md#const-usestaticvalue)

## Variables

### `Const` UNINITIALIZED_SENTINEL

• **UNINITIALIZED_SENTINEL**: *object*

*Defined in [src/util/hooks-helpers.ts:22](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/hooks-helpers.ts#L22)*

#### Type declaration:

## Functions

### `Const` useClickListener

▸ **useClickListener**‹**T**›(`params`: [UseClickListenerParams](../interfaces/_util_hooks_helpers_.useclicklistenerparams.md)): *RefObject‹T›*

*Defined in [src/util/hooks-helpers.ts:35](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/hooks-helpers.ts#L35)*

**Type parameters:**

▪ **T**: *HTMLElement*

**Parameters:**

Name | Type |
------ | ------ |
`params` | [UseClickListenerParams](../interfaces/_util_hooks_helpers_.useclicklistenerparams.md) |

**Returns:** *RefObject‹T›*

___

### `Const` useDebounce

▸ **useDebounce**‹**T**›(`value`: T, `delay`: number): *[T, React.Dispatch‹React.SetStateAction‹T››]*

*Defined in [src/util/hooks-helpers.ts:3](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/hooks-helpers.ts#L3)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`delay` | number |

**Returns:** *[T, React.Dispatch‹React.SetStateAction‹T››]*

___

### `Const` useStaticValue

▸ **useStaticValue**‹**T**›(`factory`: function): *T*

*Defined in [src/util/hooks-helpers.ts:23](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/hooks-helpers.ts#L23)*

**Type parameters:**

▪ **T**

**Parameters:**

▪ **factory**: *function*

▸ (): *T*

**Returns:** *T*
