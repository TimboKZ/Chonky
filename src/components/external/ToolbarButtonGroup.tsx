/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';

import { FileAction } from '../../typedef';
import { Dropdown } from './Dropdown';
import { SmartToolbarButton } from './ToolbarButton';

export interface ToolbarButtonGroup {
    name?: string;
    dropdown?: boolean;
    fileActions: FileAction[];
}

export interface ToolbarButtonGroupProps {
    group: ToolbarButtonGroup;
}

export const ToolbarButtonGroup: React.FC<ToolbarButtonGroupProps> = React.memo(
    (props) => {
        const { group } = props;

        let groupContents: React.ReactElement | React.ReactElement[];
        if (group.dropdown) {
            groupContents = <Dropdown group={group} />;
        } else {
            groupContents = group.fileActions.map((action) => (
                <SmartToolbarButton
                    key={`action-button-${action.name}`}
                    fileAction={action}
                />
            ));
        }

        return <div className="chonky-toolbar-button-group">{groupContents}</div>;
    }
);
