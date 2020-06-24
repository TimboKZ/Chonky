/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import hotkeys from 'hotkeys-js';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import {
    fileActionDataState,
    requestFileActionState,
} from '../../recoil/file-actions.recoil';

export interface HotkeyListenerProps {
    fileActionId: string;
}

export const HotkeyListener: React.FC<HotkeyListenerProps> = React.memo((props) => {
    const { fileActionId } = props;

    const fileAction = useRecoilValue(fileActionDataState(fileActionId));
    const requestFileAction = useRecoilValue(requestFileActionState);

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
