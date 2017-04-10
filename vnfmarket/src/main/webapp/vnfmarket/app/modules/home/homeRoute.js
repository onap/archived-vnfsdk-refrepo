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
'use strict';

/**
 * @ngdoc function
 * @name app.route:HomeRoute
 * @description
 * # HomeRoute
 * Route of the app
 */

angular.module('vnfmarket')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, vnfConfig) {

        var homePath = 'vnfmarket/app/modules/home';
        $stateProvider
            .state('home', {
                url: '',
                abstract: true,
                templateUrl: homePath + '/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm'
            })
            .state('home.marketplace', {
                url: '/marketplace',
                templateUrl: homePath + '/marketplace.html'
            })
            .state('home.serviceDetails', {
                url: '/serviceDetails',
                templateUrl: homePath + '/serviceDetails/serviceDetails.html',
                params: {
                    serviceDetails: undefined
                },
                controller: 'serviceDetailsCtrl',
                controllerAs: 'vm'
            })
            .state('home.serviceDetails.validation', {
                url: '/validation',
                templateUrl: homePath + '/serviceDetails/validation/view.html',
                controller: 'validationCtrl',
                controllerAs: 'vm'
            })
            .state('home.serviceDetails.functionTest', {
                url: '/functionTest',
                templateUrl: homePath + '/serviceDetails/functionalTest/view.html',
                controller: 'functionalTestCtrl',
                controllerAs: 'vm',
                params: {
                    csarId: undefined
                }
            })
            .state('home.serviceDetails.lifeCycle', {
                url: '/lifeCycle',
                templateUrl: homePath + '/serviceDetails/lifeCycle/view.html',
                controller: 'lifeCycleCtrl',
                controllerAs: 'vm'
            })
            .state('home.onboarding', {
                url: '/onboarding',
                templateUrl: homePath + '/serviceUpload/onboarding/onboarding.html',
                params: {
                    csarId: undefined
                },
                controller: 'onBoardingCtrl',
                controllerAs: 'vm'
            })
            .state('home.onboardingSuccess', {
                url: '/onboardingSuccess',
                templateUrl: homePath + '/serviceUpload/onboarding/onboardingSuccess.html',
                params: {
                    csarId: undefined
                },
                controller: 'onBoardingSuccessCtrl',
                controllerAs: 'vm'
            });
    }]);