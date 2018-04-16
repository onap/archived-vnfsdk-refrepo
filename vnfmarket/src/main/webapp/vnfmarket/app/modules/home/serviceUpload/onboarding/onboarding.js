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
        .controller('onBoardingCtrl', onBoarding);

    onBoarding.$inject = ['vnfConfig', 'baseUrlConfig', '$interval', '$timeout', '$state', '$mdDialog', '$stateParams', 'onBoardingService'];

    /*
     * recommend
     * Using function declarations
     * and bindable members up top.
     */

    function onBoarding(vnfConfig, baseUrlConfig, $interval, $timeout, $state, $mdDialog, $stateParams, onBoardingService) {
        var vm = this;
        console.log("functionalTest");
        var timer;
        $timeout.cancel(timer);

        $(".onboardProgress .progress1 .progressDiv").removeClass("progressed");
        $(".onboardProgress .progress1 .roundProg").removeClass("progressed");

        $(".onboardProgress .progress2 .progressDiv").removeClass("progressed");
        $(".onboardProgress .progress2 .roundProg").removeClass("progressed");

        $(".onboardProgress .progress3 .progressDiv").removeClass("progressed");
        $(".onboardProgress .progress3 .roundProg").removeClass("progressed");
        var fileName = $stateParams.csarName;

        vm.mainTitle = fileName ? fileName.slice(0, fileName.lastIndexOf(".")) : '';

        //vm.mainTitle = $stateParams.csarName;//"clearwater_ns";
        var csarId = $stateParams.csarId;
        if (!csarId) {
            $state.go("home.marketplace", {});
            return;
        }

        /*onBoardingService.getFunctionalList(csarId).then(function(response) {
            vm.functionalDataList = response.data;
        });*/

        vm.getIconClass = function (status) {
            var classIcon = "";
            if (status == undefined || status == 1) {
                //classIcon = "fa fa-clock-o";
                classIcon = "clock-icon";
            }
            else if (status == 2) {
                //classIcon = "fa fa-spinner fa-spin";
                classIcon = "progress-icon fa-spin";
            }
            else if (status == 0) {
                //classIcon = "fa fa-check-circle";
                classIcon = "success-icon";
            }
            else if (status == -1) {
                classIcon = "failed-icon fa fa-exclamation";
            }
            return classIcon;
        };

        vm.validation = [];
        vm.lifeCycle = [];
        vm.functional = [];
        var currentIteration = {};

        onBoardingService.getOnBoardingSteps().then(function (response) {

            var operTypeList = response.data.operTypeList;
            for (var i = 0; i < operTypeList.length; i++) {

                switch (operTypeList[i].operTypeId) {
                    case "validation":
                        vm.validation = operTypeList[i];
                        //addDefaultStatus(vm.validation);
                        break;
                    case "lifecycletest":
                        vm.lifeCycle = operTypeList[i];
                        //addDefaultStatus(vm.lifeCycle);
                        break;
                    case "functiontest":
                        vm.functional = operTypeList[i];
                        //addDefaultStatus(vm.functional);
                        break;
                }
            }
            currentIteration = { "list": vm.validation, "item": 0 };

            updateStepStatus();
        });

        function addDefaultStatus(listArr) {
            for (var index = 0; index < listArr.oper.length; index++) {
                listArr.oper[index].status = 1;
            }
        }


        function updateStepStatus() {
            currentIteration.list.oper[currentIteration.item].status = 2; //Change the status to "In Progress"
            timer = $timeout(updateStepTimeout, 2000);
        }

        function updateStepTimeout() {
            //var listIterFinished = false;
            var operTypeId = currentIteration.list["operTypeId"];
            var operId = currentIteration.list.oper[currentIteration.item].operId;

            if (operTypeId == "validation" || operTypeId == "lifecycletest") {
                updateView(0);
            }
            else {

                onBoardingService.getFunctionalList(csarId, operTypeId, operId).then(function (response) {
                    var stepStatus = -1; // Step not started, todo
                    if (response.data.operResult.length > 0) {
                        stepStatus = response.data.operResult[0].status;
                    }

                    updateView(stepStatus);
                });
            }
        }

        function updateView(stepStatus) {
            var listIterFinished = false;
            if (stepStatus == 0) {
                currentIteration.list.oper[currentIteration.item].status = stepStatus;
                //Success, go to next step
                if (currentIteration.list.oper.length - 1 > currentIteration.item) {
                    currentIteration.item++;
                }
                else {
                    //Choose next list
                    if (currentIteration.list == vm.validation) {
                        //First list is completed
                        $(".onboardProgress .progress1 .progressDiv").addClass("progressed");
                        $(".onboardProgress .progress1 .roundProg").addClass("progressed");
                        /*currentIteration.list = vm.lifeCycle;
                        currentIteration.item = 0*/

                        listIterFinished = true;
                        $state.go('home.onboardingSuccess', { "csarId": csarId });
                    }
                    /*else if(currentIteration.list == vm.lifeCycle){
                        //Second list is completed
                        $(".onboardProgress .progress2 .progressDiv").addClass("progressed");
                        $(".onboardProgress .progress2 .roundProg").addClass("progressed");

                        currentIteration.list = vm.functional;
                        currentIteration.item = 0
                    }
                    else {
                        //Third list is completed
                        $(".onboardProgress .progress3 .progressDiv").addClass("progressed");
                        $(".onboardProgress .progress3 .roundProg").addClass("progressed");
                        listIterFinished = true;
                        $state.go('home.onboardingSuccess', {"csarId": csarId});
                    }*/
                }
            }
            else if (stepStatus == -1) {
                //Failed case
                currentIteration.list.oper[currentIteration.item].status = stepStatus;
                listIterFinished = true;
            }

            if (!listIterFinished) {
                updateStepStatus();
            }
        }

        vm.displayValidationDialog = function () {
            $mdDialog.show({
                controller: 'validationOnboardingCtrl',
                templateUrl: vnfConfig.modulePath.home + '/serviceUpload/onboarding/validation/view.html',
                controllerAs: 'vm'
            })
                .then(function (answer) {
                    vm.getFeatureList();
                    // vm.status = 'You said the information was "' + answer + '".';
                }, function () {
                    // vm.status = 'You cancelled the dialog.';
                });
        }
        vm.displayLifecycleDialog = function () {
            $mdDialog.show({
                controller: 'lifeCycleOnboardingCtrl',
                templateUrl: vnfConfig.modulePath.home + '/serviceUpload/onboarding/lifeCycle/view.html',
                controllerAs: 'vm'
            })
                .then(function (answer) {
                    vm.getFeatureList();
                    // vm.status = 'You said the information was "' + answer + '".';
                }, function () {
                    // vm.status = 'You cancelled the dialog.';
                });
        }
        vm.displayFunctionalTestDialog = function () {
            $mdDialog.show({
                controller: 'functionalTestOnboardingCtrl',
                templateUrl: vnfConfig.modulePath.home + '/serviceUpload/onboarding/functionalTest/view.html',
                controllerAs: 'vm'
            })
                .then(function (answer) {
                    vm.getFeatureList();
                    // vm.status = 'You said the information was "' + answer + '".';
                }, function () {
                    // vm.status = 'You cancelled the dialog.';
                });
        }
    }
})();