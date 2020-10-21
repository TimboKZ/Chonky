import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { fileActionsState } from '../../recoil/file-actions.recoil';
import { FileAction } from '../../types/file-actions.types';
import { ChonkyActions } from '../../util/file-actions-definitions';
import { ToolbarDropdownProps } from './ToolbarDropdown';

export const isToolbarDropdownData = (
    value: FileAction | ToolbarDropdownProps
): value is ToolbarDropdownProps => !!(value as any).fileActionIds;

/**
 * Hook that returns an array of single file actions or file actions grouped into
 * dropdowns. Note that we should not make any assumptions about toolbar presentation
 * here.
 */
export const useToolbarItems = (): (FileAction | ToolbarDropdownProps)[] => {
    const fileActions = useRecoilValue(fileActionsState);

    return useMemo(() => {
        const excludedActionIds = new Set<string>([
            // TODO: Move decision to exclude actions somewhere else, as users' custom
            //  components might not give these actions special treatment like Chonky
            //  does.
            ChonkyActions.OpenParentFolder.id,
        ]);

        const toolbarItems: (FileAction | ToolbarDropdownProps)[] = [];
        const seenGroups: { [groupName: string]: ToolbarDropdownProps } = {};
        for (const action of fileActions) {
            if (!action.toolbarButton || excludedActionIds.has(action.id)) continue;
            if (action.toolbarButton.group && action.toolbarButton.dropdown) {
                let group: ToolbarDropdownProps = seenGroups[action.toolbarButton.group];
                if (!group) {
                    group = {
                        name: action.toolbarButton.group,
                        fileActionIds: []
                    };
                    toolbarItems.push(group);
                    seenGroups[action.toolbarButton.group] = group;
                }
                group.fileActionIds.push(action.id);
            } else {
                toolbarItems.push(action);
            }
        }
        return toolbarItems;
    }, [fileActions]);
};
