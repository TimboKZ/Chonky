/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Button from '@material-ui/core/Button';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { fileActionDataState } from '../../recoil/file-actions.recoil';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { c, important, makeChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from './ChonkyIcon';

export interface NewToolbarButtonProps {
    className?: string;
    text: string;
    tooltip?: string;
    active?: boolean;
    icon?: Nullable<ChonkyIconName | string>;
    iconOnly?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export const NewToolbarButton: React.FC<NewToolbarButtonProps> = React.memo((props) => {
    const {
        className: externalClassName,
        text,
        tooltip,
        active,
        icon,
        iconOnly,
        onClick,
        disabled,
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
    activeButton: {},
}));

export interface SmartToolbarButtonProps {
    fileActionId: string;
}

export const NewSmartToolbarButton: React.FC<SmartToolbarButtonProps> = React.memo(
    (props) => {
        const { fileActionId } = props;

        const action = useRecoilValue(fileActionDataState(fileActionId));
        const triggerAction = useFileActionTrigger(fileActionId);
        const { icon, active, disabled } = useFileActionProps(fileActionId);

        if (!action) return null;
        const { toolbarButton: button } = action;
        if (!button) return null;

        return (
            <NewToolbarButton
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
