/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React, { ReactElement, useMemo } from 'react';

import { useFolderChainItems } from './FileNavbar-hooks';

export interface FileNavbarProps {}

export const FileNavbar: React.FC<FileNavbarProps> = (props) => {
    const folderChainItems = useFolderChainItems();

    const folderChainComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < folderChainItems.length; ++i) {
            const { file, onClick } = folderChainItems[i];
            const key = `folder-chain-${file ? file.id : i}`;
            const component = file ? (
                <Link key={key} color="inherit" onClick={onClick}>
                    {file.name}
                </Link>
            ) : (
                <Typography key={key} color="textPrimary">
                    Loading...
                </Typography>
            );
            components.push(component);
        }
        return components;
    }, [folderChainItems]);

    return (
        <Breadcrumbs aria-label="folder-breadcrumbs">
            {folderChainComponents}
        </Breadcrumbs>
    );
};
