/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import { InputEvent, InputEventType, InputListener } from '../typedef';
import { isFunction, isString, isNil } from '../util/Util';
import { ConfigContext } from './ConfigContext';

interface IconButtonProps {
  icon: any;
  active?: boolean;
  tooltip?: string;
  onClick?: InputListener;
}

interface IconButtonState {}

export default class IconButton extends React.PureComponent<
  IconButtonProps,
  IconButtonState
> {
  public static contextType = ConfigContext;
  public context!: React.ContextType<typeof ConfigContext>;

  public static defaultProps = {
    active: false,
  };

  public render() {
    const { icon, active, tooltip, onClick } = this.props;
    const { Icon, icons } = this.context;

    const className = classnames({
      'chonky-icon-button': true,
      'chonky-active': active,
      'chonky-tooltip': isString(tooltip),
    });

    const buttonProps: any = {
      className,
    };
    if (isFunction(onClick)) {
      buttonProps.onClick = (event: React.MouseEvent) => {
        const inputEvent: InputEvent = {
          type: InputEventType.Mouse,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
        };
        onClick(inputEvent);
      };
    } else buttonProps.disabled = true;
    if (isString(tooltip)) buttonProps['data-tooltip'] = tooltip;

    return (
      <button {...buttonProps}>
        <Icon icon={isNil(icon) ? icons.fallbackIcon : icon} />
      </button>
    );
  }
}
