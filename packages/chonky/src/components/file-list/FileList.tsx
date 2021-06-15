import React, { UIEvent, useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';

import { ChonkyActions } from '../../action-definitions/index';
import { selectCurrentFolder, selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewMode } from '../../types/file-view.types';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileDrop } from '../../util/dnd';
import { ChonkyIconContext } from '../../util/icon-helper';
import {
    c, getStripeGradient, makeGlobalChonkyStyles, makeLocalChonkyStyles
} from '../../util/styles';
import { FileListEmpty } from './FileListEmpty';
import { GridContainer } from './GridContainer';
import { ListContainer } from './ListContainer';

export interface FileListProps {
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
}

interface StyleState {
    dndCanDrop: boolean;
    dndIsOverCurrent: boolean;
}

export const FileList: React.FC<FileListProps> = React.memo((props: FileListProps) => {
    const displayFileIds = useSelector(selectors.getDisplayFileIds);
    const viewConfig = useSelector(selectFileViewConfig);

    const currentFolder = useSelector(selectCurrentFolder);
    const { drop, dndCanDrop, dndIsOverCurrent } = useFileDrop({ file: currentFolder });
    const styleState = useMemo<StyleState>(() => ({ dndCanDrop, dndIsOverCurrent }), [dndCanDrop, dndIsOverCurrent]);

    const localClasses = useLocalStyles(styleState);
    const classes = useStyles(viewConfig);
    const { onScroll } = props;

    // In Chonky v0.x, this field was user-configurable. In Chonky v1.x+, we hardcode
    // this to `true` to simplify configuration. Users can just wrap Chonky in their
    // own `div` if they want to have finer control over the height.
    const fillParentContainer = true;

    const listRenderer = useCallback(
        ({ width, height }: { width: number; height: number }) => {
            if (displayFileIds.length === 0) {
                return <FileListEmpty width={width} height={viewConfig.entryHeight} />;
            } else if (viewConfig.mode === FileViewMode.List) {
                return <ListContainer width={width} height={height} />;
            } else {
                return <GridContainer width={width} height={height} />;
            }
        },
        [displayFileIds, viewConfig]
    );

    const ChonkyIcon = useContext(ChonkyIconContext);
    return (
        <div onScroll={onScroll} ref={drop} className={c([classes.fileListWrapper, localClasses.fileListWrapper])} role="list">
            <div className={localClasses.dndDropZone}>
                <div className={localClasses.dndDropZoneIcon}>
                    <ChonkyIcon icon={dndCanDrop ? ChonkyIconName.dndCanDrop : ChonkyIconName.dndCannotDrop} />
                </div>
            </div>
            <AutoSizer disableHeight={!fillParentContainer}>{listRenderer}</AutoSizer>
        </div>
    );
});
FileList.displayName = 'FileList';

const useLocalStyles = makeLocalChonkyStyles(theme => ({
    fileListWrapper: {
        minHeight: ChonkyActions.EnableGridView.fileViewConfig.entryHeight + 2,
        background: (state: StyleState) =>
            state.dndIsOverCurrent && state.dndCanDrop
                ? state.dndCanDrop
                    ? getStripeGradient(theme.dnd.fileListCanDropMaskOne, theme.dnd.fileListCanDropMaskTwo)
                    : getStripeGradient(theme.dnd.fileListCannotDropMaskOne, theme.dnd.fileListCannotDropMaskTwo)
                : 'none',
    },
    dndDropZone: {
        display: (state: StyleState) =>
            // When we cannot drop, we don't show an indicator at all
            state.dndIsOverCurrent && state.dndCanDrop ? 'block' : 'none',
        borderRadius: theme.gridFileEntry.borderRadius,
        pointerEvents: 'none',
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 2,
    },
    dndDropZoneIcon: {
        backgroundColor: (state: StyleState) => (state.dndCanDrop ? theme.dnd.canDropMask : theme.dnd.cannotDropMask),
        color: (state: StyleState) => (state.dndCanDrop ? theme.dnd.canDropColor : theme.dnd.cannotDropColor),
        borderRadius: theme.gridFileEntry.borderRadius,
        transform: 'translateX(-50%) translateY(-50%)',
        position: 'absolute',
        textAlign: 'center',
        lineHeight: '60px',
        fontSize: '2em',
        left: '50%',
        height: 60,
        top: '50%',
        width: 60,
    },
}));

const useStyles = makeGlobalChonkyStyles(() => ({
    fileListWrapper: {
        height: '100%',
        maxHeight: '100%',
    },
}));
