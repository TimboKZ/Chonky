[chonky](../README.md) › [Globals](../globals.md) › ["recoil/selection.recoil"](_recoil_selection_recoil_.md)

# Module: "recoil/selection.recoil"

## Index

### Variables

* [selectionModifiersState](_recoil_selection_recoil_.md#const-selectionmodifiersstate)
* [selectionSizeState](_recoil_selection_recoil_.md#const-selectionsizestate)
* [selectionState](_recoil_selection_recoil_.md#const-selectionstate)

## Variables

### `Const` selectionModifiersState

• **selectionModifiersState**: *RecoilState‹[SelectionModifiers](../interfaces/_types_selection_types_.selectionmodifiers.md)›* = atom<SelectionModifiers>({
    key: 'selectionModifiersState',
    default: {
        selectFiles: NOOP_FUNCTION,
        toggleSelection: NOOP_FUNCTION,
        clearSelection: NOOP_FUNCTION,
    },
})

*Defined in [src/recoil/selection.recoil.ts:13](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/selection.recoil.ts#L13)*

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

*Defined in [src/recoil/selection.recoil.ts:24](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/selection.recoil.ts#L24)*

___

### `Const` selectionState

• **selectionState**: *RecoilState‹[FileSelection](../interfaces/_types_selection_types_.fileselection.md)›* = atom<FileSelection>({
    key: 'selectionState',
    default: {},
})

*Defined in [src/recoil/selection.recoil.ts:8](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/selection.recoil.ts#L8)*
