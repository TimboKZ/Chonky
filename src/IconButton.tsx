/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {isFunction, isString} from './Util';

interface IconButtonProps {
    icon: any;
    active?: boolean;
    tooltip?: string;
    onClick?: (event: any) => void;
}

interface IconButtonState {}

export default class IconButton extends React.Component<IconButtonProps, IconButtonState> {

    public static defaultProps = {
        active: false,
        icon: faExclamationTriangle,
    };

    public render() {
        const {icon, active, tooltip, onClick} = this.props;

        const className = classnames({
            'chonky-icon-button': true,
            'chonky-active': active,
            'chonky-tooltip': isString(tooltip),
        });

        const buttonProps: any = {
            className,
        };
        if (isFunction(onClick)) buttonProps.onClick = onClick;
        else buttonProps.disabled = true;
        if (isString(tooltip)) buttonProps['data-tooltip'] = tooltip;

        return <button {...buttonProps}>
            <FontAwesomeIcon icon={icon}/>
        </button>;
    }

}
