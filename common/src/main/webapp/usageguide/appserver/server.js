/*

    Copyright 2016-2017, Huawei Technologies Co., Ltd.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var http=require("http");
var path=require('path');


// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//app.use(express.static(path.join(__dirname, '../' , 'browser')));
app.use(express.static(path.join(__dirname, '../../../', 'common')));
app.use(express.static(path.join(__dirname, '../' , 'browser')));

// Routes
app.use('/api', require('./api'));

// viewed at http://localhost:3000
app.get('/', function(req, res) {
	//res.sendFile(path.join(__dirname, '../' , 'browser/index.html'));
	//res.sendFile(__dirname + '/../browser/index.html');
    res.sendFile(path.join(__dirname, '../' , 'browser/index.html'));
});

// Start server
app.listen(4000);
console.log('API is running on port 4000');
console.log('API @@@@');