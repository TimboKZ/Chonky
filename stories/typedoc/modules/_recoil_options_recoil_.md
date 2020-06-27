[chonky](../README.md) › [Globals](../globals.md) › ["recoil/options.recoil"](_recoil_options_recoil_.md)

# Module: "recoil/options.recoil"

## Index

### Variables

* [optionMapState](_recoil_options_recoil_.md#const-optionmapstate)
* [optionState](_recoil_options_recoil_.md#const-optionstate)

## Variables

### `Const` optionMapState

• **optionMapState**: *RecoilState‹object›* = atom<OptionMap>({
    key: 'optionMapState',
    default: {},
})

*Defined in [src/recoil/options.recoil.ts:8](https://github.com/TimboKZ/Chonky/blob/5b9fbdf/src/recoil/options.recoil.ts#L8)*

___

### `Const` optionState

• **optionState**: *function* = selectorFamily<Undefinable<boolean>, string>({
    key: 'optionEnabledState',
    get: (optionId) => ({ get }) => {
        return get(optionMapState)[optionId];
    },
})

*Defined in [src/recoil/options.recoil.ts:15](https://github.com/TimboKZ/Chonky/blob/5b9fbdf/src/recoil/options.recoil.ts#L15)*

#### Type declaration:

▸ (`param`: P): *RecoilValueReadOnly‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`param` | P |
