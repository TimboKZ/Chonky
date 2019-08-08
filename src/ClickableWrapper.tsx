/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

import {ClickEvent} from './typedef';
import Timer = NodeJS.Timer;

export type ClickableWrapperProps = {
    wrapperTag: any;
    passthroughProps?: object;

    doubleClickDelay: number;
    onSingleClick?: (event: ClickEvent, keyboard: boolean) => void;
    onDoubleClick?: (event: ClickEvent, keyboard: boolean) => void;
}

type ClickableWrapperState = {}

export default class ClickableWrapper extends React.Component<ClickableWrapperProps, ClickableWrapperState> {

    static defaultProps = {};

    clickTimeout?: Timer;
    clickCount: number = 0;

    constructor(props: ClickableWrapperProps) {
        super(props);
    }

    handleClick = (event: React.MouseEvent) => {
        const {doubleClickDelay, onSingleClick, onDoubleClick} = this.props;
        const customEvent: ClickEvent = {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
        };

        this.clickCount++;
        if (this.clickCount === 1) {
            if (onSingleClick) onSingleClick(customEvent, false);
            this.clickCount = 1;
            setTimeout(() => this.clickCount = 0, doubleClickDelay);
        } else if (this.clickCount === 2) {
            if (onDoubleClick) onDoubleClick(customEvent, false);
        }
    };

    render() {
        const {children, wrapperTag: WrapperTag, passthroughProps, onSingleClick, onDoubleClick} = this.props;

        const compProps: any = {
            onClick: this.handleClick,
        };
        if (onSingleClick || onDoubleClick) compProps.tabIndex = 0;

        const mergedProps = {...compProps, ...passthroughProps};
        return <WrapperTag {...mergedProps}>{children}</WrapperTag>;
    }

}
