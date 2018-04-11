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
(function () {
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
        .controller('onBoardingSuccessCtrl', onBoardingSuccess);

    onBoardingSuccess.$inject = ['vnfConfig', 'baseUrlConfig', 'homeService', '$state', '$stateParams'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function onBoardingSuccess(vnfConfig, baseUrlConfig, homeService, $state, $stateParams) {
        var vm = this;
        console.log("onBoardingSuccess");
        vm.services = [], vm.serviceDetails;

        var csarId = $stateParams.csarId;
        if (!csarId) {
            $state.go("home.marketplace", {});
            return;
        }

        vm.return = function () {
            $state.go('home.marketplace', {}, {
                reload: true
            });
        }
        vm.showDetailPage = function () {
            homeService.getFeaturesList().then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].createTime = new Date(response.data[i].createTime);
                    response.data[i].modifyTime = new Date(response.data[i].modifyTime);
                }
                vm.services = response.data;

                for (var j = 0; j < response.data.length; j++) {
                    if (response.data[j].csarId == csarId) {
                        vm.serviceDetails = response.data[j];
                        break;
                    }
                }

                $state.go("home.serviceDetails.validation", {
                    serviceDetails: vm.serviceDetails
                });
            });
        }
    }
})();