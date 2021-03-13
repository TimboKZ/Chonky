/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import hotkeys from 'hotkeys-js';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { selectFileActionData } from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';
import { thunkRequestFileAction } from '../../redux/thunks/dispatchers.thunks';

export interface HotkeyListenerProps {
    fileActionId: string;
}

export const HotkeyListener: React.FC<HotkeyListenerProps> = React.memo(props => {
    const { fileActionId } = props;

    const dispatch = useDispatch();
    const fileAction = useParamSelector(selectFileActionData, fileActionId);

    useEffect(() => {
        if (!fileAction || !fileAction.hotkeys || fileAction.hotkeys.length === 0) {
            return;
        }

        const hotkeysStr = fileAction.hotkeys.join(',');
        const hotkeyCallback = (event: KeyboardEvent) => {
            event.preventDefault();
            dispatch(thunkRequestFileAction(fileAction, undefined));
        };
        hotkeys(hotkeysStr, hotkeyCallback);
        return () => hotkeys.unbind(hotkeysStr, hotkeyCallback);
    }, [dispatch, fileAction]);

    return null;
});
