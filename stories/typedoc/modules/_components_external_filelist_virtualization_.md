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

*Defined in [src/components/external/FileList-virtualization.tsx:15](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L15)*

## Functions

### `Const` getColWidth

▸ **getColWidth**(`index`: number, `columnCount`: number, `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `gutterSize`: number): *number*

*Defined in [src/components/external/FileList-virtualization.tsx:17](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L17)*

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

*Defined in [src/components/external/FileList-virtualization.tsx:27](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L27)*

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

*Defined in [src/components/external/FileList-virtualization.tsx:85](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`height?` | undefined &#124; number |

**Returns:** *Element‹›*

___

### `Const` useEntryRenderer

▸ **useEntryRenderer**(`files`: [FileArray](_types_files_types_.md#filearray)): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:38](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |

**Returns:** *(Anonymous function)*

___

### `Const` useGridRenderer

▸ **useGridRenderer**(`files`: [FileArray](_types_files_types_.md#filearray), `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `entryRenderer`: ReturnType‹typeof useEntryRenderer›, `thumbsGridRef`: React.Ref‹Nilable‹Grid››, `fillParentContainer`: boolean): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:104](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L104)*

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

*Defined in [src/components/external/FileList-virtualization.tsx:13](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L13)*

###  height

• **height**: *number* = 120

*Defined in [src/components/external/FileList-virtualization.tsx:13](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L13)*

###  width

• **width**: *number* = 160

*Defined in [src/components/external/FileList-virtualization.tsx:13](https://github.com/TimboKZ/Chonky/blob/8056a68/src/components/external/FileList-virtualization.tsx#L13)*
