/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import hotkeys from 'hotkeys-js';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { requestFileActionState } from '../../recoil/file-actions.recoil';
import { selectFileActionData} from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';

export interface HotkeyListenerProps {
    fileActionId: string;
}

export const HotkeyListener: React.FC<HotkeyListenerProps> = React.memo((props) => {
    const { fileActionId } = props;

    const fileAction = useParamSelector(selectFileActionData, fileActionId);
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
