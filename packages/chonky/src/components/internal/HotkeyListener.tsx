/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import hotkeys from 'hotkeys-js';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectFileActionData, selectFileActionRequester } from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';

export interface HotkeyListenerProps {
    fileActionId: string;
}

export const HotkeyListener: React.FC<HotkeyListenerProps> = React.memo((props) => {
    const { fileActionId } = props;

    const fileAction = useParamSelector(selectFileActionData, fileActionId);
    const requestFileAction = useSelector(selectFileActionRequester);

    useEffect(() => {
        if (!fileAction || !fileAction.hotkeys || fileAction.hotkeys.length === 0) {
            return;
        }

        const hotkeysStr = fileAction.hotkeys.join(',');
        const hotkeyCallback = (event: KeyboardEvent) => {
            event.preventDefault();
            requestFileAction(fileAction.id);
        };
        hotkeys(hotkeysStr, hotkeyCallback);
        return () => hotkeys.unbind(hotkeysStr, hotkeyCallback);
    }, [fileAction, requestFileAction]);

    return null;
});
