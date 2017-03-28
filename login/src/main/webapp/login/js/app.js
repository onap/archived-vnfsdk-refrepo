/*
    Copyright 2017, China Mobile Co., Ltd.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

var app = angular.module("POCApp", ["ui.router", "ngTable"])
    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider){
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url : '/login',
                templateUrl : '/openoui/login/html/login.html',
                controller : 'loginCtrl',
                authenticate: false
            })
            .state("menu", {
                url: "/menu",
                templateUrl : "/openoui/login/html/menu.html",
                controller : "menuCtrl",
                authenticate: true
            })
            .state("menu.serviceManagement", {
                url: "/serviceManagement",
                templateUrl : "/openoui/lifecyclemgr/index.html",
                controller : "serviceManagementCtrl",
                authenticate: true
            })
            .state("menu.resourceManagement", {
                url: "/resourceManagement",
               // templateUrl : "/openoui/resmgr/index.html",
		template : "<iframe src='../../openoui/resmgr/index.html' height=100% width=100%> </iframe>",
                controller : "resourceManagementCtrl",
                authenticate: true
            })
            .state("menu.provinceManagement", {
                url: "/provinceManagement",
                templateUrl : "/openoui/provincemgr/index.html",
                controller : "provinceManagementCtrl",
                authenticate: true
            })
            .state("menu.modelDesign", {
                url: "/modelDesign",
                templateUrl : "/openoui/login/html/temp/modelDesign.html",
                controller : "modelDesignCtrl",
                authenticate: true
            })
            .state("menu.package", {
                url: "/package",
                templateUrl : "/openoui/catalog/csarPackage.html",
                controller : "packageCtrl",
                authenticate: true
            })
            .state("menu.serviceTemplate", {
                url: "/serviceTemplate",
                templateUrl : "/openoui/catalog/template.html",
                controller : "serviceTemplateCtrl",
                authenticate: true
            })
            .state("menu.vimManage", {
                url: "/vimManage",
                templateUrl : "/openoui/extsys/vim/vimView.html",
                controller : "vimManageCtrl",
                authenticate: true
            })
            .state("menu.vnfm", {
                url: "/vnfm",
                templateUrl : "/openoui/extsys/vnfm/vnfmView.html",
                controller : "vnfmCtrl",
                authenticate: true
            })
            .state("menu.sdbController", {
                url: "/sdbController",
                templateUrl : "/openoui/login/html/temp/sdbController.html",
                controller : "sdbControllerCtrl",
                authenticate: true
            })
            .state("menu.performanceQuery", {
                url: "/performanceQuery",
                templateUrl : "/openoui/login/html/temp/performanceQuery.html",
                controller : "performanceQueryCtrl",
                authenticate: true
            })
            .state("menu.alarmQuery", {
                url: "/alarmQuery",
                templateUrl : "/openoui/login/html/temp/alarmQuery.html",
                controller : "alarmQueryCtrl",
                authenticate: true
            })
            .state("menu.parameterSetting", {
                url: "/parameterSetting",
                templateUrl : "/openoui/login/html/temp/parameterSetting.html",
                controller : "parameterSettingCtrl",
                authenticate: true
            })
            .state("menu.vnfMarket", {
                url: "/vnfMarket",
                templateUrl : "/openoui/vnfmarket/index.html",
                controller : "vnfMarketCtrl",
                authenticate: true
            })
    })

    /*Login Controller*/
    .controller('loginCtrl', function($scope, $rootScope, $stateParams, $state, LoginService) {
        $scope.loginFormInit = function() {
            $scope.error = "";
            if ($.cookie("loginkeeping") == "true") {
                $scope.user = {
                    'username': $.cookie("username"),
                    'password': $.cookie("password"),
                    'loginkeeping': true,
                };
            } else {
                $scope.user = {
                    'username': $.cookie("username"),
                    'password': $.cookie("password"),
                    'loginkeeping': false,
                };
            }
        };
        $scope.loginFormSubmit = function() {
            LoginService.login($scope.user)
                .then(function (response){
                    if ($scope.user.loginkeeping) {
                        $.cookie("loginkeeping", "true", {expires: 7});
                        $.cookie("username", $scope.user.username, {expires: 7});
                        $.cookie("password", $scope.user.password, {expires: 7});
                    } else {
                        $.cookie("loginkeeping", "false", {expire: -1});
                        $.cookie("username", "", {expires: -1});
                        $.cookie("password", "", {expires: -1});
                    }

                    $scope.error = "";
                    $state.transitionTo('menu');
                    //if (response.status == -1) {
                    //    $scope.error = "Incorrect username/password !";
                    //} else {
                    //    $scope.error = "";
                    //    $state.transitionTo('menu');
                    //}
                });
        };
    })

    /*Menu Controller*/
    .controller("menuCtrl", function($scope, $state, DataService){
        $scope.message = "Menu";
        init_menu();
    })

    /*Service Management Controller*/
    .controller("serviceManagementCtrl", function($scope, DataService, $log){
        $scope.message = "Service Management";
    })

    /*Resource Management Controller*/
    .controller("resourceManagementCtrl", function($scope, DataService, $log){
        $scope.message = "Resource Management";
    })

    /*Province Management Controller*/
    .controller("provinceManagementCtrl", function($scope, DataService, $log){
        $scope.message = "Province Management";
    })

    /*Model Design Controller*/
    .controller("modelDesignCtrl", function($scope, DataService, $log){
        $scope.message = "Model Design";
    })

    /*Package Controller*/
    .controller("packageCtrl", function($scope, DataService, $log){
        $scope.message = "Package";
    })

    /*Service Template Controller*/
    .controller("serviceTemplateCtrl", function($scope, DataService, $log){
        $scope.message = "Service Template";
    })

    /*Vim Manage Controller*/
    .controller("vimManageCtrl", function($scope, DataService, $log){
        $scope.message = "Vim Manage";
    })

    /*VNFM Controller*/
    .controller("vnfmCtrl", function($scope, DataService, $log){
        $scope.message = "VNFM";
    })

    /*Sdn Controller Controller*/
    .controller("sdnControllerCtrl", function($scope, DataService, $log){
        $scope.message = "Sdn Controller";
    })

    /*Performance Query Controller*/
    .controller("performanceQueryCtrl", function($scope, DataService, $log){
        $scope.message = "Performance Query";
    })

    /*Alarm Query Controller*/
    .controller("alarmQueryCtrl", function($scope, DataService, $log){
        $scope.message = "Alarm Query";
    })

    /*Parameter Setting Controller*/
    .controller("parameterSettingCtrl", function($scope, DataService, $log){
        $scope.message = "Parameter Setting";
    })

    /*VNF Market Controller*/
    .controller("vnfMarketCtrl", function($scope, DataService, $log){
        $scope.message = "VNF Market Place";
    })

	
var modelTemplate = "";
function loadTemplate() {
    $.get('/openoui/framework/template.html', function (template) {
        modelTemplate += template;
    });
    $.get('/openoui/framework/templateContainer.html', function (template) {
        modelTemplate += template;
    });
    $.get('/openoui/framework/templateWidget.html', function (template) {
        //console.log("Template is : "+template);
        modelTemplate += template;
    });
    $.get('/openoui/framework/templateNotification.html', function (template) {
        modelTemplate += template;
    });
    $.get('/openoui/framework/templateFunctional.html', function (template) {
        modelTemplate += template;
    });
}

function init_menu() {
    var windowH = $(window).height();
    var headerH = $('#header-logo').height();
    var menuHeight = windowH - headerH;
    $('#page-sidebar').height(windowH);
    $("#sidebar-menu").height(menuHeight);

    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    }

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
            $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
    }

    var accordion = new Accordion($('#accordion'), false);
}
