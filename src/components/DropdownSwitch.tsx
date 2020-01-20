/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import * as React from 'react';
import classnames from 'classnames';
import { ConfigContext } from './ConfigContext';

interface DropdownSwitchItem {
  id: string;
  icon: any;
  tooltip: string;
}

interface DropdownSwitchProps {
  activeId: string;
  items: DropdownSwitchItem[];
  onClick: (id: string) => void;
}

interface DropdownSwitchState { }

export default class DropdownSwitch extends React.Component<DropdownSwitchProps, DropdownSwitchState> {
  public static contextType = ConfigContext;
  public context!: React.ContextType<typeof ConfigContext>

  public render() {
    const { activeId, items, onClick } = this.props;
    const { Icon } = this.context;

    const buttonComps = new Array(items.length);
    for (let i = 0; i < buttonComps.length; ++i) {
      const item = items[i];
      const itemProps = {
        className: classnames({
          'chonky-dropdown-switch-button': true,
          'chonky-tooltip': true,
          'chonky-active': item.id === activeId,
        }),
        onClick: () => onClick(item.id),
        'data-tooltip': item.tooltip,
      };
      buttonComps[i] = <button key={`view-switch-${item.id}`} {...itemProps}>
        <Icon icon={item.icon} fixedWidth />
      </button>;
    }

    return <div className="chonky-dropdown-switch">{buttonComps}</div>;
  }
}
