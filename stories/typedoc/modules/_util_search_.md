[chonky](../README.md) › [Globals](../globals.md) › ["util/search"](_util_search_.md)

# Module: "util/search"

## Index

### Functions

* [useFilteredFiles](_util_search_.md#const-usefilteredfiles)
* [useSearch](_util_search_.md#const-usesearch)
* [useSearchContexts](_util_search_.md#const-usesearchcontexts)
* [useSearchState](_util_search_.md#const-usesearchstate)

## Functions

### `Const` useFilteredFiles

▸ **useFilteredFiles**(`files`: [FileArray](_types_files_types_.md#filearray), `searchFilter`: string): *[FileArray](_types_files_types_.md#filearray)*

*Defined in [src/util/search.ts:65](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/search.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`files` | [FileArray](_types_files_types_.md#filearray) |
`searchFilter` | string |

**Returns:** *[FileArray](_types_files_types_.md#filearray)*

___

### `Const` useSearch

▸ **useSearch**(): *object*

*Defined in [src/util/search.ts:15](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/search.ts#L15)*

**Returns:** *object*

* **searchContexts**: *[ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹boolean›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹function›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹string›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹function››[]*

* **searchState**(): *object*

  * **searchBarEnabled**: *boolean*

  * **searchBarVisible**: *boolean*

  * **searchFilter**: *string*

  * **setSearchBarEnabled**(): *function*

    * (`value`: A): *void*

  * **setSearchBarVisible**(): *function*

    * (`value`: A): *void*

  * **setSearchFilter**(): *function*

    * (`value`: A): *void*

___

### `Const` useSearchContexts

▸ **useSearchContexts**(`searchState`: ReturnType‹typeof useSearchState›): *[ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹boolean›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹function›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹string›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹function››[]*

*Defined in [src/util/search.ts:36](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/search.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`searchState` | ReturnType‹typeof useSearchState› |

**Returns:** *[ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹boolean›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹function›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹string›› | [ContextData](../interfaces/_util_context_.contextdata.md)‹Context‹function››[]*

___

### `Const` useSearchState

▸ **useSearchState**(): *object*

*Defined in [src/util/search.ts:21](https://github.com/TimboKZ/Chonky/blob/eb6f214/src/util/search.ts#L21)*

**Returns:** *object*

* **searchBarEnabled**: *boolean*

* **searchBarVisible**: *boolean*

* **searchFilter**: *string*

* **setSearchBarEnabled**(): *function*

  * (`value`: A): *void*

* **setSearchBarVisible**(): *function*

  * (`value`: A): *void*

* **setSearchFilter**(): *function*

  * (`value`: A): *void*
