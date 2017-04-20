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
     * @ngdoc configuration file
     * @name app.config:config
     * @description
     * # Config and run block
     * Configutation of the app
     */


    angular
        .module('vnfmarket')
        .config(configure)
        .run(runBlock);

    configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$mdThemingProvider', '$translateProvider'];
    //red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
    function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $mdThemingProvider, $translateProvider) {
        // This is required for Browser Sync to work poperly
        //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // The above lines is commented for CORS
        // For CORS
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // END of CORS


        // Angualr material
        // $mdThemingProvider.theme('default')
        //     .primaryPalette('light-blue')
        //      .accentPalette('light-blue', {
        //       'hue-1': 'A100' // use shade 200 for default, and keep all other shades the same
        //     });

        $mdThemingProvider.definePalette('amazingPaletteName', {
            '50': 'ff8a80',
            '100': '#2E3243',
            '200': 'ef9a9a',
            '300': '#37474f',
            '400': '#37474f',
            '500': 'f44336',
            '600': 'e53935',
            '700': 'd32f2f',
            '800': 'c62828',
            '900': 'b71c1c',
            'A100': 'ff8a80',
            'A200': '#E1E4E5',
            'A400': '#858CA8',
            'A700': '#FFFFFF'
            });

            $mdThemingProvider.theme('default')
            .primaryPalette('amazingPaletteName',{
                'default' : 'A400',
                'hue-1' : "A700",
                'hue-2' : "100",
                'hue-3' : "A200"
            }).accentPalette('amazingPaletteName', {
            'hue-1' : 'A400'
            })

        $locationProvider.hashPrefix('!');

        // Default Routing
        $urlRouterProvider
            .otherwise('/marketplace');

        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useStaticFilesLoader({
            prefix: "/openoui/vnfmarket/common/locale/locale-",
            suffix: ".json"
        });
        $translateProvider.preferredLanguage('en')
    }

    runBlock.$inject = ['$rootScope'];

    function runBlock($rootScope) {
        'use strict';

        console.log('AngularJS run() function...');
    }


})();