/*

    Copyright 2016-2017, Huawei Technologies Co., Ltd.

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

    /*.run(function($rootScope, $location, $state, LoginService) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if (toState.authenticate && !LoginService.isAuthenticated()){
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
    })*/
    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider){
        //$routeProvider.caseInsensitiveMatch = true;
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/login');
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state('login', {
                url : '/login',
                templateUrl : 'templates/login.html',
                controller : 'LoginController',
                authenticate: false
            })
            .state('register', {
                url : '/register',
                templateUrl : 'templates/register.html',
                controller : 'registerController',
                authenticate: false
            })
            .state("home", {
                url: "/home",
                templateUrl : "templates/home.html",
                controller : "homeCtrl",
                authenticate: true
            })
            .state("home.tree", {
                url: "/tree",
                templateUrl : "templates/tree.html",
                controller : "treeCtrl",
                authenticate: true
            })
            .state("home.accordion", {
                url: "/accordion",
                templateUrl : "templates/accordion.html",
                controller : "accordionCtrl",
                authenticate: true
            })
            .state("home.tabs", {
                url: "/tabs",
                templateUrl : "templates/tabs.html",
                controller : "tabsCtrl",
                authenticate: true
            })
            .state("home.vtabs", {
                url: "/vtabs",
                templateUrl : "templates/verticalTab.html",
                controller : "vTabCtrl",
                authenticate: true
            })
            .state("home.table", {
                url: "/table",
                templateUrl : "templates/table.html",
                controller : "tableCtrl",
                authenticate: true
            })
            .state("home.buttons", {
                url: "/buttons",
                templateUrl : "templates/buttons.html",
                controller : "buttonsCtrl",
                authenticate: true
            })
            /*state for radio button and checkboxes-------------------------------------------------*/
            .state("home.radiobuttons", {
                url: "/radiobuttons",
                templateUrl : "templates/radioButtons.html",
                controller : "radioCtrl",
                authenticate: true
            })
            .state("home.checkboxes", {
                url: "/checkboxes",
                templateUrl : "templates/checkBoxes.html",
                controller : "checkBoxCtrl",
                authenticate: true
            })
            .state("home.dropdown", {
                url: "/dropdown",
                templateUrl: "templates/dropdown.html",
                controller: "dropdownCtrl",
                authenticate: true
            })

            .state("home.list", {
                url: "/list",
                /*template:"<h3>Under Progress</h3>",*/
                templateUrl : "templates/list.html",
                controller : "listCtrl",
                authenticate: true
            })

            .state("home.provinceMgmt", {
                url: "/management",
                templateUrl : "templates/management.html",
                controller : "managementCtrl",
                authenticate: true
            })
            .state("home.tooltip", {
                url: "/textarea",
                templateUrl : "templates/textarea.html",
                controller : "toolCtrl",
                authenticate: true
            })

            .state("home.notification", {
                url: "/notification",
                templateUrl : "templates/notification.html",
                controller : "notificationCtrl",
                authenticate: true
            })
            .state("home.functional", {
                url: "/functional",
                templateUrl : "templates/functional.html",
                controller : "functionalCtrl",
                authenticate: true
            })


    })
    .controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
        $rootScope.title = "AngularJS Login Sample";

        $scope.formSubmit = function() {
            LoginService.login($scope.user)
                .then(function (data) {
                    if (data) {
                        $scope.error = '';
                        $scope.user.username = '';
                        $scope.user.password = '';
                        $state.transitionTo('home.tree');
                    }
                    else {
                        $scope.error = "Incorrect username/password !";
                    }
                }, function (reason) {
                    $scope.error = "Incorrect username/password !";
                });
        };

    })
    .controller('registerController', function($scope, $state, LoginService){
        $scope.formSubmit = function() {
            if($scope.user.password === $scope.user.confpassword) {
                LoginService.registerUser($scope.user)
                    .then(function (data) {
                        $state.transitionTo("login");
                    }, function () {
                        console.log("Failed to register");
                    });
            }
            else {
                console.log("Password not matched...");
                var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
                var data = {'title':'Error',showClose:true, 'closeBtnTxt':'Ok', 'icon':'glyphicon glyphicon-exclamation-sign','iconColor':'icon_error','msg':'Password and Confirm password does not match.', buttons:[]};
                var html = Mustache.to_html(dialog_tpl, data);
                $(html).modal({backdrop: "static"});   //backdrop: "static" - for grayed out and no outside click work, backdrop: false - no grayed out*/
            }
        };
    })
    .controller("homeCtrl", function($scope, $state, DataService){
        $scope.message = "Home Page";

        /*$scope.geticonClass = function() {
            if($( "#panel1" ).hasClass( "in" )){
                return "openo_accordion_ui-icon-expand";
            }
            else{
               return "openo_accordion_ui-icon-expand.current";
            }


        }*/



        /* $scope.accordionLoaded  = function() {
             if(modelTemplate != null) {
                 console.log("left menu loading..");
                 menuaccordion();
                 return true;
             }
             console.log("left menu not loading..");
             return false;
         }

         function menuaccordion() {
             var accordion_tpl = $(modelTemplate).filter('#menu_accordion').html();

             $.getJSON('./data/homelinks.json', function (accordion) {
                 var html = Mustache.to_html(accordion_tpl, accordion.accordion_data);
                 $('#accordionmenuid').html(html);
             });
         }*/

    })

    /* Tree Controller */
    .controller("treeCtrl", function($scope,DataService,$log){
        $scope.message = "Tree Data";
        var setting = {};
        /*$scope.treeLoaded = function() {
            if(modelTemplate != null) {
                console.log("Tree data loading..");
                tree();
                return true;
            }
            console.log("Tree data not loading..");
            return false;
        }*/
        $scope.init = function() {
            $scope.param="treeData";
            $scope.shortNote="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.treeData = data;
                    tree();
                    console.log("inside tree");
                    $log.info($scope.treeData);
                });
            DataService.getAllData($scope.shortNote)
                .then(function(data1){
                    $scope.treeTip = data1.treeTip;
                    console.log("inside treeTip");
                    $log.info(data1);
                });
        }
        function tree() {
            zNodes = $scope.treeData;
            $.fn.zTree.init($("#tree1"), setting, zNodes);

        }
    })

    /* Accordian Controller */
    .controller("accordionCtrl", function($scope,DataService, $log){

        $scope.message = "Accordion";

        $scope.accordionLoaded  = function() {
            if(modelTemplate != null) {
                console.log("accordion loading..");

                accordion();
                return true;
            }
            console.log("accordion not loading..");
            return false;
        }

        $scope.init = function() {
            $scope.param="accordionData";
            $scope.accordionTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.accordion = data;
                    accordion();
                    console.log("inside accordion");
                    $log.info(data);
                });
            DataService.getAllData($scope.accordionTip)
                .then(function(data){
                    $scope.accordionTipData = data.accordionTip;
                    console.log("inside accordion");
                    $log.info(data);
                });
        }

        function accordion() {

            var accordion_tpl = $(modelTemplate).filter('#accordion').html();
            console.log("in acc" );
            var html = Mustache.to_html(accordion_tpl, $scope.accordion.accordion_data);
            $('#accordion').html(html);
        }
    })
    .controller("tabsCtrl", function($scope, $state, DataService, $log){
        $scope.message = "Tabs";
        $scope.tabLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Tab is loading..");
                loadTabData();
                return true;
            }
            console.log("Not ready..");
            return false;
        }

        $scope.init = function() {
            $scope.param="tabData";
            $scope.tabTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.tabdata = data;
                    loadTabData();
                    console.log("inside tabs");
                    $log.info(data);
                });
            DataService.getAllData($scope.tabTip)
                .then(function(data){
                    $scope.tabTipData = data.tabTip;
                    $log.info(data);
                });
        }

        function loadTabData() {
            var tab_tpl = $(modelTemplate).filter('#tabs').html();
            var html = Mustache.to_html(tab_tpl, $scope.tabdata.tabData);
            $('#tabArea').html(html);
        }

    })
    .controller("vTabCtrl", function($scope, $state, DataService){
        $scope.message = "Vertical Tabs";

        $scope.vtabLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Vertical Tab is loading..");
                loadvTabData();
                return true;
            }
            console.log("Not ready..");
            return false;
        }

        $scope.init = function() {
            $scope.param="vtabData";
            $scope.vtabTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(vtabdata){
                    $scope.data = vtabdata;
                    loadvTabData();
                    console.log("inside vTab");
                });
            DataService.getAllData($scope.vtabTip)
                .then(function(vtabdata){
                    $scope.vtabTipdata = vtabdata.vtabTip;
                    console.log("inside vTab");
                });
        }

        function loadvTabData() {

            var vtab_tpl = $(modelTemplate).filter('#vtabs').html();
            var html = Mustache.to_html(vtab_tpl, $scope.data.vtabData);
            $('#vtabArea').html(html);
        }
    })
    .controller("tableCtrl", function($scope, $state, DataService){
        $scope.message = "Tables";

        $scope.tableLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Table is loading..");
                loadTableData();
                return true;
            }
            console.log("Not ready..");
            return false;
        }

        $scope.init = function() {
            $scope.param="tableData";
            $scope.tableTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.tableData = data;
                    loadTableData();
                    console.log("inside table");
                });

            DataService.getAllData($scope.tableTip)
                .then(function(data){
                    $scope.tableTipData = data.tableTip;
                    console.log("inside table");
                });
        }

        function loadTableData() {

            var table_tpl = $(modelTemplate).filter('#table').html();

            var html = Mustache.to_html(table_tpl, $scope.tableData.basic_table_data);
            $('#basictableArea').html(html);

            var html = Mustache.to_html(table_tpl, $scope.tableData.str_table_data);
            $('#strippedtableArea').html(html);

            var html = Mustache.to_html(table_tpl, $scope.tableData.cond_table_data);
            $('#condensedtableArea').html(html);
        }
    })

    /* Buttons Controller */
    .controller("buttonsCtrl", function($scope,DataService,$log){
        $scope.message = "Types of Buttons";
        $scope.buttonTip="shortNote";

        $scope.init = function() {
            $scope.param="buttonsData";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.buttons = data;
                    defaultButtons();
                    visualButtons();
                    sizeButtons();
                    iconButtons();
                    console.log("inside accordion");
                    $log.info(data);
                });
            DataService.getAllData($scope.buttonTip)
                .then(function(data){
                    $scope.buttonTipData = data.buttonTip;
                    console.log("inside table");
                });
        }

        function defaultButtons(){
            console.log("Default buttons Loaded..");
            //Here your view content is fully loaded !!
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_icon_button_tpl = $(modelTemplate).filter('#defaultIconButtons').html();

            var html = Mustache.to_html(def_button_tpl, $scope.buttons.default_btn_data.def_button);
            $('#defaultButtonArea').html(html);

            var html = Mustache.to_html(def_icon_button_tpl, $scope.buttons.default_btn_data.def_print_button);
            $('#defaultButtonArea').append(html);

            var html = Mustache.to_html(def_icon_button_tpl, $scope.buttons.default_btn_data.def_print_button_right);
            $('#defaultButtonArea').append(html);
        }


        function visualButtons(){
            console.log("Loaded..");
            //Here your view content is fully loaded !!
            var visual_button_tpl = $(modelTemplate).filter('#visualButtons').html();

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_pri_btn_data);
            $('#visualButtonArea').html(html);

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_sec_btn_data);
            $('#visualButtonArea').append(html);

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_succ_btn_data);
            $('#visualButtonArea').append(html);

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_inf_btn_data);
            $('#visualButtonArea').append(html);

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_warn_btn_data);
            $('#visualButtonArea').append(html);

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_dang_btn_data);
            $('#visualButtonArea').append(html);

            var html = Mustache.to_html(visual_button_tpl, $scope.buttons.visual_btn_data.vis_link_btn_data);
            $('#visualButtonArea').append(html);
        }

        function sizeButtons() {
            var size_button_tpl = $(modelTemplate).filter('#sizeButtons').html();

            var html = Mustache.to_html(size_button_tpl, $scope.buttons.diffSize_btn_data.size_small_btn_data);
            $('#sizeButtonArea').html(html);

            var html = Mustache.to_html(size_button_tpl, $scope.buttons.diffSize_btn_data.size_large_btn_data);
            $('#sizeButtonArea').append(html);

            var html = Mustache.to_html(size_button_tpl, $scope.buttons.diffSize_btn_data.size_block_btn_data);
            $('#sizeButtonArea').append(html);

        }

        function iconButtons() {
            var icon_button_tpl = $(modelTemplate).filter('#iconButtons').html();

            var html = Mustache.to_html(icon_button_tpl, $scope.buttons.icon_btn_data.search_icon_btn_data);
            $('#iconButtonArea').html(html);

            var html = Mustache.to_html(icon_button_tpl, $scope.buttons.icon_btn_data.search_icon_styled_btn_data);
            $('#iconButtonArea').append(html);

            var html = Mustache.to_html(icon_button_tpl, $scope.buttons.icon_btn_data.print_icon_btn_data);
            $('#iconButtonArea').append(html);

        }

        $scope.defaultButtonsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("default buttons loading..");
                defaultButtons();
                return true;
            }
            console.log("default buttons not loading..");
            return false;
        }

        $scope.visualButtonsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("visual buttons loading..");
                visualButtons();
                return true;
            }
            console.log("visual buttons not loading..");
            return false;
        }

        $scope.sizeButtonsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("size buttons loading..");
                sizeButtons();
                return true;
            }
            console.log("size buttons not loading..");
            return false;
        }

        $scope.iconButtonsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("icon buttons loading..");
                iconButtons();
                return true;
            }
            console.log("icon buttons not loading..");
            return false;
        }
    })
    /* Drop down----------------------*/
    .controller("dropdownCtrl", function($scope, DataService) {
        $scope.message = "You selected drop down";
        $scope.subIsLoaded = function () {
            if (modelTemplate != null) {
                console.log("Loading..");
                loadDrop();
                return true;
            }
            console.log("Not Loaded..");
            return false;
        }

        $scope.init = function() {
            $scope.param="dropdownData";
            $scope.dropdownTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.dropdown = data;
                    loadDrop();
                });
            DataService.getAllData($scope.dropdownTip)
                .then(function(data){
                    $scope.dropdownTipData = data.dropdownTip;
                    console.log("inside table");
                });
        }
        function loadDrop() {
            var drop_tpl = $(modelTemplate).filter('#dropDown').html();
            var dropHeader_tpl = $(modelTemplate).filter('#dropDownHeader').html();
            var dropSimple_tpl = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var html = Mustache.to_html(drop_tpl, $scope.dropdown.dropped_down_data);
            $('#dropArea').html(html);

            var html = Mustache.to_html(drop_tpl, $scope.dropdown.dropped_up_data);
            $('#dropAreaUP').html(html);

            var html = Mustache.to_html(dropHeader_tpl, $scope.dropdown.dropHeader_data);
            $('#dropAreaHeader').html(html);

            var html = Mustache.to_html(dropSimple_tpl, $scope.dropdown.dropSimple_data);
            $('#plainDropDown').html(html);

        }
    })
    .controller("radioCtrl", function($scope, DataService, $log) {
        $scope.message = "You selected radio button tab";
        var lodedOnce = false;
        $scope.subIsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Loading..");
                loadRadioBtn();
                return true;
            }
            console.log("Not Loaded..");
            return false;
        }

        $scope.init = function() {
            $scope.param="radioData";
            $scope.radioTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.radioButton = data;
                    loadRadioBtn();
                    console.log("inside button");
                    $log.info(data);
                });

            DataService.getAllData($scope.radioTip)
                .then(function(data){
                    $scope.radioTipData = data.radioTip;
                    console.log("inside table");
                });
        }
        function loadRadioBtn(){
            console.log("lodedOnce : "+lodedOnce);

            var radio_button_tpl = $(modelTemplate).filter('#radioButtons').html();
            var html = Mustache.to_html(radio_button_tpl, $scope.radioButton .radio_btn_default_data);
            $('#radioBtnArea').html(html);

            var html = Mustache.to_html(radio_button_tpl, $scope.radioButton .radio_btn_primary_data);
            $('#radioBtnArea').append(html);

            var html = Mustache.to_html(radio_button_tpl, $scope.radioButton .radio_btn_success_data);
            $('#radioBtnArea').append(html);

            var html = Mustache.to_html(radio_button_tpl, $scope.radioButton .radio_btn_danger_data);
            $('#radioBtnArea').append(html);

            var html = Mustache.to_html(radio_button_tpl, $scope.radioButton .radio_btn_Warn_data);
            $('#radioBtnArea').append(html);

            var html = Mustache.to_html(radio_button_tpl, $scope.radioButton .radio_btn_info_data);
            $('#radioBtnArea').append(html);

        }
    })
    .controller("checkBoxCtrl", function($scope, DataService) {
        $scope.message = "You selected checkbox tab";
        $scope.subIsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Loading..");
                loadCheckBox();
                return true;
            }
            console.log("Not Loaded..");
            return false;
        }
        $scope.init = function() {
            $scope.param="checkboxData";
            $scope.checkboxTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.checkBox = data;
                    loadCheckBox();
                });
            DataService.getAllData($scope.checkboxTip)
                .then(function(data){
                    $scope.checkboxTipData = data.checkboxTip;
                    console.log("inside table");
                });
        }
        function loadCheckBox() {
            var check_box_tpl = $(modelTemplate).filter('#checkBoxes').html();

            var html = Mustache.to_html(check_box_tpl, $scope.checkBox.checkbox_default_data);
            $('#CheckBoxArea').html(html);

            var html = Mustache.to_html(check_box_tpl, $scope.checkBox.checkbox_primary_data);
            $('#CheckBoxArea').append(html);

            var html = Mustache.to_html(check_box_tpl, $scope.checkBox.checkbox_success_data);
            $('#CheckBoxArea').append(html);

            var html = Mustache.to_html(check_box_tpl, $scope.checkBox.checkbox_danger_data);
            $('#CheckBoxArea').append(html);

            var html = Mustache.to_html(check_box_tpl, $scope.checkBox.checkbox_warn_data);
            $('#CheckBoxArea').append(html);

            var html = Mustache.to_html(check_box_tpl, $scope.checkBox.checkbox_info_data);
            $('#CheckBoxArea').append(html);

            /*$.getJSON('./data/checkboxData.json', function(c_data) {
             var html = Mustache.to_html(check_box_tpl, c_data.checkbox_default_data);
             $('#CheckBoxArea').html(html);

             var html = Mustache.to_html(check_box_tpl, c_data.checkbox_primary_data);
             $('#CheckBoxArea').append(html);

             var html = Mustache.to_html(check_box_tpl, c_data.checkbox_success_data);
             $('#CheckBoxArea').append(html);

             var html = Mustache.to_html(check_box_tpl, c_data.checkbox_danger_data);
             $('#CheckBoxArea').append(html);

             var html = Mustache.to_html(check_box_tpl, c_data.checkbox_warn_data);
             $('#CheckBoxArea').append(html);

             var html = Mustache.to_html(check_box_tpl, c_data.checkbox_info_data);
             $('#CheckBoxArea').append(html);
             });*/
        }
    })

    /* Reference Code -- Remove after use */
    .controller("coursesCtrl", function($scope, DataService){
        $scope.message = "Courses Offered";
        $scope.courses = ["Java", "C/C++", "JavaScript", "AngularJS", "NodeJS", "HTML", "Python", "Action Script"];
        $scope.showDialog = function() {
            /*var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
             var data = {'title':'Shahid Noor','showClose':true,'closeBtnTxt':'Cancel','icon':'glyphicon glyphicon-off','iconColor':'icon_warn','msg':'Good! There is a message that can be used to show on the screen. There is a message that can be used to show on the screen', buttons:[{"text": "Ok", 'action':'callThis()'},{"text": "Show"}]};
             var html = Mustache.to_html(dialog_tpl, data);
             $(html).modal({backdrop: "static"});   //backdrop: "static" - for grayed out and no outside click work, backdrop: false - no grayed out*/

            var def_button_tpl = $(modelTemplate).filter('#visualButtons').html();
            var def_btn_data = {'title':"asas", 'type':'primary'};
            var html = Mustache.to_html(def_button_tpl, def_btn_data);
            $('#sampleArea').html(html);
        };

        // $scope.$on('$viewContentLoaded', function(){
        function loaded(){
            console.log("Loaded..");
            //Here your view content is fully loaded !!
            var def_button_tpl = $(modelTemplate).filter('#dropDown').html();
            var def_btn_data = {'title':'Shahid Noor','position':'down', items:[{"itemLabel": "Ok"},{"itemLabel": "Show"}]};
            var html = Mustache.to_html(def_button_tpl, def_btn_data);
            $('#sampleArea').html(html);

        }
        $scope.subIsLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Loading..");
                loaded();
                return true;
            }
            console.log("Not Loaded..");
            return false;
        }
    })

    .controller("toolCtrl", function($scope, DataService, $compile, $log){
                 $scope.toolTip = "shortNote";
                $scope.toolTipContent = "textArea";

            DataService.getAllData($scope.toolTipContent)
            .then(function(data){
                $log.info(data.Note.placement);
                $scope.noteContent = data.Note.message;
                $scope.notePlacement = data.Note.placement;
                $scope.errMsg = data.ErrMsg;
                console.log($scope.noteContent + " " + $scope.notePlacement);
                loadTextArea();
            });
            DataService.getAllData($scope.toolTip)
                .then(function(data){
                    $scope.toolTipData = data.toolTip;
                    //loadTextArea();
                });

        //$('[data-toggle="popover"]').popover();



        function loadTextArea() {
            var text = $(modelTemplate).filter('#textfield').html();
            var email = $(modelTemplate).filter('#email').html();
            var url = $(modelTemplate).filter('#url').html();
            var password = $(modelTemplate).filter('#password').html();
            var numeric = $(modelTemplate).filter('#numeric').html();
            var dot = $(modelTemplate).filter('#dot').html();
            var dateinput = $(modelTemplate).filter('#dateinput').html();
            var monthinput = $(modelTemplate).filter('#monthinput').html();
            var weekinput = $(modelTemplate).filter('#weekinput').html();
            var timeinput = $(modelTemplate).filter('#timeinput').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var ipv6 = $(modelTemplate).filter('#ipv6').html();
            var textarea = $(modelTemplate).filter('#textarea').html();

            var note = $(modelTemplate).filter('#note').html();

            var dataText = {"errMsg" :     {"textboxErr" : "The name is required.", "modalVar":"province.province_name", "placeholder":""}};
            var html = Mustache.to_html(text, dataText.errMsg);
            $('#fname').html($compile(html)($scope));

            var html = Mustache.to_html(email, $scope.errMsg);
            $('#email').html($compile(html)($scope));

            var html = Mustache.to_html(url, $scope.errMsg);
            $('#url').html($compile(html)($scope));

            var html = Mustache.to_html(password, $scope.errMsg);
            $('#password').html($compile(html)($scope));

            var dataNum = {"errMsg" :     {"numericErr" : "The number is required.", "modalVar":"province.port", "placeholder":""}};
            var html = Mustache.to_html(numeric, dataNum.errMsg);
            $('#numeric').html($compile(html)($scope));


            var html = Mustache.to_html(dot, $scope.errMsg);
            $('#dot').html($compile(html)($scope));

            var html = Mustache.to_html(dateinput, $scope.errMsg);
            $('#dateinput').html($compile(html)($scope));

            var html = Mustache.to_html(monthinput, $scope.errMsg);
            $('#monthinput').html($compile(html)($scope));

            var html = Mustache.to_html(weekinput, $scope.errMsg);
            $('#weekinput').html($compile(html)($scope));

            var html = Mustache.to_html(timeinput, $scope.errMsg);
            $('#timeinput').html($compile(html)($scope));

            var dataIP = {"errMsg" :     {"ipv4Err" : "The ipv4 is required.", "modalVar":"province.ip", "placeholder":""}};
            var html = Mustache.to_html(ipv4, dataIP.errMsg);
            $('#ipv4').html($compile(html)($scope));

            var html = Mustache.to_html(ipv6, $scope.errMsg);
            $('#ipv6').html($compile(html)($scope));

            var html = Mustache.to_html(textarea, $scope.errMsg);
            $('#textarea').html($compile(html)($scope));



            var html = Mustache.to_html(note, {"placement":$scope.notePlacement});
            $('#note').html(html);
            $("#noteanchor").popover({
                template: '<div class="popover fade bottom in customPopover"><div class="arrow"></div>'+$scope.noteContent+'</div>'
            });

            $scope.validatetextbox = function (value){
               if($scope.textbox) {
                    $scope.textboxErr = false;
                }
                else
                    $scope.textboxErr = true;

            }
            $scope.validateemail = function (value){
                if($scope.email) {
                    $scope.emailErr = false;
                }
                else
                    $scope.emailErr = true;

            }
            $scope.validateurl = function (value){
                if($scope.url) {
                    $scope.urlErr = false;
                }
                else
                    $scope.urlErr = true;

            }
            $scope.validatepassword = function (value){
                if($scope.password) {
                    $scope.passwordErr = false;
                }
                else
                    $scope.passwordErr = true;

            }
            $scope.validatenumeric = function (value){
                if($scope.number) {
                    $scope.numericErr = false;
                }
                else
                    $scope.numericErr = true;

            }
            $scope.validatedot = function (value){
                if($scope.datetime) {
                    $scope.dotErr = false;
                }
                else
                    $scope.dotErr = true;

            }
            $scope.validatedateinput = function (value){
                if($scope.date) {
                    $scope.dateinputErr = false;
                }
                else
                    $scope.dateinputErr = true;

            }
            $scope.validatemonthinput = function (value){
                if($scope.month) {
                    $scope.monthinputErr = false;
                }
                else
                    $scope.monthinputErr = true;

            }
            $scope.validateweek = function (value){
                if($scope.week) {
                    $scope.weekinputErr = false;
                }
                else
                    $scope.weekinputErr = true;

            }
            $scope.validatetime = function (value){
                if($scope.time) {
                    $scope.timeinputErr = false;
                }
                else
                    $scope.timeinputErr = true;

            }
            $scope.validateipv4 = function (value){
                if($scope.ipv4) {
                    $scope.ipv4Err = false;
                }
                else
                    $scope.ipv4Err = true;

            }
            $scope.validateipv6 = function (value){
                if($scope.ipv6) {
                    $scope.ipv6Err = false;
                }
                else
                    $scope.ipv6Err = true;

            }

            $scope.validatetextarea = function (value){
                if($scope.textarea) {
                    $scope.textareaErr = false;
                }
                else
                    $scope.textareaErr = true;

            }



        }


    })







    .controller("notificationCtrl", function($scope, DataService){
        $scope.message = "Notification and Messages";
        $scope.notificationTip = "shortNote";

        var dialog_tpl;
        $scope.templateLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Loading..");

                return true;
            }
            console.log("Not Loaded..");
            return false;
        }
        $scope.init = function() {
            $scope.param="notificationData";
            $scope.notificationTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.notification = data;
                });
            DataService.getAllData($scope.notificationTip)
                .then(function(data){
                    $scope.notificationTipData = data.notificationTip;
                });
        }

        $scope.showError = function() {
            dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.notification.err_data);
            $(html).modal({backdrop: "static"});//backdrop: "static" - for grayed out and no outside click work, backdrop: false - no grayed out*!
        }

        $scope.showWarning = function() {
            dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.notification.warn_data);
            $(html).modal();
        }

        $scope.showInfo = function() {
            dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.notification.info_data);
            $(html).modal();
        }
        $scope.showConfirm = function() {
            dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.notification.confirm_data);
            $(html).modal({backdrop: "static"});   //backdrop: "static" - for grayed out and no outside click work, backdrop: false - no grayed out*!/
        }

    })

    .controller("functionalCtrl", function($scope, DataService){
        $scope.message = "Functional Flow";

        var dialog_tpl;
        $scope.templateLoaded  = function() {
            if(modelTemplate != null) {
                console.log("Loading..");

                return true;
            }
            console.log("Not Loaded..");
            return false;
        }

        $scope.init = function() {
            $scope.param="functionalData";
            $scope.functionalTip="shortNote";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.functional = data;
                });
            DataService.getAllData($scope.functionalTip)
                .then(function(data){
                    $scope.functionalTipData = data.functionalTip;
                });
        }
        $scope.showCreate = function() {
            dialog_tpl = $(modelTemplate).filter('#functionalDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.functional.create_data);
            $(html).modal();
        }
        $scope.showModify = function() {
            dialog_tpl = $(modelTemplate).filter('#functionalDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.functional.modify_data);
            $(html).modal();
        }
        $scope.showDelete = function() {
            dialog_tpl = $(modelTemplate).filter('#functionalDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.functional.delete_data);
            $(html).modal();
        }
        $scope.showWorkflow = function() {
            dialog_tpl = $(modelTemplate).filter('#functionalDialog').html();
            var html = Mustache.to_html(dialog_tpl, $scope.functional.workflow_data);
            $(html).modal();
        }
    })

    .controller("listCtrl", function($scope, $log, DataService){
        $scope.message = "List Page";
        $scope.listTip = "shortNote";
        $scope.init = function() {
            console.log("Shahid... ng-init");
            $scope.param="list";
            DataService.getAllData($scope.param)
                .then(function(data){
                    $scope.mainlistItem = data;
                }, function(reason){
                    $scope.portfolios = [];

                });

            DataService.getAllData($scope.listTip)
                .then(function(data){
                    $scope.listTipData = data.listTip;
                });
        }
        $scope.loadSubMenuPage = function(index) {
            $log.info($scope.mainlistItem);
            $scope.subMenuListItem = $scope.mainlistItem[index].subMenu;
            $scope.subsubMenuListItem = [];
        }
        $scope.loadSubSubMenuPage = function(index) {
            $log.info($scope.subMenuListItem);
            console.log("index: "+index);
            $scope.subsubMenuListItem = $scope.subMenuListItem[index].subsubMenu;
        }
    })

    .controller("managementCtrl", function($scope, $log, DataService, $state, $compile, NgTableParams){
        $scope.message = "Management";
        $scope.provinceTip = "shortNote";
        /*$scope.provinceData = [
            {id:1, province_name:'First', ip:'192.168.1.45', port:'8080'},
            {id:2, province_name:'Second', ip:'192.168.1.5', port:'8081'},
            {id:3, province_name:'Third', ip:'192.168.1.15', port:'8082'},
            {id:4, province_name:'Fourth', ip:'192.168.1.28', port:'8083'},
            {id:5, province_name:'Fifth', ip:'192.168.1.19', port:'8084'}
        ];*/

        $scope.init = function() {
            console.log("Shahid... ng-init");
            DataService.getAllProvinceData()
                .then(function(data){
                    $scope.provinceData = data.provinceData;
                    console.log("Data: ");
                    loadButtons();
                    $log.info(data.provinceData);
                }, function(reason){
                    $scope.message = "Error is :" + JSON.stringify(reason);
                });

            DataService.getAllData($scope.provinceTip)
                .then(function(data){
                    $scope.provinceTipData = data.provinceTip;
                });
        }

        /*DataService.getAllProvinceData()
            .then(function(data){
                $scope.provinceData = data.provinceData;
                console.log("Data: ");
                $log.info(data.provinceData);
            }, function(reason){
                $scope.message = "Error is :" + JSON.stringify(reason);
            });*/
        /*DataService.getAllData($scope.provinceTip)
            .then(function(data){
                $scope.provinceTipData = data.provinceTip;
            });*/

        function loadButtons() {
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var add_data = {"title":"Add", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_button_tpl, add_data);
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('#provinceAction').html($compile(addhtml)($scope));
            $('#provinceAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            //var data = [{id: 1, name: "Moroni", age: 50}, {id: 2, name: "ABC", age: 30}, {id: 3, name: "Morhoni", age: 10}, {id: 4, name: "DABC", age: 31}, {id: 5, name: "Noor", age: 30}, {id: 6, name: "ABCD", age: 40}, {id: 7, name: "DABC", age: 31}, {id: 8, name: "Noor", age: 30}, {id: 9, name: "ABCD", age: 40}, {id: 10, name: "DABC", age: 31}, {id: 11, name: "Noor", age: 30}, {id: 12, name: "ABCD", age: 40}];
            $scope.tableParams = new NgTableParams({count: 5, sorting: {province_name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.provinceData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.provinceData, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();

            var dataText = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"province.province_name", "placeholder":"Name"}};
            $('#myModal .provinceName').html($compile(Mustache.to_html(text, dataText.ErrMsg))($scope));

            var dataIP = {"ErrMsg" :     {"ipv4Err" : "The ipv4 is required.", "modalVar":"province.ip", "placeholder":"IP Address"}};
            $('#myModal .ipAddress').html($compile(Mustache.to_html(ipv4, dataIP.ErrMsg))($scope));

            var dataNum = {"ErrMsg" :     {"numericErr" : "The number is required.", "modalVar":"province.port", "placeholder":"Port"}};
            $('#myModal .port').html($compile(Mustache.to_html(number, dataNum.ErrMsg))($scope));

            var modelSubmit_data = {"title":"Submit", "clickAction":"saveData(province.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelDelete_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelDelete_html = Mustache.to_html(def_button_tpl, modelDelete_data);
            $('#myModal #footerBtns').append($compile(modelDelete_html)($scope));
        }

        $scope.validatetextbox = function (value){
            if($scope.province.province_name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }
        $scope.validateipv4 = function (value){
            if($scope.province.ip) {
                $scope.ipv4Err = false;
            }
            else
                $scope.ipv4Err = true;
        }
        $scope.validatenumeric = function (value){
            if($scope.province.port) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
        }


        $scope.checkAll = function() {
            console.log("Checked ..");
            angular.forEach($scope.provinceData, function(data) {
                //data.select = $scope.selectAll;
                $scope.checkboxes.items[user.id]
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.province = {};
            $scope.textboxErr = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
            $("#myModal").modal();
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.province));
                DataService.editProvinceData($scope.province)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                            //$state.go($state.current.name, {}, {reload: true})
                        },
                        function (reason) {
                            //$log.info(reason);
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.province));
                DataService.addProvinceData($scope.province)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                            //$state.go($state.current.name, {}, {reload: true})
                        },
                        function (reason) {
                            //$log.info(reason);
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

        $scope.deleteData = function() {
            var deleteArr = [];
            //$log.info($scope.checkboxes);
            angular.forEach($scope.checkboxes.items, function(value , key) {
                //$log.info(data);
                if(value) {
                    deleteArr.push(key);
                }
            });

            console.log("To be deleted : "+deleteArr);
            //$log.info(deleteArr);
            DataService.deleteProvinceData(deleteArr)
                .then(function(data){
                        $scope.message = "Successfully deleted :-)";
                        $state.reload();
                    },
                    function(reason){
                        //$log.info(reason);
                        $scope.message = reason.status + " " + reason.statusText;
                    });
        }

        $scope.deleteIndividualData = function(id) {
            var deleteArr = [];
            //$log.info($scope.checkboxes);
            deleteArr.push(id);

            console.log("To be deleted : "+deleteArr);
            //$log.info(deleteArr);
            DataService.deleteProvinceData(deleteArr)
                .then(function(data){
                        $scope.message = "Successfully deleted :-)";
                        $state.reload();
                    },
                    function(reason){
                        //$log.info(reason);
                        $scope.message = reason.status + " " + reason.statusText;
                    });
        }

        $scope.editData = function(id) {
            $scope.textboxErr = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.provinceData, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.province = data;
                        /*$scope.province.province_name = data.province_name;
                        $scope.province.ip = data.ip;
                        $scope.province.port = data.port;*/

                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

    })

var modelTemplate;
function loadTemplate() {
    $.get('template.html', function(template) {
        modelTemplate = template;
    });
}

function callThis() {
    alert("Going Great!");
}

function searchTable() {
    var filter, table, tr, td;
    filter = $("#myInput").val().toUpperCase();
    table = $("#myTable_search");
    tr = $("#myTable_search tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (var i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function linkClicked(state) {
    console.log("State to : " + state);
}