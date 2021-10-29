/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Button from '@material-ui/core/Button';
import React, { useContext } from 'react';
import { Nullable } from 'tsdef';

import { selectFileActionData } from '../../redux/selectors';
import { useParamSelector } from '../../redux/store';
import { ChonkyIconName } from '../../types/icons.types';
import { CustomVisibilityState } from '../../types/action.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { useLocalizedFileActionStrings } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, important, makeGlobalChonkyStyles } from '../../util/styles';

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

export const ToolbarButton: React.FC<ToolbarButtonProps> = React.memo(props => {
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
    const ChonkyIcon = useContext(ChonkyIconContext);

    const iconComponent =
        icon || iconOnly ? (
            <div className={iconOnly ? '' : classes.iconWithText}>
                <ChonkyIcon
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
                    <ChonkyIcon
                        icon={icon ? icon : ChonkyIconName.dropdown}
                        fixedWidth={true}
                    />
                </div>
            )}
        </Button>
    );
});

const useStyles = makeGlobalChonkyStyles(theme => ({
    baseButton: {
        fontSize: important(theme.toolbar.fontSize),
        textTransform: important('none'),
        letterSpacing: important(0),
        minWidth: important('auto'),
        lineHeight: theme.toolbar.lineHeight,
        height: theme.toolbar.size,
        paddingBottom: important(0),
        paddingTop: important(0),
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
    props => {
        const { fileActionId } = props;

        const action = useParamSelector(selectFileActionData, fileActionId);
        const triggerAction = useFileActionTrigger(fileActionId);
        const { icon, active, disabled } = useFileActionProps(fileActionId);
        const { buttonName, buttonTooltip } = useLocalizedFileActionStrings(action);

        if (!action) return null;
        const { button } = action;
        if (!button) return null;
        if (action.customVisibility !== undefined && action.customVisibility() === CustomVisibilityState.Hidden) return null;

        return (
            <ToolbarButton
                text={buttonName}
                tooltip={buttonTooltip}
                icon={icon}
                iconOnly={button.iconOnly}
                active={active}
                onClick={triggerAction}
                disabled={disabled}
            />
        );
    }
);
