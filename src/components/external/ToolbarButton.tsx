import c from 'classnames';
import React from 'react';

import { FileAction } from '../../typedef';
import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';
import { useSmartToolbarButtonProps } from './ToolbarButton-hooks';

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
    fileAction: FileAction;
}

export const SmartToolbarButton: React.FC<SmartToolbarButtonProps> = React.memo(
    (props) => {
        const { fileAction: action } = props;

        const { toolbarButton: button } = action;
        if (!button) return null;

        const { onClick, disabled } = useSmartToolbarButtonProps(action);

        return (
            <ToolbarButton
                text={button.name}
                tooltip={button.tooltip}
                icon={button.icon}
                iconOnly={button.iconOnly}
                onClick={onClick}
                disabled={disabled}
            />
        );
    }
);
