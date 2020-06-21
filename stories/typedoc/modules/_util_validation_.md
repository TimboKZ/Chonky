[chonky](../README.md) › [Globals](../globals.md) › ["util/validation"](_util_validation_.md)

# Module: "util/validation"

## Index

### Interfaces

* [ErrorMessageData](../interfaces/_util_validation_.errormessagedata.md)

### Functions

* [cleanupFileArray](_util_validation_.md#const-cleanupfilearray)
* [isFunction](_util_validation_.md#const-isfunction)
* [isMobileDevice](_util_validation_.md#const-ismobiledevice)
* [isPlainObject](_util_validation_.md#const-isplainobject)
* [useFileArrayValidation](_util_validation_.md#const-usefilearrayvalidation)

## Functions

### `Const` cleanupFileArray

▸ **cleanupFileArray**‹**AllowNull**›(`fileArray`: AllowNull extends false ? FileArray : Nullable<FileArray>, `allowNull`: AllowNull): *object*

*Defined in [src/util/validation.ts:32](https://github.com/TimboKZ/Chonky/blob/84f690f/src/util/validation.ts#L32)*

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

*Defined in [src/util/validation.ts:11](https://github.com/TimboKZ/Chonky/blob/84f690f/src/util/validation.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Function*

___

### `Const` isMobileDevice

▸ **isMobileDevice**(): *boolean*

*Defined in [src/util/validation.ts:15](https://github.com/TimboKZ/Chonky/blob/84f690f/src/util/validation.ts#L15)*

**Returns:** *boolean*

___

### `Const` isPlainObject

▸ **isPlainObject**(`value`: any): *value is object*

*Defined in [src/util/validation.ts:8](https://github.com/TimboKZ/Chonky/blob/84f690f/src/util/validation.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is object*

___

### `Const` useFileArrayValidation

▸ **useFileArrayValidation**(`files`: [FileArray](_types_files_types_.md#filearray), `folderChain`: Nullable‹[FileArray](_types_files_types_.md#filearray)›): *object*

*Defined in [src/util/validation.ts:137](https://github.com/TimboKZ/Chonky/blob/84f690f/src/util/validation.ts#L137)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`folderChain` | Nullable‹[FileArray](_types_files_types_.md#filearray)› |

**Returns:** *object*

* **cleanFiles**: *[FileArray](_types_files_types_.md#filearray)*

* **cleanFolderChain**: *Nullable‹[FileArray](_types_files_types_.md#filearray)›*

* **errorMessages**: *[ErrorMessageData](../interfaces/_util_validation_.errormessagedata.md)[]*
