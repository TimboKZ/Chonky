import c from 'classnames';
import React, { useContext, useMemo } from 'react';
import { Nullable, Undefinable } from 'tsdef';

import { FileData } from '../../typedef';
import {
    ChonkyDispatchFileActionContext,
    ChonkyFileActionsContext,
    ChonkyFilesContext,
    ChonkyFolderChainContext,
    ChonkySelectionContext,
    ChonkySelectionUtilContext,
} from '../../util/context';
import { ChonkyActions } from '../../util/file-actions';
import { FileHelper } from '../../util/file-helper';
import { SelectionHelper } from '../../util/selection';
import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';

/**
 * Generates folder chain HTML components for the `FileToolbar` component.
 */
export const useFolderChainComponent = () => {
    const folderChain = useContext(ChonkyFolderChainContext);
    const dispatchChonkyAction = useContext(ChonkyDispatchFileActionContext);
    // All hook params should go into `deps`
    const deps = [folderChain, dispatchChonkyAction];
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
                    dispatchChonkyAction({
                        actionName: ChonkyActions.OpenFiles.name,
                        target: file,
                        files: [file],
                    });
                };
            }
            const TagToUse = compProps.onClick ? 'button' : 'div';
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
    }, deps);
    return folderChainComponent;
};

/**
 * Converts an array of file actions into button components.
 */
export const useFileActionButtons = (): {
    openParentFolderButton: Nullable<React.ReactElement>;
    buttonComponents: React.ReactElement[];
} => {
    const files = useContext(ChonkyFilesContext);
    const folderChain = useContext(ChonkyFolderChainContext);
    const selection = useContext(ChonkySelectionContext);
    const selectionUtil = useContext(ChonkySelectionUtilContext);
    const fileActions = useContext(ChonkyFileActionsContext);
    const dispatchChonkyAction = useContext(ChonkyDispatchFileActionContext);

    const parentFolder =
        folderChain && folderChain.length > 1
            ? folderChain[folderChain?.length - 2]
            : null;
    const selectionSize = SelectionHelper.getSelectionSize(files, selection);

    // All hook params should go into `deps`
    const deps = [
        files,
        folderChain,
        selection,
        selectionUtil,
        dispatchChonkyAction,
        parentFolder,
        selectionSize,
    ];
    return useMemo(() => {
        let openParentFolderButton = null;
        const buttonComponents: React.ReactElement[] = [];
        for (let i = 0; i < fileActions.length; ++i) {
            const action = fileActions[i];
            const { toolbarButton } = action;
            if (!toolbarButton) continue;

            let actionSelectionSize: Undefinable<number> = undefined;
            let actionFiles: Undefinable<ReadonlyArray<FileData>> = undefined;
            if (action.requiresSelection) {
                if (action.fileFilter) {
                    actionSelectionSize = SelectionHelper.getSelectionSize(
                        files,
                        selection,
                        action.fileFilter
                    );
                    actionFiles = SelectionHelper.getSelectedFiles(
                        files,
                        selection,
                        action.fileFilter
                    );
                } else {
                    actionSelectionSize = selectionSize;
                    actionFiles = SelectionHelper.getSelectedFiles(files, selection);
                }
            }
            const actionTarget =
                action.requiresParentFolder && parentFolder ? parentFolder : undefined;
            const disabled =
                (action.requiresSelection && actionSelectionSize === 0) ||
                (action.requiresParentFolder && !parentFolder);

            const key = `toolbar-button-${action.name}`;
            const component = (
                <ToolbarButton
                    key={key}
                    text={toolbarButton.name}
                    tooltip={toolbarButton.tooltip}
                    icon={toolbarButton.icon}
                    iconOnly={toolbarButton.iconOnly}
                    onClick={() =>
                        dispatchChonkyAction({
                            actionName: action.name,
                            target: actionTarget,
                            files: actionFiles,
                        })
                    }
                    disabled={disabled}
                />
            );

            if (action.name === ChonkyActions.OpenParentFolder.name) {
                openParentFolderButton = component;
            } else {
                buttonComponents.push(component);
            }
        }

        return { openParentFolderButton, buttonComponents };
    }, deps);
};

export const useToolbarButtonGroups = () => {
    const fileActions = useContext(ChonkyFileActionsContext);
    const deps = [fileActions];
    return useMemo(() => {
        // Create an array for normal toolbar buttons
        const buttonGroups: ToolbarButtonGroup[] = [];

        // Create a map used for merging buttons into groups
        const buttonGroupMap: { [groupName: string]: ToolbarButtonGroup } = {};

        // Create separate variables for buttons that get special treatment:
        let openParentFolderButtonGroup: Nullable<ToolbarButtonGroup> = null;
        let searchButtonGroup: Nullable<ToolbarButtonGroup> = null;

        for (const action of fileActions) {
            if (!action.toolbarButton) continue;

            const button = action.toolbarButton;
            let group: ToolbarButtonGroup;

            if (button.group) {
                if (buttonGroupMap[button.group]) {
                    // If group exists, append action to it.
                    group = buttonGroupMap[button.group];
                    group.dropdown = group.dropdown || button.dropdown;
                    group.fileActions.push(action);
                } else {
                    // Otherwise, create a new group.
                    group = {
                        name: button.group,
                        dropdown: button.dropdown,
                        fileActions: [action],
                    };
                    buttonGroups.push(group);
                    buttonGroupMap[group.name!] = group;
                }
            } else {
                // If button has no group specified, we put it in a standalone group
                group = {
                    name: button.group,
                    dropdown: button.dropdown,
                    fileActions: [action],
                };

                // Only add it to the normal groups array if it's not a special button
                if (action.name === ChonkyActions.OpenParentFolder.name) {
                    openParentFolderButtonGroup = group;
                } else if (action.name === ChonkyActions.Search.name) {
                    searchButtonGroup = group;
                } else {
                    buttonGroups.push(group);
                }
            }
        }

        return { buttonGroups, openParentFolderButtonGroup, searchButtonGroup };
    }, deps);
};
