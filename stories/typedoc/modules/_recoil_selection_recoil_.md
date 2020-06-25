[chonky](../README.md) › [Globals](../globals.md) › ["recoil/selection.recoil"](_recoil_selection_recoil_.md)

# Module: "recoil/selection.recoil"

## Index

### Variables

* [fileSelectedState](_recoil_selection_recoil_.md#const-fileselectedstate)
* [selectedFilesState](_recoil_selection_recoil_.md#const-selectedfilesstate)
* [selectionModifiersState](_recoil_selection_recoil_.md#const-selectionmodifiersstate)
* [selectionSizeState](_recoil_selection_recoil_.md#const-selectionsizestate)
* [selectionState](_recoil_selection_recoil_.md#const-selectionstate)

## Variables

### `Const` fileSelectedState

• **fileSelectedState**: *function* = selectorFamily<boolean, Nullable<string>>({
    key: 'fileSelectedState',
    get: (fileId) => ({ get }) => {
        // We deliberately don't use `FileHelper.isSelectable` here. We want
        // the UI to represent the true state of selection. This will help users
        // see what exactly the selection is before running some code.
        return !!fileId && get(selectionState)[fileId] === true;
    },
})

*Defined in [src/recoil/selection.recoil.ts:53](https://github.com/TimboKZ/Chonky/blob/8056a68/src/recoil/selection.recoil.ts#L53)*

#### Type declaration:

▸ (`param`: P): *RecoilValueReadOnly‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`param` | P |

___

### `Const` selectedFilesState

• **selectedFilesState**: *RecoilValueReadOnly‹ReadonlyArray‹object››* = selector({
    key: 'selectedFilesState',
    get: ({ get }) => {
        const files = get(filesState);
        const selection = get(selectionState);

        return SelectionHelper.getSelectedFiles(files, selection);
    },
})

*Defined in [src/recoil/selection.recoil.ts:27](https://github.com/TimboKZ/Chonky/blob/8056a68/src/recoil/selection.recoil.ts#L27)*

___

### `Const` selectionModifiersState

• **selectionModifiersState**: *RecoilState‹[SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)›* = atom<SelectionModifiers>({
    key: 'selectionModifiersState',
    default: {
        selectFiles: NOOP_FUNCTION,
        toggleSelection: NOOP_FUNCTION,
        clearSelection: NOOP_FUNCTION,
    },
})

*Defined in [src/recoil/selection.recoil.ts:16](https://github.com/TimboKZ/Chonky/blob/8056a68/src/recoil/selection.recoil.ts#L16)*

___

### `Const` selectionSizeState

• **selectionSizeState**: *RecoilValueReadOnly‹number›* = selector({
    key: 'selectionSizeState',
    get: ({ get }) => {
        const selection = get(selectionState);

        let selectionSize = 0;
        for (const fileId in selection) {
            if (selection.hasOwnProperty(fileId)) {
                if (selection[fileId] === true) selectionSize++;
            }
        }

        return selectionSize;
    },
})

*Defined in [src/recoil/selection.recoil.ts:37](https://github.com/TimboKZ/Chonky/blob/8056a68/src/recoil/selection.recoil.ts#L37)*

___

### `Const` selectionState

• **selectionState**: *RecoilState‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›* = atom<FileSelection>({
    key: 'selectionState',
    default: {},
})

*Defined in [src/recoil/selection.recoil.ts:11](https://github.com/TimboKZ/Chonky/blob/8056a68/src/recoil/selection.recoil.ts#L11)*
