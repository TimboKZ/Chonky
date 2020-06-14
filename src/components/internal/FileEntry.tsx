import React, { useState } from 'react';
import { Nullable } from 'tsdef';
import { useDrag } from 'react-dnd';
import c from 'classnames';

import { FileData } from '../../typedef';
import { useThumbnailUrl } from '../../util/file-helper';
import { ColorsDark, ColorsLight, useIconData } from '../../util/icon-helper';
import { ChonkyIconFA, ChonkyIconName } from '../external/ChonkyIcon';
import { FileThumbnail } from './FileThumbnail';

export interface FileEntryProps {
    file: Nullable<FileData>;
    style?: React.CSSProperties;
}

export const FileEntry: React.FC<FileEntryProps> = (props) => {
    const { file, style } = props;

    const [{ isDragging }, drag] = useDrag({
        item: { type: 'chonky-file-entry' },
        canDrag: !!file && file.droppable !== true,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [thumbnailUrl, setThumbnailUrl] = useState<Nullable<string>>(null);
    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
    useThumbnailUrl(file, setThumbnailUrl, setThumbnailLoading);

    const iconData = useIconData(file);
    const backgroundColor = thumbnailUrl
        ? ColorsDark[iconData.colorCode]
        : ColorsLight[iconData.colorCode];

    const className = c({
        'chonky-file-entry': true,
        'chonky-file-entry-dragging': isDragging,
    });
    return (
        <div ref={drag} className={className} style={style}>
            <div className="chonky-file-entry-preview">
                <div className="chonky-file-icon">
                    <div className="chonky-file-icon-inside">
                        <ChonkyIconFA
                            icon={
                                thumbnailLoading
                                    ? ChonkyIconName.loading
                                    : iconData.icon
                            }
                            spin={thumbnailLoading || !file}
                        />
                    </div>
                </div>
                <FileThumbnail thumbnailUrl={thumbnailUrl} />
                <div className="chonky-file-background" style={{ backgroundColor }} />
            </div>
            <div className="chonky-file-entry-description">
                {file ? file.name : '---'}
            </div>
        </div>
    );
};
