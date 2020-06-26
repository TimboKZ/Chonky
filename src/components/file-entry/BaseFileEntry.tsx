import c from 'classnames';
import React, { useState } from 'react';
import { Nullable } from 'tsdef';

import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import { ColorsDark, ColorsLight, useIconData } from '../../util/file-icon-helper';
import { ChonkyIconFA } from '../external/ChonkyIcon';
import { FileThumbnail } from '../internal/FileThumbnail';
import {
    useDndIcon,
    useFileNameComponent,
    useModifierIconComponents,
    useThumbnailUrl,
} from './BaseFileEntry-hooks';
import { DnDProps } from './DnDFileEntry';

export interface FileEntryProps extends DnDProps {
    file: Nullable<FileData>;

    displayIndex: number; // Index at which this file appears in the file list

    selected: boolean;

    style?: React.CSSProperties;
}

export const BaseFileEntry: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, selected, style, dndIsDragging, dndIsOver, dndCanDrop } = props;

    // Deal with thumbnails
    const [thumbnailUrl, setThumbnailUrl] = useState<Nullable<string>>(null);
    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
    useThumbnailUrl(file, setThumbnailUrl, setThumbnailLoading);

    // Deal with file icon
    const iconData = useIconData(file);
    const backgroundColor = thumbnailUrl
        ? ColorsDark[iconData.colorCode]
        : ColorsLight[iconData.colorCode];
    const iconSpin = thumbnailLoading || !file;
    const icon = thumbnailLoading ? ChonkyIconName.loading : iconData.icon;

    // Deal with drag & drop
    const dndIcon = useDndIcon(selected, dndIsDragging, dndIsOver, dndCanDrop);

    // Determine modifier icons
    const modifierIconComponents = useModifierIconComponents(file);

    // Determine file name
    const fileNameComponent = useFileNameComponent(file);

    // Render the component
    const className = c({
        'chonky-file-entry': true,
        'chonky-file-entry-directory': FileHelper.isDirectory(file),
        'chonky-file-entry-selected': selected,
        'chonky-file-entry-dragging': dndIsDragging,
        'chonky-file-entry-drop-hovered': dndIsOver && dndCanDrop,
    });
    return (
        <div className={className} style={style}>
            <div className="chonky-file-entry-inside">
                {dndIcon && (
                    <div className="chonky-file-entry-dnd-indicator">
                        <ChonkyIconFA icon={dndIcon} />
                    </div>
                )}

                <div className="chonky-file-entry-preview">
                    <div className="chonky-file-details">
                        <div className="chonky-file-details-inside">
                            <div className="chonky-file-details-item">
                                {FileHelper.getReadableDate(file)}
                            </div>
                            <div className="chonky-file-details-item">
                                {FileHelper.getReadableFileSize(file)}
                            </div>
                        </div>
                    </div>

                    <div className="chonky-file-icon">
                        {FileHelper.isDirectory(file) && (
                            <div className="chonky-file-icon-children-count">
                                {FileHelper.getChildrenCount(file)}
                            </div>
                        )}
                        <div className="chonky-file-icon-inside">
                            <ChonkyIconFA icon={icon} spin={iconSpin} />
                        </div>
                    </div>

                    <div className="chonky-file-selection" />

                    <FileThumbnail thumbnailUrl={thumbnailUrl} />

                    <div
                        className="chonky-file-background"
                        style={{ backgroundColor }}
                    />
                </div>

                <div className="chonky-file-entry-description">
                    <div
                        className="chonky-file-entry-description-title"
                        title={file ? file.name : undefined}
                    >
                        {modifierIconComponents.length > 0 && (
                            <span className="chonky-file-entry-description-title-modifiers">
                                {modifierIconComponents}
                            </span>
                        )}
                        {fileNameComponent}
                    </div>
                </div>
            </div>
        </div>
    );
});
