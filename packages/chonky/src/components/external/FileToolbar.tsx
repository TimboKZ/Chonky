import React, { ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectToolbarItems } from '../../redux/selectors';
import { makeGlobalChonkyStyles } from '../../util/styles';
import { SmartToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarInfo } from './ToolbarInfo';
import { ToolbarSearch } from './ToolbarSearch';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const classes = useStyles();
    const toolbarItems = useSelector(selectToolbarItems);

    const toolbarItemComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < toolbarItems.length; ++i) {
            const item = toolbarItems[i];

            const key = `toolbar-item-${typeof item === 'string' ? item : item.name}`;
            const component =
                typeof item === 'string' ? (
                    <SmartToolbarButton key={key} fileActionId={item} />
                ) : (
                    <ToolbarDropdown
                        key={key}
                        name={item.name}
                        fileActionIds={item.fileActionIds}
                    />
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

const useStyles = makeGlobalChonkyStyles(theme => ({
    toolbarWrapper: {},
    toolbarContainer: {
        flexWrap: 'wrap-reverse',
        display: 'flex',
    },
    toolbarLeft: {
        paddingBottom: theme.margins.rootLayoutMargin,
        flexWrap: 'nowrap',
        flexGrow: 10000,
        display: 'flex',
    },
    toolbarLeftFiller: {
        flexGrow: 10000,
    },
    toolbarRight: {
        paddingBottom: theme.margins.rootLayoutMargin,
        flexWrap: 'nowrap',
        display: 'flex',
    },
}));
