import React, { ReactElement } from 'react';
import { Nullable } from 'tsdef';

export interface ErrorMessageProps {
    message: string;
    bullets?: string[];
}

export const ErrorMessage = React.memo<ErrorMessageProps>((props) => {
    const { message, bullets } = props;

    let bulletList: Nullable<ReactElement> = null;
    if (bullets && bullets.length > 0) {
        const items: React.ReactElement[] = [];
        for (let i = 0; i < bullets.length; ++i) {
            items.push(<li key={`error-bullet-${i}`}>{bullets[i]}</li>);
        }
        bulletList = <ul>{items}</ul>;
    }

    return (
        <div className="chonky-error">
            <span className="chonky-error-name">Chonky runtime error:</span> {message}
            {bulletList}
        </div>
    );
});
