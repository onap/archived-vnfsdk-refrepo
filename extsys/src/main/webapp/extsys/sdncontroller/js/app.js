/*

 Copyright 2017, Huawei Technologies Co., Ltd.

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

var app = angular.module("ControllerApp", ["ui.router", "ngTable"])

    /*.run(function($rootScope, $location, $state, LoginService) {
     $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
     if (toState.authenticate && !LoginService.isAuthenticated()){
     // User isn’t authenticated
     $state.transitionTo("login");
     event.preventDefault();
     }
     });
     })*/
    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        //$routeProvider.caseInsensitiveMatch = true;
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/controller');
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider


            .state("controller", {
                url: "/controller",
                templateUrl: "templates/controller.html",
                controller: "controllerCtrl"
            })
    })

    /*-------------------------------------------------------------------------------Controller---------------------------------------------------------------------*/
    .controller("controllerCtrl", function ($scope, controllerDataService, $log, $compile,NgTableParams, $state) {

        $scope.title = "Controller";
        $scope.init = function() {
            controllerDataService.getControllerData()
                .then(function (data) {
                    $scope.data = data;
                    console.log("Data: ");
                    $log.info(data);
                    loadButtons();
                }, function (reason) {

                    $scope.message = "Error is :" + JSON.stringify(reason);
                });
        }

        function loadButtons() {
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();
            var add_data = {"title":"Create", "type":"btn btn-default",  "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
           // var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            //var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#extsysAction').html($compile(addhtml)($scope));
            //$('#extsysAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            //var data = [{id: 1, name: "Moroni", age: 50}, {id: 2, name: "ABC", age: 30}, {id: 3, name: "Morhoni", age: 10}, {id: 4, name: "DABC", age: 31}, {id: 5, name: "Noor", age: 30}, {id: 6, name: "ABCD", age: 40}, {id: 7, name: "DABC", age: 31}, {id: 8, name: "Noor", age: 30}, {id: 9, name: "ABCD", age: 40}, {id: 10, name: "DABC", age: 31}, {id: 11, name: "Noor", age: 30}, {id: 12, name: "ABCD", age: 40}];
            $scope.controllerTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.controllerData});

            /*$scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.controllerData, function(item) {
                    console.log("#######"+item.id);
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });*/

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(ext.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var extName = {"ErrMsg" :     {"errmsg" : "Name is required.", "modalVar":"ext.Name", "errtag":"textboxErrName", "errfunc":"validatetextboxName", "required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, extName.ErrMsg))($scope));

            var extURL = {"ErrMsg" :     {"errmsg" : "URL is required.", "modalVar":"ext.url", "errtag":"textboxErrURL", "errfunc":"validatetextboxURL", "required":true}};
            $('#myModal #url').append($compile(Mustache.to_html(text, extURL.ErrMsg))($scope));

            var extUserName = {"ErrMsg" :     {"errmsg" : "UserName is required.", "modalVar":"ext.userName", "errtag":"textboxErrUserName", "errfunc":"validatetextboxUserName", "required":true}};
            $('#myModal #username').append($compile(Mustache.to_html(text, extUserName.ErrMsg))($scope));

            var extPassword = {"ErrMsg" :     {"errmsg" : "Password is required.", "modalVar":"ext.Password", "errtag":"textboxErrPassword", "errfunc":"validatetextboxPassword", "required":true}};
            $('#myModal #password').append($compile(Mustache.to_html(text, extPassword.ErrMsg))($scope));

            var extVersion = {"ErrMsg" :     {"errmsg" : "Version is required.", "modalVar":"ext.Version"}};
            $('#myModal #version').append($compile(Mustache.to_html(text, extVersion.ErrMsg))($scope));

            var extVendor = {"ErrMsg" :     {"errmsg" : "Vendor is required.", "modalVar":"ext.Vendor"}};
            $('#myModal #vendor').append($compile(Mustache.to_html(text, extVendor.ErrMsg))($scope));

            var extDescription = {"ErrMsg" :     {"textboxErr" : "Description is required.", "modalVar":"ext.Description"}};
            $('#myModal #description').append($compile(Mustache.to_html(text, extDescription.ErrMsg))($scope));

            /*var extProtocol = {"ErrMsg" :     {"textboxErr" : "Protocol is required.", "modalVar":"ext.protocol"}};
            $('#myModal #protocol').append($compile(Mustache.to_html(text, extProtocol.ErrMsg))($scope));*/

            var dropdowndata_protocol = {
                "modalVar" : "ext.Protocol",
                "labelField" : "itemLabel",
                "optionsValue" : JSON.stringify($scope.data.dropdownProtocolData.item)
            };

            console.log("dropdown data:"+$scope.data.dropdownProtocolData.item);

            $('#myModal #protocol').append($compile(Mustache.to_html(dropDown, dropdowndata_protocol))($scope));

            var extProductName = {"ErrMsg" :     {"textboxErr" : "ProductName is required.", "modalVar":"ext.productName"}};
            $('#myModal #ProductName').append($compile(Mustache.to_html(text, extProductName.ErrMsg))($scope));

            /*var extType = {"ErrMsg" :     {"textboxErr" : "Type is required.", "modalVar":"ext.type"}};
            $('#myModal #type').append($compile(Mustache.to_html(text, extType.ErrMsg))($scope));*/

            var dropdowndata_type = {
                "modalVar" : "ext.Type",
                "labelField" : "itemLabel",
                "optionsValue" : JSON.stringify($scope.data.dropdownTypeData.item)
            };

            $('#myModal #type').append($compile(Mustache.to_html(dropDown, dropdowndata_type))($scope));



            /*
            var extType = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ext.type", "placeholder":"Country"}};
            $('#myModal #Type').append($compile(Mustache.to_html(text, extType.ErrMsg))($scope));

            var extCreate = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ext.createTime", "placeholder":"memory"}};
            $('#myModal #CreateTime').append($compile(Mustache.to_html(number, extCreate.ErrMsg))($scope));

            var extOperation = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ext.operation", "placeholder":"Hard Disk"}};
            $('#myModal #Operation').append($compile(Mustache.to_html(text, extOperation.ErrMsg))($scope));*/



        }

        $scope.validatetextboxName = function (value){
            if($scope.ext.Name) {
                $scope.textboxErrName = false;
            }
            else
                $scope.textboxErrName = true;
        }

        $scope.validatetextboxURL = function (value){
            if($scope.ext.url) {
                $scope.textboxErrURL = false;
            }
            else
                $scope.textboxErrURL = true;
        }

        $scope.validatetextboxUserName = function (value){
            if($scope.ext.userName) {
                $scope.textboxErrUserName = false;
            }
            else
                $scope.textboxErrUserName = true;
        }

        $scope.validatetextboxPassword = function (value){
            if($scope.ext.Password) {
                $scope.textboxErrPassword = false;
            }
            else
                $scope.textboxErrPassword = true;
        }


        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            $state.reload();
        }



        /*$scope.checkAll = function () {
            angular.forEach($scope.data, function (data) {
                data.select = $scope.selectAll;
            });
        };*/

        $scope.showAddModal = function () {
            console.log("Showing Modal to Add data");
            $scope.ext = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErrName = false;
            $scope.textboxErrURL = false;
            $scope.textboxErrUserName = false;
            $scope.textboxErrPassword = false;
        }
        $scope.saveData = function (id) {
            if (!$scope.textboxErrName && !$scope.textboxErrURL && !$scope.textboxErrUserName && !$scope.textboxErrPassword) {
                if (id) {
                    //edit data
                    console.log("Editing data.." + JSON.stringify($scope.ext));
                    controllerDataService.editControllerData($scope.ext)
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
                    console.log("Adding data.." + JSON.stringify($scope.ext));
                    controllerDataService.addControllerData($scope.ext)
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
        }

        $scope.deleteData = function (id) {
            var confirmation=false;
            var checkbox = false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "Ok", "action": "deleteConfirmation("+id+")"
                    }]
            }};
            angular.forEach($scope.checkboxes.items, function(value) {
                if(value) {
                    checkbox = true;
                }
            });
            if (checkbox || (typeof id !== "undefined")) {
                var html = Mustache.to_html(dialog_tpl, error.err_data);
                $($compile(html)($scope)).modal({backdrop: "static"});
            }
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in controller is :");
            //$log.info($scope.data.controllerData);
            var deleteArr = [];
            if (typeof id !== "undefined"){

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function(value , key) {
                    if(value) {
                        console.log("deleting name is :"+key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: "+deleteArr);
            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                controllerDataService.deleteControllerData(deleteArr[i])
                    .then(function(data){
                        $scope.message = "Successfully deleted :-)";
                        $state.reload();
                    },
                    function(reason){
                        $scope.message = reason.status + " " + reason.statusText;
                    });
            }
        }

        $scope.editData = function (id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.controllerData, function (data) {
                if (!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.Name);
                        console.log("Data is sssss :"+data);
                        $scope.ext = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })


/*var modelTemplate;

function loadTemplate() {
    $.get('template.html', function (template) {
        modelTemplate = template;
    });
}*/

var modelTemplate = "";
function loadTemplate() {
    $.get('framework/template.html', function (template) {
        modelTemplate += template;
    });
    $.get('framework/templateContainer.html', function (template) {
        modelTemplate += template;
    });
    $.get('framework/templateWidget.html', function (template) {
        //console.log("Template is : "+template);
        modelTemplate += template;
    });
    $.get('framework/templateNotification.html', function (template) {
        modelTemplate += template;
    });
    $.get('framework/templateFunctional.html', function (template) {
        modelTemplate += template;
    });
}



