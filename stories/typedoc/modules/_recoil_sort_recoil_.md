[chonky](../README.md) › [Globals](../globals.md) › ["recoil/sort.recoil"](_recoil_sort_recoil_.md)

# Module: "recoil/sort.recoil"

## Index

### Variables

* [sortConfigState](_recoil_sort_recoil_.md#const-sortconfigstate)

## Variables

### `Const` sortConfigState

• **sortConfigState**: *RecoilState‹[SortConfig](../interfaces/_types_sort_types_.sortconfig.md)›* = atom<SortConfig>({
    key: 'sortConfigState',
    default: {
        fileActionId: ChonkyActions.SortFilesByName.id,
        sortKeySelector: ChonkyActions.SortFilesByName.sortKeySelector,
        order: SortOrder.Asc,
    },
})

*Defined in [src/recoil/sort.recoil.ts:8](https://github.com/TimboKZ/Chonky/blob/603fef8/src/recoil/sort.recoil.ts#L8)*
