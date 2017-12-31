var webpack = require('webpack');
var path = require('path');

let music = {
  APP_DIR: path.resolve(__dirname, 'lib/music/client/'),
  APP_FILE: path.resolve(__dirname, 'lib/music/client/music-client.jsx')
}

let soundboard = {
  APP_DIR: path.resolve(__dirname, 'lib/soundboard/client/'),
  APP_FILE: path.resolve(__dirname, 'lib/soundboard/client/soundboard.jsx')
}

var config = {
  devtool: 'source-map',
  entry: {
    'lib/music/static/js/bundle.js': music.APP_FILE,
    'lib/soundboard/static/js/bundle.js': soundboard.APP_FILE
  },
  output: {
    path: path.resolve('./'),
    filename: '[name]'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
};

module.exports = config;
