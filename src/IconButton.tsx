/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';

type IconButtonProps = {
    icon: any;
    active?: boolean;
    tooltip?: string;
    onClick?: (event: any) => void;
}

type IconButtonState = {}

export default class IconButton extends React.Component<IconButtonProps, IconButtonState> {

    static defaultProps = {
        active: false,
        icon: faExclamationTriangle,
    };

    constructor(props: IconButtonProps) {
        super(props);
    }

    render() {
        const {icon, active, tooltip, onClick} = this.props;

        const className = classnames({
            'chonky-icon-button': true,
            'chonky-active': active,
            'chonky-tooltip': !!tooltip,
        });

        const buttonProps: any = {
            className,
        };
        if (onClick) buttonProps.onClick = onClick;
        else buttonProps.disabled = true;
        if (tooltip) buttonProps['data-tooltip'] = tooltip;

        return <button {...buttonProps}>
            <FontAwesomeIcon icon={icon}/>
        </button>;
    }

}
