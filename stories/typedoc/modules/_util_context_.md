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
* [ChonkySelectionContext](_util_context_.md#const-chonkyselectioncontext)
* [ChonkySelectionSizeContext](_util_context_.md#const-chonkyselectionsizecontext)
* [ChonkySelectionUtilContext](_util_context_.md#const-chonkyselectionutilcontext)
* [ChonkyThumbnailGeneratorContext](_util_context_.md#const-chonkythumbnailgeneratorcontext)

### Functions

* [validateContextType](_util_context_.md#const-validatecontexttype)

## Type aliases

###  ExtractContextType

Ƭ **ExtractContextType**: *P extends Context<infer T> ? T : never*

*Defined in [src/util/context.ts:39](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L39)*

## Variables

### `Const` ChonkyDisableSelectionContext

• **ChonkyDisableSelectionContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:36](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L36)*

___

### `Const` ChonkyDispatchFileActionContext

• **ChonkyDispatchFileActionContext**: *Context‹function›* = React.createContext<
    InternalFileActionDispatcher
>((...args: any[]) => null)

*Defined in [src/util/context.ts:23](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L23)*

___

### `Const` ChonkyDispatchSpecialActionContext

• **ChonkyDispatchSpecialActionContext**: *Context‹function›* = React.createContext<
    InternalSpecialActionDispatcher
>((...args: any[]) => null)

*Defined in [src/util/context.ts:26](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L26)*

___

### `Const` ChonkyDoubleClickDelayContext

• **ChonkyDoubleClickDelayContext**: *Context‹number›* = React.createContext<number>(300)

*Defined in [src/util/context.ts:34](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L34)*

___

### `Const` ChonkyEnableDragAndDropContext

• **ChonkyEnableDragAndDropContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:37](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L37)*

___

### `Const` ChonkyFileActionsContext

• **ChonkyFileActionsContext**: *Context‹[FileAction](../interfaces/_typedef_.fileaction.md)[]›* = React.createContext<FileAction[]>([])

*Defined in [src/util/context.ts:22](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L22)*

___

### `Const` ChonkyFilesContext

• **ChonkyFilesContext**: *Context‹null | [FileData](../interfaces/_typedef_.filedata.md)[]›* = React.createContext<FileArray>([])

*Defined in [src/util/context.ts:14](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L14)*

___

### `Const` ChonkyFolderChainContext

• **ChonkyFolderChainContext**: *Context‹null | null | [FileData](../interfaces/_typedef_.filedata.md)[]›* = React.createContext<Nullable<FileArray>>(null)

*Defined in [src/util/context.ts:15](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L15)*

___

### `Const` ChonkySelectionContext

• **ChonkySelectionContext**: *Context‹[FileSelection](../interfaces/_typedef_.fileselection.md)›* = React.createContext<FileSelection>({})

*Defined in [src/util/context.ts:16](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L16)*

___

### `Const` ChonkySelectionSizeContext

• **ChonkySelectionSizeContext**: *Context‹number›* = React.createContext<number>(0)

*Defined in [src/util/context.ts:17](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L17)*

___

### `Const` ChonkySelectionUtilContext

• **ChonkySelectionUtilContext**: *Context‹[SelectionUtil](../classes/_util_selection_.selectionutil.md)‹››* = React.createContext<SelectionUtil>(
    new SelectionUtil()
)

*Defined in [src/util/context.ts:18](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L18)*

___

### `Const` ChonkyThumbnailGeneratorContext

• **ChonkyThumbnailGeneratorContext**: *Context‹null | function›* = React.createContext<
    Nullable<ThumbnailGenerator>
>(null)

*Defined in [src/util/context.ts:30](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L30)*

## Functions

### `Const` validateContextType

▸ **validateContextType**‹**T**›(`contextData`: [ContextData](../interfaces/_util_context_.contextdata.md)‹T›): *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*

*Defined in [src/util/context.ts:44](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/util/context.ts#L44)*

**Type parameters:**

▪ **T**: *Context‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`contextData` | [ContextData](../interfaces/_util_context_.contextdata.md)‹T› |

**Returns:** *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*
