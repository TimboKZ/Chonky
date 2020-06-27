[chonky](../README.md) › [Globals](../globals.md) › ["components/external/DropdownButton"](_components_external_dropdownbutton_.md)

# Module: "components/external/DropdownButton"

## Index

### Interfaces

* [DropdownButtonProps](../interfaces/_components_external_dropdownbutton_.dropdownbuttonprops.md)
* [SmartDropdownButtonProps](../interfaces/_components_external_dropdownbutton_.smartdropdownbuttonprops.md)

### Variables

* [DropdownButton](_components_external_dropdownbutton_.md#const-dropdownbutton)

### Functions

* [SmartDropdownButton](_components_external_dropdownbutton_.md#const-smartdropdownbutton)

## Variables

### `Const` DropdownButton

• **DropdownButton**: *React.FC‹[DropdownButtonProps](../interfaces/_components_external_dropdownbutton_.dropdownbuttonprops.md)›* = React.memo((props) => {
    const { text, tooltip, active, icon, onClick, disabled } = props;

    const className = c({
        'chonky-toolbar-dropdown-button': true,
        'chonky-active': !!active,
    });
    return (
        <button
            className={className}
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={!onClick || disabled}
        >
            <div className="chonky-toolbar-dropdown-button-icon">
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.circle}
                    fixedWidth={true}
                />
            </div>
            <div className="chonky-toolbar-dropdown-button-text">{text}</div>
        </button>
    );
})

*Defined in [src/components/external/DropdownButton.tsx:26](https://github.com/TimboKZ/Chonky/blob/603fef8/src/components/external/DropdownButton.tsx#L26)*

## Functions

### `Const` SmartDropdownButton

▸ **SmartDropdownButton**(`props`: [SmartDropdownButtonProps](../interfaces/_components_external_dropdownbutton_.smartdropdownbuttonprops.md) & object): *null | Element‹›*

*Defined in [src/components/external/DropdownButton.tsx:55](https://github.com/TimboKZ/Chonky/blob/603fef8/src/components/external/DropdownButton.tsx#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`props` | [SmartDropdownButtonProps](../interfaces/_components_external_dropdownbutton_.smartdropdownbuttonprops.md) & object |

**Returns:** *null | Element‹›*
