import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import {
    ChonkyFileActionsContext,
    ChonkyFolderChainContext,
} from '../../util/context';
import { useFileActionButtons, useFolderChainComponent } from './FileToolbar-hooks';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = (props) => {
    const folderChain = useContext(ChonkyFolderChainContext);
    const fileActions = useContext(ChonkyFileActionsContext);

    const folderChainComp = folderChain ? useFolderChainComponent(folderChain) : null;
    const { openParentFolderButton, buttonComponents } = useFileActionButtons(
        fileActions
    );

    return (
        <div className="chonky-toolbar">
            <div className="chonky-toolbar-side chonky-toolbar-side-left">
                {openParentFolderButton}
                {folderChainComp}
            </div>
            <div className="chonky-toolbar-side chonky-toolbar-side-right">
                {buttonComponents}
            </div>
        </div>
    );
};

FileToolbar.propTypes = {
    // @ts-ignore
    folderChain: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.oneOf([null]).isRequired,
        ])
    ),
};
