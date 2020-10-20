/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import c from 'classnames';
import React from 'react';
import { Nullable } from 'tsdef';

export interface FileThumbnailProps {
    thumbnailUrl: Nullable<string>;
}

export const FileThumbnail: React.FC<FileThumbnailProps> = React.memo((props) => {
    const { thumbnailUrl } = props;

    const thumbnailStyle: React.CSSProperties = thumbnailUrl
        ? { backgroundImage: `url('${thumbnailUrl}')` }
        : {};

    const className = c({
        'chonky-file-thumbnail': true,
        'chonky-file-thumbnail-hidden': !thumbnailUrl,
    });
    return <div className={className} style={thumbnailStyle} />;
});
