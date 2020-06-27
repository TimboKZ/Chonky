[chonky](../README.md) › [Globals](../globals.md) › ["recoil/files.recoil"](_recoil_files_recoil_.md)

# Module: "recoil/files.recoil"

## Index

### Variables

* [fileDataState](_recoil_files_recoil_.md#const-filedatastate)
* [fileMapState](_recoil_files_recoil_.md#const-filemapstate)
* [filesState](_recoil_files_recoil_.md#const-filesstate)
* [folderChainState](_recoil_files_recoil_.md#const-folderchainstate)
* [parentFolderState](_recoil_files_recoil_.md#const-parentfolderstate)

## Variables

### `Const` fileDataState

• **fileDataState**: *function* = selectorFamily<Nullable<FileData>, Nullable<string>>({
    key: 'fileDataState',
    get: (fileId) => ({ get }) => {
        if (!fileId) return null;

        const fileMap = get(fileMapState);
        const file = fileMap[fileId];
        return file ?? null;
    },
})

*Defined in [src/recoil/files.recoil.ts:41](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/recoil/files.recoil.ts#L41)*

#### Type declaration:

▸ (`param`: P): *RecoilValueReadOnly‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`param` | P |

___

### `Const` fileMapState

• **fileMapState**: *RecoilValueReadOnly‹object›* = selector<{ [fileId: string]: FileData }>({
    key: 'fileMapState',
    get: ({ get }) => {
        const files = get(filesState);

        const fileMap = {};

        for (const file of files) {
            if (!file) continue;
            fileMap[file.id] = file;
        }

        return fileMap;
    },
})

*Defined in [src/recoil/files.recoil.ts:25](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/recoil/files.recoil.ts#L25)*

___

### `Const` filesState

• **filesState**: *RecoilState‹null | [FileData](../interfaces/_types_files_types_.filedata.md)[]›* = atom<FileArray>({
    key: 'filesState',
    default: [],
})

*Defined in [src/recoil/files.recoil.ts:8](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/recoil/files.recoil.ts#L8)*

___

### `Const` folderChainState

• **folderChainState**: *RecoilState‹null | null | [FileData](../interfaces/_types_files_types_.filedata.md)[]›* = atom<Nullable<FileArray>>({
    key: 'folderChainState',
    default: null,
})

*Defined in [src/recoil/files.recoil.ts:13](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/recoil/files.recoil.ts#L13)*

___

### `Const` parentFolderState

• **parentFolderState**: *RecoilState‹null | [FileData](../interfaces/_types_files_types_.filedata.md)›* = atom<Nullable<FileData>>({
    key: 'parentFolderState',
    default: null,
})

*Defined in [src/recoil/files.recoil.ts:18](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/recoil/files.recoil.ts#L18)*
