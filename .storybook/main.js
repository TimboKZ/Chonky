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
            chonky: path.resolve(__dirname, '..', 'src'),
            'chonky/style': path.resolve(__dirname, '..', 'style'),
        };

        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../'),
        });

        return config;
    },
};
