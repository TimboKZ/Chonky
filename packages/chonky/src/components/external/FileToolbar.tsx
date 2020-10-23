import React, { ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectToolbarItems } from '../../redux/selectors';
import { FileAction } from '../../file-actons/actions.types';
import { makeChonkyStyles } from '../../util/styles';
import { SmartToolbarButton } from './ToolbarButton';
import { ToolbarDropdown, ToolbarDropdownProps } from './ToolbarDropdown';
import { ToolbarInfo } from './ToolbarInfo';
import { ToolbarSearch } from './ToolbarSearch';

export const isToolbarDropdownData = (
    value: FileAction | ToolbarDropdownProps
): value is ToolbarDropdownProps => !!(value as any).fileActionIds;

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const classes = useStyles();
    const toolbarItems = useSelector(selectToolbarItems);

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
