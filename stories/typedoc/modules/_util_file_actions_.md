[chonky](../README.md) › [Globals](../globals.md) › ["util/file-actions"](_util_file_actions_.md)

# Module: "util/file-actions"

## Index

### Functions

* [useFileActionProps](_util_file_actions_.md#const-usefileactionprops)
* [useFileActionTrigger](_util_file_actions_.md#const-usefileactiontrigger)
* [useFileActions](_util_file_actions_.md#const-usefileactions)

## Functions

### `Const` useFileActionProps

▸ **useFileActionProps**(`fileActionId`: string): *object*

*Defined in [src/util/file-actions.ts:85](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/file-actions.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActionId` | string |

**Returns:** *object*

* **active**: *boolean*

* **disabled**: *boolean*

* **icon**: *Nullable‹[ChonkyIconName](../enums/_types_icons_types_.chonkyiconname.md) | string›*

___

### `Const` useFileActionTrigger

▸ **useFileActionTrigger**(`fileActionId`: string): *(Anonymous function)*

*Defined in [src/util/file-actions.ts:77](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/file-actions.ts#L77)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActionId` | string |

**Returns:** *(Anonymous function)*

___

### `Const` useFileActions

▸ **useFileActions**(`fileActions`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[], `externalFileActonHandler`: Nullable‹[FileActionHandler](_types_file_actions_types_.md#fileactionhandler)›): *object*

*Defined in [src/util/file-actions.ts:28](https://github.com/TimboKZ/Chonky/blob/b63f6c0/src/util/file-actions.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActions` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[] |
`externalFileActonHandler` | Nullable‹[FileActionHandler](_types_file_actions_types_.md#fileactionhandler)› |

**Returns:** *object*

* **internalFileActionDispatcher**(): *function*

  * (`actionData`: [FileActionData](../interfaces/_types_file_actions_types_.fileactiondata.md)): *void*

* **internalFileActionRequester**: *(Anonymous function)*
