import path from 'path';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Nullable, Undefinable } from 'tsdef';

import { selectThumbnailGenerator } from '../../redux/selectors';
import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import { ColorsDark, ColorsLight, useIconData } from '../../util/file-icon-helper';
import { Logger } from '../../util/logger';
import { c } from '../../util/styles';
import { ChonkyIconFA } from '../external/ChonkyIcon';
import { TextPlaceholder } from '../external/TextPlaceholder';
import { FileEntryProps } from './FileEntry';

export const useDndIcon = (props: FileEntryProps) => {
    let dndIconName: Nullable<ChonkyIconName> = null;
    let dndIconColor: Undefinable<string> = undefined;
    if (props.dndIsOver) {
        const showDropIcon = props.dndCanDrop && !props.selected;
        dndIconName = showDropIcon
            ? ChonkyIconName.dndCanDrop
            : ChonkyIconName.dndCannotDrop;
        dndIconColor = showDropIcon ? 'green' : 'red';
    } else if (props.dndIsDragging) {
        dndIconName = ChonkyIconName.dndDragging;
    }

    return { dndIconName, dndIconColor };
};

export const useModifierIconComponents = (file: Nullable<FileData>) => {
    const modifierIcons: ChonkyIconName[] = useMemo(() => {
        const modifierIcons: ChonkyIconName[] = [];
        if (FileHelper.isHidden(file)) modifierIcons.push(ChonkyIconName.hidden);
        if (FileHelper.isSymlink(file)) modifierIcons.push(ChonkyIconName.symlink);
        if (FileHelper.isEncrypted(file)) modifierIcons.push(ChonkyIconName.lock);
        return modifierIcons;
    }, [file]);
    const modifierIconComponents = useMemo(
        () =>
            modifierIcons.map((icon, index) => (
                <ChonkyIconFA key={`file-modifier-${index}`} icon={icon} />
            )),
        [modifierIcons]
    );
    return modifierIconComponents;
};

export const useFileNameComponent = (file: Nullable<FileData>) => {
    return useMemo(() => {
        if (!file) return <TextPlaceholder minLength={15} maxLength={20} />;

        let name;
        let extension;

        const isDir = FileHelper.isDirectory(file);
        if (isDir) {
            name = file.name;
            extension = '/';
        } else {
            extension = file.ext ?? path.extname(file.name);
            name = file.name.substr(0, file.name.length - extension.length);
        }

        return (
            <>
                {name}
                <span className="chonky-file-entry-description-title-extension">
                    {extension}
                </span>
            </>
        );
    }, [file]);
};

export const useCommonFileEntryComponents = (
    props: FileEntryProps,
    isGridView: boolean,
    useDarkColor: boolean,
    thumbnailLoading: boolean,
    thumbnailUrl: Nullable<string>
) => {
    // Determine file entry class
    const entryClassName = c({
        'chonky-file-entry': true,
        'chonky-file-entry-grid': isGridView,
        'chonky-file-entry-list': !isGridView,
        'chonky-file-entry-directory': FileHelper.isDirectory(props.file),
        'chonky-file-entry-selected': props.selected,
        'chonky-file-entry-focused': props.focused,
        'chonky-file-entry-dragging': props.dndIsDragging,
        'chonky-file-entry-drop-hovered': props.dndIsOver && props.dndCanDrop,
        'chonky-file-entry-has-thumbnail': !!thumbnailUrl,
    });

    // Determine file color and icon properties
    const iconData = useIconData(props.file);
    const fileColor = useDarkColor
        ? ColorsDark[iconData.colorCode]
        : ColorsLight[iconData.colorCode];
    const iconSpin = thumbnailLoading || !props.file;
    const icon = thumbnailLoading ? ChonkyIconName.loading : iconData.icon;

    return {
        entryClassName,
        ...useDndIcon(props),
        fileColor,
        iconSpin,
        icon,
        fileDateString: FileHelper.getReadableDate(props.file),
        fileSizeString: FileHelper.getReadableFileSize(props.file),
        modifierIconComponents: useModifierIconComponents(props.file),
        fileNameComponent: useFileNameComponent(props.file),
    };
};

export const useThumbnailUrl = (file: Nullable<FileData>) => {
    const thumbnailGenerator = useSelector(selectThumbnailGenerator);
    const [thumbnailUrl, setThumbnailUrl] = useState<Nullable<string>>(null);
    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);

    useEffect(() => {
        let loadingCancelled = false;

        if (file) {
            if (thumbnailGenerator) {
                setThumbnailLoading(true);
                Promise.resolve()
                    .then(() => thumbnailGenerator(file))
                    .then((thumbnailUrl: any) => {
                        if (loadingCancelled) return;
                        setThumbnailLoading(false);

                        if (thumbnailUrl && typeof thumbnailUrl === 'string') {
                            setThumbnailUrl(thumbnailUrl);
                        }
                    })
                    .catch((error) => {
                        if (!loadingCancelled) setThumbnailLoading(false);
                        Logger.error(
                            `User-defined "thumbnailGenerator" handler threw an error: ${error.message}`
                        );
                    });
            } else if (file.thumbnailUrl) {
                setThumbnailUrl(file.thumbnailUrl);
            }
        }

        return () => {
            loadingCancelled = true;
        };
    }, [file, setThumbnailUrl, setThumbnailLoading, thumbnailGenerator]);

    return { thumbnailUrl, thumbnailLoading };
};
