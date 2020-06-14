import { useContext, useEffect } from 'react';
import { Nullable } from 'tsdef';

import { FileData } from '../typedef';
import { ChonkyThumbnailGeneratorContext } from './context';
import { Logger } from './logger';

export class FileHelper {
    public static isOpenable(file: Nullable<FileData>): file is FileData {
        // Openable by default
        return !!file && file.openable !== false;
    }
}

export const useThumbnailUrl = (
    file: Nullable<FileData>,
    setThumbnailUrl: (url: string) => void,
    setThumbnailLoading: (state: boolean) => void
) => {
    const thumbnailGenerator = useContext(ChonkyThumbnailGeneratorContext);

    const deps = [file, thumbnailGenerator, setThumbnailUrl];
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
    }, deps);
};
