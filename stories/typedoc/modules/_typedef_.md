[chonky](../README.md) › [Globals](../globals.md) › ["typedef"](_typedef_.md)

# Module: "typedef"

## Index

### Interfaces

* [FileAction](../interfaces/_typedef_.fileaction.md)
* [FileActionData](../interfaces/_typedef_.fileactiondata.md)
* [FileData](../interfaces/_typedef_.filedata.md)
* [FileIconData](../interfaces/_typedef_.fileicondata.md)
* [FileSelection](../interfaces/_typedef_.fileselection.md)
* [ToolbarButtonData](../interfaces/_typedef_.toolbarbuttondata.md)

### Type aliases

* [FileActionHandler](_typedef_.md#fileactionhandler)
* [FileArray](_typedef_.md#filearray)
* [FileFilter](_typedef_.md#filefilter)
* [InternalFileActionDispatcher](_typedef_.md#internalfileactiondispatcher)
* [InternalSpecialActionDispatcher](_typedef_.md#internalspecialactiondispatcher)
* [ReadonlyFileArray](_typedef_.md#readonlyfilearray)
* [ThumbnailGenerator](_typedef_.md#thumbnailgenerator)

## Type aliases

###  FileActionHandler

Ƭ **FileActionHandler**: *function*

*Defined in [src/typedef.ts:65](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L65)*

#### Type declaration:

▸ (`action`: [FileAction](../interfaces/_typedef_.fileaction.md), `data`: [FileActionData](../interfaces/_typedef_.fileactiondata.md)): *void | Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`action` | [FileAction](../interfaces/_typedef_.fileaction.md) |
`data` | [FileActionData](../interfaces/_typedef_.fileactiondata.md) |

___

###  FileArray

Ƭ **FileArray**: *Nullable‹[FileData](../interfaces/_typedef_.filedata.md)›[]*

*Defined in [src/typedef.ts:33](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L33)*

___

###  FileFilter

Ƭ **FileFilter**: *function*

*Defined in [src/typedef.ts:37](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L37)*

#### Type declaration:

▸ (`file`: Nullable‹[FileData](../interfaces/_typedef_.filedata.md)›): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`file` | Nullable‹[FileData](../interfaces/_typedef_.filedata.md)› |

___

###  InternalFileActionDispatcher

Ƭ **InternalFileActionDispatcher**: *function*

*Defined in [src/typedef.ts:70](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L70)*

#### Type declaration:

▸ (`actionData`: [FileActionData](../interfaces/_typedef_.fileactiondata.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [FileActionData](../interfaces/_typedef_.fileactiondata.md) |

___

###  InternalSpecialActionDispatcher

Ƭ **InternalSpecialActionDispatcher**: *function*

*Defined in [src/typedef.ts:71](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L71)*

#### Type declaration:

▸ (`actionData`: [SpecialActionData](_util_special_actions_.md#specialactiondata)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionData` | [SpecialActionData](_util_special_actions_.md#specialactiondata) |

___

###  ReadonlyFileArray

Ƭ **ReadonlyFileArray**: *ReadonlyArray‹Nullable‹[FileData](../interfaces/_typedef_.filedata.md)››*

*Defined in [src/typedef.ts:35](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L35)*

___

###  ThumbnailGenerator

Ƭ **ThumbnailGenerator**: *function*

*Defined in [src/typedef.ts:78](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/typedef.ts#L78)*

#### Type declaration:

▸ (`file`: [FileData](../interfaces/_typedef_.filedata.md)): *Nilable‹string› | Promise‹Nilable‹string››*

**Parameters:**

Name | Type |
------ | ------ |
`file` | [FileData](../interfaces/_typedef_.filedata.md) |
