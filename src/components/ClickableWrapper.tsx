/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';

import { detectKey, isFunction, isNumber } from '../util/Util';
import { InputEvent, InputEventType, InputListener, KbKey } from '../typedef';

export interface ClickableWrapperProps {
  wrapperTag: any;
  passthroughProps?: any;

  doubleClickDelay: number;
  onSingleClick?: InputListener;
  onDoubleClick?: InputListener;
  onAllClicks?: InputListener;
}

export default class ClickableWrapper extends React.Component<
  ClickableWrapperProps,
  {}
> {
  private clickTimeout?: number;
  private clickCount: number = 0;

  public constructor(props: ClickableWrapperProps) {
    super(props);
  }

  private handleClick = (event: React.MouseEvent) => {
    const {
      doubleClickDelay,
      onSingleClick,
      onDoubleClick,
      onAllClicks,
    } = this.props;
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
      this.clickTimeout = setTimeout(
        () => (this.clickCount = 0),
        doubleClickDelay
      );
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

  private handleKeyDown = (event: KeyboardEvent) => {
    const { onSingleClick, onDoubleClick, onAllClicks } = this.props;
    const key = detectKey(event);
    const inputEvent: InputEvent = {
      type: InputEventType.Keyboard,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      key,
    };

    if (isFunction(onAllClicks)) onAllClicks(inputEvent);

    if (key === KbKey.Space) {
      if (isFunction(onSingleClick)) {
        event.preventDefault();
        onSingleClick(inputEvent);
      }
    } else if (key === KbKey.Enter) {
      if (isFunction(onDoubleClick)) {
        event.preventDefault();
        onDoubleClick(inputEvent);
      }
    }
  };

  public render() {
    const {
      children,
      wrapperTag: WrapperTag,
      passthroughProps,
      onSingleClick,
      onDoubleClick,
    } = this.props;

    const compProps: any = {
      onClick: this.handleClick,
      onKeyDown: this.handleKeyDown,
    };
    if (isFunction(onSingleClick) || isFunction(onDoubleClick))
      compProps.tabIndex = 0;

    const mergedProps = { ...compProps, ...passthroughProps };
    return <WrapperTag {...mergedProps}>{children}</WrapperTag>;
  }
}
