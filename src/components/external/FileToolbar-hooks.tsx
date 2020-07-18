import c from 'classnames';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { fileActionsState } from '../../recoil/file-actions.recoil';
import { folderChainState } from '../../recoil/files.recoil';
import { dispatchSpecialActionState } from '../../recoil/special-actions.recoil';
import { ActionGroupData } from '../../types/file-actions.types';
import { ChonkyIconName } from '../../types/icons.types';
import { SpecialAction } from '../../types/special-actions.types';
import { ChonkyActions } from '../../util/file-actions-definitions';
import { FileHelper } from '../../util/file-helper';
import { ChonkyIconFA } from './ChonkyIcon';

/**
 * Generates folder chain HTML components for the `FileToolbar` component.
 */
export const useFolderChainComponent = () => {
    const folderChain = useRecoilValue(folderChainState);
    const dispatchSpecialAction = useRecoilValue(dispatchSpecialActionState);
    const folderChainComponent = useMemo(() => {
        if (!folderChain) return folderChain;

        const comps = new Array(Math.max(0, folderChain.length * 2 - 1));
        for (let i = 0; i < folderChain.length; ++i) {
            const file = folderChain[i];
            const isLast = i === folderChain.length - 1;
            const j = i * 2;

            const compProps: React.ComponentProps<any> = {
                key: `folder-chain-entry-${j}`,
                className: c({
                    'chonky-folder-chain-entry': true,
                    'chonky-loading': !file,
                }),
            };
            if (FileHelper.isOpenable(file) && !isLast) {
                compProps.onClick = () => {
                    dispatchSpecialAction({
                        actionId: SpecialAction.OpenFolderChainFolder,
                        file: file,
                    });
                };
            }
            const TagToUse = compProps.onClick ? 'button' : 'div';
            if (TagToUse === 'button') compProps.type = 'button';
            comps[j] = (
                <TagToUse {...compProps}>
                    {/* eslint-disable-next-line */}
                    {j === 0 && (
                        <span className="chonky-text-subtle-dark">
                            <ChonkyIconFA icon={ChonkyIconName.folder} />
                            &nbsp;&nbsp;
                        </span>
                    )}
                    <span className="chonky-folder-chain-entry-name">
                        {file ? file.name : 'Loading...'}
                    </span>
                </TagToUse>
            );
            if (!isLast) {
                comps[j + 1] = (
                    <div
                        key={`folder-chain-separator-${j}`}
                        className="chonky-folder-chain-separator"
                    >
                        <ChonkyIconFA
                            icon={ChonkyIconName.folderChainSeparator}
                            size="xs"
                        />
                    </div>
                );
            }
        }
        return <div className="chonky-folder-chain">{comps}</div>;
    }, [folderChain, dispatchSpecialAction]);
    return folderChainComponent;
};

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
