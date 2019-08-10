/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

interface IconGroupProps {}

interface IconGroupState {}

export default class ButtonGroup extends React.Component<IconGroupProps, IconGroupState> {

    public static defaultProps = {};

    public constructor(props: IconGroupProps) {
        super(props);
    }

    public render() {
        const {children} = this.props;
        return <div className="chonky-button-group">
            {children}
        </div>;
    }

}
