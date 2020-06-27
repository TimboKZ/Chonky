[chonky](../README.md) › [Globals](../globals.md) › ["util/context"](_util_context_.md)

# Module: "util/context"

## Index

### Interfaces

* [ContextData](../interfaces/_util_context_.contextdata.md)

### Type aliases

* [ExtractContextType](_util_context_.md#extractcontexttype)

### Variables

* [ChonkySearchBarEnabledContext](_util_context_.md#const-chonkysearchbarenabledcontext)
* [ChonkySearchBarVisibleContext](_util_context_.md#const-chonkysearchbarvisiblecontext)
* [ChonkySearchFilterContext](_util_context_.md#const-chonkysearchfiltercontext)
* [ChonkySetSearchBarEnabledContext](_util_context_.md#const-chonkysetsearchbarenabledcontext)
* [ChonkySetSearchBarVisibleContext](_util_context_.md#const-chonkysetsearchbarvisiblecontext)
* [ChonkySetSearchFilterContext](_util_context_.md#const-chonkysetsearchfiltercontext)

### Functions

* [validateContextType](_util_context_.md#const-validatecontexttype)

## Type aliases

###  ExtractContextType

Ƭ **ExtractContextType**: *P extends Context<infer T> ? T : never*

*Defined in [src/util/context.ts:20](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L20)*

## Variables

### `Const` ChonkySearchBarEnabledContext

• **ChonkySearchBarEnabledContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:6](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L6)*

___

### `Const` ChonkySearchBarVisibleContext

• **ChonkySearchBarVisibleContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:10](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L10)*

___

### `Const` ChonkySearchFilterContext

• **ChonkySearchFilterContext**: *Context‹string›* = React.createContext<string>('')

*Defined in [src/util/context.ts:14](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L14)*

___

### `Const` ChonkySetSearchBarEnabledContext

• **ChonkySetSearchBarEnabledContext**: *Context‹function›* = React.createContext<
    (visible: boolean) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:7](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L7)*

___

### `Const` ChonkySetSearchBarVisibleContext

• **ChonkySetSearchBarVisibleContext**: *Context‹function›* = React.createContext<
    (visible: boolean) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:11](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L11)*

___

### `Const` ChonkySetSearchFilterContext

• **ChonkySetSearchFilterContext**: *Context‹function›* = React.createContext<
    (searchFilter: string) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:15](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L15)*

## Functions

### `Const` validateContextType

▸ **validateContextType**‹**T**›(`contextData`: [ContextData](../interfaces/_util_context_.contextdata.md)‹T›): *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*

*Defined in [src/util/context.ts:30](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/context.ts#L30)*

This function is a no-op, but it's type verifies that the provided `ContextData`
value matches the type expected by the context.

**Type parameters:**

▪ **T**: *Context‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`contextData` | [ContextData](../interfaces/_util_context_.contextdata.md)‹T› |

**Returns:** *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*
