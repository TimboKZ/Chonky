import React from 'react';

export interface ErrorMessageProps {
    message: string;
    bullets?: string[];
}

export const ErrorMessage = React.memo<ErrorMessageProps>((props) => {
    const { message, bullets } = props;

    let bulletList = null;
    if (bullets) {
        const items = [];
        for (let i = 0; i < bullets.length; ++i) {
            items.push(<li key={`error-bullet-{i}`}>{bullets[i]}</li>);
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
