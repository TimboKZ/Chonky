/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import c from 'classnames';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { Nullable } from 'tsdef';

import { fileActionDataState } from '../../recoil/file-actions.recoil';
import { ChonkyIconName } from '../../types/icons.types';
import { useFileActionProps, useFileActionTrigger } from '../../util/file-actions';
import { ChonkyIconFA } from './ChonkyIcon';

export interface DropdownButtonProps {
    text: string;
    tooltip?: string;
    active?: boolean;
    icon?: Nullable<ChonkyIconName | string>;
    onClick?: () => void;
    disabled?: boolean;
}

export const DropdownButton: React.FC<DropdownButtonProps> = React.memo((props) => {
    const { text, tooltip, active, icon, onClick, disabled } = props;

    const className = c({
        'chonky-toolbar-dropdown-button': true,
        'chonky-active': !!active,
    });
    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            title={tooltip ? tooltip : text}
            disabled={!onClick || disabled}
        >
            <div className="chonky-toolbar-dropdown-button-icon">
                <ChonkyIconFA
                    icon={icon ? icon : ChonkyIconName.circle}
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
    const { icon, active, disabled } = useFileActionProps(fileActionId);

    if (!action) return null;
    const { toolbarButton: button } = action;
    if (!button) return null;

    return (
        <DropdownButton
            text={button.name}
            tooltip={button.tooltip}
            icon={icon}
            onClick={triggerAction}
            active={active}
            disabled={disabled}
        />
    );
};
