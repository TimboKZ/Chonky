[chonky](../README.md) › [Globals](../globals.md) › ["components/external/Dropdown"](_components_external_dropdown_.md)

# Module: "components/external/Dropdown"

## Index

### Interfaces

* [DropdownProps](../interfaces/_components_external_dropdown_.dropdownprops.md)

### Variables

* [Dropdown](_components_external_dropdown_.md#const-dropdown)

## Variables

### `Const` Dropdown

• **Dropdown**: *React.FC‹[DropdownProps](../interfaces/_components_external_dropdown_.dropdownprops.md)›* = React.memo((props) => {
    const { group } = props;

    const [showDropdown, setShowDropdown] = useState(false);

    const hideDropdown = useCallback(() => setShowDropdown(false), [setShowDropdown]);
    const dropdownRef = useOutsideClickListener(hideDropdown);

    const triggerClick = useCallback(() => {
        setShowDropdown(true);
    }, [setShowDropdown]);

    return (
        <div ref={dropdownRef} className="chonky-toolbar-dropdown">
            <ToolbarButton
                text={group.name!}
                icon={ChonkyIconName.dropdown}
                iconOnRight={true}
                onClick={triggerClick}
            />
            {showDropdown && (
                <div className="chonky-toolbar-dropdown-content">
                    {group.fileActions.map((action) => (
                        <SmartDropdownButton
                            key={`action-button-${action.name}`}
                            fileAction={action}
                        />
                    ))}
                </div>
            )}
        </div>
    );
})

*Defined in [src/components/external/Dropdown.tsx:19](https://github.com/TimboKZ/Chonky/blob/ca45eac/src/components/external/Dropdown.tsx#L19)*
