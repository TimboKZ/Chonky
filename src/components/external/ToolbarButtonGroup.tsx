/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import React from 'react';

import { ActionGroupData } from '../../types/file-actions.types';
import { Dropdown } from './Dropdown';
import { SmartToolbarButton } from './ToolbarButton';

export interface ToolbarButtonGroupProps {
    group: ActionGroupData;
}

export const ToolbarButtonGroup: React.FC<ToolbarButtonGroupProps> = React.memo(
    (props) => {
        const { group } = props;

        let groupContents: React.ReactElement | React.ReactElement[];
        if (group.dropdown) {
            groupContents = <Dropdown group={group} />;
        } else {
            groupContents = group.fileActionIds.map((actionId) => (
                <SmartToolbarButton
                    key={`action-button-${actionId}`}
                    fileActionId={actionId}
                />
            ));
        }

        return <div className="chonky-toolbar-button-group">{groupContents}</div>;
    }
);
