[chonky](../README.md) › [Globals](../globals.md) › ["recoil/files.recoil"](_recoil_files_recoil_.md)

# Module: "recoil/files.recoil"

## Index

### Variables

* [filesState](_recoil_files_recoil_.md#const-filesstate)
* [folderChainState](_recoil_files_recoil_.md#const-folderchainstate)

## Variables

### `Const` filesState

• **filesState**: *RecoilState‹null | [FileData](../interfaces/_types_files_types_.filedata.md)[]›* = atom<FileArray>({
    key: 'filesState',
    default: [],
})

*Defined in [src/recoil/files.recoil.ts:8](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/files.recoil.ts#L8)*

___

### `Const` folderChainState

• **folderChainState**: *RecoilState‹null | null | [FileData](../interfaces/_types_files_types_.filedata.md)[]›* = atom<Nullable<FileArray>>({
    key: 'folderChainState',
    default: null,
})

*Defined in [src/recoil/files.recoil.ts:13](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/recoil/files.recoil.ts#L13)*
