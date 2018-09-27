const merge = require('webpack-merge');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const common = require('./webpack.common.js');
const {getRelease} = require('./utils');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  plugins: [
      new SentryCliPlugin({
          release: getRelease(),
          include: './dist',
          ignoreFile: '.sentrycliignore',
          ignore: ['node_modules', 'webpack.common.js', 'webpack.production.js', 'webpack.development.js'],
          configFile: 'sentry.properties',
          debug: false
      }),
  ],
});