const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const babelConfigureFile = require('./babel.config');

const { BizroadWebpackPlugin } = require('../dist');

module.exports = {
  entry: './src/main.tsx',
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfigureFile(),
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 1208,
  },
};
