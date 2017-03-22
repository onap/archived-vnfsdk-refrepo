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
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');





module.exports = {
    entry: {
        'main': './alarm/main.browser.ts',
        'vendor': './alarm/vendor.ts',
        'polyfills': './alarm/polyfills.browser.ts'
    },
    resolve: {

        extensions: ['.js', '.ts', '.json'],
    },
    module: {

        rules: [
            {
                test: /\.ts$/,
                use: [

                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                        }
                    },
                    {
                        loader: 'angular2-template-loader'
                    }
                ],
                exclude: [/\.(spec|e2e)\.ts$/]
            },

            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader?sourceMap'],
                include: helpers.root('alarm', 'app'),
                exclude: [helpers.root('alarm/assets'), helpers.root('public')]
            },
            {
                test: /\.html$/,
                use: 'raw-loader',
                include: [helpers.root('alarm/app')],
                exclude: [helpers.root('alarm/index.html')]
            },


            {
                test: /\.(png|jpe?g|gif|ico|svg)$/,
                include: [helpers.root('public')
                ],
                use: 'file-loader?name=assets/images/[name].[hash].[ext]'
            },


            {
                test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                include: [helpers.root('public', 'thirdparty')
                ],
                use: 'file-loader?name=assets/fonts/[name].[hash].[ext]'
            }

        ],

    },

    plugins: [

        new CheckerPlugin(),

        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)alarm(\\|\/)linker/,
            helpers.root('alarm'),
            {
            }
        ),

        new HtmlWebpackPlugin({
            template: 'alarm/index.html',
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'vendor', 'polyfills']
        }),

    ]
};
