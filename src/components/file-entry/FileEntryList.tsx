import React from 'react';

import { ChonkyIconFA } from '../external/ChonkyIcon';
import { TextPlaceholder } from '../external/TextPlaceholder';
import { FileEntryProps } from './FileEntry';
import { useCommonFileEntryComponents } from './FileEntry-hooks';

export const FileEntryList: React.FC<FileEntryProps> = React.memo((props) => {
    const { file, style } = props;

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
    } = useCommonFileEntryComponents(props, false, true, false, null);

    return (
        <div className={entryClassName} style={{ ...style, color: dndIconColor }}>
            <div
                className="chonky-file-entry-column chonky-file-entry-column-icon"
                style={{ color: dndIconName ? dndIconColor : fileColor }}
            >
                <div className="chonky-file-entry-column-inside">
                    {dndIconName ? (
                        <ChonkyIconFA
                            icon={dndIconName}
                            spin={false}
                            fixedWidth={true}
                        />
                    ) : (
                        <ChonkyIconFA icon={icon} spin={iconSpin} fixedWidth={true} />
                    )}
                </div>
            </div>
            <div className="chonky-file-entry-column chonky-file-entry-column-name">
                <div
                    className="chonky-file-entry-column-inside"
                    title={file ? file.name : undefined}
                >
                    {modifierIconComponents.length > 0 && (
                        <span className="chonky-file-entry-column-name-modifiers">
                            {modifierIconComponents}
                        </span>
                    )}
                    {fileNameComponent}
                </div>
            </div>
            <div className="chonky-file-entry-column chonky-file-entry-column-size">
                <div className="chonky-file-entry-column-inside">
                    {file ? (
                        fileSizeString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={5} maxLength={15} />
                    )}
                </div>
            </div>
            <div className="chonky-file-entry-column chonky-file-entry-column-date">
                <div className="chonky-file-entry-column-inside">
                    {file ? (
                        fileDateString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={10} maxLength={20} />
                    )}
                </div>
            </div>
            <div className="chonky-file-entry-outline"></div>
            <div className="chonky-file-entry-selection"></div>
        </div>
    );
});
