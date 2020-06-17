import c from 'classnames';
import React from 'react';

import { FileAction } from '../../typedef';
import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';
import { useSmartToolbarButtonProps } from './ToolbarButton-hooks';

export interface ToolbarButtonProps {
    text: string;
    tooltip?: string;
    icon?: ChonkyIconName | string;
    iconOnly?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = React.memo((props) => {
    const { text, tooltip, icon, iconOnly, onClick, disabled } = props;

    const className = c({
        'chonky-toolbar-button': true,
    });
    return (
        <button
            className={className}
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={disabled}
        >
            {(icon || iconOnly) && (
                <div className="chonky-toolbar-button-icon">
                    <ChonkyIconFA icon={icon ? icon : ChonkyIconName.fallbackIcon} />
                </div>
            )}
            {text && !iconOnly && (
                <div className="chonky-toolbar-button-text">{text}</div>
            )}
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
