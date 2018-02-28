var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");
require('dotenv').config()

let plugins = []
if (process.env.ENV != 'DEVELOPMENT') { 
  plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
   }),
    new webpack.optimize.UglifyJsPlugin()  
  ]      
}
module.exports = {
  entry: {
    index: "./_javascript/index.js"
  },
  output: {
    path: path.join(__dirname, "javascript"),
    filename: "[name].bundle.js"
  },
  cache: false,
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        include: [path.join(__dirname, "_javascript")]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              
              importLoaders: 1,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader?limit=100000'
          }
        ]
      }

    ]
  },
  plugins : plugins
};
