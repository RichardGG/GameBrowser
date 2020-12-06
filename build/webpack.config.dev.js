'use strict'

const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'development',

  entry: [
    './src/app.js'
  ],

  devServer: {
      hot: true,
      watchOptions: {
          poll: true
      }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: "sass-loader",
        }
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    }),
    new CopyWebpackPlugin({patterns: [{
        from: resolve('static/output'),
        to: resolve('dist/static/output'),
        toType: 'dir'
    }]})
  ]
}