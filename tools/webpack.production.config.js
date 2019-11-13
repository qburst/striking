let path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
let node_modules_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  }
}


