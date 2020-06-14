import React, { useContext, useMemo } from 'react';
import c from 'classnames';
import { Nullable } from 'tsdef';

import { FileAction, FileArray } from '../../typedef';
import { FileHelper } from '../../util/file-helper';
import { ChonkyActions } from '../../util/file-actions';
import { ChonkyDispatchActionContext } from '../../util/context';
import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';
import { ToolbarButton } from './ToolbarButton';

/**
 * Generates folder chain HTML components for the `FileToolbar` component.
 */
export const useFolderChainComponent = (folderChain: FileArray) => {
    const dispatchChonkyAction = useContext(ChonkyDispatchActionContext);
    // All hook params should go into `deps`
    const deps = [folderChain, dispatchChonkyAction];
    const folderChainComponent = useMemo(() => {
        const comps = new Array(Math.max(0, folderChain.length * 2 - 1));
        for (let i = 0; i < folderChain.length; ++i) {
            const folder = folderChain[i];
            const isLast = i === folderChain.length - 1;
            const j = i * 2;

            const compProps: React.ComponentProps<any> = {
                key: `folder-chain-entry-${j}`,
                className: c({
                    'chonky-folder-chain-entry': true,
                    'chonky-loading': !folder,
                }),
            };
            if (FileHelper.isOpenable(folder) && !isLast) {
                compProps.onClick = () =>
                    dispatchChonkyAction({
                        actionName: ChonkyActions.OpenFiles.name,
                        file: folder,
                    });
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
                        {folder ? folder.name : 'Loading...'}
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
export const useFileActionButtons = (
    fileActions: FileAction[]
): {
    openParentFolderButton: Nullable<React.ReactElement>;
    buttonComponents: React.ReactElement[];
} => {
    const dispatchChonkyAction = useContext(ChonkyDispatchActionContext);
    // All hook params should go into `deps`
    const deps = [fileActions, dispatchChonkyAction];
    return useMemo(() => {
        let openParentFolderButton = null;
        const buttonComponents: React.ReactElement[] = [];
        for (let i = 0; i < fileActions.length; ++i) {
            const { name: actionName, toolbarButton } = fileActions[i];
            if (!toolbarButton) continue;

            const key = `toolbar-button-${actionName}`;
            const component = (
                <ToolbarButton
                    key={key}
                    text={toolbarButton.name}
                    tooltip={toolbarButton.tooltip}
                    icon={toolbarButton.icon}
                    iconOnly={toolbarButton.iconOnly}
                    onClick={() => dispatchChonkyAction({ actionName })}
                />
            );

            if (actionName === ChonkyActions.OpenParentFolder.name) {
                openParentFolderButton = component;
            } else {
                buttonComponents.push(component);
            }
        }

        return { openParentFolderButton, buttonComponents };
    }, deps);
};
