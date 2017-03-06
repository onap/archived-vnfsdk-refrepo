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
        .controller('serviceDeleteCtrl', ServiceDelete);

    ServiceDelete.$inject = ['serviceDeleteService', '$mdDialog', '$mdToast', 'serviceDetails'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function ServiceDelete(serviceDeleteService, $mdDialog, $mdToast, serviceDetails) {
        var vm = this;
        vm.serviceDetails = serviceDetails;

        vm.hide = function() {
            $mdDialog.hide();
        };

        vm.cancel = function() {
            $mdDialog.cancel();
        };

        vm.answer = function(answer) {
            serviceDeleteService.serviceDelete(vm.serviceDetails.csarId)
                .then(function(response) {
                    $mdDialog.hide(response);
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Service deleted successfully')
                        .position("bottom right")
                        .action('Ok')
                        .theme('success-toast')
                    );
                });
        };
    }
})();