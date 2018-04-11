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
     * @name app.service:homeService
     * @description
     * # homeService
     * Service of the app
     */

    angular.module('vnfmarket')
        .factory('homeService', homeService);

    homeService.$inject = ['$q', 'vnfConfig', 'httpService', '$mdDialog'];

    function homeService($q, vnfConfig, httpService, $mdDialog) {
        return {
            getFeaturesList: getFeaturesList,
            downloadServiceFile: downloadServiceFile,
            openDeleteDialog: openDeleteDialog,
            updateDownloadCount: updateDownloadCount,
            openUploadDialog: openUploadDialog
        };

        function getFeaturesList() {
            var url = vnfConfig.api.home.getFeaturesList.url,
                method = vnfConfig.api.home.getFeaturesList.method;

            var defer = $q.defer()
            httpService.apiRequest(url, method)
                .then(function (response) {
                    defer.resolve(response);
                }, function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        function updateDownloadCount(csarId) {
            var url = vnfConfig.api.home.updateDownloadCount.url;
            var method = vnfConfig.api.home.updateDownloadCount.method;
            url = url.replace(":csarId", csarId)
            var defer = $q.defer()
            httpService.apiRequest(url, method)
                .then(function (response) {
                    defer.resolve(response);
                }, function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        function downloadServiceFile(csarId) {
            var url = vnfConfig.api.home.downloadServiceFile.url;
            url = url.replace(":csarId", csarId);
            window.location.href = url;
        }

        function openDeleteDialog(serviceDetails, callbackFunction) {
            $mdDialog.show({
                controller: 'serviceDeleteCtrl',
                templateUrl: vnfConfig.modulePath.home + '/serviceDelete/serviceDelete.html',
                serviceDetails: serviceDetails,
                controllerAs: 'vm'
            })
                .then(function (answer) {
                    //vm.status = 'You said the information was "' + answer + '".';
                    callbackFunction();
                }, function () {
                    //vm.status = 'You cancelled the dialog.';
                });
        }

        function openUploadDialog(callbackFunction, isUpload, csarId) {
            $mdDialog.show({
                controller: 'serviceUploadCtrl',
                templateUrl: vnfConfig.modulePath.home + '/serviceUpload/serviceUpload.html',
                controllerAs: 'vm',
                isUpload: isUpload,
                csarId: csarId ? csarId : null
            })
                .then(function (answer) {
                    if (callbackFunction)
                        callbackFunction();
                    // vm.status = 'You said the information was "' + answer + '".';
                }, function () {
                    // vm.status = 'You cancelled the dialog.';
                });
        }

    }

})();