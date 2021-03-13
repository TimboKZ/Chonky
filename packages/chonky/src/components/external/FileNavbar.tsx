/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import React, { ReactElement, useMemo } from 'react';

import { ChonkyActions } from '../../action-definitions/index';
import { important, makeGlobalChonkyStyles } from '../../util/styles';
import { useFolderChainItems } from './FileNavbar-hooks';
import { FolderChainButton } from './FolderChainButton';
import { SmartToolbarButton } from './ToolbarButton';

export interface FileNavbarProps {}

export const FileNavbar: React.FC<FileNavbarProps> = React.memo(() => {
    const classes = useStyles();
    const folderChainItems = useFolderChainItems();

    const folderChainComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < folderChainItems.length; ++i) {
            const key = `folder-chain-${i}`;
            const component = (
                <FolderChainButton
                    key={key}
                    first={i === 0}
                    current={i === folderChainItems.length - 1}
                    item={folderChainItems[i]}
                />
            );
            components.push(component);
        }
        return components;
    }, [folderChainItems]);

    return (
        <Box className={classes.navbarWrapper}>
            <Box className={classes.navbarContainer}>
                <SmartToolbarButton fileActionId={ChonkyActions.OpenParentFolder.id} />
                <Breadcrumbs
                    className={classes.navbarBreadcrumbs}
                    classes={{ separator: classes.separator }}
                >
                    {folderChainComponents}
                </Breadcrumbs>
            </Box>
        </Box>
    );
});

const useStyles = makeGlobalChonkyStyles(theme => ({
    navbarWrapper: {
        paddingBottom: theme.margins.rootLayoutMargin,
    },
    navbarContainer: {
        display: 'flex',
    },
    upDirectoryButton: {
        fontSize: important(theme.toolbar.fontSize),
        height: theme.toolbar.size,
        width: theme.toolbar.size,
        padding: '0px !important',
    },
    navbarBreadcrumbs: {
        fontSize: important(theme.toolbar.fontSize),
        flexGrow: 100,
    },
    separator: {
        marginRight: important(4),
        marginLeft: important(4),
    },
}));
