import { ChonkyIconProps } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import React from 'react';

const myEmojiMap: { [iconName: string]: string } = {
    bentoEmoji: '🍱',
    angryEmoji: '😠',
    japanEmoji: '🗾',
};

export const MyEmojiIcon: React.FC<ChonkyIconProps> = React.memo((props) => {
    const emojiIcon = myEmojiMap[props.icon];
    if (emojiIcon) {
        return <span>{emojiIcon}</span>;
    }
    return <ChonkyIconFA {...props} />;
});
