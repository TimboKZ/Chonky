/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

import {
    isFunction,
    isNil,
    isNumber,
    registerKbListener,
} from '../util/Util';
import {InputEvent, InputEventType, InputListener, KbKey} from '../typedef';
import {Nullable} from 'tsdef';

export interface ClickableWrapperProps {
    wrapperTag: any;
    passthroughProps?: any;

    doubleClickDelay: number;
    onSingleClick?: InputListener;
    onDoubleClick?: InputListener;
    onAllClicks?: InputListener;
}

interface ClickableWrapperListener {
    onSingleClick?: InputListener;
    onDoubleClick?: InputListener;
    onAllClicks?: InputListener;
}
let activeListener: Nullable<ClickableWrapperListener> = null;
const handleKeyPress: InputListener = (event: InputEvent) => {
    if (isNil(activeListener)) return false;

    const listener = activeListener;
    const {key} = event;
    if (key !== KbKey.Enter && key !== KbKey.Space) return false;

    let handled = false;
    if (key === KbKey.Space && isFunction(listener.onSingleClick)) {
        listener.onSingleClick(event);
        handled = true;
    } else if (key === KbKey.Enter && isFunction(listener.onDoubleClick)) {
        listener.onDoubleClick(event);
        handled = true;
    }
    if (isFunction(listener.onAllClicks)) {
        listener.onAllClicks(event);
        handled = true;
    }

    return handled;
};
registerKbListener(handleKeyPress);

export default class ClickableWrapper extends React.Component<ClickableWrapperProps, {}> {

    private readonly listener: ClickableWrapperListener;
    private clickTimeout?: number;
    private clickCount: number = 0;

    public constructor(props: ClickableWrapperProps) {
        super(props);
        const {onSingleClick, onDoubleClick, onAllClicks} = props;
        this.listener = {onSingleClick, onDoubleClick, onAllClicks};
    }

    private handleClick = (event: React.MouseEvent) => {
        const {doubleClickDelay, onSingleClick, onDoubleClick, onAllClicks} = this.props;
        const inputEvent: InputEvent = {
            type: InputEventType.Mouse,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
        };

        if (isFunction(onAllClicks)) onAllClicks(inputEvent);

        this.clickCount++;
        if (this.clickCount === 1) {
            if (isFunction(onSingleClick)) {
                event.preventDefault();
                onSingleClick(inputEvent);
            }
            this.clickCount = 1;
            // @ts-ignore
            this.clickTimeout = setTimeout(() => this.clickCount = 0, doubleClickDelay);
        } else if (this.clickCount === 2) {
            if (isFunction(onDoubleClick)) {
                event.preventDefault();
                onDoubleClick(inputEvent);
            }
            if (isNumber(this.clickTimeout)) {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = undefined;
                this.clickCount = 0;
            }
        }
    };

    private handleFocus = () => {
        activeListener = this.listener;
    };

    private handleBlur = () => {
        activeListener = null;
    };

    public render() {
        const {
            children, wrapperTag: WrapperTag, passthroughProps,
            onSingleClick, onDoubleClick,
        } = this.props;

        const compProps: any = {
            onClick: this.handleClick,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur,
        };
        if (isFunction(onSingleClick) || isFunction(onDoubleClick)) compProps.tabIndex = 0;

        const mergedProps = {...compProps, ...passthroughProps};
        return <WrapperTag {...mergedProps}>{children}</WrapperTag>;
    }

}
