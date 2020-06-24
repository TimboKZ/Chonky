/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useCallback, useState } from 'react';

import { ActionGroupData } from '../../types/file-actions.types';
import { ChonkyIconName } from '../../types/icons.types';
import { useClickListener } from '../../util/hooks-helpers';
import { SmartDropdownButton } from './DropdownButton';
import { ToolbarButton } from './ToolbarButton';

export interface DropdownProps {
    group: ActionGroupData;
}

export const Dropdown: React.FC<DropdownProps> = React.memo((props) => {
    const { group } = props;

    const [showDropdown, setShowDropdown] = useState(false);

    const hideDropdown = useCallback(() => setShowDropdown(false), [setShowDropdown]);
    const dropdownRef = useClickListener({
        onOutsideClick: hideDropdown,
    });

    const triggerClick = useCallback(() => {
        setShowDropdown(true);
    }, [setShowDropdown]);

    return (
        <div ref={dropdownRef} className="chonky-toolbar-dropdown">
            <ToolbarButton
                text={group.name!}
                active={showDropdown}
                icon={ChonkyIconName.dropdown}
                iconOnRight={true}
                onClick={triggerClick}
            />
            {showDropdown && (
                <div className="chonky-toolbar-dropdown-content">
                    {group.fileActionIds.map((actionId) => (
                        <SmartDropdownButton
                            key={`action-button-${actionId}`}
                            fileActionId={actionId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});
