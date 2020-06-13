import React from 'react';

// Import Noty for nice file open notifications
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/relax.css';

import { Title, Description, Primary, Props } from '@storybook/addon-docs/blocks';

export const createDocsObject = (params: { markdown: string }) => {
    const { markdown } = params;

    return {
        page: () => {
            return (
                <React.Fragment>
                    <Title />
                    <Description markdown={markdown} />
                    <Primary />
                    <Props />
                </React.Fragment>
            );
        },
    };
};

export const showNotification = (params: {
    text: string;
    type?: 'success' | 'warning';
}) => {
    const { text, type } = params;
    new Noty({
        text,
        type: type ? type : 'success',
        theme: 'relax',
        timeout: 3000,
    }).show();
};
