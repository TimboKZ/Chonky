import c from 'classnames';
import React from 'react';

import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';

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
            title={tooltip}
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
