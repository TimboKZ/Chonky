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
        const { fileActionId } = props;

        const action = useRecoilValue(fileActionDataState(fileActionId));
        const triggerAction = useFileActionTrigger(fileActionId);
        const { active, disabled } = useFileActionModifiers(fileActionId);

        if (!action) return null;
        const { toolbarButton: button } = action;
        if (!button) return null;

        return (
            <ToolbarButton
                text={button.name}
                tooltip={button.tooltip}
                icon={button.icon}
                iconOnly={button.iconOnly}
                active={active}
                onClick={triggerAction}
                disabled={disabled}
            />
        );
    }
)

*Defined in [src/components/external/ToolbarButton.tsx:67](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/components/external/ToolbarButton.tsx#L67)*

___

### `Const` ToolbarButton

• **ToolbarButton**: *React.FC‹[ToolbarButtonProps](../interfaces/_components_external_toolbarbutton_.toolbarbuttonprops.md)›* = React.memo((props) => {
    const {
        text,
        tooltip,
        active,
        icon,
        iconOnly,
        iconOnRight,
        onClick,
        disabled,
    } = props;

    const iconComponent =
        icon || iconOnly ? (
            <div className="chonky-toolbar-button-icon">
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.fallbackIcon}
                    fixedWidth={true}
                />
            </div>
        ) : null;

    const className = c({
        'chonky-toolbar-button': true,
        'chonky-active': !!active,
    });
    return (
        <button
            className={className}
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

*Defined in [src/components/external/ToolbarButton.tsx:21](https://github.com/TimboKZ/Chonky/blob/cb533b8/src/components/external/ToolbarButton.tsx#L21)*
