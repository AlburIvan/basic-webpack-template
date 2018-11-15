
/**
 * to access built-in plugin.
 * https://webpack.js.org/concepts/#plugins
 */
const webpack = require('webpack');

/** 
 * Simplifies creation of HTML files to serve your webpack bundles.
 * https://github.com/jantimon/html-webpack-plugin
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {

  mode: 'development',

  // entry point for webpack to begin compiling
  entry: {
    index: './src/index.js',
    about: './src/about.js'
  },

  // dev Server setup
  devServer: {
    port: 9000,
    compress: true,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /./, to: 'views/errors/404.html' }
      ]
    }
  },

  // Here be modules
  module: {
    rules: [
      { 
        test: /\.css|scss$/, 
        use: [ 
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translate CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/,
        use: ['babel-loader'] // transpile ECMA6 code to vanilla JS with babel
      }
    ]
  },

  // Here be plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/index.html',
      inject: true,
      chunks: ['index'],
      title: 'My App',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/about.html',
      inject: true,
      chunks: ['about'],
      filename: 'about.html'
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("development"),
      PRODUCTION: JSON.stringify(false),
      VERSION: JSON.stringify('5fa3b9'),
    })
  ]
}