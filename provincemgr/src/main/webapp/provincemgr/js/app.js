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

var app = angular.module("ProvinceManagementApp", ["ui.router", "ngTable"])

    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider){

        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/provinceMgmt');
        $stateProvider
            .state("" +
                "provinceMgmt", {
                url: "/provinceMgmt",
                templateUrl : "templates/management.html",
                controller : "managementCtrl"
            })
    })


    .controller("managementCtrl", function($scope, $log, provinceDataService, $state, $compile, NgTableParams){
        $scope.message = "Management";

        $scope.init = function() {
            provinceDataService.getAllProvinceData()
                .then(function(data){
                    $scope.provinceData = data.provinceData;
                    console.log("Data: ");
                    loadButtons();
                    $log.info(data.provinceData);
                }, function(reason){
                    $scope.message = "Error is :" + JSON.stringify(reason);
                });

            /*DataService.post("http://localhost:4000/api/getAllJSONData", {"wdgtType":$scope.provinceTip})
                .then(function(data){
                    $scope.provinceTipData = data.data.provinceTip;
                });*/
        }

        function loadButtons() {

            console.log("modelTemplate issss"+modelTemplate);
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            var dialog = $(modelTemplate).filter('#dialog').html();

            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};

            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#provinceAction').html($compile(addhtml)($scope));



            $('#provinceAction').append($compile(deletehtml)($scope));

            $('#managementDialog').html($compile(dialog)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

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

            $('#managementDialog .modalHeader').html('<h5 class="modal-title titlestyle">Modal Header</h5>');
            $('#managementDialog .modalBodyContent').html('<div class="form-group row"> <label class="col-xs-4 col-form-label labelstyle">Name</label> <div class="col-xs-8 provinceName" > </div> </div>');
            $('#managementDialog .modalBodyContent').append('<div class="form-group row"> <label class="col-xs-4 col-form-label labelstyle">IP Address</label> <div class="col-xs-8 ipAddress" > </div> </div>');
            $('#managementDialog .modalBodyContent').append(' <div class="form-group row"> <label for="port" class="col-xs-4 col-form-label labelstyle">Port</label> <div class="col-xs-8 port" > </div> </div>');
            $('#managementDialog .modalBodyContent').append(' <div class="form-group row"> <label for="desc" class="col-xs-4 col-form-label labelstyle">Description</label> <div class="col-xs-8 desc" > </div> </div>');



            var dataText = {"ErrMsg" :     {"errmsg" : "Please input Name.", "modalVar":"province.province_name", "placeholder":"Name", "errtag":"ptextboxErr", "errfunc":"validatetextbox", "required":true}};
            $('#managementDialog .provinceName').html($compile(Mustache.to_html(text, dataText.ErrMsg))($scope));

            var dataIP = {"ErrMsg" :     {"errmsg" : "Please input IP Address.", "modalVar":"province.ip", "placeholder":"IP Address"}};
            $('#managementDialog .ipAddress').html($compile(Mustache.to_html(ipv4, dataIP.ErrMsg))($scope));

            var dataNum = {"ErrMsg" :     {"errmsg" : "Please input port.", "modalVar":"province.port", "placeholder":"Port"}};
            $('#managementDialog .port').html($compile(Mustache.to_html(number, dataNum.ErrMsg))($scope));

            var dataText = {"ErrMsg" :     {"errmsg" : "Please input description.", "modalVar":"province.desc", "placeholder":"Description"}};
            $('#managementDialog .desc').html($compile(Mustache.to_html(text, dataText.ErrMsg))($scope));

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(province.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#managementDialog #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Cancel", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#managementDialog #footerBtns').append($compile(modelBtn_html)($scope));
        }

        $scope.validatetextbox = function (value){
            if($scope.province.province_name) {
                $scope.ptextboxErr = false;
            }
            else
                $scope.ptextboxErr = true;
        }

        $scope.checkAll = function() {
            console.log("Checked ..");
            angular.forEach($scope.provinceData, function(data) {
                $scope.checkboxes.items[user.id]
            });
        };

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#uniModal').modal('hide');
            console.log("@@@@@@@@@@@@@@@@@@");
            $state.reload();
        }

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.province = {};
            $scope.textboxErr = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
            //$("#myModal").modal();
            $("#uniModal").modal({}).draggable();
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.province));
                provinceDataService.editProvinceData($scope.province)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.province));
                provinceDataService.addProvinceData($scope.province)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#uniModal').modal('hide');
        }

        /*$scope.deleteIndividualData = function(id) {
            var deleteArr = [];
            //$log.info($scope.checkboxes);
            deleteArr.push(id);

            console.log("To be deleted : "+deleteArr);
            //$log.info(deleteArr);


            provinceDataService.post("http://localhost:4000/api/deleteProvinceData", {'idList':deleteArr})
                .then(function(data){
                        $scope.message = "Successfully deleted :-)";
                        $state.reload();
                    },
                    function(reason){
                        //$log.info(reason);
                        $scope.message = reason.status + " " + reason.statusText;
                    });
        }*/
        $scope.deleteData = function(id) {
            var confirmation=false;
            var dialog_tpl = $(modelTemplate).filter('#personDialog').html();
            var error = {"err_data" : { "title": "Error",
                "showClose": "true",
                "closeBtnTxt": "Cancel",
                "icon": "glyphicon glyphicon-exclamation-sign",
                "iconColor": "icon_error",
                "msg": "Do you really wanted to Delete?.",
                "buttons": [
                    {
                        "text": "OK", "action": "deleteConfirmation("+id+")"
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
            console.log("data in province data is :");
            $log.info($scope.provinceData);
            var deleteArr = [];
            if (typeof id !== "undefined"){

                deleteArr.push(id);
            }else{
                angular.forEach($scope.checkboxes.items, function (value, key) {
                    if (value) {
                        console.log("deleting name is :" + key);
                        deleteArr.push(key);
                    }
                });

            }

            console.log("To be deleted : " + deleteArr);

            for(var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : "+deleteArr[i]);
                provinceDataService.deleteProvinceData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }

           /* provinceDataService.post("http://localhost:4000/api/deleteProvinceData", {'idList':deleteArr})
                .then(function (data) {
                        $scope.message = "Successfully deleted :-)";
                        $state.reload();
                    },
                    function (reason) {
                        $scope.message = reason.status + " " + reason.statusText;
                    });*/
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

                        $("#uniModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

    })

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