[chonky](../README.md) › [Globals](../globals.md) › ["recoil/file-actions.recoil"](_recoil_file_actions_recoil_.md)

# Module: "recoil/file-actions.recoil"

## Index

### Variables

* [dispatchFileActionState](_recoil_file_actions_recoil_.md#const-dispatchfileactionstate)
* [doubleClickDelayState](_recoil_file_actions_recoil_.md#const-doubleclickdelaystate)
* [fileActionsState](_recoil_file_actions_recoil_.md#const-fileactionsstate)

## Variables

### `Const` dispatchFileActionState

• **dispatchFileActionState**: *RecoilState‹function›* = atom<InternalFileActionDispatcher>({
    key: 'dispatchFileActionState',
    default: NOOP_FUNCTION,
})

*Defined in [src/recoil/file-actions.recoil.ts:13](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/file-actions.recoil.ts#L13)*

___

### `Const` doubleClickDelayState

• **doubleClickDelayState**: *RecoilState‹number›* = atom<number>({
    key: 'doubleClickDelayState',
    default: 300,
})

*Defined in [src/recoil/file-actions.recoil.ts:18](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/file-actions.recoil.ts#L18)*

___

### `Const` fileActionsState

• **fileActionsState**: *RecoilState‹[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]›* = atom<FileAction[]>({
    key: 'fileActionsState',
    default: [],
})

*Defined in [src/recoil/file-actions.recoil.ts:8](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/file-actions.recoil.ts#L8)*
