[chonky](../README.md) › [Globals](../globals.md) › ["components/external/ToolbarButtonGroup"](_components_external_toolbarbuttongroup_.md)

# Module: "components/external/ToolbarButtonGroup"

## Index

### Interfaces

* [ToolbarButtonGroup](../interfaces/_components_external_toolbarbuttongroup_.toolbarbuttongroup.md)
* [ToolbarButtonGroupProps](../interfaces/_components_external_toolbarbuttongroup_.toolbarbuttongroupprops.md)

### Variables

* [ToolbarButtonGroup](_components_external_toolbarbuttongroup_.md#const-toolbarbuttongroup)

## Variables

### `Const` ToolbarButtonGroup

• **ToolbarButtonGroup**: *React.FC‹[ToolbarButtonGroupProps](../interfaces/_components_external_toolbarbuttongroup_.toolbarbuttongroupprops.md)›* = React.memo(
    (props) => {
        const { group } = props;

        const buttonComponents = group.fileActions.map((action) => (
            <SmartToolbarButton
                key={`action-button-${action.name}`}
                fileAction={action}
            />
        ));
        return <div className="chonky-toolbar-button-group">{buttonComponents}</div>;
    }
)

*Defined in [src/components/external/ToolbarButtonGroup.tsx:22](https://github.com/TimboKZ/Chonky/blob/cc6d20b/src/components/external/ToolbarButtonGroup.tsx#L22)*
