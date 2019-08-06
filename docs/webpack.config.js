const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    // 'webpack-dev-server/client?http://localhost:3000',
    // 'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'js/index.js'),
  ],

  output: {
    filename: 'bundle.js',
    path: __dirname,
    publicPath: '/',
  },

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.js', '.vue', '.jsx'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      // vue: 'vue/dist/vue.js',
      // '@': path.resolve(__dirname, '/js'),
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
    ],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    contentBase: __dirname,
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
};
