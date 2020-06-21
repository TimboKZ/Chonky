[chonky](../README.md) › [Globals](../globals.md) › ["components/external/FileList-virtualization"](_components_external_filelist_virtualization_.md)

# Module: "components/external/FileList-virtualization"

## Index

### Variables

* [DefaultEntrySize](_components_external_filelist_virtualization_.md#const-defaultentrysize)

### Functions

* [getColWidth](_components_external_filelist_virtualization_.md#const-getcolwidth)
* [getRowHeight](_components_external_filelist_virtualization_.md#const-getrowheight)
* [noContentRenderer](_components_external_filelist_virtualization_.md#const-nocontentrenderer)
* [useEntryRenderer](_components_external_filelist_virtualization_.md#const-useentryrenderer)
* [useGridRenderer](_components_external_filelist_virtualization_.md#const-usegridrenderer)

### Object literals

* [SmallThumbsSize](_components_external_filelist_virtualization_.md#const-smallthumbssize)

## Variables

### `Const` DefaultEntrySize

• **DefaultEntrySize**: *[FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md)* = SmallThumbsSize

*Defined in [src/components/external/FileList-virtualization.tsx:21](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L21)*

## Functions

### `Const` getColWidth

▸ **getColWidth**(`index`: number, `columnCount`: number, `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `gutterSize`: number): *number*

*Defined in [src/components/external/FileList-virtualization.tsx:23](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`columnCount` | number |
`entrySize` | [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md) |
`gutterSize` | number |

**Returns:** *number*

___

### `Const` getRowHeight

▸ **getRowHeight**(`index`: number, `rowCount`: number, `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `gutterSize`: number): *number*

*Defined in [src/components/external/FileList-virtualization.tsx:33](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`rowCount` | number |
`entrySize` | [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md) |
`gutterSize` | number |

**Returns:** *number*

___

### `Const` noContentRenderer

▸ **noContentRenderer**(`height?`: undefined | number): *Element‹›*

*Defined in [src/components/external/FileList-virtualization.tsx:104](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L104)*

**Parameters:**

Name | Type |
------ | ------ |
`height?` | undefined &#124; number |

**Returns:** *Element‹›*

___

### `Const` useEntryRenderer

▸ **useEntryRenderer**(`files`: [FileArray](_types_files_types_.md#filearray)): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:44](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |

**Returns:** *(Anonymous function)*

___

### `Const` useGridRenderer

▸ **useGridRenderer**(`files`: [FileArray](_types_files_types_.md#filearray), `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `entryRenderer`: ReturnType‹typeof useEntryRenderer›, `thumbsGridRef`: React.Ref‹Nilable‹Grid››, `fillParentContainer`: boolean): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:123](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`entrySize` | [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md) |
`entryRenderer` | ReturnType‹typeof useEntryRenderer› |
`thumbsGridRef` | React.Ref‹Nilable‹Grid›› |
`fillParentContainer` | boolean |

**Returns:** *(Anonymous function)*

## Object literals

### `Const` SmallThumbsSize

### ▪ **SmallThumbsSize**: *object*

*Defined in [src/components/external/FileList-virtualization.tsx:19](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L19)*

###  height

• **height**: *number* = 120

*Defined in [src/components/external/FileList-virtualization.tsx:19](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L19)*

###  width

• **width**: *number* = 160

*Defined in [src/components/external/FileList-virtualization.tsx:19](https://github.com/TimboKZ/Chonky/blob/84f690f/src/components/external/FileList-virtualization.tsx#L19)*
