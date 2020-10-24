/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Menu from '@material-ui/core/Menu';
import React, { ReactElement, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { reduxActions } from '../../redux/reducers';
import { selectContextMenuConfig, selectContextMenuItems } from '../../redux/selectors';
import { important, makeChonkyStyles } from '../../util/styles';
import { SmartToolbarDropdownButton } from './ToolbarDropdownButton';

export interface FileContextMenuProps {}

export const FileContextMenu: React.FC<FileContextMenuProps> = (props) => {
    const dispatch = useDispatch();
    const contextMenuConfig = useSelector(selectContextMenuConfig);
    const contextMenuItems = useSelector(selectContextMenuItems);

    const handleClose = useCallback(() => dispatch(reduxActions.hideContextMenu()), [
        dispatch,
    ]);
    const contextMenuItemComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < contextMenuItems.length; ++i) {
            const item = contextMenuItems[i];

            if (typeof item === 'string') {
                components.push(
                    <SmartToolbarDropdownButton
                        key={`context-menu-item-${item}`}
                        fileActionId={item}
                        onClickFollowUp={handleClose}
                    />
                );
            } else {
                item.fileActionIds.map((id) =>
                    components.push(
                        <SmartToolbarDropdownButton
                            key={`context-menu-item-${item.name}-${id}`}
                            fileActionId={id}
                            onClickFollowUp={handleClose}
                        />
                    )
                );
            }
        }
        return components;
    }, [contextMenuItems, handleClose]);

    const anchorPosition = useMemo(
        () =>
            contextMenuConfig
                ? { top: contextMenuConfig.mouseY, left: contextMenuConfig.mouseX }
                : undefined,
        [contextMenuConfig]
    );

    const classes = useStyles();
    return (
        <Menu
            keepMounted
            elevation={2}
            disablePortal
            onClose={handleClose}
            transitionDuration={150}
            open={!!contextMenuConfig}
            anchorPosition={anchorPosition}
            anchorReference="anchorPosition"
            classes={{ list: classes.contextMenuList }}
        >
            {contextMenuItemComponents}
        </Menu>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    contextMenuList: {
        paddingBottom: important(0),
        paddingTop: important(0),
    },
}));
