/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

export interface TextPlaceholderProps {
    minLength: number;
    maxLength: number;
}

const getRandomInt = (min: number, max: number) => {
    return min + Math.floor(Math.random() * Math.floor(max - min));
};
export const TextPlaceholder: React.FC<TextPlaceholderProps> = React.memo((props) => {
    const { minLength, maxLength } = props;

    const placeholderLength = getRandomInt(minLength, maxLength);
    const whitespace = '&nbsp;'.repeat(placeholderLength);

    return (
        <span
            className="chonky-text-placeholder"
            dangerouslySetInnerHTML={{ __html: whitespace }}
        />
    );
});
