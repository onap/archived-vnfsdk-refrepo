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
        .factory('onBoardingService', onBoardingService);

    onBoardingService.$inject = ['$q', 'vnfConfig', 'httpService', '$mdDialog'];

    function onBoardingService($q, vnfConfig, httpService, $mdDialog) {
        return {
            getFunctionalList: getFunctionalList,
            getOnBoardingSteps: getOnBoardingSteps
        };

        function getFunctionalList(csarId, operTypeId, operId) {
            var url = vnfConfig.api.home.getFunctionalList.url,
                method = vnfConfig.api.home.getFunctionalList.method;

            url = url.replace(":csarId", csarId);
            url += "?operTypeId="+operTypeId;
            url += "&operId="+operId;


            /*var response =
                {
                    "operTypeName": "Validation",
                    "operTypeId": "validation",
                    "oper": [{
                        "operId": "upload_id_1",
                        "operName": "XYZ",
                        "status": 0
                    }]
                };

            if(operTypeId == "lifecycletest" && operId == "lifecycle_id_2") {
                response =
                {
                    "operTypeName": "Validation",
                    "operTypeId": "validation",
                    "oper": [{
                        "operId": "upload_id_1",
                        "operName": "XYZ",
                        "status": 0
                    }]
                };
            }*/

            var defer = $q.defer();

            //defer.resolve(response);

            httpService.apiRequest(url, method)
                .then(function(response) {
                    defer.resolve(response);
                }, function(error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        function getOnBoardingSteps() {

            var url = vnfConfig.api.home.getOnBoardingSteps.url,
                method = vnfConfig.api.home.getOnBoardingSteps.method;

            var defer = $q.defer();

            /*var response = [
                {
                    "operTypeName": "Validation",
                    "operTypeId": "validation",
                    "oper": [{
                        "operId": "upload_id_1",
                        "operName": "XYZ"
                    }, {
                        "operId": "upload_id_2",
                        "operName": "XYZ"
                    }]
                },
                {
                    "operTypeName": "LifeCycle",
                    "operTypeId": "lifecycletest",
                    "oper": [{
                        "operId": "lifecycle_id_1",
                        "operName": "XYZ"
                    }, {
                        "operId": "lifecycle_id_2",
                        "operName": "XYZ"
                    }, {
                        "operId": "lifecycle_id_3",
                        "operName": "ZZZ"
                    }]
                },
                {
                    "operTypeName": "Function Test",
                    "operTypeId": "functiontest",
                    "oper": [
                        {
                            "operId": "packageExists",
                            "operName": "Check Package exists"
                        }, {
                            "operId": "download",
                            "operName": "Download Package from Repository"
                        },
                        {
                            "operId": "functestexec",
                            "operName": "Execute Function Testing"
                        },
                        {
                            "operId": "functestexec2",
                            "operName": "Execute Function Testing2"
                        },
                        {
                            "operId": "functestexec3",
                            "operName": "Execute Function Testing3"
                        }]
                }
            ];

            defer.resolve(response);*/


            httpService.apiRequest(url, method)
                .then(function(response) {
                    defer.resolve(response);
                }, function(error) {
                    defer.reject(error);
                });
            return defer.promise;
        }
    }

})();