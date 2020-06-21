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
* [ChonkyFileEntrySizeContext](_util_context_.md#const-chonkyfileentrysizecontext)
* [ChonkyFilesContext](_util_context_.md#const-chonkyfilescontext)
* [ChonkyFolderChainContext](_util_context_.md#const-chonkyfolderchaincontext)
* [ChonkyInstanceIdContext](_util_context_.md#const-chonkyinstanceidcontext)
* [ChonkySearchBarEnabledContext](_util_context_.md#const-chonkysearchbarenabledcontext)
* [ChonkySearchBarVisibleContext](_util_context_.md#const-chonkysearchbarvisiblecontext)
* [ChonkySearchFilterContext](_util_context_.md#const-chonkysearchfiltercontext)
* [ChonkySelectionContext](_util_context_.md#const-chonkyselectioncontext)
* [ChonkySelectionSizeContext](_util_context_.md#const-chonkyselectionsizecontext)
* [ChonkySelectionUtilContext](_util_context_.md#const-chonkyselectionutilcontext)
* [ChonkySetSearchBarEnabledContext](_util_context_.md#const-chonkysetsearchbarenabledcontext)
* [ChonkySetSearchBarVisibleContext](_util_context_.md#const-chonkysetsearchbarvisiblecontext)
* [ChonkySetSearchFilterContext](_util_context_.md#const-chonkysetsearchfiltercontext)
* [ChonkyThumbnailGeneratorContext](_util_context_.md#const-chonkythumbnailgeneratorcontext)

### Functions

* [validateContextType](_util_context_.md#const-validatecontexttype)

## Type aliases

###  ExtractContextType

Ƭ **ExtractContextType**: *P extends Context<infer T> ? T : never*

*Defined in [src/util/context.ts:62](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L62)*

## Variables

### `Const` ChonkyDisableSelectionContext

• **ChonkyDisableSelectionContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:58](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L58)*

___

### `Const` ChonkyDispatchFileActionContext

• **ChonkyDispatchFileActionContext**: *Context‹function›* = React.createContext<
    InternalFileActionDispatcher
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:25](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L25)*

___

### `Const` ChonkyDispatchSpecialActionContext

• **ChonkyDispatchSpecialActionContext**: *Context‹function›* = React.createContext<
    InternalSpecialActionDispatcher
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:28](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L28)*

___

### `Const` ChonkyDoubleClickDelayContext

• **ChonkyDoubleClickDelayContext**: *Context‹number›* = React.createContext<number>(300)

*Defined in [src/util/context.ts:50](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L50)*

___

### `Const` ChonkyEnableDragAndDropContext

• **ChonkyEnableDragAndDropContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:59](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L59)*

___

### `Const` ChonkyFileActionsContext

• **ChonkyFileActionsContext**: *Context‹[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]›* = React.createContext<FileAction[]>([])

*Defined in [src/util/context.ts:24](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L24)*

___

### `Const` ChonkyFileEntrySizeContext

• **ChonkyFileEntrySizeContext**: *Context‹[FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md)›* = React.createContext<FileEntrySize>(
    DefaultEntrySize
)

*Defined in [src/util/context.ts:53](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L53)*

___

### `Const` ChonkyFilesContext

• **ChonkyFilesContext**: *Context‹null | [FileData](../interfaces/_types_files_types_.filedata.md)[]›* = React.createContext<FileArray>([])

*Defined in [src/util/context.ts:14](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L14)*

___

### `Const` ChonkyFolderChainContext

• **ChonkyFolderChainContext**: *Context‹null | null | [FileData](../interfaces/_types_files_types_.filedata.md)[]›* = React.createContext<Nullable<FileArray>>(null)

*Defined in [src/util/context.ts:15](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L15)*

___

### `Const` ChonkyInstanceIdContext

• **ChonkyInstanceIdContext**: *Context‹string›* = React.createContext<string>('no-instance-id')

*Defined in [src/util/context.ts:13](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L13)*

___

### `Const` ChonkySearchBarEnabledContext

• **ChonkySearchBarEnabledContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:33](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L33)*

___

### `Const` ChonkySearchBarVisibleContext

• **ChonkySearchBarVisibleContext**: *Context‹boolean›* = React.createContext<boolean>(false)

*Defined in [src/util/context.ts:37](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L37)*

___

### `Const` ChonkySearchFilterContext

• **ChonkySearchFilterContext**: *Context‹string›* = React.createContext<string>('')

*Defined in [src/util/context.ts:41](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L41)*

___

### `Const` ChonkySelectionContext

• **ChonkySelectionContext**: *Context‹[FileSelection](../interfaces/_types_files_types_.fileselection.md)›* = React.createContext<FileSelection>({})

*Defined in [src/util/context.ts:18](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L18)*

___

### `Const` ChonkySelectionSizeContext

• **ChonkySelectionSizeContext**: *Context‹number›* = React.createContext<number>(0)

*Defined in [src/util/context.ts:19](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L19)*

___

### `Const` ChonkySelectionUtilContext

• **ChonkySelectionUtilContext**: *Context‹[SelectionUtil](../classes/_util_selection_.selectionutil.md)‹››* = React.createContext<SelectionUtil>(
    new SelectionUtil()
)

*Defined in [src/util/context.ts:20](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L20)*

___

### `Const` ChonkySetSearchBarEnabledContext

• **ChonkySetSearchBarEnabledContext**: *Context‹function›* = React.createContext<
    (visible: boolean) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:34](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L34)*

___

### `Const` ChonkySetSearchBarVisibleContext

• **ChonkySetSearchBarVisibleContext**: *Context‹function›* = React.createContext<
    (visible: boolean) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:38](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L38)*

___

### `Const` ChonkySetSearchFilterContext

• **ChonkySetSearchFilterContext**: *Context‹function›* = React.createContext<
    (searchFilter: string) => void
>(NOOP_FUNCTION)

*Defined in [src/util/context.ts:42](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L42)*

___

### `Const` ChonkyThumbnailGeneratorContext

• **ChonkyThumbnailGeneratorContext**: *Context‹null | function›* = React.createContext<
    Nullable<ThumbnailGenerator>
>(null)

*Defined in [src/util/context.ts:46](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L46)*

## Functions

### `Const` validateContextType

▸ **validateContextType**‹**T**›(`contextData`: [ContextData](../interfaces/_util_context_.contextdata.md)‹T›): *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*

*Defined in [src/util/context.ts:72](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/util/context.ts#L72)*

This function is a no-op, but it's type verifies that the provided `ContextData`
value matches the type expected by the context.

**Type parameters:**

▪ **T**: *Context‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`contextData` | [ContextData](../interfaces/_util_context_.contextdata.md)‹T› |

**Returns:** *[ContextData](../interfaces/_util_context_.contextdata.md)‹T›*
