let webpack = require ('webpack');
let path = require('path');

module.exports =  {
  entry: [
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/dev-server',
    './src/index-dev.js'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
 
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.*\js$/,
        exclude: '/node_modules/',
        loader: 'eslint-loader'
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: false
  },
  devtool: 'source-map'
}
