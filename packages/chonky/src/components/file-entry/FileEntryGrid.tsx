import React from 'react';

import { FileHelper } from '../../util/file-helper';
import { ChonkyIconFA } from '../external/ChonkyIcon';
import { FileThumbnail } from '../internal/FileThumbnail';
import { FileEntryProps } from './FileEntry';
import { useCommonFileEntryComponents, useThumbnailUrl } from './FileEntry-hooks';

export const FileEntryGrid: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, style } = props;

    // Deal with thumbnails
    const { thumbnailUrl, thumbnailLoading } = useThumbnailUrl(file);

    // Get file entry components/properties
    const {
        entryClassName,
        dndIconName,
        dndIconColor,
        fileColor,
        iconSpin,
        icon,
        fileDateString,
        fileSizeString,
        modifierIconComponents,
        fileNameComponent,
    } = useCommonFileEntryComponents(
        props,
        true,
        !!thumbnailUrl,
        thumbnailLoading,
        thumbnailUrl
    );

    return (
        <div className={entryClassName} style={style}>
            <div className="chonky-file-entry-inside">
                {dndIconName && (
                    <div
                        className="chonky-file-entry-dnd-indicator"
                        style={{ color: dndIconColor }}
                    >
                        <ChonkyIconFA icon={dndIconName} />
                    </div>
                )}

                <div className="chonky-file-entry-preview">
                    <div className="chonky-file-details">
                        <div className="chonky-file-details-inside">
                            <div className="chonky-file-details-item">
                                {fileDateString}
                            </div>
                            <div className="chonky-file-details-item">
                                {fileSizeString}
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
                        style={{ backgroundColor: fileColor }}
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
