/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { fileActionDataState } from '../../recoil/file-actions.recoil';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { c, important, makeChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarDropdownButtonProps {
    text: string;
    active?: boolean;
    icon?: Nullable<ChonkyIconName | string>;
    onClick?: () => void;
    disabled?: boolean;
}

export const ToolbarDropdownButton: React.FC<ToolbarDropdownButtonProps> = (props) => {
    const { text, active, icon, onClick, disabled } = props;
    const classes = useStyles();

    const className = c({
        [classes.baseButton]: true,
        [classes.activeButton]: active,
    });
    return (
        <MenuItem className={className} onClick={onClick} disabled={disabled}>
            {icon && (
                <ListItemIcon className={classes.icon}>
                    <ChonkyIconFA icon={icon} fixedWidth={true} />
                </ListItemIcon>
            )}
            <ListItemText primaryTypographyProps={{ className: classes.text }}>
                {text}
            </ListItemText>
        </MenuItem>
    );
};

const useStyles = makeChonkyStyles((theme) => ({
    baseButton: {
        minWidth: important('auto'),
        lineHeight: theme.toolbar.size,
        padding: important(20),
        height: theme.toolbar.size,
    },
    icon: {
        fontSize: important(theme.toolbar.fontSize),
        minWidth: important('auto'),
        color: important('inherit'),
        marginRight: 8,
    },
    text: {
        fontSize: important(theme.toolbar.fontSize),
    },
    activeButton: {
        color: important(theme.colors.textActive),
    },
}));

export interface SmartToolbarDropdownButtonProps {
    fileActionId: string;
    onClick?: () => void;
}

export const SmartToolbarDropdownButton: React.FC<SmartToolbarDropdownButtonProps> = (
    props
) => {
    const { fileActionId, onClick } = props;

    const action = useRecoilValue(fileActionDataState(fileActionId));
    const triggerAction = useFileActionTrigger(fileActionId);
    const { icon, active, disabled } = useFileActionProps(fileActionId);

    // Combine external click handler with internal one
    const handleClick = useCallback(() => {
        triggerAction();
        if (onClick) onClick();
    }, [onClick, triggerAction]);

    if (!action) return null;
    const { toolbarButton: button } = action;
    if (!button) return null;

    return (
        <ToolbarDropdownButton
            text={button.name}
            icon={icon}
            onClick={handleClick}
            active={active}
            disabled={disabled}
        />
    );
};
