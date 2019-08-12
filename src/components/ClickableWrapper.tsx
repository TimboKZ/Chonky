/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';

import {
    generateId,
    isFunction,
    isNil,
    isNumber,
    isObject,
    isString,
} from '../util/Util';
import {InputEvent, InputEventType, InputListener, KbKey} from '../types/typedef';

export interface ClickableWrapperProps {
    instanceId: string;
    wrapperTag: any;
    passthroughProps?: object;

    doubleClickDelay: number;
    onSingleClick?: InputListener;
    onDoubleClick?: InputListener;
    onAllClicks?: InputListener;
}

const listenerMap: {
    [id: string]: {
        onSingleClick?: InputListener;
        onDoubleClick?: InputListener;
        onAllClicks?: InputListener;
    };
} = {};
export const handleKeyPress: InputListener = (event: InputEvent) => {
    const {key} = event;
    if (key !== KbKey.Enter && key !== KbKey.Space) return false;

    const activeElem = document.activeElement;
    if (isNil(activeElem)) return false;

    const listenerId = activeElem.getAttribute('data-chonky-listener-id');
    if (!isString(listenerId)) return false;

    const listener = listenerMap[listenerId];
    if (!isObject(listener)) return false;

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

export default class ClickableWrapper extends React.Component<ClickableWrapperProps, {}> {

    private readonly listenerId: string;
    private clickTimeout?: number;
    private clickCount: number = 0;

    public constructor(props: ClickableWrapperProps) {
        super(props);
        const {instanceId} = props;
        this.listenerId = `${instanceId}/${generateId()}`;
    }

    public componentDidMount(): void {
        const {onSingleClick, onDoubleClick, onAllClicks} = this.props;
        listenerMap[this.listenerId] = {onSingleClick, onDoubleClick, onAllClicks};
    }

    public componentWillUnmount(): void {
        delete listenerMap[this.listenerId];
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
                onSingleClick(inputEvent);
            }
            this.clickCount = 1;
            // @ts-ignore
            this.clickTimeout = setTimeout(() => this.clickCount = 0, doubleClickDelay);
        } else if (this.clickCount === 2) {
            if (isFunction(onDoubleClick)) onDoubleClick(inputEvent);
            if (isNumber(this.clickTimeout)) {
                clearTimeout(this.clickTimeout);
                this.clickTimeout = undefined;
                this.clickCount = 0;
            }
        }
    };

    public render() {
        const {
            children, wrapperTag: WrapperTag, passthroughProps,
            onSingleClick, onDoubleClick,
        } = this.props;

        const compProps: any = {
            onClick: this.handleClick,
            'data-chonky-listener-id': this.listenerId,
        };
        if (isFunction(onSingleClick) || isFunction(onDoubleClick)) compProps.tabIndex = 0;

        const mergedProps = {...compProps, ...passthroughProps};
        return <WrapperTag {...mergedProps}>{children}</WrapperTag>;
    }

}
