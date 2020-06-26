[chonky](../README.md) › [Globals](../globals.md) › ["util/file-actions"](_util_file_actions_.md)

# Module: "util/file-actions"

## Index

### Functions

* [useFileActionModifiers](_util_file_actions_.md#const-usefileactionmodifiers)
* [useFileActionTrigger](_util_file_actions_.md#const-usefileactiontrigger)
* [useFileActions](_util_file_actions_.md#const-usefileactions)

## Functions

### `Const` useFileActionModifiers

▸ **useFileActionModifiers**(`fileActionId`: string): *object*

*Defined in [src/util/file-actions.ts:81](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-actions.ts#L81)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActionId` | string |

**Returns:** *object*

* **active**: *boolean*

* **disabled**: *boolean*

___

### `Const` useFileActionTrigger

▸ **useFileActionTrigger**(`fileActionId`: string): *(Anonymous function)*

*Defined in [src/util/file-actions.ts:73](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-actions.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActionId` | string |

**Returns:** *(Anonymous function)*

___

### `Const` useFileActions

▸ **useFileActions**(`fileActions`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[], `externalFileActonHandler`: Nullable‹[FileActionHandler](_types_file_actions_types_.md#fileactionhandler)›): *object*

*Defined in [src/util/file-actions.ts:24](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/util/file-actions.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActions` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[] |
`externalFileActonHandler` | Nullable‹[FileActionHandler](_types_file_actions_types_.md#fileactionhandler)› |

**Returns:** *object*

* **internalFileActionDispatcher**(): *function*

  * (`actionData`: [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)): *void*

* **internalFileActionRequester**: *(Anonymous function)*
