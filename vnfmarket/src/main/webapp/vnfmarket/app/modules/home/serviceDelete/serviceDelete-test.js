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
     * @name app.test:homeTest
     * @description
     * # homeTest
     * Test of the app
     */
     angular
            .module('vnfmarket')
            .constant("serviceDetails", {
                "csarId": "26b4d6c4-a157-43c0-8ebc-9d6af1d6c40c",
                "name": "clearwater_vnf",
                "downloadUri": "null/files/catalog-http/NFAR/Canonical/clearwater_vnf/v1.0/clearwater_vnf.csar",
                "report": "/Demo/reports/b3232e0c-3843-4df8-88e7-734cf2d7a97c/report.html",
                "size": "1.8 MB",
                "version": "v1.0",
                "provider": "Canonical",
                "type": "NFAR",
                "format": "yaml",
                "deletionPending": false,
                "createTime": "2017-02-22 08:59:06",
                "modifyTime": "2017-02-22 08:59:06",
                "shortDesc": "",
                "details": "",
                "remarks": ""
            })

    describe('Home - serviceDeleteCtrl', function() {
        var controller = null,
            $scope = null,
            $location, service, httpBackend, config, state, blah;

        beforeEach(function() {
            module('vnfmarket');
        });
        beforeEach(module('ui.router'));
        beforeEach(module('md.data.table'));
        beforeEach(module('pascalprecht.translate'));

        beforeEach(inject(function($controller, $rootScope, serviceDeleteService, $httpBackend, vnfConfig, serviceDetails) {
            $scope = $rootScope.$new();
            service = serviceDeleteService;
            httpBackend = $httpBackend;
            config = vnfConfig;
            blah = serviceDetails;
            controller = $controller('serviceDeleteCtrl', {
                $scope: $scope
            });
        }));

        it('Should serviceDeleteCtrl must be defined', function() {
            expect(controller).toBeDefined();
        });

        it('Delete service for a valid scenario', function() {
            var csarId = "26b4d6c4-a157-43c0-8ebc-9d6af1d6c40c", url = config.common.baseUrl + config.api.home.serviceDelete.url;
            url = url.replace(":csarId", csarId);
            httpBackend.whenDELETE(url).respond(200, {});

            var returnData = {};
            httpBackend.expectDELETE(url).respond(returnData);

            service.serviceDelete(csarId).then(function(response) {
                expect(response.status).toBeDefined();
                expect(response.status).toBe(200);
            });
            httpBackend.flush();
        });

        // it('Delete service for a valid scenario', function() {
        //     var csarId = "Test-26b4d6c4-a157-43c0-8ebc-9d6af1d6c40c-test", url = config.common.baseUrl + config.api.home.serviceDelete.url;
        //     url = url.replace(":csarId", csarId);
        //     httpBackend.whenDELETE(url).respond(500, { "errorText"  : "Invalid"});

        //     var returnData = {}, code;
        //     httpBackend.expectDELETE(url).respond(returnData);

        //     service.serviceDelete(csarId).then(function(response) {
        //         expect(response.data).toBeDefined();
        //         expect(response.data).toBe("Invalid");
        //     });
        //     httpBackend.flush();
        // });
    });
})();