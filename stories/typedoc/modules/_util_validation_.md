[chonky](../README.md) › [Globals](../globals.md) › ["util/validation"](_util_validation_.md)

# Module: "util/validation"

## Index

### Functions

* [cleanupFileActions](_util_validation_.md#const-cleanupfileactions)
* [cleanupFileArray](_util_validation_.md#const-cleanupfilearray)
* [isFunction](_util_validation_.md#const-isfunction)
* [isMobileDevice](_util_validation_.md#const-ismobiledevice)
* [isPlainObject](_util_validation_.md#const-isplainobject)
* [useFileActionsValidation](_util_validation_.md#const-usefileactionsvalidation)
* [useFileArrayValidation](_util_validation_.md#const-usefilearrayvalidation)

## Functions

### `Const` cleanupFileActions

▸ **cleanupFileActions**(`fileActions`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]): *object*

*Defined in [src/util/validation.ts:266](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L266)*

This function validates the user-provided file actions array. It checks the following
criteria:
- `files` is not an array
- there are duplicate file action IDs
- some file actions are missing `id` field
- some files have invalid type (they are not objects)

**Parameters:**

Name | Type |
------ | ------ |
`fileActions` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[] |

**Returns:** *object*

* **cleanFileActions**: *[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]*

* **warningBullets**: *string[]*

* **warningMessage**: *Nullable‹string›*

___

### `Const` cleanupFileArray

▸ **cleanupFileArray**‹**AllowNull**›(`fileArray`: AllowNull extends false ? FileArray : Nullable<FileArray>, `allowNull`: AllowNull): *object*

*Defined in [src/util/validation.ts:33](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L33)*

This function validates the user-provided files array. It checks the following
criteria:
- `files` is not an array
- there are duplicate file IDs
- some files are missing `id` field
- some files are missing `name` field
- some files have invalid type (they are neither an object nor `null`)

**Type parameters:**

▪ **AllowNull**: *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`fileArray` | AllowNull extends false ? FileArray : Nullable<FileArray> |
`allowNull` | AllowNull |

**Returns:** *object*

* **cleanFileArray**: *AllowNull extends false ? FileArray : Nullable<FileArray>*

* **warningBullets**: *string[]*

* **warningMessage**: *Nullable‹string›*

___

### `Const` isFunction

▸ **isFunction**(`value`: any): *value is Function*

*Defined in [src/util/validation.ts:12](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Function*

___

### `Const` isMobileDevice

▸ **isMobileDevice**(): *boolean*

*Defined in [src/util/validation.ts:16](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L16)*

**Returns:** *boolean*

___

### `Const` isPlainObject

▸ **isPlainObject**(`value`: any): *value is object*

*Defined in [src/util/validation.ts:9](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is object*

___

### `Const` useFileActionsValidation

▸ **useFileActionsValidation**(`fileActions`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[], `defaultFileActions`: [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[], `includeDefaultFileActions`: boolean): *object*

*Defined in [src/util/validation.ts:201](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L201)*

**Parameters:**

Name | Type |
------ | ------ |
`fileActions` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[] |
`defaultFileActions` | [FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[] |
`includeDefaultFileActions` | boolean |

**Returns:** *object*

* **cleanFileActions**: *[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]*

* **errorMessages**: *[ErrorMessageData](../interfaces/_types_validation_types_.errormessagedata.md)[]*

___

### `Const` useFileArrayValidation

▸ **useFileArrayValidation**(`files`: [FileArray](_types_files_types_.md#filearray), `folderChain`: Nullable‹[FileArray](_types_files_types_.md#filearray)›): *object*

*Defined in [src/util/validation.ts:133](https://github.com/TimboKZ/Chonky/blob/bceb265/src/util/validation.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`folderChain` | Nullable‹[FileArray](_types_files_types_.md#filearray)› |

**Returns:** *object*

* **cleanFiles**: *[FileArray](_types_files_types_.md#filearray)*

* **cleanFolderChain**: *Nullable‹[FileArray](_types_files_types_.md#filearray)›*

* **errorMessages**: *[ErrorMessageData](../interfaces/_types_validation_types_.errormessagedata.md)[]*
