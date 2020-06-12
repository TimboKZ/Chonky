const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.mdx', '.css', '.sass'],
        alias: {
            chonky: path.resolve(__dirname, '..', 'src'),
            'chonky/style': path.resolve(__dirname, '..', 'style'),
        },
    },
    module: {
        rules: [
            // add your custom loaders.
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
};
