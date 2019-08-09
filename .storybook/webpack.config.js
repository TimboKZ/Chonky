module.exports = ({config}) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {loader: require.resolve('awesome-typescript-loader')},
            {loader: require.resolve('react-docgen-typescript-loader')},
            {loader: require.resolve('eslint-loader')},
        ],
    });
    config.resolve.symlinks = false;
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
};