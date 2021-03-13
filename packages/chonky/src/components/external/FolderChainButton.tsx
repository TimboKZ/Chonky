/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useContext, useMemo } from 'react';

import { DndEntryState } from '../../types/file-list.types';
import { ChonkyIconName } from '../../types/icons.types';
import { useDndHoverOpen, useFileDrop } from '../../util/dnd';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, important, makeLocalChonkyStyles } from '../../util/styles';
import { useDndIcon } from '../file-list/FileEntry-hooks';
import { FolderChainItem } from './FileNavbar-hooks';
import { ToolbarButton } from './ToolbarButton';

export interface FolderChainButtonProps {
    first: boolean;
    current: boolean;
    item: FolderChainItem;
}

export const FolderChainButton: React.FC<FolderChainButtonProps> = React.memo(
    ({ first, current, item }) => {
        const { file, disabled, onClick } = item;
        const { dndIsOver, dndCanDrop, drop } = useFileDrop({
            file,
            forceDisableDrop: !file || current,
        });
        const dndState = useMemo<DndEntryState>(
            () => ({
                dndIsOver,
                dndCanDrop,
                dndIsDragging: false,
            }),
            [dndCanDrop, dndIsOver]
        );
        useDndHoverOpen(file, dndState);
        const dndIconName = useDndIcon(dndState);
        const ChonkyIcon = useContext(ChonkyIconContext);

        const classes = useStyles(dndState);
        const className = c({
            [classes.baseBreadcrumb]: true,
            [classes.disabledBreadcrumb]: disabled,
            [classes.currentBreadcrumb]: current,
        });
        const text = file ? file.name : 'Loading...';
        const icon =
            first && file?.folderChainIcon === undefined
                ? ChonkyIconName.folder
                : file?.folderChainIcon;

        return (
            <div className={classes.buttonContainer} ref={file ? drop : null}>
                {file && dndIconName && (
                    <div className={classes.dndIndicator}>
                        <ChonkyIcon icon={dndIconName} fixedWidth={true} />
                    </div>
                )}
                <ToolbarButton
                    icon={icon}
                    className={className}
                    text={text}
                    disabled={disabled}
                    onClick={onClick}
                />
            </div>
        );
    }
);

const useStyles = makeLocalChonkyStyles(theme => ({
    buttonContainer: {
        position: 'relative',
    },
    baseBreadcrumb: {
        color: (dndState: DndEntryState) => {
            let color = theme.palette.text.primary;
            if (dndState.dndIsOver) {
                color = dndState.dndCanDrop
                    ? theme.dnd.canDropColor
                    : theme.dnd.cannotDropColor;
            }
            return important(color);
        },
    },
    disabledBreadcrumb: {
        // Constant function here is on purpose. Without the function, the color here
        // does not override the `baseBreadcrumb` color from above.
        color: () => important(theme.palette.text.disabled),
    },
    currentBreadcrumb: {
        textDecoration: important('underline'),
    },
    dndIndicator: {
        color: (dndState: DndEntryState) =>
            dndState.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor,
        backgroundColor: (dndState: DndEntryState) =>
            dndState.dndCanDrop ? theme.dnd.canDropMask : theme.dnd.cannotDropMask,
        lineHeight: `calc(${theme.toolbar.lineHeight} - 6px)`,
        transform: 'translateX(-50%) translateY(-50%)',
        borderRadius: theme.toolbar.buttonRadius,
        height: theme.toolbar.size - 6,
        width: theme.toolbar.size - 6,
        boxSizing: 'border-box',
        position: 'absolute',
        textAlign: 'center',
        left: '50%',
        top: '50%',
        zIndex: 5,
    },
}));
