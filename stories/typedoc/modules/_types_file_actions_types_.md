[chonky](../README.md) › [Globals](../globals.md) › ["types/file-actions.types"](_types_file_actions_types_.md)

# Module: "types/file-actions.types"

## Index

### Interfaces

* [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)
* [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)
* [ToolbarButtonData](../interfaces/_types_file_actions_types_.toolbarbuttondata.md)

### Type aliases

* [FileActionHandler](_types_file_actions_types_.md#fileactionhandler)
* [InternalFileActionDispatcher](_types_file_actions_types_.md#internalfileactiondispatcher)

## Type aliases

###  FileActionHandler

Ƭ **FileActionHandler**: *function*

*Defined in [src/types/file-actions.types.ts:36](https://github.com/TimboKZ/Chonky/blob/84f690f/src/types/file-actions.types.ts#L36)*

#### Type declaration:

▸ (`action`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md), `data`: [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)): *void | Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`action` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md) |
`data` | [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md) |

___

###  InternalFileActionDispatcher

Ƭ **InternalFileActionDispatcher**: *function*

*Defined in [src/types/file-actions.types.ts:40](https://github.com/TimboKZ/Chonky/blob/84f690f/src/types/file-actions.types.ts#L40)*

#### Type declaration:

▸ (`actionData`: [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md) |
