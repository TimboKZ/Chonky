/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React from 'react';

import { makeLocalChonkyStyles } from '../../util/styles';

export interface TextPlaceholderProps {
    minLength: number;
    maxLength: number;
}

const getRandomInt = (min: number, max: number) => {
    return min + Math.floor(Math.random() * Math.floor(max - min));
};
export const TextPlaceholder: React.FC<TextPlaceholderProps> = React.memo(props => {
    const { minLength, maxLength } = props;

    const placeholderLength = getRandomInt(minLength, maxLength);
    const whitespace = '&nbsp;'.repeat(placeholderLength);

    const classes = useStyles();
    return (
        <span
            className={classes.textPlaceholder}
            dangerouslySetInnerHTML={{ __html: whitespace }}
        />
    );
});

const useStyles = makeLocalChonkyStyles(() => ({
    '@keyframes loading-placeholder': {
        '0%': { opacity: 0.2 },
        '50%': { opacity: 0.4 },
        '100%': { opacity: 0.2 },
    },
    textPlaceholder: {
        animationName: '$loading-placeholder',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationDuration: '1.5s',
        backgroundColor: '#ccc',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        borderRadius: 4,
        maxWidth: '40%',
        minWidth: 20,
    },
}));
