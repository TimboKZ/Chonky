[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/BaseFileEntry-hooks"](_components_internal_basefileentry_hooks_.md)

# Module: "components/internal/BaseFileEntry-hooks"

## Index

### Functions

* [useDndIcon](_components_internal_basefileentry_hooks_.md#const-usedndicon)
* [useThumbnailUrl](_components_internal_basefileentry_hooks_.md#const-usethumbnailurl)

## Functions

### `Const` useDndIcon

▸ **useDndIcon**(`selected`: Nilable‹boolean›, `isDragging`: Nilable‹boolean›, `isOver`: Nilable‹boolean›, `canDrop`: Nilable‹boolean›): *Nullable‹[ChonkyIconName](../enums/_types_icons_types_.chonkyiconname.md)›*

*Defined in [src/components/internal/BaseFileEntry-hooks.tsx:10](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/internal/BaseFileEntry-hooks.tsx#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`selected` | Nilable‹boolean› |
`isDragging` | Nilable‹boolean› |
`isOver` | Nilable‹boolean› |
`canDrop` | Nilable‹boolean› |

**Returns:** *Nullable‹[ChonkyIconName](../enums/_types_icons_types_.chonkyiconname.md)›*

___

### `Const` useThumbnailUrl

▸ **useThumbnailUrl**(`file`: Nullable‹[FileData](../interfaces/_types_files_types_.filedata.md)›, `setThumbnailUrl`: function, `setThumbnailLoading`: function): *void*

*Defined in [src/components/internal/BaseFileEntry-hooks.tsx:25](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/internal/BaseFileEntry-hooks.tsx#L25)*

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
