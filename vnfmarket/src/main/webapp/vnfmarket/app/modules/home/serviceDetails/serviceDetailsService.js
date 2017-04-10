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
        .factory('serviceDetailsService', ServiceDetails);

    ServiceDetails.$inject = ['$q', 'vnfConfig', 'httpService'];

    function ServiceDetails($q, vnfConfig, httpService) {
        return {
            serviceDetails: serviceDetails
        };

        function serviceDetails(csarId) {
            var url = vnfConfig.api.home.serviceDetails.url,
                method = vnfConfig.api.home.serviceDetails.method;

            url = url.replace(":csarId", csarId)

            var defer = $q.defer()
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