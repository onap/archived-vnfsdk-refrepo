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
(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:aboutCtrl
	* @description
	* # aboutCtrl
	* Controller of the app
	*/

  	angular
		.module('about')
		.controller('AboutCtrl', About);

		About.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function About() {
			/*jshint validthis: true */
			var vm = this;

		}

})();
