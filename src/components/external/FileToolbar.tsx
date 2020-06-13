import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ChonkyFolderChainContext } from '../../util/context';
import { useFolderChainComponent } from './FileToolbar-hooks';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = (props) => {
    const folderChain = useContext(ChonkyFolderChainContext);
    const folderChainComp = folderChain ? useFolderChainComponent(folderChain) : null;

    return (
        <div className="chonky-toolbar">
            <div className="chonky-toolbar-side chonky-toolbar-side-left">
                {folderChainComp}
            </div>
            <div className="chonky-toolbar-side chonky-toolbar-side-right">
                Hello World! {JSON.stringify(props)}
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
