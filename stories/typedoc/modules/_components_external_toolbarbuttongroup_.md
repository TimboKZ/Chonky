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

        let groupContents: React.ReactElement | React.ReactElement[];
        if (group.dropdown) {
            groupContents = <Dropdown group={group} />;
        } else {
            groupContents = group.fileActions.map((action) => (
                <SmartToolbarButton
                    key={`action-button-${action.id}`}
                    fileAction={action}
                />
            ));
        }

        return <div className="chonky-toolbar-button-group">{groupContents}</div>;
    }
)

*Defined in [src/components/external/ToolbarButtonGroup.tsx:23](https://github.com/TimboKZ/Chonky/blob/ce1f2d4/src/components/external/ToolbarButtonGroup.tsx#L23)*
