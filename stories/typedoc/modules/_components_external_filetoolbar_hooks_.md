[chonky](../README.md) › [Globals](../globals.md) › ["components/external/FileToolbar-hooks"](_components_external_filetoolbar_hooks_.md)

# Module: "components/external/FileToolbar-hooks"

## Index

### Functions

* [useFileActionButtons](_components_external_filetoolbar_hooks_.md#const-usefileactionbuttons)
* [useFolderChainComponent](_components_external_filetoolbar_hooks_.md#const-usefolderchaincomponent)
* [useToolbarButtonGroups](_components_external_filetoolbar_hooks_.md#const-usetoolbarbuttongroups)

## Functions

### `Const` useFileActionButtons

▸ **useFileActionButtons**(): *object*

*Defined in [src/components/external/FileToolbar-hooks.tsx:91](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileToolbar-hooks.tsx#L91)*

Converts an array of file actions into button components.

**Returns:** *object*

* **buttonComponents**: *ReactElement[]*

* **openParentFolderButton**: *Nullable‹ReactElement›*

___

### `Const` useFolderChainComponent

▸ **useFolderChainComponent**(): *null | Element‹›*

*Defined in [src/components/external/FileToolbar-hooks.tsx:24](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileToolbar-hooks.tsx#L24)*

Generates folder chain HTML components for the `FileToolbar` component.

**Returns:** *null | Element‹›*

___

### `Const` useToolbarButtonGroups

▸ **useToolbarButtonGroups**(): *object*

*Defined in [src/components/external/FileToolbar-hooks.tsx:181](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/FileToolbar-hooks.tsx#L181)*

**Returns:** *object*

* **buttonGroups**: *[ToolbarButtonGroup](../interfaces/_components_external_toolbarbuttongroup_.toolbarbuttongroup.md)[]*

* **openParentFolderButtonGroup**: *null | [ToolbarButtonGroup](../interfaces/_components_external_toolbarbuttongroup_.toolbarbuttongroup.md)*

* **searchButtonGroup**: *null | [ToolbarButtonGroup](../interfaces/_components_external_toolbarbuttongroup_.toolbarbuttongroup.md)*
