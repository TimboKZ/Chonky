import React from 'react';

import { Description, Primary, Title } from '@storybook/addon-docs/blocks';

export const createDocsObject = (params: { markdown: string }) => {
    const { markdown } = params;

    return {
        page: () => {
            return (
                <React.Fragment>
                    <Title />
                    <Description markdown={markdown} />
                    <Primary />
                </React.Fragment>
            );
        },
    };
};
