[chonky](../README.md) › [Globals](../globals.md) › ["components/external/TextPlaceholder"](_components_external_textplaceholder_.md)

# Module: "components/external/TextPlaceholder"

## Index

### Interfaces

* [TextPlaceholderProps](../interfaces/_components_external_textplaceholder_.textplaceholderprops.md)

### Variables

* [TextPlaceholder](_components_external_textplaceholder_.md#const-textplaceholder)

### Functions

* [getRandomInt](_components_external_textplaceholder_.md#const-getrandomint)

## Variables

### `Const` TextPlaceholder

• **TextPlaceholder**: *React.FC‹[TextPlaceholderProps](../interfaces/_components_external_textplaceholder_.textplaceholderprops.md)›* = React.memo((props) => {
    const { minLength, maxLength } = props;

    const placeholderLength = getRandomInt(minLength, maxLength);
    const whitespace = '&nbsp;'.repeat(placeholderLength);

    return (
        <span
            className="chonky-text-placeholder"
            dangerouslySetInnerHTML={{ __html: whitespace }}
        />
    );
})

*Defined in [src/components/external/TextPlaceholder.tsx:17](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/components/external/TextPlaceholder.tsx#L17)*

## Functions

### `Const` getRandomInt

▸ **getRandomInt**(`min`: number, `max`: number): *number*

*Defined in [src/components/external/TextPlaceholder.tsx:14](https://github.com/TimboKZ/Chonky/blob/f29f7b3/src/components/external/TextPlaceholder.tsx#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`min` | number |
`max` | number |

**Returns:** *number*
