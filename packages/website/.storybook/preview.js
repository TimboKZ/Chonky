export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    backgrounds: {
        default: 'gray',
        values: [
            {
                name: 'white',
                value: '#fff',
            },
            {
                name: 'gray',
                value: '#f2f2f2',
            },
            {
                name: 'dark gray',
                value: '#2f2f2f',
            },
        ],
    },
};
