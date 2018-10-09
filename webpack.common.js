const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

console.log(process.env.RELEASE_VERSION);
console.log(process.env.NODE_ENV);

module.exports = {
    entry: './src/index.js',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: 'src/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                RELEASE_VERSION: JSON.stringify(process.env.RELEASE_VERSION)
            },
        }),
    ],
    module: {
        rules: [
            {
                test: [/\.js$/, /\.jsx?$/],
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-flow"
                        ],
                        plugins: [
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-proposal-object-rest-spread"
                        ]
                    }
                }
            }
        ],
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        sourceMapFilename: "[name].js.map",
        path: path.resolve(__dirname, 'dist')
    }
};

