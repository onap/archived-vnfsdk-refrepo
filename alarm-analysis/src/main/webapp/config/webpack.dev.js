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
const webpackMerge = require('webpack-merge'); 
const commonConfig = require('./webpack.common.js');  
const helpers = require('./helpers');


/**
 * Webpack Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = webpackMerge(commonConfig, {


 

  devtool: 'source-map',



  output: {


   
    path: helpers.root('holmes'),

    
    filename: '[name].bundle.js',

    
    sourceMapFilename: '[name].map',

    
    chunkFilename: '[id].chunk.js'
  },



  module: {

    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: 'tslint.json',
              fileOutput: {
                dir: './foo/',

                ext: 'xml',

                clean: true,

                header: '<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="5.7">',

                footer: '</checkstyle>'
              }
            }
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      {
        test: /\.css$/,
        use: ['to-string-loader', 'style-loader', 'css-loader'],
        include: [helpers.root('alarm/assets'), helpers.root('public')]
      },

    ]

  },



  plugins: [
   

    new CopyWebpackPlugin([
      { from: helpers.root('public/thirdparty/js/jquery_1.12.4.min.js'), to: helpers.root('holmes/public/js') },
      { from: helpers.root('public/common/js/popModal.js'), to: helpers.root('holmes/public/js') },
      { from: helpers.root('public/common/js/jQuery-File-Upload/js/jquery.ui.widget.js'), to: helpers.root('holmes/public/js') },
      { from: helpers.root('public/common/js/jQuery-File-Upload/js/vendor/jquery.ui.widget.js'), to: helpers.root('holmes/public/js') },
      { from: helpers.root('public/common/js/jQuery-File-Upload/js/jquery.iframe-transport.js'), to: helpers.root('holmes/public/js') },
      { from: helpers.root('public/common/js/jQuery-File-Upload/js/jquery.fileupload.js'), to: helpers.root('holmes/public/js') },
      { from: helpers.root('i18n'), to: helpers.root('holmes/i18n') },
      { from: helpers.root('public/thirdparty/images/'), to: helpers.root('holmes/public/thirdparty/images') }
    ]),


   
    new DefinePlugin({
      VERSION: JSON.stringify('version'),
      CONST2: JSON.stringify('CONST2')
    }),

    
  ],




 
  devServer: {

    port: 9528, 

    host: '10.74.24.20', 

    historyApiFallback: true,

    inline: true, 

    progress: true, 

    colors: true, 

    watch: false
  },


  node: {
    global: true,
    console: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }



});
