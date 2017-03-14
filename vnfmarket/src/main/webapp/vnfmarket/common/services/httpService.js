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
     * @name app.service:homeService
     * @description
     * # homeService
     * Service of the app
     */

    angular.module('vnfmarket')
        .factory('httpService', httpService);

    httpService.$inject = ['$http', '$q', '$rootScope', '$mdDialog'];

    function httpService($http, $q, $rootScope, $mdDialog) {
        return {
            apiRequest: apiRequest,
            apiRequestWithProgress: apiRequestWithProgress
        };

        function apiRequest(url, method, data, headers) {
            var defer = $q.defer()
            $http({
                method: method,
                url: url,
                data: data,
                headers: headers
            }).then(function successCallback(response) {
                defer.resolve(response);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(error) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent:parentEl,
                    templateUrl:'vnfmarket/common/templates/serverError.html',
                    locals:{
                        error:error
                    },
                    skipHide:true,
                    controller:function($scope, $mdDialog, error){
                        $scope.error = error;
                        $scope.closeDialog= function(){
                            $mdDialog.hide();
                        }
                    }
                });
                defer.reject(error);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return defer.promise;
        }

        function apiRequestWithProgress(url, method, data, headers) {
            var defer = $q.defer()
            $http({
                method: method,
                url: url,
                data: data,
                headers: headers,
                transformRequest: angular.identity,
                uploadEventHandlers: {
                    progress: function(e) {
                        if (e.lengthComputable) {
                            $rootScope.progressBar = (e.loaded / e.total) * 100;
                        }
                    }
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(error) {
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent:parentEl,
                    templateUrl:'vnfmarket/common/templates/serverError.html',
                    locals:{
                        error:error
                    },
                    skipHide:true,
                    controller:function($scope, $mdDialog, error){
                        $scope.error = error;
                        $scope.closeDialog= function(){
                            $mdDialog.hide();
                        }
                    }

                });
                defer.reject(error);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return defer.promise;
        }
    }
})();