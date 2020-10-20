/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Box from '@material-ui/core/Box';
import React, { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { enableDragAndDropState } from '../../recoil/drag-and-drop.recoil';
import { fileActionsState } from '../../recoil/file-actions.recoil';
import { clearSelectionOnOutsideClickState } from '../../recoil/options.recoil';
import { selectionModifiersState } from '../../recoil/selection.recoil';
import { ErrorMessageData } from '../../types/validation.types';
import { useClickListener } from '../../util/hooks-helpers';
import { makeChonkyStyles } from '../../util/styles';
import { DnDFileListDragLayer } from '../file-entry/DnDFileListDragLayer';
import { ErrorMessage } from './ErrorMessage';
import { HotkeyListener } from './HotkeyListener';

export interface ChonkyPresentationLayerProps {
    validationErrors: ErrorMessageData[];
}

export const ChonkyPresentationLayer: React.FC<ChonkyPresentationLayerProps> = (
    props
) => {
    const { validationErrors, children } = props;

    const fileActions = useRecoilValue(fileActionsState);
    const selectionModifiers = useRecoilValue(selectionModifiersState);
    const enableDragAndDrop = useRecoilValue(enableDragAndDropState);
    const clearSelectionOnOutsideClick = useRecoilValue(
        clearSelectionOnOutsideClickState
    );

    // Deal with clicks outside of Chonky
    const onOutsideClick = useCallback(
        (event, targetIsAButton) => {
            // We only clear out the selection on outside click if the click target was
            // not a button. We don't want to clear out the selection when a button is
            // clicked because Chonky users might want to trigger some
            // selection-related action on that button click.
            if (!clearSelectionOnOutsideClick || targetIsAButton) return;
            selectionModifiers.clearSelection();
        },
        [selectionModifiers, clearSelectionOnOutsideClick]
    );
    const chonkyRootRef = useClickListener({ onOutsideClick });

    // Generate necessary components
    const hotkeyListenerComponents = useMemo(
        () =>
            fileActions.map((action) => (
                <HotkeyListener
                    key={`file-action-listener-${action.id}`}
                    fileActionId={action.id}
                />
            )),
        [fileActions]
    );
    const validationErrorComponents = useMemo(
        () =>
            validationErrors.map((data, index) => (
                <ErrorMessage
                    key={`error-message-${index}`}
                    message={data.message}
                    bullets={data.bullets}
                />
            )),
        [validationErrors]
    );

    const customProps = {
        // We specify `ref` prop outside due to Material UI bug:
        // @see https://github.com/mui-org/material-ui/pull/22925
        ref: chonkyRootRef,
    };

    const classes = useStyles();

    return (
        <Box className={classes.chonkyRoot} {...customProps}>
            {enableDragAndDrop && <DnDFileListDragLayer />}
            {hotkeyListenerComponents}
            {validationErrorComponents}
            {children ? children : null}
        </Box>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    chonkyRoot: {
        backgroundColor: theme.colors.bgPrimary,
        padding: theme.margins.rootLayoutMargin,
        fontSize: theme.fontSizes.rootPrimary,
        color: theme.colors.textPrimary,
        touchAction: 'manipulation', // Disabling zoom on double tap
        fontFamily: 'sans-serif',
        border: theme.rootBorder,
        flexDirection: 'column',
        boxSizing: 'border-box',
        textAlign: 'left',
        borderRadius: 4,
        display: 'flex',
        height: '100%',

        // Disabling select
        webkitTouchCallout: 'none',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
}));
