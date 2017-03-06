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

    describe('Home - serviceDetailsCtrl', function() {
        var controller = null,
            $scope = null,
            $location, stateParams, httpBackend, config, state, blah;
        var data = {
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
        };

        beforeEach(function() {
            module('vnfmarket');
        });
        beforeEach(module('ui.router'));
        beforeEach(module('md.data.table'));
        beforeEach(module('pascalprecht.translate'));

        beforeEach(inject(function($controller, $rootScope, $stateParams, $httpBackend, vnfConfig) {
            $scope = $rootScope.$new();
            stateParams = $stateParams;
            httpBackend = $httpBackend;
            config = vnfConfig;
            stateParams.serviceDetails = data;
            controller = $controller('serviceDetailsCtrl', {
                $scope: $scope
            });
        }));

        it('Should serviceDetailsCtrl must be defined', function() {
            expect(controller).toBeDefined();
        });

        it('Receving state param service details', function() {
                expect(stateParams.serviceDetails.csarId).toBeDefined();
                expect(stateParams.serviceDetails.name).toBeDefined();
                expect(stateParams.serviceDetails.downloadUri).toBeDefined();
                expect(stateParams.serviceDetails.report).toBeDefined();
                expect(stateParams.serviceDetails.size).toBeDefined();
                expect(stateParams.serviceDetails.version).toBeDefined();
                expect(stateParams.serviceDetails.provider).toBeDefined();
                expect(stateParams.serviceDetails.type).toBeDefined();
                expect(stateParams.serviceDetails.format).toBeDefined();
                expect(stateParams.serviceDetails.deletionPending).toBeDefined();
                expect(stateParams.serviceDetails.createTime).toBeDefined();
                expect(stateParams.serviceDetails.modifyTime).toBeDefined();
                expect(stateParams.serviceDetails.shortDesc).toBeDefined();
                expect(stateParams.serviceDetails.details).toBeDefined();
                expect(stateParams.serviceDetails.remarks).toBeDefined();
        });
    });
})();