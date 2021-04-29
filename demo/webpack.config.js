const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const babelConfigureFile = require('./babel.config');

const { BizroadWebpackPlugin } = require('../dist');

module.exports = {
  entry: {
    normal: ['./demo/src/main.js'],
    vue: './demo/vuesrc/index.vue',
    jsx: { import: './demo/jsxsrc/main.jsx' },
    tsx: ['./demo/tsxsrc/main.tsx'],
  },
  mode: 'development',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './vuesrc'),
    },
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.tx', '.tsx', '.vue'],
  },
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
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [new BizroadWebpackPlugin({}), new VueLoaderPlugin()],
};
