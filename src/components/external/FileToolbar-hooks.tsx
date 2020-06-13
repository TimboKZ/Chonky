import React, { useMemo } from 'react';
import c from 'classnames';

import { FileArray } from '../../typedef';
import { FileHelper } from '../../util/file-helper';
import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';

/**
 * Generates folder chain HTML components for the `FileToolbar` component.
 */
export const useFolderChainComponent = (folderChain: FileArray) => {
    // All hook params should go into `deps`
    const deps = [folderChain];
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
                compProps.onClick = () => null;
                // TODO: Dispatch a real action here
                // compProps.onClick = () => onFileOpen(folder);
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
