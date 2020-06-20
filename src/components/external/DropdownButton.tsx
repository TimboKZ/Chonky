/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { ChonkyIconFA, ChonkyIconName } from './ChonkyIcon';
import { FileAction } from 'chonky';
import { useSmartToolbarButtonProps } from './ToolbarButton-hooks';

export interface DropdownButtonProps {
    text: string;
    tooltip?: string;
    icon?: ChonkyIconName | string;
    onClick?: () => void;
    disabled?: boolean;
}

export const DropdownButton: React.FC<DropdownButtonProps> = React.memo((props) => {
    const { text, tooltip, icon, onClick, disabled } = props;

    return (
        <button
            className="chonky-toolbar-dropdown-button"
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={!onClick || disabled}
        >
            <div className="chonky-toolbar-dropdown-button-icon">
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.fallbackIcon}
                    fixedWidth={true}
                />
            </div>
            <div className="chonky-toolbar-dropdown-button-text">{text}</div>
        </button>
    );
});

export interface SmartDropdownButtonProps {
    fileAction: FileAction;
}

export const SmartDropdownButton: React.FC<SmartDropdownButtonProps> = (props) => {
    const { fileAction: action } = props;

    const { toolbarButton: button } = action;
    if (!button) return null;

    const { onClick, disabled } = useSmartToolbarButtonProps(action);

    return (
        <DropdownButton
            text={button.name}
            tooltip={button.tooltip}
            icon={button.icon}
            onClick={onClick}
            disabled={disabled}
        />
    );
};
