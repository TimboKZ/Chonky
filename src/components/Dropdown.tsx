/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';

interface DropdownProps {
    title: string;
    active?: boolean;
}

interface DropdownState {}

export default class Dropdown extends React.Component<DropdownProps, DropdownState> {

    public static defaultProps = {
        title: 'Dropdown',
        active: false,
    };

    public constructor(props: DropdownProps) {
        super(props);
    }

    public render() {
        const {children, title, active} = this.props;

        const className = classnames({
            'chonky-dropdown': true,
            'chonky-active': active,
        });
        return <div className={className}>
            <button className="chonky-icon-button">
            <span>
                {title}
                &nbsp;&nbsp;
                <FontAwesomeIcon icon={faChevronDown} size="xs" style={{verticalAlign: 'top', marginTop: '0.7em'}}/>
            </span>
            </button>

            <div className="chonky-dropdown-contents">
                {children}
            </div>
        </div>;
    }

}
