import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { reduxActions } from '../../redux/reducers';

export const useContextMenuHandler = () => {
    const dispatch = useDispatch();
    return useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            dispatch(
                reduxActions.showContextMenu({
                    mouseX: event.clientX - 2,
                    mouseY: event.clientY - 4,
                })
            );
        },
        [dispatch]
    );
};
