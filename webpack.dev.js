
/** 
 * Simplifies creation of HTML files to serve your webpack bundles 
 * https://github.com/jantimon/html-webpack-plugin
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {

  // entry point for webpack to begin compiling
  entry: {
    index: './src/index.js',
    about: './src/about.js'
  },

  // dev Server setup
  devServer: {
    https: true,
    port: 5555,
    compress: true,
    hot: true,
    historyApiFallback: {
      rewrites: [{ from: /./, to: 'views/errors/404.html' }]
    }
  },

  // Here be plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/about.html',
      inject: true,
      chunks: ['about'],
      filename: 'about.html'
    })
  ]
}