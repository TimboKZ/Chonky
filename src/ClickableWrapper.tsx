/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

import {ClickEvent} from './typedef';
import {isFunction, isNumber} from './Util';

export interface ClickableWrapperProps {
    wrapperTag: any;
    passthroughProps?: object;

    doubleClickDelay: number;
    onSingleClick?: (event: ClickEvent, keyboard: boolean) => void;
    onDoubleClick?: (event: ClickEvent, keyboard: boolean) => void;
}

interface ClickableWrapperState {}

export default class ClickableWrapper extends React.Component<ClickableWrapperProps, ClickableWrapperState> {

    public static defaultProps = {};

    private clickTimeout?: number;
    private clickCount: number = 0;

    public constructor(props: ClickableWrapperProps) {
        super(props);
    }

    private handleClick = (event: React.MouseEvent) => {
        const {doubleClickDelay, onSingleClick, onDoubleClick} = this.props;
        const customEvent: ClickEvent = {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
        };
        console.log('Single click!', onSingleClick);

        this.clickCount++;
        if (this.clickCount === 1) {
            if (isFunction(onSingleClick)) {
                onSingleClick(customEvent, false);
                console.log('Single click! 1.5');
            }
            console.log('Single click! 2');
            this.clickCount = 1;
            // @ts-ignore
            this.clickTimeout = setTimeout(() => this.clickCount = 0, doubleClickDelay);
        } else if (this.clickCount === 2) {
            if (isFunction(onDoubleClick)) onDoubleClick(customEvent, false);
            if (isNumber(this.clickTimeout)) {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = undefined;
                this.clickCount = 0;
            }
        }
    };

    public render() {
        const {children, wrapperTag: WrapperTag, passthroughProps, onSingleClick, onDoubleClick} = this.props;

        const compProps: any = {
            onClick: this.handleClick,
        };
        if (isFunction(onSingleClick) || isFunction(onDoubleClick)) compProps.tabIndex = 0;

        const mergedProps = {...compProps, ...passthroughProps};
        return <WrapperTag {...mergedProps}>{children}</WrapperTag>;
    }

}
