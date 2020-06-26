[chonky](../README.md) › [Globals](../globals.md) › ["components/file-entry/BaseFileEntry-hooks"](_components_file_entry_basefileentry_hooks_.md)

# Module: "components/file-entry/BaseFileEntry-hooks"

## Index

### Functions

* [useDndIcon](_components_file_entry_basefileentry_hooks_.md#const-usedndicon)
* [useFileNameComponent](_components_file_entry_basefileentry_hooks_.md#const-usefilenamecomponent)
* [useModifierIconComponents](_components_file_entry_basefileentry_hooks_.md#const-usemodifiericoncomponents)
* [useThumbnailUrl](_components_file_entry_basefileentry_hooks_.md#const-usethumbnailurl)

## Functions

### `Const` useDndIcon

▸ **useDndIcon**(`selected`: Nilable‹boolean›, `isDragging`: Nilable‹boolean›, `isOver`: Nilable‹boolean›, `canDrop`: Nilable‹boolean›): *Nullable‹[ChonkyIconName](../enums/_types_icons_types_.chonkyiconname.md)›*

*Defined in [src/components/file-entry/BaseFileEntry-hooks.tsx:14](https://github.com/TimboKZ/Chonky/blob/01ce777/src/components/file-entry/BaseFileEntry-hooks.tsx#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`selected` | Nilable‹boolean› |
`isDragging` | Nilable‹boolean› |
`isOver` | Nilable‹boolean› |
`canDrop` | Nilable‹boolean› |

**Returns:** *Nullable‹[ChonkyIconName](../enums/_types_icons_types_.chonkyiconname.md)›*

___

### `Const` useFileNameComponent

▸ **useFileNameComponent**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *Element‹›*

*Defined in [src/components/file-entry/BaseFileEntry-hooks.tsx:86](https://github.com/TimboKZ/Chonky/blob/01ce777/src/components/file-entry/BaseFileEntry-hooks.tsx#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`file` | Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)› |

**Returns:** *Element‹›*

___

### `Const` useModifierIconComponents

▸ **useModifierIconComponents**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›): *Element‹›[]*

*Defined in [src/components/file-entry/BaseFileEntry-hooks.tsx:69](https://github.com/TimboKZ/Chonky/blob/01ce777/src/components/file-entry/BaseFileEntry-hooks.tsx#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`file` | Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)› |

**Returns:** *Element‹›[]*

___

### `Const` useThumbnailUrl

▸ **useThumbnailUrl**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›, `setThumbnailUrl`: function, `setThumbnailLoading`: function): *void*

*Defined in [src/components/file-entry/BaseFileEntry-hooks.tsx:29](https://github.com/TimboKZ/Chonky/blob/01ce777/src/components/file-entry/BaseFileEntry-hooks.tsx#L29)*

**Parameters:**

▪ **file**: *Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›*

▪ **setThumbnailUrl**: *function*

▸ (`url`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

▪ **setThumbnailLoading**: *function*

▸ (`state`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`state` | boolean |

**Returns:** *void*
