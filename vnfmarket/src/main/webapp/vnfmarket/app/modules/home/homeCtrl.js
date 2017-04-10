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
        .controller('HomeCtrl', Home);

    Home.$inject = ['$mdDialog', 'homeService', 'vnfConfig', '$state'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function Home($mdDialog, homeService, vnfConfig, $state) {
        /*jshint validthis: true */
        var vm = this;
        vm.showSearch = true;
        vm.hasGridView = localStorage.getItem("viewType") === "list" ? false : true;
        if (!localStorage.getItem("viewType")) {
            localStorage.setItem("viewType", "grid");
        }
        vm.SpinClass = "";

        vm.filter = {
            "search": '',
            "name": 'TableList'
        };

        vm.listViewActions = {
            "search": ""
        }

        vm.pagination = [5, 10, 15, {
            label: 'All',
            value: function() {
                return vm.services.length ? vm.services.length : 0;
            }
        }];

        vm.paginationQuery = {
            order: "name",
            limit: 10,
            page: 1
        };

        vm.paginationOptions = {
            rowSelect: false,
            multiSelect: false,
            autoSelect: false,
            //autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLink: true,
            limitSelect: true,
            pageSelect: true
        };

        vm.getFeatureList = function() {
            vm.SpinClass = "fa-spin"
            homeService.getFeaturesList().then(function(response) {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].createTime = new Date(response.data[i].createTime);
                    response.data[i].modifyTime = new Date(response.data[i].modifyTime);
                }
                vm.services = response.data;
                vm.SpinClass = ""
            });
        }

        vm.downloadService = function(csarId) {
			homeService.updateDownloadCount(csarId).then(function(response){
				homeService.downloadServiceFile(csarId);
                vm.getFeatureList();
			});
            
        }

        vm.changeView = function(viewType) {
            vm.hasGridView = !vm.hasGridView;
            localStorage.setItem('viewType', viewType);
        }

        vm.showDetails = function(serviceDetails) {
            $state.go('home.serviceDetails', {
                serviceDetails: serviceDetails
            });
        }

        vm.serviceUpload = function(isUpload, csarId) {
			homeService.openUploadDialog(vm.getFeatureList, isUpload, csarId);
        };
		

        vm.onDeleteCompletion = function() {
            vm.getFeatureList();
        }

        vm.serviceDelete = function(serviceDetails) {
            homeService.openDeleteDialog(serviceDetails, vm.onDeleteCompletion);
        };

        vm.getFeatureList();
    }

})();