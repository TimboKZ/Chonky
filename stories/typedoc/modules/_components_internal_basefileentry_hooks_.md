[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/BaseFileEntry-hooks"](_components_internal_basefileentry_hooks_.md)

# Module: "components/internal/BaseFileEntry-hooks"

## Index

### Functions

* [useDndIcon](_components_internal_basefileentry_hooks_.md#const-usedndicon)
* [useThumbnailUrl](_components_internal_basefileentry_hooks_.md#const-usethumbnailurl)

## Functions

### `Const` useDndIcon

▸ **useDndIcon**(`selected`: Nilable‹boolean›, `isDragging`: Nilable‹boolean›, `isOver`: Nilable‹boolean›, `canDrop`: Nilable‹boolean›): *Nullable‹[ChonkyIconName](../enums/_components_external_chonkyicon_.chonkyiconname.md)›*

*Defined in [src/components/internal/BaseFileEntry-hooks.tsx:9](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/internal/BaseFileEntry-hooks.tsx#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`selected` | Nilable‹boolean› |
`isDragging` | Nilable‹boolean› |
`isOver` | Nilable‹boolean› |
`canDrop` | Nilable‹boolean› |

**Returns:** *Nullable‹[ChonkyIconName](../enums/_components_external_chonkyicon_.chonkyiconname.md)›*

___

### `Const` useThumbnailUrl

▸ **useThumbnailUrl**(`file`: Nullable‹[FileData](../interfaces/_typedef_.filedata.md)›, `setThumbnailUrl`: function, `setThumbnailLoading`: function): *void*

*Defined in [src/components/internal/BaseFileEntry-hooks.tsx:24](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/internal/BaseFileEntry-hooks.tsx#L24)*

**Parameters:**

▪ **file**: *Nullable‹[FileData](../interfaces/_typedef_.filedata.md)›*

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
