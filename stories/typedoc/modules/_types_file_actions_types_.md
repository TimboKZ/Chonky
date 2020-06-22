[chonky](../README.md) › [Globals](../globals.md) › ["types/file-actions.types"](_types_file_actions_types_.md)

# Module: "types/file-actions.types"

## Index

### Interfaces

* [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)
* [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)
* [NewInternalFileActionHandlerMap](../interfaces/_types_file_actions_types_.newinternalfileactionhandlermap.md)
* [ToolbarButtonData](../interfaces/_types_file_actions_types_.toolbarbuttondata.md)

### Type aliases

* [FileActionListener](_types_file_actions_types_.md#fileactionlistener)
* [InternalFileActionDispatcher](_types_file_actions_types_.md#internalfileactiondispatcher)
* [NewInternalFileActionDispatcher](_types_file_actions_types_.md#newinternalfileactiondispatcher)

## Type aliases

###  FileActionListener

Ƭ **FileActionListener**: *function*

*Defined in [src/types/file-actions.types.ts:36](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/types/file-actions.types.ts#L36)*

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

*Defined in [src/types/file-actions.types.ts:41](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/types/file-actions.types.ts#L41)*

#### Type declaration:

▸ (`actionData`: [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md) |

___

###  NewInternalFileActionDispatcher

Ƭ **NewInternalFileActionDispatcher**: *function*

*Defined in [src/types/file-actions.types.ts:47](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/types/file-actions.types.ts#L47)*

#### Type declaration:

▸ (`actionId`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionId` | string |
