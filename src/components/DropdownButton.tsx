/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {isFunction, isNil} from '../util/Util';

interface DropdownButtonProps {
    icon: any;
    altIcon?: any;
    active: boolean;
    text: string;
    onClick?: (event: any) => void;
}

interface DropdownButtonState {}

export default class DropdownButton extends React.Component<DropdownButtonProps, DropdownButtonState> {

    public render() {
        const {icon, altIcon, active, text, onClick} = this.props;

        let iconToUse = icon;
        let iconClass = '';
        if (!isNil(altIcon) && active !== undefined) {
            if (active) {
                iconClass = 'chonky-text-active';
            } else {
                iconToUse = altIcon;
                iconClass = 'chonky-text-subtle';
            }
        }

        const buttonProps: any = {};
        if (isFunction(onClick)) buttonProps.onClick = onClick;
        else buttonProps.disabled = true;

        return <button className="chonky-dropdown-button" {...buttonProps}>
            <span className={iconClass}>
                <FontAwesomeIcon icon={iconToUse} fixedWidth size="sm"/>
            </span>
            &nbsp;
            {text}
        </button>;
    }

}
