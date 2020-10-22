import React, { CSSProperties } from 'react';
import { Nilable } from 'tsdef';

import { SmartFileEntry } from '../file-entry/SmartFileEntry';

export const fileListItemRenderer = (
    index: number,
    fileId: Nilable<string>,
    isGridView: boolean,
    style: CSSProperties,
    rowGutter: number = 0,
    columnGutter: number = 0
) => {
    if (fileId === undefined) return null;

    let styleWithGutter: CSSProperties = style;
    if (rowGutter || columnGutter) {
        styleWithGutter = {
            ...style,
            paddingRight: columnGutter,
            paddingBottom: rowGutter,
            boxSizing: 'border-box',
        };
    }

    return (
        <div style={styleWithGutter}>
            <SmartFileEntry
                fileId={fileId ?? null}
                displayIndex={index}
                isGridView={isGridView}
            />
        </div>
    );
};
