[chonky](../README.md) › [Globals](../globals.md) › ["util/context"](_util_context_.md)

# Module: "util/context"

## Index

### Interfaces

* [ContextData](../interfaces/_util_context_.contextdata.md)

### Type aliases

* [ExtractContextType](_util_context_.md#extractcontexttype)

### Variables

* [ChonkyDisableSelectionContext](_util_context_.md#const-chonkydisableselectioncontext)
* [ChonkyDispatchFileActionContext](_util_context_.md#const-chonkydispatchfileactioncontext)
* [ChonkyDispatchSpecialActionContext](_util_context_.md#const-chonkydispatchspecialactioncontext)
* [ChonkyDoubleClickDelayContext](_util_context_.md#const-chonkydoubleclickdelaycontext)
* [ChonkyEnableDragAndDropContext](_util_context_.md#const-chonkyenabledraganddropcontext)
* [ChonkyFileActionsContext](_util_context_.md#const-chonkyfileactionscontext)
* [ChonkyFilesContext](_util_context_.md#const-chonkyfilescontext)
* [ChonkyFolderChainContext](_util_context_.md#const-chonkyfolderchaincontext)
* [ChonkySearchFilterContext](_util_context_.md#const-chonkysearchfiltercontext)
* [ChonkySelectionContext](_util_context_.md#const-chonkyselectioncontext)
* [ChonkySelectionSizeContext](_util_context_.md#const-chonkyselectionsizecontext)
* [ChonkySelectionUtilContext](_util_context_.md#const-chonkyselectionutilcontext)
* [ChonkySetSearchFilterContext](_util_context_.md#const-chonkysetsearchfiltercontext)
* [ChonkyThumbnailGeneratorContext](_util_context_.md#const-chonkythumbnailgeneratorcontext)

### Functions

* [validateContextType](_util_context_.md#const-validatecontexttype)

## Type aliases

###  ExtractContextType

Ƭ **ExtractContextType**: *P extends Context<infer T> ? T : never*

*Defined in [src/util/context.ts:45](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L45)*

## Variables

### `Const` ChonkyDisableSelectionContext

• **ChonkyDisableSelectionContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:42](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L42)*

___

### `Const` ChonkyDispatchFileActionContext

• **ChonkyDispatchFileActionContext**: *Context‹function›* = React.createContext<
    InternalFileActionDispatcher
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:24](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L24)*

___

### `Const` ChonkyDispatchSpecialActionContext

• **ChonkyDispatchSpecialActionContext**: *Context‹function›* = React.createContext<
    InternalSpecialActionDispatcher
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:27](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L27)*

___

### `Const` ChonkyDoubleClickDelayContext

• **ChonkyDoubleClickDelayContext**: *Context‹number›* = React.createContext<number>(300)

*Defined in [src/util/context.ts:40](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L40)*

___

### `Const` ChonkyEnableDragAndDropContext

• **ChonkyEnableDragAndDropContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:43](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L43)*

___

### `Const` ChonkyFileActionsContext

• **ChonkyFileActionsContext**: *Context‹[FileAction](../interfaces/_typedef_.fileaction.md)[]›* = React.createContext<FileAction[]>([])

*Defined in [src/util/context.ts:23](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L23)*

___

### `Const` ChonkyFilesContext

• **ChonkyFilesContext**: *Context‹null | [FileData](../interfaces/_typedef_.filedata.md)[]›* = React.createContext<FileArray>([])

*Defined in [src/util/context.ts:15](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L15)*

___

### `Const` ChonkyFolderChainContext

• **ChonkyFolderChainContext**: *Context‹null | null | [FileData](../interfaces/_typedef_.filedata.md)[]›* = React.createContext<Nullable<FileArray>>(null)

*Defined in [src/util/context.ts:16](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L16)*

___

### `Const` ChonkySearchFilterContext

• **ChonkySearchFilterContext**: *Context‹string›* = React.createContext<string>('')

*Defined in [src/util/context.ts:31](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L31)*

___

### `Const` ChonkySelectionContext

• **ChonkySelectionContext**: *Context‹[FileSelection](../interfaces/_typedef_.fileselection.md)›* = React.createContext<FileSelection>({})

*Defined in [src/util/context.ts:17](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L17)*

___

### `Const` ChonkySelectionSizeContext

• **ChonkySelectionSizeContext**: *Context‹number›* = React.createContext<number>(0)

*Defined in [src/util/context.ts:18](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L18)*

___

### `Const` ChonkySelectionUtilContext

• **ChonkySelectionUtilContext**: *Context‹[SelectionUtil](../classes/_util_selection_.selectionutil.md)‹››* = React.createContext<SelectionUtil>(
    new SelectionUtil()
)

*Defined in [src/util/context.ts:19](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L19)*

___

### `Const` ChonkySetSearchFilterContext

• **ChonkySetSearchFilterContext**: *Context‹function›* = React.createContext<
    (searchFilter: string) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:32](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L32)*

___

### `Const` ChonkyThumbnailGeneratorContext

• **ChonkyThumbnailGeneratorContext**: *Context‹null | function›* = React.createContext<
    Nullable<ThumbnailGenerator>
>(null)

*Defined in [src/util/context.ts:36](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L36)*

## Functions

### `Const` validateContextType

▸ **validateContextType**‹**T**›(`contextData`: [ContextData](../interfaces/_util_context_.contextdata.md)‹T›): *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*

*Defined in [src/util/context.ts:50](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/context.ts#L50)*

**Type parameters:**

▪ **T**: *Context‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`contextData` | [ContextData](../interfaces/_util_context_.contextdata.md)‹T› |

**Returns:** *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*
