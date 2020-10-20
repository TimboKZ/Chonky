import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { fileActionsState } from '../../recoil/file-actions.recoil';
import { ActionGroupData } from '../../types/file-actions.types';
import { ChonkyActions } from '../../util/file-actions-definitions';

export const useActionGroups = () => {
    const fileActions = useRecoilValue(fileActionsState);
    return useMemo(() => {
        // Create an array for normal toolbar buttons
        const buttonGroups: ActionGroupData[] = [];

        // Create a map used for merging buttons into groups
        const buttonGroupMap: { [groupName: string]: ActionGroupData } = {};

        // Create separate variables for buttons that get special treatment:
        let openParentFolderButtonGroup: Nullable<ActionGroupData> = null;
        let searchButtonGroup: Nullable<ActionGroupData> = null;

        for (const action of fileActions) {
            if (!action.toolbarButton) continue;

            const button = action.toolbarButton;
            let group: ActionGroupData;

            if (button.group) {
                if (buttonGroupMap[button.group]) {
                    // If group exists, append action to it.
                    group = buttonGroupMap[button.group];
                    group.dropdown = group.dropdown || button.dropdown;
                    group.fileActionIds.push(action.id);
                } else {
                    // Otherwise, create a new group.
                    group = {
                        name: button.group,
                        dropdown: button.dropdown,
                        fileActionIds: [action.id],
                    };
                    buttonGroups.push(group);
                    buttonGroupMap[group.name!] = group;
                }
            } else {
                // If button has no group specified, we put it in a standalone group
                group = {
                    name: button.group,
                    dropdown: button.dropdown,
                    fileActionIds: [action.id],
                };

                // Only add it to the normal groups array if it's not a special button
                if (action.id === ChonkyActions.OpenParentFolder.id) {
                    openParentFolderButtonGroup = group;
                } else if (action.id === ChonkyActions.ToggleSearch.id) {
                    searchButtonGroup = group;
                } else {
                    buttonGroups.push(group);
                }
            }
        }

        return { buttonGroups, openParentFolderButtonGroup, searchButtonGroup };
    }, [fileActions]);
};
