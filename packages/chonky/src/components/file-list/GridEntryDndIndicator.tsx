/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { DndEntryState } from '../../types/file-list.types';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { ChonkyIconFA } from '../external/ChonkyIcon';
import { useDndIcon } from './FileEntry-hooks';

export interface DnDIndicatorProps {
    className: string;
    dndState: DndEntryState;
}

export const GridEntryDndIndicator: React.FC<DnDIndicatorProps> = React.memo((props) => {
    const { className: externalClassName, dndState } = props;
    const { dndIconColor, dndIconName } = useDndIcon(dndState);
    const classes = useStyles(dndIconColor);
    if (!dndIconName) return null;
    const className = c({
        [classes.dndIndicator]: true,
        [externalClassName]: true,
    });
    return (
        <div className={className}>
            <ChonkyIconFA icon={dndIconName} />
        </div>
    );
});

const useStyles = makeLocalChonkyStyles((theme) => ({
    dndIndicator: {
        color: (dndColor: string) => dndColor,
        boxSizing: 'border-box',
        position: 'absolute',
        fontSize: '1.2em',
        opacity: 0.6,
        padding: 6,
        '&:before': {
            borderBottom: '50px solid transparent',
            borderLeft: '50px solid #fff',
            position: 'absolute',
            content: '""',
            zIndex: -1,
            left: 0,
            top: 0,
        },
    },
}));
