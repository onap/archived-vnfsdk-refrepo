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

    ServiceDetail.$inject = ['serviceDetailsService', '$state', '$stateParams', 'vnfConfig', 'homeService'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function ServiceDetail(serviceDetailsService, $state, $stateParams, vnfConfig, homeService) {
        var vm = this;
        if (!$stateParams.serviceDetails) {
            $state.go('home.marketplace');
            return;
        }

        vm.service = $stateParams.serviceDetails;
        vm.service.funcTestReportUrl = vnfConfig.common.baseUrl + vm.service.report;

        vm.downloadService = function(csarId) {
            homeService.downloadServiceFile(csarId);
        }

        vm.onDeleteCompletion = function() {
            $state.go('home.marketplace', {}, {
                reload: true
            });
        }

        vm.serviceDelete = function(serviceDetails) {
            homeService.openDeleteDialog(serviceDetails, vm.onDeleteCompletion);
        };
    }
})();