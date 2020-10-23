/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Menu from '@material-ui/core/Menu';
import React, { useMemo } from 'react';

import { ToolbarItemGroup } from '../../file-actons/presentation.types';
import { important, makeChonkyStyles } from '../../util/styles';
import { ToolbarButton } from './ToolbarButton';
import { SmartToolbarDropdownButton } from './ToolbarDropdownButton';

export type ToolbarDropdownProps = ToolbarItemGroup;

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = (props) => {
    const { name, fileActionIds } = props;
    const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    const menuItemComponents = useMemo(
        () =>
            fileActionIds.map((id) => (
                <SmartToolbarDropdownButton key={`menu-item-${id}`} fileActionId={id} />
            )),
        [fileActionIds]
    );

    const classes = useStyles();
    return (
        <>
            <ToolbarButton text={name} onClick={handleClick} dropdown={true} />
            <Menu
                autoFocus={true}
                classes={{ list: classes.dropdownList }}
                elevation={2}
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={handleClose}
            >
                {menuItemComponents}
            </Menu>
        </>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    dropdownList: {
        paddingBottom: important(0),
        paddingTop: important(0),
    },
}));
