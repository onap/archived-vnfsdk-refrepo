/* Copyright 2017 ZTE Corporation.
 *
 *Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 *You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');


const webpack = require('webpack');
const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');
const helpers = require('./helpers');


module.exports = webpackMerge(commonConfig, {
 

  devtool: 'source-map',

 
  output: {
  
    path: helpers.root('holmes'),
    
    filename: '[name].[chunkhash].bundle.js',//'[name].[hash].js',

    sourceMapFilename: '[name].[chunkhash].bundle.map',

    
    chunkFilename: '[id].[chunkhash].chunk.js'//'[id].[hash].chunk.js'
  },




  module: {

    rules: [
    
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true
            }
          }
        }),
        include: [helpers.root('alarm/assets'), helpers.root('public'),helpers.root('alarm/app')]
      },
    ]

  },

  plugins: [

    new webpack.NoErrorsPlugin(),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: {
        keep_fnames: true
      }
    }),

   
    new ExtractTextPlugin('[name].[contenthash].css'),
    
    new DefinePlugin({
      'CONST': true,
    }),

   
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    })
  ],


  node: {
    global: true,
    crypto: 'empty',
    process: false,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }


});
