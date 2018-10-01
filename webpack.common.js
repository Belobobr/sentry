const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: 'src/index.html'
        })
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

