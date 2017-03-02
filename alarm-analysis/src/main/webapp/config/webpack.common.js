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
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');


module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',   
        'vendor': './src/vendor.ts',        
        'app': './src/main.ts'               
    },

    resolve: {
        extensions: ['', '.js', '.ts']        
    },
    require:"../public/common/js/popModal.js",

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']

            },
            
            {   
                test: /\.html$/,
                loader: 'html'
            },
            {   
                test: /\.(png|jpe?g|gif|ico|svg)$/,
                include: [helpers.root('public', 'images'),helpers.root('public', 'component/thirdparty/uniform/images'),
                    helpers.root('public', 'framework/img'),
                    helpers.root('public', 'component/thirdparty/zTree/css/zTreeStyle/img'),
                    helpers.root('public', 'component/thirdparty/icheck/skins/line'),
                    helpers.root('public', 'component/thirdparty/icheck/skins/square'),
                    helpers.root('public', 'component/'),
                ],
                loader: 'file?name=public/images/[name].[hash].[ext]'
            },
            {   
                test: /\.(svg|woff|woff2|ttf|eot)$/,
                include: [helpers.root('public', 'fonts'),helpers.root('public', 'component/css/ZteIctIcons/fonts'),
                    helpers.root('public', 'component/thirdparty/bootstrap/fonts')
                ],
                loader: 'file?name=public/fonts/[name].[hash].[ext]'
            },
            {   
                test: /\.css$/,
                exclude: [helpers.root('src', 'app'),helpers.root('public', 'component/thirdparty/icheck/skins/line')
            ],
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw'
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html',
        })
    ]
};
