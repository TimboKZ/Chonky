/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';

interface IconGroupProps {}

interface IconGroupState {}

export class ButtonGroup extends React.PureComponent<IconGroupProps, IconGroupState> {
    public render() {
        const { children } = this.props;
        return <div className="chonky-button-group">{children}</div>;
    }
}
