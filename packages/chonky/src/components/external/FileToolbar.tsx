import React, { ReactElement, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectToolbarItems } from '../../redux/selectors';
import { important, makeGlobalChonkyStyles } from '../../util/styles';
import { SmartToolbarButton } from './ToolbarButton';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ToolbarInfo } from './ToolbarInfo';
import { ToolbarSearch } from './ToolbarSearch';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const classes = useStyles();
    const toolbarItems = useSelector(selectToolbarItems);

    const toolbarItemComponents = useMemo(() => {
        const stringComponents: ReactElement[] = [];
        const nonStringComponents: ReactElement[] = [];
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
            if (typeof item === 'string') {
                stringComponents.push(component);
            } else {
                nonStringComponents.push(component);
            }
        }
        return {
            stringComponents,
            nonStringComponents,
        };
    }, [toolbarItems]);
    
    return (
        <div className={classes.toolbarWrapper}>
            <div className={classes.toolbarContainer}>
                <div className={classes.toolbarLeft}>
                {toolbarItemComponents.stringComponents.map((component, index) => (
                    <div key={`wrapped-${index}`} className={classes[`toolbarLeftItemWrapper${index}`]}>
                        {component}
                    </div>
                ))}
                </div>
                <div className={classes.toolbarRight}>
                    {toolbarItemComponents.nonStringComponents.map((component, index) => (
                        <div key={`wrapped-${index}`} className={classes.toolbarRightItemWrapper}>
                            {component}
                        </div>
                    ))}
                    <ToolbarSearch />
                </div>
            </div>
        </div>
    );
});

const useStyles = makeGlobalChonkyStyles(theme => ({
    toolbarWrapper: {
        marginLeft: '24px'
    },
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
        marginRight: '24px',
    },
    toolbarLeftItemWrapper0: {
        backgroundColor: '#406BC7',
        marginRight: '12px',
        borderRadius: '5px',
        padding: '2px 10px',
        color: '#fff !important',
    },
    toolbarLeftItemWrapper1: {
        backgroundColor: '#fff',
        borderRadius: '5px',
        border: '2px solid #406BC7',
        color: '#406BC7 !important',
    },
    toolbarRightItemWrapper: {
        backgroundColor: '#F4F4F4',
        borderRadius: '5px',
        marginRight: '14px',
        padding: '2px 5px',
    }
}));
