[chonky](../README.md) › [Globals](../globals.md) › ["util/validation"](_util_validation_.md)

# Module: "util/validation"

## Index

### Interfaces

* [ErrorMessageData](../interfaces/_util_validation_.errormessagedata.md)

### Functions

* [isFunction](_util_validation_.md#const-isfunction)
* [isMobileDevice](_util_validation_.md#const-ismobiledevice)
* [isPlainObject](_util_validation_.md#const-isplainobject)
* [useCleanFileArray](_util_validation_.md#const-usecleanfilearray)
* [useFileBrowserValidation](_util_validation_.md#const-usefilebrowservalidation)

## Functions

### `Const` isFunction

▸ **isFunction**(`value`: any): *value is Function*

*Defined in [src/util/validation.ts:11](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/validation.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is Function*

___

### `Const` isMobileDevice

▸ **isMobileDevice**(): *boolean*

*Defined in [src/util/validation.ts:15](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/validation.ts#L15)*

**Returns:** *boolean*

___

### `Const` isPlainObject

▸ **isPlainObject**(`value`: any): *value is object*

*Defined in [src/util/validation.ts:8](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/validation.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is object*

___

### `Const` useCleanFileArray

▸ **useCleanFileArray**‹**AllowNull**›(`fileArray`: AllowNull extends false ? FileArray : Nullable<FileArray>, `allowNull`: AllowNull): *object*

*Defined in [src/util/validation.ts:31](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/validation.ts#L31)*

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

### `Const` useFileBrowserValidation

▸ **useFileBrowserValidation**(`files`: [FileArray](_typedef_.md#filearray), `folderChain`: Nullable‹[FileArray](_typedef_.md#filearray)›): *object*

*Defined in [src/util/validation.ts:136](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/util/validation.ts#L136)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_typedef_.md#filearray) |
`folderChain` | Nullable‹[FileArray](_typedef_.md#filearray)› |

**Returns:** *object*

* **cleanFiles**: *[FileArray](_typedef_.md#filearray)*

* **cleanFolderChain**: *Nullable‹[FileArray](_typedef_.md#filearray)›*

* **errorMessages**: *[ErrorMessageData](../interfaces/_util_validation_.errormessagedata.md)[]*
