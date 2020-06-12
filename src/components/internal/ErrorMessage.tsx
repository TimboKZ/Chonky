import React from 'react';

export interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = React.memo<ErrorMessageProps>((props) => {
    return (
        <div className="chonky-error">
            <span className="chonky-error-name">Chonky runtime error:</span>{' '}
            {props.message}
        </div>
    );
});
