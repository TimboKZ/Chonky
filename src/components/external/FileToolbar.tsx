import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { useFolderChainComponent, useToolbarButtonGroups } from './FileToolbar-hooks';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import { ChonkySearchBarEnabledContext } from '../../util/context';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const searchBarEnabled = useContext(ChonkySearchBarEnabledContext);

    const folderChainComp = useFolderChainComponent();
    const {
        buttonGroups,
        openParentFolderButtonGroup,
        searchButtonGroup,
    } = useToolbarButtonGroups();

    return (
        <div className="chonky-toolbar">
            <div className="chonky-toolbar-side chonky-toolbar-side-left">
                {openParentFolderButtonGroup && (
                    <ToolbarButtonGroup group={openParentFolderButtonGroup} />
                )}
                {folderChainComp}
            </div>
            <div className="chonky-toolbar-side chonky-toolbar-side-right">
                {buttonGroups.map((group, index) => (
                    <ToolbarButtonGroup
                        key={`button-group-${group.name ? group.name : index}`}
                        group={group}
                    />
                ))}
                {searchBarEnabled && searchButtonGroup && (
                    <ToolbarButtonGroup group={searchButtonGroup} />
                )}
            </div>
        </div>
    );
});

FileToolbar.propTypes = {
    // @ts-ignore
    folderChain: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.oneOf([null]).isRequired,
        ])
    ),
};
