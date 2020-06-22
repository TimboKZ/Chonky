/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { validationErrorsState } from '../../recoil/errors.recoil';
import {
    dispatchFileActionState,
    doubleClickDelayState,
    fileActionsState,
} from '../../recoil/file-actions.recoil';
import { fileEntrySizeState } from '../../recoil/file-list.recoil';
import { filesState, folderChainState } from '../../recoil/files.recoil';
import { selectionModifiersState, selectionState } from '../../recoil/selection.recoil';
import { dispatchSpecialActionState } from '../../recoil/special-actions.recoil';
import { thumbnailGeneratorState } from '../../recoil/thumbnails.recoil';
import {
    DefaultFileActions,
    useFileActionDispatcher,
} from '../../util/file-actions-old';
import { useFilteredFiles } from '../../util/search';
import { useSelection } from '../../util/selection';
import { useSpecialActionDispatcher } from '../../util/special-actions';
import {
    useFileActionsValidation,
    useFileArrayValidation,
} from '../../util/validation';
import { FileBrowserProps } from '../external/FileBrowser';

export const ChonkyBusinessLogic: React.FC<FileBrowserProps> = (props) => {
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
    const disableDefaultFileActions = !!props.disableDefaultFileActions;

    //
    // ==== Input props validation
    const {
        cleanFiles,
        cleanFolderChain,
        errorMessages: fileArrayErrors,
    } = useFileArrayValidation(files, folderChain);
    const {
        cleanFileActions,
        errorMessages: fileActionsErrors,
    } = useFileActionsValidation(
        fileActions,
        DefaultFileActions,
        !disableDefaultFileActions
    );
    const validationErrors = [...fileArrayErrors, ...fileActionsErrors];

    const setRecoilValidationErrors = useSetRecoilState(validationErrorsState);
    useEffect(() => {
        setRecoilValidationErrors(validationErrors);
    }, [validationErrors, setRecoilValidationErrors]);

    //
    // ==== File array sorting | TODO: Come up with an API for customizable sorting...
    const sortedFiles = cleanFiles;

    //
    // ==== File search (aka file array filtering)
    // const { searchState, searchContexts } = useSearch();
    const filteredFiles = useFilteredFiles(sortedFiles);

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
    const dispatchFileAction = useFileActionDispatcher(cleanFileActions, onFileAction);

    //
    // ==== Special actions - special actions hard-coded into Chonky that users cannot
    //      customize (easily).
    const dispatchSpecialAction = useSpecialActionDispatcher(
        sortedFiles,
        selection,
        selectionUtilRef.current,
        selectionModifiers,
        dispatchFileAction
    );

    const setRecoilFiles = useSetRecoilState(filesState);
    useEffect(() => {
        setRecoilFiles(filteredFiles);
    }, [filteredFiles, setRecoilFiles]);

    const setRecoilFolderChain = useSetRecoilState(folderChainState);
    useEffect(() => {
        setRecoilFolderChain(cleanFolderChain);
    }, [cleanFolderChain, setRecoilFolderChain]);

    const setRecoilSelection = useSetRecoilState(selectionState);
    useEffect(() => {
        setRecoilSelection(selection);
    }, [selection, setRecoilSelection]);

    const setRecoilFileActions = useSetRecoilState(fileActionsState);
    useEffect(() => {
        setRecoilFileActions(cleanFileActions);
    }, [cleanFileActions, setRecoilFileActions]);

    const setRecoilDispatchFileAction = useSetRecoilState(dispatchFileActionState);
    useEffect(() => {
        setRecoilDispatchFileAction(() => dispatchFileAction);
    }, [dispatchFileAction, setRecoilDispatchFileAction]);

    const setRecoilDispatchSpecialAction = useSetRecoilState(
        dispatchSpecialActionState
    );
    useEffect(() => {
        setRecoilDispatchSpecialAction(() => dispatchSpecialAction);
    }, [dispatchSpecialAction, setRecoilDispatchSpecialAction]);

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
};
