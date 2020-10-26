/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useCallback } from 'react';
import { Nullable } from 'tsdef';

import { selectFileActionData } from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { c, important, makeGlobalChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarDropdownButtonProps {
    text: string;
    active?: boolean;
    icon?: Nullable<ChonkyIconName | string>;
    onClick?: () => void;
    disabled?: boolean;
}

export const ToolbarDropdownButton = React.forwardRef(
    (props: ToolbarDropdownButtonProps, ref: React.Ref<HTMLLIElement>) => {
        const { text, active, icon, onClick, disabled } = props;
        const classes = useStyles();

        const className = c({
            [classes.baseButton]: true,
            [classes.activeButton]: active,
        });
        return (
            <MenuItem
                ref={ref}
                className={className}
                onClick={onClick}
                disabled={disabled}
            >
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
    }
);

const useStyles = makeGlobalChonkyStyles((theme) => ({
    baseButton: {
        minWidth: important('auto'),
        lineHeight: theme.toolbar.lineHeight,
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
    onClickFollowUp?: () => void;
}

export const SmartToolbarDropdownButton = React.forwardRef(
    (props: SmartToolbarDropdownButtonProps, ref: React.Ref<HTMLLIElement>) => {
        const { fileActionId, onClickFollowUp } = props;

        const action = useParamSelector(selectFileActionData, fileActionId);
        const triggerAction = useFileActionTrigger(fileActionId);
        const { icon, active, disabled } = useFileActionProps(fileActionId);

        // Combine external click handler with internal one
        const handleClick = useCallback(() => {
            triggerAction();
            if (onClickFollowUp) onClickFollowUp();
        }, [onClickFollowUp, triggerAction]);

        if (!action) return null;
        const { button } = action;
        if (!button) return null;

        return (
            <ToolbarDropdownButton
                ref={ref}
                text={button.name}
                icon={icon}
                onClick={handleClick}
                active={active}
                disabled={disabled}
            />
        );
    }
);
