const path = require('path');

module.exports = {
    stories: ['../stories/**/*.stories.@(tsx|mdx)'],
    addons: [
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

        // Used to load TypeScript files as raw text for the docs
        config.module.rules.push({
            test: /\.raw$/i,
            use: [
                {
                    loader: 'raw-loader',
                    options: {
                        esModule: false,
                    },
                },
            ],
        });

        config.module.rules.push({
            test: /\.mdx?$/i,
            use: [
                {
                    loader: 'markdown-dynamic-codeblock-loader',
                    options: {
                        mappings: {
                            src: path.resolve(__dirname, '..', 'src'),
                        },
                    },
                },
            ],
        });

        return config;
    },
};
