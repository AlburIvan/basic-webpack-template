const path = require('path');
const read = require('fs-readdir-recursive')

/** to access built-in plugin. - https://webpack.js.org/concepts/#plugins */
const webpack = require('webpack');

/** Simplifies creation of HTML files to serve your webpack bundles. - https://github.com/jantimon/html-webpack-plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** A webpack plugin to remove/clean your build folder(s) before building. - https://github.com/johnagan/clean-webpack-plugin */
const CleanWebpackPlugin = require('clean-webpack-plugin')

/** This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. - https://github.com/webpack-contrib/mini-css-extract-plugin */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** It will search for CSS assets during the Webpack build and will optimize \ minimize the CSS - https://github.com/NMFR/optimize-css-assets-webpack-plugin */
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/** This plugin uses uglify-js to minify your JavaScript. - https://github.com/webpack-contrib/uglifyjs-webpack-plugin */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/** This is a simple plugin that uses Imagemin to compress all images in your project. - https://github.com/Klathmon/imagemin-webpack-plugin */
const ImageminPlugin = require('imagemin-webpack-plugin').default;

/**  */
const buildPath = path.resolve(__dirname, 'dist');

/**  */
let pages = read(path.join(__dirname, 'views'));

/**  */
let jsEntries = read(path.join(__dirname, 'src'))

let entries = {}

jsEntries.forEach(entry => {
  let js = entry.replace(/(\.\w+)/g, '');
  entries[js] = `./src/${entry}`;;
})


module.exports = {

  mode: 'production',

  // This option controls if and how source maps files are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: 'source-map',

  // entry point for webpack to begin compiling
  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: entries,

  // how to write the compiled files to disk
  // https://webpack.js.org/concepts/output/
  output: {
    filename: '[name].[hash:20].js',
    path: buildPath
  },

  // Here be loaders
  module: {
    rules: [
      {
        test: /\.css|scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  // Here be plugins
  plugins: [
    new CleanWebpackPlugin(buildPath),
    pages.map(page => {

      let chunk = page.replace(/(\.\w+)/g, '');

      let plugin = new HtmlWebpackPlugin({
        template: `./views/${page}`,
        inject: true,
        chunks: ['app', `${chunk}`],
        filename: `${page}`
      })

      return plugin;
    }).join(','),
    // .concat([
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        optipng: {
          optimizationLevel: 9
        }
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify("development"),
        PRODUCTION: JSON.stringify(false),
        VERSION: JSON.stringify('5fa3b9'),
      })
    // ])
  ],

  // https://webpack.js.org/configuration/optimization/
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
    }
  }
}