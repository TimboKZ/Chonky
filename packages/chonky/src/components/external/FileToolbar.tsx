import PropTypes from 'prop-types';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { searchBarEnabledState } from '../../recoil/search.recoil';
import { useActionGroups, useFolderChainComponent } from './FileToolbar-hooks';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const searchBarEnabled = useRecoilValue(searchBarEnabledState);

    const folderChainComp = useFolderChainComponent();
    const {
        buttonGroups,
        openParentFolderButtonGroup,
        searchButtonGroup,
    } = useActionGroups();

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
