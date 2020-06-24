import c from 'classnames';
import React from 'react';
import { useRecoilValue } from 'recoil';

import { fileActionDataState } from '../../recoil/file-actions.recoil';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionModifiers, useFileActionTrigger } from '../../util/file-actions';
import { ChonkyIconFA } from './ChonkyIcon';

export interface ToolbarButtonProps {
    text: string;
    tooltip?: string;
    active?: boolean;
    icon?: ChonkyIconName | string;
    iconOnly?: boolean;
    iconOnRight?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = React.memo((props) => {
    const {
        text,
        tooltip,
        active,
        icon,
        iconOnly,
        iconOnRight,
        onClick,
        disabled,
    } = props;

    const iconComponent =
        icon || iconOnly ? (
            <div className="chonky-toolbar-button-icon">
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.fallbackIcon}
                    fixedWidth={true}
                />
            </div>
        ) : null;

    const className = c({
        'chonky-toolbar-button': true,
        'chonky-active': !!active,
    });
    return (
        <button
            className={className}
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={!onClick || disabled}
        >
            {!iconOnRight && iconComponent}
            {text && !iconOnly && (
                <div className="chonky-toolbar-button-text">{text}</div>
            )}
            {iconOnRight && iconComponent}
        </button>
    );
});

export interface SmartToolbarButtonProps {
    fileActionId: string;
}

export const SmartToolbarButton: React.FC<SmartToolbarButtonProps> = React.memo(
    (props) => {
        const { fileActionId } = props;

        const action = useRecoilValue(fileActionDataState(fileActionId));
        const triggerAction = useFileActionTrigger(fileActionId);
        const { active, disabled } = useFileActionModifiers(fileActionId);

        if (!action) return null;
        const { toolbarButton: button } = action;
        if (!button) return null;

        return (
            <ToolbarButton
                text={button.name}
                tooltip={button.tooltip}
                icon={button.icon}
                iconOnly={button.iconOnly}
                active={active}
                onClick={triggerAction}
                disabled={disabled}
            />
        );
    }
);
