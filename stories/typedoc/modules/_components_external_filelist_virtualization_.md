[chonky](../README.md) › [Globals](../globals.md) › ["components/external/FileList-virtualization"](_components_external_filelist_virtualization_.md)

# Module: "components/external/FileList-virtualization"

## Index

### Interfaces

* [EntrySize](../interfaces/_components_external_filelist_virtualization_.entrysize.md)

### Functions

* [getColWidth](_components_external_filelist_virtualization_.md#const-getcolwidth)
* [getRowHeight](_components_external_filelist_virtualization_.md#const-getrowheight)
* [noContentRenderer](_components_external_filelist_virtualization_.md#const-nocontentrenderer)
* [useEntryRenderer](_components_external_filelist_virtualization_.md#const-useentryrenderer)
* [useGridRenderer](_components_external_filelist_virtualization_.md#const-usegridrenderer)

### Object literals

* [SmallThumbsSize](_components_external_filelist_virtualization_.md#const-smallthumbssize)

## Functions

### `Const` getColWidth

▸ **getColWidth**(`index`: number, `columnCount`: number, `entrySize`: [EntrySize](../interfaces/_components_external_filelist_virtualization_.entrysize.md), `gutterSize`: number): *number*

*Defined in [src/components/external/FileList-virtualization.tsx:24](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`columnCount` | number |
`entrySize` | [EntrySize](../interfaces/_components_external_filelist_virtualization_.entrysize.md) |
`gutterSize` | number |

**Returns:** *number*

___

### `Const` getRowHeight

▸ **getRowHeight**(`index`: number, `rowCount`: number, `entrySize`: [EntrySize](../interfaces/_components_external_filelist_virtualization_.entrysize.md), `gutterSize`: number): *number*

*Defined in [src/components/external/FileList-virtualization.tsx:34](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`rowCount` | number |
`entrySize` | [EntrySize](../interfaces/_components_external_filelist_virtualization_.entrysize.md) |
`gutterSize` | number |

**Returns:** *number*

___

### `Const` noContentRenderer

▸ **noContentRenderer**(`height?`: undefined | number): *Element‹›*

*Defined in [src/components/external/FileList-virtualization.tsx:103](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`height?` | undefined &#124; number |

**Returns:** *Element‹›*

___

### `Const` useEntryRenderer

▸ **useEntryRenderer**(`files`: [FileArray](_typedef_.md#filearray)): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:44](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_typedef_.md#filearray) |

**Returns:** *(Anonymous function)*

___

### `Const` useGridRenderer

▸ **useGridRenderer**(`files`: [FileArray](_typedef_.md#filearray), `entryRenderer`: ReturnType‹typeof useEntryRenderer›, `thumbsGridRef`: React.Ref‹Nilable‹Grid››, `fillParentContainer`: boolean): *(Anonymous function)*

*Defined in [src/components/external/FileList-virtualization.tsx:122](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_typedef_.md#filearray) |
`entryRenderer` | ReturnType‹typeof useEntryRenderer› |
`thumbsGridRef` | React.Ref‹Nilable‹Grid›› |
`fillParentContainer` | boolean |

**Returns:** *(Anonymous function)*

## Object literals

### `Const` SmallThumbsSize

### ▪ **SmallThumbsSize**: *object*

*Defined in [src/components/external/FileList-virtualization.tsx:22](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L22)*

###  height

• **height**: *number* = 120

*Defined in [src/components/external/FileList-virtualization.tsx:22](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L22)*

###  width

• **width**: *number* = 160

*Defined in [src/components/external/FileList-virtualization.tsx:22](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileList-virtualization.tsx#L22)*
