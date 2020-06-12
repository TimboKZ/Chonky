import React, { useContext } from 'react';

import { ChonkyFilesContext } from '../../util/context';
import { ErrorMessage } from '../internal/ErrorMessage';
import { Logger } from '../../util/logger';
import { FileBrowser } from './FileBrowser';

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = () => {
    const files = useContext(ChonkyFilesContext);

    if (!files) {
        const errorMessage =
            `${FileList.name} cannot find the "files" array via React context. This ` +
            `happens when ${FileList.name} is placed outside of ${FileBrowser.name}` +
            `component.`;
        Logger.error(errorMessage);
        return <ErrorMessage message={errorMessage} />;
    }

    const components = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const key = file ? file.id : `file-entry-${i}`;
        components.push(
            <div key={key} className="chonky-file-list-entry">
                {file ? file.name : '---'}
            </div>
        );
    }

    return <div className="chonky-file-list">{components}</div>;
};
