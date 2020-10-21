import React, { ReactElement, useMemo } from 'react';

import { makeChonkyStyles } from '../../util/styles';
import { isToolbarDropdownData, useToolbarItems } from './FileToolbar-hooks';
import { SmartToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarInfo } from './ToolbarInfo';
import { ToolbarSearch } from './ToolbarSearch';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const classes = useStyles();
    const toolbarItems = useToolbarItems();

    const toolbarItemComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < toolbarItems.length; ++i) {
            const item = toolbarItems[i];

            const key = `toolbar-item-${
                isToolbarDropdownData(item) ? item.name : item.id
            }`;
            const component = isToolbarDropdownData(item) ? (
                <ToolbarDropdown
                    key={key}
                    name={item.name}
                    fileActionIds={item.fileActionIds}
                />
            ) : (
                <SmartToolbarButton key={key} fileActionId={item.id} />
            );
            components.push(component);
        }
        return components;
    }, [toolbarItems]);

    return (
        <div className={classes.toolbarWrapper}>
            <div className={classes.toolbarContainer}>
                <div className={classes.toolbarLeft}>
                    <ToolbarSearch />
                    <ToolbarInfo />
                </div>
                <div className={classes.toolbarRight}>{toolbarItemComponents}</div>
            </div>
        </div>
    );
});

const useStyles = makeChonkyStyles((theme) => ({
    toolbarWrapper: {
        paddingBottom: theme.margins.rootLayoutMargin,
    },
    toolbarContainer: {
        display: 'flex',
    },
    toolbarLeft: {
        flexGrow: 10000,
        display: 'flex',
    },
    toolbarLeftFiller: {
        flexGrow: 10000,
    },
    toolbarRight: {
        display: 'flex',
    },
}));
