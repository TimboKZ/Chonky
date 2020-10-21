/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSetRecoilState } from 'recoil';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { doubleClickDelayState } from '../../recoil/file-actions.recoil';
import { filesState } from '../../recoil/files.recoil';
import { clearSelectionOnOutsideClickState } from '../../recoil/options.recoil';
import { selectionModifiersState, selectionState } from '../../recoil/selection.recoil';
import { thumbnailGeneratorState } from '../../recoil/thumbnails.recoil';
import { thunkUpdateRawFileActions } from '../../redux/file-actions.thunks';
import { thunkUpdateRawFiles, thunkUpdateRawFolderChain } from '../../redux/thunks';
import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { useFileActions } from '../../util/file-actions';
import { useFileBrowserHandle } from '../../util/file-browser-handle';
import { useSelection } from '../../util/selection';
import { useSpecialActionDispatcher } from '../../util/special-actions';

export const ChonkyBusinessLogic = React.memo(
    React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
        const { files, defaultFileViewActionId } = props;

        const {
            files: rawFiles,
            folderChain: rawFolderChain,
            fileActions: rawFileActions,
            disableDefaultFileActions,
        } = props;

        // Instance ID used to distinguish between multiple Chonky instances on the
        // same page const chonkyInstanceId = useStaticValue(shortid.generate);

        //
        // ==== Default values assignment
        const fileActions = props.fileActions ? props.fileActions : [];
        const onFileAction = props.onFileAction ? props.onFileAction : null;
        const thumbnailGenerator = props.thumbnailGenerator
            ? props.thumbnailGenerator
            : null;
        const doubleClickDelay =
            typeof props.doubleClickDelay === 'number' ? props.doubleClickDelay : 300;
        const disableSelection = !!props.disableSelection;
        const enableDragAndDrop = !props.disableDragAndDrop;
        const clearSelectionOnOutsideClick =
            props.clearSelectionOnOutsideClick !== false;

        // ==== Update Redux state
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(
                thunkUpdateRawFileActions(rawFileActions, !!disableDefaultFileActions)
            );
        }, [dispatch, rawFileActions, disableDefaultFileActions]);
        useEffect(() => {
            dispatch(thunkUpdateRawFiles(rawFiles));
        }, [dispatch, rawFiles]);
        useEffect(() => {
            dispatch(thunkUpdateRawFolderChain(rawFolderChain));
        }, [dispatch, rawFolderChain]);

        //
        // ==== File selections
        const { selection, selectionUtilRef, selectionModifiers } = useSelection(
            files,
            disableSelection
        );

        const setRecoilSelectionModifiers = useSetRecoilState(selectionModifiersState);
        useEffect(() => {
            setRecoilSelectionModifiers(selectionModifiers);
        }, [selectionModifiers, setRecoilSelectionModifiers]);

        //
        // ==== File actions - actions that users can customise as they please
        useFileActions(fileActions, onFileAction, defaultFileViewActionId);

        //
        // ==== Special actions - special actions hard-coded into Chonky that users
        //      cannot customize (easily).
        useSpecialActionDispatcher(
            files,
            selection,
            selectionUtilRef.current,
            selectionModifiers
        );

        //
        // ==== Setup the imperative handle for external use
        useFileBrowserHandle(ref, selectionModifiers);

        const setRecoilFiles = useSetRecoilState(filesState);
        useEffect(() => {
            setRecoilFiles(files);
        }, [files, setRecoilFiles]);

        const setRecoilSelection = useSetRecoilState(selectionState);
        useEffect(() => {
            setRecoilSelection(selection);
        }, [selection, setRecoilSelection]);

        const setRecoilThumbnailGenerator = useSetRecoilState(thumbnailGeneratorState);
        useEffect(() => {
            setRecoilThumbnailGenerator(() => thumbnailGenerator);
        }, [thumbnailGenerator, setRecoilThumbnailGenerator]);

        const setRecoilDoubleClickDelay = useSetRecoilState(doubleClickDelayState);
        useEffect(() => {
            setRecoilDoubleClickDelay(doubleClickDelay);
        }, [doubleClickDelay, setRecoilDoubleClickDelay]);

        const setRecoilEnableDragAndDrop = useSetRecoilState(enableDragAndDropState);
        useEffect(() => {
            setRecoilEnableDragAndDrop(enableDragAndDrop);
        }, [enableDragAndDrop, setRecoilEnableDragAndDrop]);

        const setRecoilClearSelectionOnOutsideClick = useSetRecoilState(
            clearSelectionOnOutsideClickState
        );
        useEffect(() => {
            setRecoilClearSelectionOnOutsideClick(clearSelectionOnOutsideClick);
        }, [clearSelectionOnOutsideClick, setRecoilClearSelectionOnOutsideClick]);

        return null;
    })
);
