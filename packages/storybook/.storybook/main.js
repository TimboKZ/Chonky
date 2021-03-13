const fs = require('fs');
const path = require('path');

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/preset-create-react-app',
    ],
    webpackFinal: async (config) => {
        // Check if Chonky repository is checked out next to current repo.
        const chonkyPath = path.resolve(__dirname, '..', '..', '..', 'Chonky');
        const chonkyCheckedOut = fs.existsSync(chonkyPath);

        return config;
        if (chonkyCheckedOut && config.mode !== 'production') {
            // If Chonky is checked out, import files directly from it instead of
            // using the Chonky package installed locally. Note that we are
            // importing TypeScript files and not the compiled JS build.
            const chonkySrcPath = path.join(chonkyPath, 'packages', 'chonky', 'src');
            const chonkyStylePath = path.join(
                chonkyPath,
                'packages',
                'chonky',
                'style'
            );

            config.resolve.alias = {
                ...config.resolve.alias,
                'chonky/style': chonkyStylePath, // goes first for correct resolution
                chonky: chonkySrcPath,
            };

            // Remove CRA limitation of import files only from `src/` folder
            const scopePluginIndex = config.resolve.plugins.findIndex(
                ({ constructor }) =>
                    constructor && constructor.name === 'ModuleScopePlugin'
            );
            config.resolve.plugins.splice(scopePluginIndex, 1);
            const {
                module: {
                    rules: [, , , , , , { oneOf }],
                },
            } = config;
            const babelLoader = oneOf.find(({ test }) => new RegExp(test).test('.ts'));
            babelLoader.include.push(chonkySrcPath);
        }

        return config;
    },
};
