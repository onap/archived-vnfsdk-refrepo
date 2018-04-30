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
'use strict';

/**
 * @ngdoc function
 * @name app.route:userRoute
 * @description
 * # userRoute
 * Route of the app
 */

angular.module('user')
	.config(['$stateProvider', function ($stateProvider) {

		$stateProvider
			.state('home.user', {
				url:'/user',
				templateUrl: 'app/modules/user/user.html',
				controller: 'UserCtrl',
				controllerAs: 'vm'
			});


	}]);
