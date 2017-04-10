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
        .controller('lifeCycleOnboardingCtrl', lifeCycle);

    lifeCycle.$inject = [ 'vnfConfig', 'baseUrlConfig', '$mdDialog'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function lifeCycle(vnfConfig, baseUrlConfig,$mdDialog) {
        var vm = this;
        console.log("functionalTest")
        vm.filter = {
            "search": '',
            "name": 'step'
        };

        vm.listViewActions = {
            "search": ""
        }

        vm.pagination = [5, 10, 15, {
            label: 'All',
            value: function() {
                return vm.lifeCycleTests.length ? vm.lifeCycleTests.length : 0;
            }
        }];

        vm.paginationQuery = {
            order: "step",
            limit: 10,
            page: 1
        };

        vm.paginationOptions = {
            rowSelect: false,
            multiSelect: false,
            autoSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLink: true,
            limitSelect: true,
            pageSelect: true
        };
        vm.getTests = function(){
            console.log(vm.lifeCycleTests)
        }
		
		
		vm.hide = function(answer) {
            $mdDialog.hide(answer);
        };

        vm.cancel = function() {
            $mdDialog.cancel();
        };

        vm.lifeCycleTests =  [{
                "step" : "Lifecycle step-1",
                "parameter" : "Lifecycle Parameter1",
                "result" : "pass"
            },
            {
                "step" : "Lifecycle step-2",
                "parameter" : "Lifecycle Parameter2",
                "result" : "pass"
            },{
                "step" : "Lifecycle step-3",
                "parameter" : "Parameter3",
                "result" : "pass"
            }]
    }
})();