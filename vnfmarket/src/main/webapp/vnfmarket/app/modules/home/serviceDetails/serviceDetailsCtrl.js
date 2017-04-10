/*
 * Copyright 2017 Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name app.controller:HomeCtrl
     * @description
     * # HomeCtrl
     * Controller of the app
     */

    angular
        .module('vnfmarket')
        .controller('serviceDetailsCtrl', ServiceDetail);

    ServiceDetail.$inject = ['serviceDetailsService', '$state', '$stateParams', 'vnfConfig', 'homeService', 'baseUrlConfig'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function ServiceDetail(serviceDetailsService, $state, $stateParams, vnfConfig, homeService, baseUrlConfig) {
        var vm = this;
        vm.index = 0;
		vm.active = 'validation';
        if (!$stateParams.serviceDetails) {
            $state.go('home.marketplace');
            return;
        }

        vm.service = $stateParams.serviceDetails;
        vm.service.funcTestReportUrl = baseUrlConfig.common.ip + ":" + baseUrlConfig.common.port + vm.service.report;

        vm.downloadService = function(csarId) {
            homeService.updateDownloadCount(csarId).then(function(response){
                homeService.downloadServiceFile(csarId);
            })
        }

        vm.onDeleteCompletion = function() {
            $state.go('home.marketplace', {}, {
                reload: true
            });
        }

        vm.serviceDelete = function(serviceDetails) {
            homeService.openDeleteDialog(serviceDetails, vm.onDeleteCompletion);
        };
		
		vm.navigateValidation = function() {
			vm.active = 'validation';
            $state.go('home.serviceDetails.validation');
        };
		
		vm.navigateLifecycle = function() {
			vm.active = 'lifeCycle';
            $state.go('home.serviceDetails.lifeCycle');
        };
		
		vm.navigationFunctionalTest = function() {
			vm.active = 'functionTest';
            $state.go('home.serviceDetails.functionTest', {
				csarId: vm.service.csarId
			});
        };

        vm.navigateTab = function(sref, index) {
            $state.go(sref);
            vm.index = index;
        };
		
		vm.reupload = function(isUpload, csarId){
			homeService.openUploadDialog(null, isUpload, csarId);
		}

        if(!$state.current.name.startsWith("home.serviceDetails.")){
			$state.go('home.serviceDetails.validation');
		} else {
			if($state.current.name.endsWith("validation")){
				vm.active = 'validation';
			} else if ($state.current.name.endsWith("lifeCycle")){
				vm.active = 'lifeCycle';
			} else if($state.current.name.endsWith("functionTest")){
				vm.active = 'functionalTest';
			}
		}
    }
})();