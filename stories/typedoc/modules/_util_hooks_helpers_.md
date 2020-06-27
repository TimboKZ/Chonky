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
* [useInstanceVariable](_util_hooks_helpers_.md#const-useinstancevariable)
* [useRefCallbackWithErrorHandling](_util_hooks_helpers_.md#const-userefcallbackwitherrorhandling)
* [useStaticValue](_util_hooks_helpers_.md#const-usestaticvalue)

## Variables

### `Const` UNINITIALIZED_SENTINEL

• **UNINITIALIZED_SENTINEL**: *object*

*Defined in [src/util/hooks-helpers.ts:25](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/hooks-helpers.ts#L25)*

#### Type declaration:

## Functions

### `Const` useClickListener

▸ **useClickListener**‹**T**›(`params`: [UseClickListenerParams](../interfaces/_util_hooks_helpers_.useclicklistenerparams.md)): *RefObject‹T›*

*Defined in [src/util/hooks-helpers.ts:46](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/hooks-helpers.ts#L46)*

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

*Defined in [src/util/hooks-helpers.ts:6](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/hooks-helpers.ts#L6)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
`delay` | number |

**Returns:** *[T, React.Dispatch‹React.SetStateAction‹T››]*

___

### `Const` useInstanceVariable

▸ **useInstanceVariable**‹**T**›(`value`: T): *MutableRefObject‹T›*

*Defined in [src/util/hooks-helpers.ts:32](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/hooks-helpers.ts#L32)*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *MutableRefObject‹T›*

___

### `Const` useRefCallbackWithErrorHandling

▸ **useRefCallbackWithErrorHandling**‹**FuncType**›(`callbackFunc`: FuncType, `displayName`: string): *(Anonymous function)*

*Defined in [src/util/hooks-helpers.ts:80](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/hooks-helpers.ts#L80)*

**Type parameters:**

▪ **FuncType**: *AnyFunction*

**Parameters:**

Name | Type |
------ | ------ |
`callbackFunc` | FuncType |
`displayName` | string |

**Returns:** *(Anonymous function)*

___

### `Const` useStaticValue

▸ **useStaticValue**‹**T**›(`factory`: function): *T*

*Defined in [src/util/hooks-helpers.ts:26](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/hooks-helpers.ts#L26)*

**Type parameters:**

▪ **T**

**Parameters:**

▪ **factory**: *function*

▸ (): *T*

**Returns:** *T*
