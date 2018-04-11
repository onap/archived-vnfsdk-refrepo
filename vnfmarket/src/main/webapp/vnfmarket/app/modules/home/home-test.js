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
     * @name app.test:homeTest
     * @description
     * # homeTest
     * Test of the app
     */

    describe('Home - Marketplace', function () {
        var controller = null,
            $scope = null,
            $location, service, httpBackend, config, state;

        beforeEach(function () {
            module('vnfmarket');
        });
        beforeEach(module('ui.router'));
        beforeEach(module('md.data.table'));
        beforeEach(module('pascalprecht.translate'));

        beforeEach(inject(function ($controller, $rootScope, _$location_, homeService, $httpBackend, vnfConfig, $state) {
            $scope = $rootScope.$new();
            $location = _$location_;
            service = homeService;
            httpBackend = $httpBackend;
            config = vnfConfig;
            state = $state;
            controller = $controller('HomeCtrl', {
                $scope: $scope
            });
        }));

        it('Should HomeCtrl must be defined', function () {
            expect(controller).toBeDefined();
        });

        it('Service List response should be of type array', function () {
            var data = [{
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
            }];
            httpBackend.whenGET(config.common.baseUrl + config.api.home.getFeaturesList.url).respond(200, data);

            var returnData = {};
            httpBackend.expectGET(config.common.baseUrl + config.api.home.getFeaturesList.url).respond(returnData);

            service.getFeaturesList().then(function (response) {
                expect(response.data).toBeDefined();
                expect(Array.isArray(response.data)).toBeTruthy();
            });
            httpBackend.flush();
        });

        it('Service List response is not of array type', function () {
            var data = {};
            httpBackend.whenGET(config.common.baseUrl + config.api.home.getFeaturesList.url).respond(200, data);

            var returnData = {};
            httpBackend.expectGET(config.common.baseUrl + config.api.home.getFeaturesList.url).respond(returnData);

            service.getFeaturesList().then(function (response) {
                expect(response.data).toBeDefined();
                expect(Array.isArray(response.data)).toBeFalsy();
            });
            httpBackend.flush();
        });

        it('Service List response should contain service details', function () {
            var returnData = {};
            var data = [{
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
            }];
            httpBackend.whenGET(config.common.baseUrl + config.api.home.getFeaturesList.url).respond(200, data);

            httpBackend.expectGET(config.common.baseUrl + config.api.home.getFeaturesList.url).respond(returnData);
            service.getFeaturesList().then(function (response) {
                expect(response.data).toBeDefined();
                var serviceDetails = response.data[0];
                expect(serviceDetails.csarId).toBeDefined();
                expect(serviceDetails.name).toBeDefined();
                expect(serviceDetails.downloadUri).toBeDefined();
                expect(serviceDetails.report).toBeDefined();
                expect(serviceDetails.size).toBeDefined();
                expect(serviceDetails.version).toBeDefined();
                expect(serviceDetails.provider).toBeDefined();
                expect(serviceDetails.type).toBeDefined();
                expect(serviceDetails.format).toBeDefined();
                expect(serviceDetails.deletionPending).toBeDefined();
                expect(serviceDetails.createTime).toBeDefined();
                expect(serviceDetails.modifyTime).toBeDefined();
                expect(serviceDetails.shortDesc).toBeDefined();
                expect(serviceDetails.details).toBeDefined();
                expect(serviceDetails.remarks).toBeDefined();
            });
            httpBackend.flush();
        });

        it('Should match the path Module name', function () {
            $location.path('/marketplace');
            expect($location.path()).toBe('/marketplace');
        });

        it('Path to the state home has to be defined', function () {
            expect(state.href("home")).toBe('#!');
        });

        it('Path to the state home.marketplace has to be defined', function () {
            expect(state.href("home.marketplace")).toBe('#!/marketplace');
        });

        it('Path to the state home.serviceDetails has to be defined', function () {
            expect(state.href("home.serviceDetails")).toBe('#!/serviceDetails');
        });

        it('When a state is invalid', function () {
            expect(state.href("blah")).toBeNull('/marketplace');
        });
    });
})();