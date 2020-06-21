import { useContext, useEffect } from 'react';
import { Nilable, Nullable } from 'tsdef';

import { FileData } from '../../types/files.types';
import { ChonkyIconName } from '../../types/icons.types';
import { ChonkyThumbnailGeneratorContext } from '../../util/context';
import { Logger } from '../../util/logger';

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
    const thumbnailGenerator = useContext(ChonkyThumbnailGeneratorContext);

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
