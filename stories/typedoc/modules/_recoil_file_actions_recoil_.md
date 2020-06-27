[chonky](../README.md) › [Globals](../globals.md) › ["recoil/file-actions.recoil"](_recoil_file_actions_recoil_.md)

# Module: "recoil/file-actions.recoil"

## Index

### Variables

* [dispatchFileActionState](_recoil_file_actions_recoil_.md#const-dispatchfileactionstate)
* [doubleClickDelayState](_recoil_file_actions_recoil_.md#const-doubleclickdelaystate)
* [fileActionDataState](_recoil_file_actions_recoil_.md#const-fileactiondatastate)
* [fileActionMapState](_recoil_file_actions_recoil_.md#const-fileactionmapstate)
* [fileActionSelectedFilesCountState](_recoil_file_actions_recoil_.md#const-fileactionselectedfilescountstate)
* [fileActionSelectedFilesState](_recoil_file_actions_recoil_.md#const-fileactionselectedfilesstate)
* [fileActionsState](_recoil_file_actions_recoil_.md#const-fileactionsstate)
* [requestFileActionState](_recoil_file_actions_recoil_.md#const-requestfileactionstate)

## Variables

### `Const` dispatchFileActionState

• **dispatchFileActionState**: *RecoilState‹function›* = atom<InternalFileActionDispatcher>({
    key: 'dispatchFileActionState',
    default: NOOP_FUNCTION,
})

*Defined in [src/recoil/file-actions.recoil.ts:25](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L25)*

___

### `Const` doubleClickDelayState

• **doubleClickDelayState**: *RecoilState‹number›* = atom<number>({
    key: 'doubleClickDelayState',
    default: 300,
})

*Defined in [src/recoil/file-actions.recoil.ts:35](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L35)*

___

### `Const` fileActionDataState

• **fileActionDataState**: *function* = selectorFamily<Nullable<FileAction>, string>({
    key: 'fileActionDataState',
    get: (fileActionId) => ({ get }) => {
        if (!fileActionId) return null;

        const fileActionMap = get(fileActionMapState);
        const fileAction = fileActionMap[fileActionId];
        return fileAction ?? null;
    },
})

*Defined in [src/recoil/file-actions.recoil.ts:42](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L42)*

#### Type declaration:

▸ (`param`: P): *RecoilValueReadOnly‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`param` | P |

___

### `Const` fileActionMapState

• **fileActionMapState**: *RecoilState‹object›* = atom<{ [fileActionId: string]: FileAction }>({
    key: 'fileActionMapState',
    default: {},
})

*Defined in [src/recoil/file-actions.recoil.ts:20](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L20)*

___

### `Const` fileActionSelectedFilesCountState

• **fileActionSelectedFilesCountState**: *function* = selectorFamily<number, string>({
    key: 'fileActionSelectedFilesCountState',
    get: (fileActionId) => ({ get }) => {
        const actionSelectedFiles = get(fileActionSelectedFilesState(fileActionId));
        return actionSelectedFiles.length;
    },
})

*Defined in [src/recoil/file-actions.recoil.ts:77](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L77)*

#### Type declaration:

▸ (`param`: P): *RecoilValueReadOnly‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`param` | P |

___

### `Const` fileActionSelectedFilesState

• **fileActionSelectedFilesState**: *function* = selectorFamily<readonly FileData[], string>(
    {
        key: 'fileActionSelectedFilesState',
        get: (fileActionId) => ({ get }) => {
            if (!fileActionId) return [];

            const fileActionMap = get(fileActionMapState);
            const fileAction = fileActionMap[fileActionId];
            if (!fileAction) return [];

            const selectedFiles = get(selectedFilesState);
            if (fileAction.fileFilter) {
                return selectedFiles.filter(fileAction.fileFilter);
            } else {
                return selectedFiles;
            }
        },
    }
)

*Defined in [src/recoil/file-actions.recoil.ts:57](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L57)*

This Recoil selector family returns a subset of the global file selection that
satisfies filter of the provided file action.

#### Type declaration:

▸ (`param`: P): *RecoilValueReadOnly‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`param` | P |

___

### `Const` fileActionsState

• **fileActionsState**: *RecoilState‹[FileAction](../interfaces/_types_file_actions_types_.fileaction.md)[]›* = atom<FileAction[]>({
    key: 'fileActionsState',
    default: [],
})

*Defined in [src/recoil/file-actions.recoil.ts:15](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L15)*

___

### `Const` requestFileActionState

• **requestFileActionState**: *RecoilState‹function›* = atom<InternalFileActionRequester>({
    key: 'requestFileActionState',
    default: NOOP_FUNCTION,
})

*Defined in [src/recoil/file-actions.recoil.ts:30](https://github.com/TimboKZ/Chonky/blob/2de2c80/src/recoil/file-actions.recoil.ts#L30)*
