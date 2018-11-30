const read = require('fs-readdir-recursive')
const path = require('path')

/** to access built-in plugin. - https://webpack.js.org/concepts/#plugins */
const webpack = require('webpack');

/** Simplifies creation of HTML files to serve your webpack bundles. - https://github.com/jantimon/html-webpack-plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');


let pages = read(path.join(__dirname, 'views'));
let jsEntries = read(path.join(__dirname, 'src'))

let entries = {}

jsEntries.forEach(entry => {
  let js = entry.replace(/(\.\w+)/g, '');
  entries[js] = `./src/${entry}`;;
})

module.exports = {

  mode: 'development',

  // entry point for webpack to begin compiling
  entry: entries,

  // dev Server setup
  devServer: {
    port: 9000,
    compress: true,

    // The local filesystem directory where static html files
    // should be placed to enjoy 'live-reloading'
    contentBase: path.resolve(__dirname, "views"),

    // 'Live-reloading' happens when you make changes to code
    // dependency pointed to by the 'entry' parameter.
    // To make live-reloading happen even when changes are made
    // to the static html pages in 'contentBase', add 
    // 'watchContentBase'
    watchContentBase: true,

    // Control options related to watching the files.
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
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
        use: ['babel-loader']
      }
    ]
  },

  // Here be plugins
  plugins:
    pages.map(page => {

      let chunk = page.replace(/(\.\w+)/g, '');

      let plugin = new HtmlWebpackPlugin({
        template: `./views/${page}`,
        inject: true,
        chunks: ['app', `${chunk}`],
        filename: `${page}`
      })

      return plugin;
    }).concat([
    // new HtmlWebpackPlugin({
    //   template: './views/index.html',
    //   inject: true,
    //   chunks: ['index'],
    //   title: 'Page :: Index',
    //   filename: 'index.html'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './views/about.html',
    //   inject: true,
    //   chunks: ['about'],
    //   title: 'Page :: About',
    //   filename: 'about.html'
    // }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify("development"),
      PRODUCTION: JSON.stringify(false),
      VERSION: JSON.stringify('5fa3b9'),
    })
  ]),


}