[chonky](../README.md) › [Globals](../globals.md) › ["types/file-actions.types"](_types_file_actions_types_.md)

# Module: "types/file-actions.types"

## Index

### Interfaces

* [ActionGroupData](../interfaces/_types_file_actions_types_.actiongroupdata.md)
* [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)
* [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)
* [ToolbarButtonData](../interfaces/_types_file_actions_types_.toolbarbuttondata.md)

### Type aliases

* [FileActionHandler](_types_file_actions_types_.md#fileactionhandler)
* [InternalFileActionDispatcher](_types_file_actions_types_.md#internalfileactiondispatcher)
* [InternalFileActionRequester](_types_file_actions_types_.md#internalfileactionrequester)

## Type aliases

###  FileActionHandler

Ƭ **FileActionHandler**: *function*

*Defined in [src/types/file-actions.types.ts:26](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/types/file-actions.types.ts#L26)*

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

*Defined in [src/types/file-actions.types.ts:31](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/types/file-actions.types.ts#L31)*

#### Type declaration:

▸ (`actionData`: [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md) |

___

###  InternalFileActionRequester

Ƭ **InternalFileActionRequester**: *function*

*Defined in [src/types/file-actions.types.ts:32](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/types/file-actions.types.ts#L32)*

#### Type declaration:

▸ (`actionId`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionId` | string |
