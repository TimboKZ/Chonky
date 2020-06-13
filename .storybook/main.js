const path = require('path');

module.exports = {
    stories: ['../stories/**/*.stories.@(tsx|mdx)'],
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-docs',
        '@storybook/addon-storysource',
        '@storybook/addon-viewport/register',
    ],
    webpackFinal: async (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            'chonky/style': path.resolve(__dirname, '..', 'style'),
            chonky: path.resolve(__dirname, '..', 'src'),
        };

        return config;
    },
};
