import path from 'path';
import React, {
    HTMLProps,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nullable, Undefinable } from 'tsdef';

import { ChonkyActions } from '../../action-definitions/index';
import { selectThumbnailGenerator } from '../../redux/selectors';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { DndEntryState } from '../../types/file-list.types';
import { FileData } from '../../types/file.types';
import { ChonkyIconName } from '../../types/icons.types';
import { FileHelper } from '../../util/file-helper';
import {
    ChonkyIconContext,
    ColorsDark,
    ColorsLight,
    useIconData,
} from '../../util/icon-helper';
import { Logger } from '../../util/logger';
import { TextPlaceholder } from '../external/TextPlaceholder';
import { KeyboardClickEvent, MouseClickEvent } from '../internal/ClickableWrapper';
import { FileEntryState } from './GridEntryPreview';

export const useFileEntryHtmlProps = (
    file: Nullable<FileData>
): HTMLProps<HTMLDivElement> => {
    return useMemo(() => {
        const dataProps: { [prop: string]: Undefinable<string> } = {
            'data-test-id': 'file-entry',
            'data-chonky-file-id': file ? file.id : undefined,
        };

        return {
            role: 'listitem',
            ...dataProps,
        };
    }, [file]);
};

export const useFileEntryState = (
    file: Nullable<FileData>,
    selected: boolean,
    focused: boolean
) => {
    const iconData = useIconData(file);
    const { thumbnailUrl, thumbnailLoading } = useThumbnailUrl(file);

    return useMemo<FileEntryState>(() => {
        const fileColor = thumbnailUrl
            ? ColorsDark[iconData.colorCode]
            : ColorsLight[iconData.colorCode];
        const iconSpin = thumbnailLoading || !file;
        const icon = thumbnailLoading ? ChonkyIconName.loading : iconData.icon;

        return {
            childrenCount: FileHelper.getChildrenCount(file),
            icon: file && file.icon !== undefined ? file.icon : icon,
            iconSpin: iconSpin,
            thumbnailUrl: thumbnailUrl,
            color: file && file.color !== undefined ? file.color : fileColor,
            selected: selected,
            focused: !!focused,
        };
    }, [file, focused, iconData, selected, thumbnailLoading, thumbnailUrl]);
};

export const useDndIcon = (dndState: DndEntryState) => {
    let dndIconName: Nullable<ChonkyIconName> = null;
    if (dndState.dndIsOver) {
        const showDropIcon = dndState.dndCanDrop;
        dndIconName = showDropIcon
            ? ChonkyIconName.dndCanDrop
            : ChonkyIconName.dndCannotDrop;
    } else if (dndState.dndIsDragging) {
        dndIconName = ChonkyIconName.dndDragging;
    }

    return dndIconName;
};

export const useModifierIconComponents = (file: Nullable<FileData>) => {
    const modifierIcons: ChonkyIconName[] = useMemo(() => {
        const modifierIcons: ChonkyIconName[] = [];
        if (FileHelper.isHidden(file)) modifierIcons.push(ChonkyIconName.hidden);
        if (FileHelper.isSymlink(file)) modifierIcons.push(ChonkyIconName.symlink);
        if (FileHelper.isEncrypted(file)) modifierIcons.push(ChonkyIconName.lock);
        return modifierIcons;
    }, [file]);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const modifierIconComponents = useMemo(
        () =>
            modifierIcons.map((icon, index) => (
                <ChonkyIcon key={`file-modifier-${index}`} icon={icon} />
            )),
        // For some reason ESLint marks `ChonkyIcon` as an unnecessary dependency,
        // but we expect it can change at runtime so we disable the check.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ChonkyIcon, modifierIcons]
    );
    return modifierIconComponents;
};

export const useFileNameComponent = (file: Nullable<FileData>) => {
    return useMemo(() => {
        if (!file) return <TextPlaceholder minLength={15} maxLength={20} />;

        let name;
        let extension = null;

        const isDir = FileHelper.isDirectory(file);
        if (isDir) {
            name = file.name;
        } else {
            extension = file.ext ?? path.extname(file.name);
            name = file.name.substr(0, file.name.length - extension.length);
        }

        return (
            <>
                {name}
                {extension && (
                    <span className="chonky-file-entry-description-title-extension">
                        {extension}
                    </span>
                )}
            </>
        );
    }, [file]);
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

export const useFileClickHandlers = (
    file: Nullable<FileData>,
    displayIndex: number
) => {
    const dispatch = useDispatch();

    // Prepare base handlers
    const onMouseClick = useCallback(
        (event: MouseClickEvent, clickType: 'single' | 'double') => {
            if (!file) return;

            dispatch(
                thunkRequestFileAction(ChonkyActions.MouseClickFile, {
                    clickType,
                    file,
                    fileDisplayIndex: displayIndex,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                })
            );
        },
        [dispatch, file, displayIndex]
    );
    const onKeyboardClick = useCallback(
        (event: KeyboardClickEvent) => {
            if (!file) return;

            dispatch(
                thunkRequestFileAction(ChonkyActions.KeyboardClickFile, {
                    file,
                    fileDisplayIndex: displayIndex,
                    enterKey: event.enterKey,
                    spaceKey: event.spaceKey,
                    altKey: event.altKey,
                    ctrlKey: event.ctrlKey,
                    shiftKey: event.shiftKey,
                })
            );
        },
        [dispatch, file, displayIndex]
    );

    // Prepare single/double click handlers
    const onSingleClick = useCallback(
        (event: MouseClickEvent) => onMouseClick(event, 'single'),
        [onMouseClick]
    );
    const onDoubleClick = useCallback(
        (event: MouseClickEvent) => onMouseClick(event, 'double'),
        [onMouseClick]
    );

    return {
        onSingleClick,
        onDoubleClick,
        onKeyboardClick,
    };
};
