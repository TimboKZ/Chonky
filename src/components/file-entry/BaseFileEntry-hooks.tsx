import path from 'path';
import React, { useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Nilable, Nullable } from 'tsdef';

import { thumbnailGeneratorState } from '../../recoil/thumbnails.recoil';
import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import { Logger } from '../../util/logger';
import { ChonkyIconFA } from '../external/ChonkyIcon';
import { TextPlaceholder } from '../external/TextPlaceholder';

export const useDndIcon = (
    selected: Nilable<boolean>,
    isDragging: Nilable<boolean>,
    isOver: Nilable<boolean>,
    canDrop: Nilable<boolean>
): Nullable<ChonkyIconName> => {
    if (isOver) {
        return canDrop && !selected
            ? ChonkyIconName.dndCanDrop
            : ChonkyIconName.dndCannotDrop;
    }

    return isDragging ? ChonkyIconName.dndDragging : null;
};

export const useThumbnailUrl = (
    file: Nullable<FileData>,
    setThumbnailUrl: (url: string) => void,
    setThumbnailLoading: (state: boolean) => void
) => {
    const thumbnailGenerator = useRecoilValue(thumbnailGeneratorState);

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
