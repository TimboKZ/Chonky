import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Nullable } from 'tsdef';

import { EssentialActions } from '../../action-definitions/essential';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';
import { DndEntryState } from '../../types/file-list.types';
import { FileData } from '../../types/file.types';
import { useFileEntryDnD } from '../../util/dnd';
import { FileHelper } from '../../util/file-helper';
import { makeLocalChonkyStyles } from '../../util/styles';

export interface DnDFileEntryProps {
    file: Nullable<FileData>;
    children: (dndState: DndEntryState) => React.ReactElement;
}

export const DnDFileEntry = React.memo(({ file, children }: DnDFileEntryProps) => {
    const { drop, drag, dndState } = useFileEntryDnD(file);

    const dispatch = useDispatch();
    useEffect(() => {
        let timeout: Nullable<any> = null;
        if (dndState.dndIsOver && FileHelper.isDndOpenable(file)) {
            timeout = setTimeout(
                () =>
                    dispatch(
                        thunkRequestFileAction(EssentialActions.OpenFiles, {
                            targetFile: file,
                            files: [file],
                        })
                    ),
                // TODO: Make this timeout configurable
                1500
            );
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [dispatch, file, dndState.dndIsOver]);

    const classes = useStyles();
    return (
        <div ref={drop} className={classes.fillParent}>
            <div
                ref={FileHelper.isDraggable(file) ? drag : null}
                className={classes.fillParent}
            >
                {children(dndState)}
            </div>
        </div>
    );
});

export const useStyles = makeLocalChonkyStyles((theme) => ({
    fillParent: {
        height: '100%',
    },
}));
