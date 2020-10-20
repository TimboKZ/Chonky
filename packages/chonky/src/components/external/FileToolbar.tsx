import React from 'react';
import { useRecoilValue } from 'recoil';

import { searchBarEnabledState } from '../../recoil/search.recoil';
import { makeChonkyStyles } from '../../util/styles';
import { useActionGroups } from './FileToolbar-hooks';
import { ToolbarButtonGroup } from './ToolbarButtonGroup';
import { ToolbarInfo } from './ToolbarInfo';
import { ToolbarSearch } from './ToolbarSearch';

export interface FileToolbarProps {}

export const FileToolbar: React.FC<FileToolbarProps> = React.memo(() => {
    const classes = useStyles();
    const searchBarEnabled = useRecoilValue(searchBarEnabledState);

    const { buttonGroups, searchButtonGroup } = useActionGroups();

    return (
        <div className={classes.toolbarWrapper}>
            <div className={classes.toolbarContainer}>
                <div className={classes.toolbarLeft}>
                    <ToolbarSearch />
                    <ToolbarInfo />
                </div>
                <div className={classes.toolbarRight}>
                    {buttonGroups.map((group, index) => (
                        <ToolbarButtonGroup
                            key={`button-group-${group.name ? group.name : index}`}
                            group={group}
                        />
                    ))}
                    {searchBarEnabled && searchButtonGroup && (
                        <ToolbarButtonGroup group={searchButtonGroup} />
                    )}
                </div>
            </div>
        </div>
    );
});

const useStyles = makeChonkyStyles((theme) => ({
    toolbarWrapper: {
        paddingBottom: theme.margins.rootLayoutMargin,
    },
    toolbarContainer: {
        backgroundColor: theme.colors.debugRed,
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
