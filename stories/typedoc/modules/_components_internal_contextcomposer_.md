[chonky](../README.md) › [Globals](../globals.md) › ["components/internal/ContextComposer"](_components_internal_contextcomposer_.md)

# Module: "components/internal/ContextComposer"

## Index

### Interfaces

* [ContextComposerProps](../interfaces/_components_internal_contextcomposer_.contextcomposerprops.md)
* [ContextProviderData](../interfaces/_components_internal_contextcomposer_.contextproviderdata.md)

### Functions

* [ContextComposer](_components_internal_contextcomposer_.md#const-contextcomposer)

## Functions

### `Const` ContextComposer

▸ **ContextComposer**(`props`: [ContextComposerProps](../interfaces/_components_internal_contextcomposer_.contextcomposerprops.md) & object): *Element‹›*

*Defined in [src/components/internal/ContextComposer.tsx:30](https://github.com/TimboKZ/Chonky/blob/faab549/src/components/internal/ContextComposer.tsx#L30)*

Takes an array of context providers and composes them into a
hierarchy:

<Comp1 {...props}>
    <Comp2 {...props}>
        <Comp3 {...props}>
            {children}
        </Comp3>
    </Comp2>
</Comp1>

**Parameters:**

Name | Type |
------ | ------ |
`props` | [ContextComposerProps](../interfaces/_components_internal_contextcomposer_.contextcomposerprops.md) & object |

**Returns:** *Element‹›*
