[chonky](../README.md) › [Globals](../globals.md) › ["components/external/ToolbarButtonGroup"](_components_external_toolbarbuttongroup_.md)

# Module: "components/external/ToolbarButtonGroup"

## Index

### Interfaces

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
            groupContents = group.fileActionIds.map((actionId) => (
                <SmartToolbarButton
                    key={`action-button-${actionId}`}
                    fileActionId={actionId}
                />
            ));
        }

        return <div className="chonky-toolbar-button-group">{groupContents}</div>;
    }
)

*Defined in [src/components/external/ToolbarButtonGroup.tsx:17](https://github.com/TimboKZ/Chonky/blob/d1a0325/src/components/external/ToolbarButtonGroup.tsx#L17)*
