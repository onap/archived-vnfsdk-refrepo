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
        .controller('serviceUploadCtrl', ServiceUpload);

    ServiceUpload.$inject = ['serviceUploadService', '$scope', 'vnfConfig', '$mdDialog', '$mdToast', '$rootScope', '$interval', 'baseUrlConfig', '$state', 'isUpload', 'csarId'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function ServiceUpload(serviceUploadService, $scope, vnfConfig, $mdDialog, $mdToast, $rootScope, $interval, baseUrlConfig, $state, isUpload, csarId) {
        var vm = this;
        vm.isUpload = isUpload;
        vm.csarId = csarId
        vm.apiInfo = 0;
        vm.status = "Idle";
        vm.promise = null;
        vm.service = {};

        vm.hide = function (answer) {
            $mdDialog.hide(answer);
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.answer = function (answer) {
            vm.status = "progress";
            var dataObj = vm.service,
                file = vm.service.file,
                fd = new FormData(),
                params = {
                    "details": vm.service.details ? vm.service.details : "",
                    "shortDesc": vm.service.shortDesc ? vm.service.shortDesc : "",
                    "remarks": vm.service.remarks ? vm.service.remarks : ""
                };
            fd.append("file", file);
            fd.append("params", JSON.stringify(params));

            var headers = {
                "Content-Type": undefined
            }

            vm.promise = $interval(function () {
                if ($rootScope.progressBar >= 80 && vm.status !== "success") {
                    vm.apiInfo = 80;
                } else {
                    vm.apiInfo = parseInt($rootScope.progressBar, 10);
                }
            }, 500);

            if (vm.isUpload) {
                var filename = vm.service.file.name;
                serviceUploadService.postServiceUpload(fd, headers)
                    .then(function (response) {
                        vm.hide("Uploading")
                        $state.go('home.onboarding', { "csarId": response.data.csarId, "csarName": filename });
                    });
            } else {
                serviceUploadService.repostServiceUpload(fd, headers, vm.csarId)
                    .then(function (response) {
                        vm.hide("Uploading")
                        $state.go('home.onboarding', { "csarId": response.data.csarId, "csarName": filename });
                    });
            }
        };

        $scope.$on("$destroy", function () {
            if (vm.promise) {
                $interval.cancel(vm.promise);
            }
        })
    }
})();