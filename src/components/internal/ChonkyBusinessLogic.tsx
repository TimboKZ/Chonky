/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { doubleClickDelayState } from '../../recoil/file-actions.recoil';
import { fileEntrySizeState } from '../../recoil/file-list.recoil';
import {
    filesState,
    folderChainState,
    parentFolderState,
} from '../../recoil/files.recoil';
import { selectionModifiersState, selectionState } from '../../recoil/selection.recoil';
import { thumbnailGeneratorState } from '../../recoil/thumbnails.recoil';
import { FileBrowserProps } from '../../types/file-browser.types';
import { useFileActions } from '../../util/file-actions';
import { useFileSearch } from '../../util/search';
import { useSelection } from '../../util/selection';
import { useSpecialActionDispatcher } from '../../util/special-actions';

export const ChonkyBusinessLogic: React.FC<FileBrowserProps> = React.memo((props) => {
    const { files } = props;

    // Instance ID used to distinguish between multiple Chonky instances on the same
    // page
    // const chonkyInstanceId = useStaticValue(shortid.generate);

    //
    // ==== Default values assignment
    const folderChain = props.folderChain ? props.folderChain : null;
    const fileActions = props.fileActions ? props.fileActions : [];
    const onFileAction = props.onFileAction ? props.onFileAction : null;
    const thumbnailGenerator = props.thumbnailGenerator
        ? props.thumbnailGenerator
        : null;
    const doubleClickDelay =
        typeof props.doubleClickDelay === 'number' ? props.doubleClickDelay : 300;
    const disableSelection = !!props.disableSelection;
    const enableDragAndDrop = !!props.enableDragAndDrop;

    //
    // ==== File array sorting | TODO: Come up with an API for customizable sorting...
    const sortedFiles = files;

    //
    // ==== File search (aka file array filtering)
    const filteredFiles = useFileSearch(sortedFiles);

    //
    // ==== File selections
    const { selection, selectionUtilRef, selectionModifiers } = useSelection(
        sortedFiles,
        disableSelection
    );

    const setRecoilSelectionModifiers = useSetRecoilState(selectionModifiersState);
    useEffect(() => {
        setRecoilSelectionModifiers(selectionModifiers);
    }, [selectionModifiers, setRecoilSelectionModifiers]);

    //
    // ==== File actions - actions that users can customise as they please
    useFileActions(fileActions, onFileAction);

    //
    // ==== Special actions - special actions hard-coded into Chonky that users cannot
    //      customize (easily).
    useSpecialActionDispatcher(
        sortedFiles,
        selection,
        selectionUtilRef.current,
        selectionModifiers
    );

    const setRecoilFiles = useSetRecoilState(filesState);
    useEffect(() => {
        setRecoilFiles(filteredFiles);
    }, [filteredFiles, setRecoilFiles]);

    const setFolderChain = useSetRecoilState(folderChainState);
    const setParentFolder = useSetRecoilState(parentFolderState);
    useEffect(() => {
        const parentFolder =
            folderChain && folderChain.length > 1
                ? folderChain[folderChain?.length - 2]
                : null;

        setFolderChain(folderChain);
        setParentFolder(parentFolder);
    }, [folderChain, setFolderChain, setParentFolder]);

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

    const [,] = useRecoilState(fileEntrySizeState);

    const setRecoilEnableDragAndDrop = useSetRecoilState(enableDragAndDropState);
    useEffect(() => {
        setRecoilEnableDragAndDrop(enableDragAndDrop);
    }, [enableDragAndDrop, setRecoilEnableDragAndDrop]);

    return null;
});
