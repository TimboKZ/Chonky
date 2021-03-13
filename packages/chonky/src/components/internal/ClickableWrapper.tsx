/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useCallback } from 'react';
import { AnyObjectWithStringKeys } from 'tsdef';

import { useClickHandler, useKeyDownHandler } from './ClickableWrapper-hooks';

export interface MouseClickEvent {
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}
export type MouseClickEventHandler = (event: MouseClickEvent) => void;

export interface KeyboardClickEvent {
    enterKey: boolean;
    spaceKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
}
export type KeyboardClickEventHandler = (event: KeyboardClickEvent) => void;

export interface ClickableWrapperProps {
    wrapperTag: any;
    passthroughProps?: any;

    onSingleClick?: MouseClickEventHandler;
    onDoubleClick?: MouseClickEventHandler;
    onKeyboardClick?: KeyboardClickEventHandler;
    setFocused?: (focused: boolean) => void;
}

export const ClickableWrapper: React.FC<ClickableWrapperProps> = props => {
    const {
        children,
        wrapperTag: WrapperTag,
        passthroughProps,
        onSingleClick,
        onDoubleClick,
        onKeyboardClick,
        setFocused,
    } = props;

    const handleClick = useClickHandler(onSingleClick, onDoubleClick);
    const handleKeyDown = useKeyDownHandler(onKeyboardClick);

    const compProps: AnyObjectWithStringKeys = {
        onFocus: useCallback(() => setFocused && setFocused(true), [setFocused]),
        onBlur: useCallback(() => setFocused && setFocused(false), [setFocused]),
    };

    if (onSingleClick || onDoubleClick || onKeyboardClick) {
        compProps.onClick = handleClick;
        compProps.onKeyDown = handleKeyDown;
        compProps.tabIndex = 0;
    }

    const mergedProps = { ...compProps, ...passthroughProps };
    return <WrapperTag {...mergedProps}>{children}</WrapperTag>;
};
