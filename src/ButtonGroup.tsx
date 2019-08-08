/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

type IconGroupProps = {}

type IconGroupState = {}

export default class ButtonGroup extends React.Component<IconGroupProps, IconGroupState> {

    static defaultProps = {};

    constructor(props: IconGroupProps) {
        super(props);
    }

    render() {
        const {children} = this.props;
        return <div className="chonky-button-group">
            {children}
        </div>;
    }

}
