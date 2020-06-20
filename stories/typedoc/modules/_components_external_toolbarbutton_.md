[chonky](../README.md) › [Globals](../globals.md) › ["components/external/ToolbarButton"](_components_external_toolbarbutton_.md)

# Module: "components/external/ToolbarButton"

## Index

### Interfaces

* [SmartToolbarButtonProps](../interfaces/_components_external_toolbarbutton_.smarttoolbarbuttonprops.md)
* [ToolbarButtonProps](../interfaces/_components_external_toolbarbutton_.toolbarbuttonprops.md)

### Variables

* [SmartToolbarButton](_components_external_toolbarbutton_.md#const-smarttoolbarbutton)
* [ToolbarButton](_components_external_toolbarbutton_.md#const-toolbarbutton)

## Variables

### `Const` SmartToolbarButton

• **SmartToolbarButton**: *React.FC‹[SmartToolbarButtonProps](../interfaces/_components_external_toolbarbutton_.smarttoolbarbuttonprops.md)›* = React.memo(
    (props) => {
        const { fileAction: action } = props;

        const { toolbarButton: button } = action;
        if (!button) return null;

        const { onClick, disabled } = useSmartToolbarButtonProps(action);

        return (
            <ToolbarButton
                text={button.name}
                tooltip={button.tooltip}
                icon={button.icon}
                iconOnly={button.iconOnly}
                onClick={onClick}
                disabled={disabled}
            />
        );
    }
)

*Defined in [src/components/external/ToolbarButton.tsx:50](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/components/external/ToolbarButton.tsx#L50)*

___

### `Const` ToolbarButton

• **ToolbarButton**: *React.FC‹[ToolbarButtonProps](../interfaces/_components_external_toolbarbutton_.toolbarbuttonprops.md)›* = React.memo((props) => {
    const { text, tooltip, icon, iconOnly, iconOnRight, onClick, disabled } = props;

    const iconComponent =
        icon || iconOnly ? (
            <div className="chonky-toolbar-button-icon">
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.fallbackIcon}
                    fixedWidth={true}
                />
            </div>
        ) : null;

    return (
        <button
            className="chonky-toolbar-button"
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={!onClick || disabled}
        >
            {!iconOnRight && iconComponent}
            {text && !iconOnly && (
                <div className="chonky-toolbar-button-text">{text}</div>
            )}
            {iconOnRight && iconComponent}
        </button>
    );
})

*Defined in [src/components/external/ToolbarButton.tsx:17](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/components/external/ToolbarButton.tsx#L17)*
