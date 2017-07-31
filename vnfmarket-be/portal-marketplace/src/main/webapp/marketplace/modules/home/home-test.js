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
(function () {
	'use strict';

	/**
	* @ngdoc function
	* @name app.test:homeTest
	* @description
	* # homeTest
	* Test of the app
	*/

	describe('homeCtrl', function () {
		var controller = null, $scope = null, $location;

		beforeEach(function () {
			module('vnfmarket');
		});

		beforeEach(inject(function ($controller, $rootScope, _$location_) {
			$scope = $rootScope.$new();
			$location = _$location_;

			controller = $controller('HomeCtrl', {
				$scope: $scope
			});
		}));

		it('Should HomeCtrl must be defined', function () {
			expect(controller).toBeDefined();
		});

		it('Should match the path Module name', function () {
			$location.path('/home');
			expect($location.path()).toBe('/home');
		});

	});
})();
