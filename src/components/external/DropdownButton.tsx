/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';
import { useRecoilValue } from 'recoil';

import { fileActionDataState } from '../../recoil/file-actions.recoil';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionModifiers, useFileActionTrigger } from '../../util/file-actions';
import { ChonkyIconFA } from './ChonkyIcon';

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
    fileActionId: string;
}

export const SmartDropdownButton: React.FC<SmartDropdownButtonProps> = (props) => {
    const { fileActionId } = props;

    const action = useRecoilValue(fileActionDataState(fileActionId));
    const triggerAction = useFileActionTrigger(fileActionId);
    const { disabled } = useFileActionModifiers(fileActionId);

    if (!action) return null;
    const { toolbarButton: button } = action;
    if (!button) return null;

    return (
        <DropdownButton
            text={button.name}
            tooltip={button.tooltip}
            icon={button.icon}
            onClick={triggerAction}
            disabled={disabled}
        />
    );
};
