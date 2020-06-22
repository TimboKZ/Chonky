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

*Defined in [src/components/external/FileList-virtualization.tsx:20](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L20)*

## Functions

### `Const` getColWidth

▸ **getColWidth**(`index`: number, `columnCount`: number, `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `gutterSize`: number): *number*

*Defined in [src/components/external/FileList-virtualization.tsx:22](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L22)*

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

*Defined in [src/components/external/FileList-virtualization.tsx:32](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L32)*

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

*Defined in [src/components/external/FileList-virtualization.tsx:103](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`height?` | undefined &#124; number |

**Returns:** *Element‹›*

___

### `Const` useEntryRenderer

▸ **useEntryRenderer**(`files`: [FileArray](_types_files_types_.md#filearray)): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:43](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |

**Returns:** *(Anonymous function)*

___

### `Const` useGridRenderer

▸ **useGridRenderer**(`files`: [FileArray](_types_files_types_.md#filearray), `entrySize`: [FileEntrySize](../interfaces/_types_file_list_view_types_.fileentrysize.md), `entryRenderer`: ReturnType‹typeof useEntryRenderer›, `thumbsGridRef`: React.Ref‹Nilable‹Grid››, `fillParentContainer`: boolean): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:122](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L122)*

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

*Defined in [src/components/external/FileList-virtualization.tsx:18](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L18)*

###  height

• **height**: *number* = 120

*Defined in [src/components/external/FileList-virtualization.tsx:18](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L18)*

###  width

• **width**: *number* = 160

*Defined in [src/components/external/FileList-virtualization.tsx:18](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/FileList-virtualization.tsx#L18)*
