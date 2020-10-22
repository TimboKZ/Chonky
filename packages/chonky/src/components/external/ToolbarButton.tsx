/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Button from '@material-ui/core/Button';
import React from 'react';
import { Nullable } from 'tsdef';

import { selectFileActionData } from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { c, important, makeChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarButtonProps {
    className?: string;
    text: string;
    tooltip?: string;
    active?: boolean;
    icon?: Nullable<ChonkyIconName | string>;
    iconOnly?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    dropdown?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = React.memo((props) => {
    const {
        className: externalClassName,
        text,
        tooltip,
        active,
        icon,
        iconOnly,
        onClick,
        disabled,
        dropdown,
    } = props;
    const classes = useStyles();

    const iconComponent =
        icon || iconOnly ? (
            <div className={iconOnly ? '' : classes.iconWithText}>
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.fallbackIcon}
                    fixedWidth={true}
                />
            </div>
        ) : null;

    const className = c({
        [externalClassName ?? '']: true,
        [classes.baseButton]: true,
        [classes.iconOnlyButton]: iconOnly,
        [classes.activeButton]: !!active,
    });
    return (
        <Button
            className={className}
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={disabled || !onClick}
        >
            {iconComponent}
            {text && !iconOnly && <span>{text}</span>}
            {dropdown && (
                <div className={classes.iconDropdown}>
                    <ChonkyIconFA
                        icon={icon ? icon : ChonkyIconName.dropdown}
                        fixedWidth={true}
                    />
                </div>
            )}
        </Button>
    );
});

const useStyles = makeChonkyStyles((theme) => ({
    baseButton: {
        fontSize: important(theme.toolbar.fontSize),
        textTransform: important('none'),
        letterSpacing: important(0),
        minWidth: important('auto'),
        lineHeight: theme.toolbar.size,
        padding: important(0),
        height: theme.toolbar.size,
    },
    iconWithText: {
        marginRight: 8,
    },
    iconOnlyButton: {
        width: theme.toolbar.size,
        textAlign: 'center',
    },
    iconDropdown: {
        fontSize: '0.7em',
        marginLeft: 2,
        marginTop: 1,
    },
    activeButton: {
        color: important(theme.colors.textActive),
    },
}));

export interface SmartToolbarButtonProps {
    fileActionId: string;
}

export const SmartToolbarButton: React.FC<SmartToolbarButtonProps> = React.memo(
    (props) => {
        const { fileActionId } = props;

        const action = useParamSelector(selectFileActionData, fileActionId);
        const triggerAction = useFileActionTrigger(fileActionId);
        const { icon, active, disabled } = useFileActionProps(fileActionId);

        if (!action) return null;
        const { button } = action;
        if (!button) return null;

        return (
            <ToolbarButton
                text={button.name}
                tooltip={button.tooltip}
                icon={icon}
                iconOnly={button.iconOnly}
                active={active}
                onClick={triggerAction}
                disabled={disabled}
            />
        );
    }
);
