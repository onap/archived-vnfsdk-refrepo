/* Copyright 2017, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var app = angular.module("ResourceMgrApp", ["ui.router", "ngTable"])

    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider){
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/resource/site');

        $stateProvider
            .state("resource", {
                url: "/resource",
                templateUrl : "templates/resource.html",
                controller : "resourceCtrl"
            })

            .state("resource.site", {
                url: "/site",
                templateUrl : "sdn-resmgr/site/site.html",
                controller : "siteCtrl"

            })
            .state("resource.me", {
                url: "/ne",
                templateUrl : "sdn-resmgr/ne/ne.html",
                controller : "neCtrl"
            })
            .state("resource.port", {
                url: "/port",
                templateUrl : "sdn-resmgr/port/port.html",
                controller : "portCtrl"

            })
            .state("resource.link", {
                url: "/link",
                templateUrl : "sdn-resmgr/link/link.html",
                controller : "linkCtrl"

            })
            .state("resource.location", {
                url: "/location",
                templateUrl : "nfv-resmgr/location/location.html",
                controller : "locationCtrl"

            })
            .state("resource.datacenter", {
                url: "/datacenter",
                templateUrl : "nfv-resmgr/datacenter/datacenter.html",
                controller : "datacenterCtrl"
            })
            /*.state("resource.overlayVPN", {
                url: "/overlayVPN",
                templateUrl : "nfv-resmgr/vim/vim.html",
                //controller : "overlayVPNCtrl"
            })*/
            .state("resource.vim", {
                url: "/vim",
                templateUrl : "nfv-resmgr/vim/vim.html",
                controller : "vimCtrl"
            })

    })

    .controller("resourceCtrl", function($scope, $log){
        $scope.message = "Resource";
        console.log("Hello All");

        $scope.loadTemplate = function() {

        }
        $scope.getTemplate = function(templateId) {
            console.log("getTemplate() : " + $scope.templates);
            return $($scope.templates).filter('#defaultButtons').html();
        }
    })
/*------------------------------------------------------------------------------PORT--------------------------------------------------------------------------------------*/
    .controller("portCtrl", function($scope,portDataService,$log, $compile,NgTableParams, $state ){
        $scope.title = "Port";

        $scope.init = function() {
            portDataService.getAllPortData()
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
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#portAction').html($compile(addhtml)($scope));
            $('#portAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.portTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.portData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.portData, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(port.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();


            var portName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.name", "errtag":"textboxErr", "errfunc":"validatetextbox", "required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, portName.ErrMsg))($scope));

            var portMe = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"port.me", "errtag":"textboxErr", "errfunc":"validatetextbox", "required":true}};
            $('#myModal #me').append($compile(Mustache.to_html(text, portMe.ErrMsg))($scope));

            //var portType = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"port.type"}};
            $('#myModal #type').append($compile(Mustache.to_html(dropDown, $scope.data.dropdowntypeData))($scope));

            var portLayerRate = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"port.layerrate"}};
            $('#myModal #layerrate').append($compile(Mustache.to_html(text, portLayerRate.ErrMsg))($scope));

            //var portEdgePoint = {"ErrMsg" :     {"ipv4Err" : "IP Address is required.", "modalVar":"port.Edgepoint"}};
            $('#myModal #Edgepoint').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownEdgeData))($scope));

            var portIndex = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"port.portindex"}};
            $('#myModal #portindex').append($compile(Mustache.to_html(text, portIndex.ErrMsg))($scope));

            var portIp = {"ErrMsg" :     {"textboxErr" : "The ip is required.", "modalVar":"port.ipaddress"}};
            $('#myModal #ipaddress').append($compile(Mustache.to_html(text, portIp.ErrMsg))($scope));

            var portAdmin = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"port.adminState"}};
            $('#myModal #adminState').append($compile(Mustache.to_html(text, portAdmin.ErrMsg))($scope));

            var portOperatingState = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"port.operatingState"}};
            $('#myModal #operatingState').append($compile(Mustache.to_html(text, portOperatingState.ErrMsg))($scope));

        }

        $scope.validatetextbox = function (value){
            if($scope.port.name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validateipv4 = function (value){
            if($scope.port.ipaddress) {
                $scope.ipv4Err = false;
            }
            else
                $scope.ipv4Err = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.port.portindex) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }


        $scope.validatenumeric = function (value){
            if($scope.port.layerrate) {
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
            angular.forEach($scope.portData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.port = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.port));
                portDataService.editPortData($scope.port)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.port));
                portDataService.addPortData($scope.port)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

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
            var html = Mustache.to_html(dialog_tpl, error.err_data);
            $($compile(html)($scope)).modal({backdrop: "static"});
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in port data is ::");
            $log.info($scope.data.portData);
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
                portDataService.deletePortData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.portData, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.port = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

    })
/*-----------------------------------------------------------------------------SITE-----------------------------------------------------------------------------------*/
    .controller("siteCtrl", function($scope,siteDataService, $log, $compile, $state, NgTableParams ){
        $scope.title = "Site";

        $scope.init = function() {
            siteDataService.getAllSiteData()
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
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#siteAction').html($compile(addhtml)($scope));
            $('#siteAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.siteTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.siteData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.siteData, function(item) {
                    console.log(item.id);
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(site.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var siteName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"site.name", "errtag":"textboxErr", "errfunc":"validatetextbox", "required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, siteName.ErrMsg))($scope));

            $('#myModal #type').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownsiteData))($scope));

            var siteTenantName = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"site.tenatname"}};
            $('#myModal #tenantname').append($compile(Mustache.to_html(text, siteTenantName.ErrMsg))($scope));

            var siteTenantType = {"ErrMsg" :     {"textboxErr" : "The tenanttype is required.", "modalVar":"site.tenanttype"}};
            $('#myModal #tenanttype').append($compile(Mustache.to_html(text, siteTenantType.ErrMsg))($scope));

            var siteLocation = {"ErrMsg" :     {"textboxErr" : "Location is required.", "modalVar":"site.location", "placeholder":"Location"}};
            $('#myModal #location').append($compile(Mustache.to_html(text, siteLocation.ErrMsg))($scope));


        }

        $scope.validatetextbox = function (value){
            if($scope.site.name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }


        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
        }

        $scope.checkAll = function() {
            angular.forEach($scope.siteData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.site = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.site));
                siteDataService.editSiteData($scope.site)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            //$log.info(reason);
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.site));
                siteDataService.addSiteData($scope.site)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

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
                        "text": "Ok", "action": "deleteConfirmation("+id+")"
                    }]
            }};
            var html = Mustache.to_html(dialog_tpl, error.err_data);
            $($compile(html)($scope)).modal({backdrop: "static"});
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in site data is :");
            $log.info($scope.data.siteData);
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
                siteDataService.deleteSiteData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.siteData, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.site = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

    })
/*-----------------------------------------------------------------------------------LOCATION-----------------------------------------------------------------------------------*/
    .controller("locationCtrl", function($scope,locationDataService,$log, $compile,NgTableParams, $state){

        $scope.title = "Location";

        $scope.init = function() {
            locationDataService.getLocationData()
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
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#locationAction').html($compile(addhtml)($scope));
            $('#locationAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.neTableParams = new NgTableParams({count: 5, sorting: {Id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.locationData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.locationData, function(item) {
                    if (angular.isDefined(item.Id)) {
                        $scope.checkboxes.items[item.Id] = value;
                    }
                });
            });

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(loc.Id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));


            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();

            var locId = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"loc.Id", "errtag":"textboxErr", "errfunc":"validatetextbox", "placeholder":"Country", "placeholder":"Id"}};
            $('#myModal #Name').append($compile(Mustache.to_html(text, locId.ErrMsg))($scope));

            var locCountry = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"loc.Country", "errtag":"textboxErr", "errfunc":"validatetextbox", "placeholder":"Country","required":true}};
            $('#myModal #Country').append($compile(Mustache.to_html(text, locCountry.ErrMsg))($scope));

            var locLocation = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"loc.Location", "errtag":"textboxErr", "errfunc":"validatetextbox", "placeholder":"Location","required":true}};
            $('#myModal #Location').append($compile(Mustache.to_html(text, locLocation.ErrMsg))($scope));

            var locDescription = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"loc.Description", "errtag":"textboxErr", "errfunc":"validatetextbox", "placeholder":"Description "}};
            $('#myModal #Description').append($compile(Mustache.to_html(text, locDescription.ErrMsg))($scope));

            var locLatitude = {"ErrMsg" :     {"ipv4Err" : "IP Address is required.", "modalVar":"loc.Latitude", "errtag":"textboxErr", "errfunc":"validatetextbox", "placeholder":"Latitude","required":true}};
            $('#myModal #Latitude').append($compile(Mustache.to_html(text, locLatitude.ErrMsg))($scope));

            var locLongitude = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"loc.Longitude", "errtag":"textboxErr", "errfunc":"validatetextbox", "placeholder":"Longitude","required":true}};
            $('#myModal #Longitude').append($compile(Mustache.to_html(text, locLongitude.ErrMsg))($scope));
        }

        $scope.validatetextbox = function (value){
            if($scope.loc.Id) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatetextbox = function (value){
            if($scope.loc.Country) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatetextbox = function (value){
            if($scope.loc.Location) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatetextbox = function (value){
            if($scope.loc.Latitude) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatetextbox = function (value){
            if($scope.loc.Longitude) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.loc.Latitude) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.loc.Longitude) {
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
            angular.forEach($scope.locationData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.location = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
            $scope.numericErr = false;
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.loc));
                locationDataService.editLocationData($scope.loc)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.loc));
                locationDataService.addLocationData($scope.loc)
                    .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

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
            var html = Mustache.to_html(dialog_tpl, error.err_data);
            $($compile(html)($scope)).modal({backdrop: "static"});
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in location data is :");
            $log.info($scope.data.locationData);
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
                locationDataService.deleteLocationData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.locationData, function(data) {
                if(!dataFound) {
                    if (data.Id == id) {
                        console.log("Found : " + data.Id);
                        $scope.loc = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })
/*---------------------------------------------------------------LINK----------------------------------------------------------------------------------------------------*/
    .controller("linkCtrl", function($scope,linkDataService,$log, $compile,NgTableParams, $state){
        $scope.title = "Link";
        $scope.init = function() {
            linkDataService.getAllLinkData()
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
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#linkAction').html($compile(addhtml)($scope));
            $('#linkAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.linkTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.linkData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.linkData, function(item) {
                    console.log(item.id);
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(link.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var linkName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"link.name","errtag":"textboxErr", "errfunc":"validatetextbox","required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, linkName.ErrMsg))($scope));

            //var linkType = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.type"}};
            $('#myModal #type').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownlinkData))($scope));

            var linkLayerRate = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.layerRate"}};
            $('#myModal #layerRate').append($compile(Mustache.to_html(text, linkLayerRate.ErrMsg))($scope));

            var linkSourcePort = {"ErrMsg" :     {"numericErr" : "The name is required.", "modalVar":"link.sourcePort"}};
            $('#myModal #sourcePort').append($compile(Mustache.to_html(text, linkSourcePort.ErrMsg))($scope));

            var linkSinkPort = {"ErrMsg" :     {"numericErr" : "IP Address is required.", "modalVar":"link.sinkPort"}};
            $('#myModal #sinkPort').append($compile(Mustache.to_html(text, linkSinkPort.ErrMsg))($scope));

            var linkSourceNe = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.sourceNE"}};
            $('#myModal #sourceNE').append($compile(Mustache.to_html(text, linkSourceNe.ErrMsg))($scope));

            var linkSinkNe = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.sinkNE"}};
            $('#myModal #sinkNE').append($compile(Mustache.to_html(text, linkSinkNe.ErrMsg))($scope));

            var linkAdminState = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.adminState"}};
            $('#myModal #adminState').append($compile(Mustache.to_html(text, linkAdminState.ErrMsg))($scope));

            var linkOperatingState = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"link.operatingState"}};
            $('#myModal #operatingState').append($compile(Mustache.to_html(text, linkOperatingState.ErrMsg))($scope));

        }

        $scope.validatetextbox = function (value){
            if($scope.link.name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.link.sourcePort) {
                $scope.numericErr = false;
            }
            else
                $scope.numericErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.link.sinkPort) {
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
            angular.forEach($scope.linkData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.link = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
            $scope.numericErr = false;
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.link));
                linkDataService.editLinkData($scope.link)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.link));
                linkDataService.addLinkData($scope.link)
                    .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

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
            var html = Mustache.to_html(dialog_tpl, error.err_data);
            $($compile(html)($scope)).modal({backdrop: "static"});
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in link data is :");
            $log.info($scope.data.linkData);
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
                linkDataService.deleteLinkData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.linkData, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.link = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }
    })
 /*------------------------------------------------------------------------------NE---------------------------------------------------------------------------------------*/
    .controller("neCtrl", function($scope,neDataService, $log, $compile, NgTableParams, $state) {

        $scope.title = "ME";

        $scope.init = function() {
            neDataService.getAllNEData()
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
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#neAction').html($compile(addhtml)($scope));
            $('#neAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.neTableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.neData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.neData, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(ne.id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var neName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"ne.name", "errtag":"textboxErr", "errfunc":"validatetextbox","required":true}};
            $('#myModal #name').append($compile(Mustache.to_html(text, neName.ErrMsg))($scope));

            var neVersion = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"ne.version","errtag":"textboxErr", "errfunc":"validatetextbox","required":true}};
            $('#myModal #version').append($compile(Mustache.to_html(text, neVersion.ErrMsg))($scope));

            var neProductName = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ne.productname" }};
            $('#myModal #productname').append($compile(Mustache.to_html(text, neProductName.ErrMsg))($scope));

            $('#myModal #controller').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownneData))($scope));

            var neIPAddress = {"ErrMsg" :     {"ipv4Err" : "IP Address is required.", "modalVar":"ne.ipaddress"}};
            $('#myModal #ipaddress').append($compile(Mustache.to_html(text, neIPAddress.ErrMsg))($scope));

            var neNERole = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ne.nerole"}};
            $('#myModal #nerole').append($compile(Mustache.to_html(text, neNERole.ErrMsg))($scope));

            var neAdminState = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ne.adminState"}};
            $('#myModal #adminState').append($compile(Mustache.to_html(text, neAdminState.ErrMsg))($scope));

            var neOperatingState = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"ne.operatingState"}};
            $('#myModal #operatingState').append($compile(Mustache.to_html(text, neOperatingState.ErrMsg))($scope));

        }

        $scope.validatetextbox = function (value){
            if($scope.ne.name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatetextbox = function (value){
            if($scope.ne.version) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validateipv4 = function (value){
            if($scope.ne.ipaddress) {
                $scope.ipv4Err = false;
            }
            else
                $scope.ipv4Err = true;
        }

        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
        }



        $scope.checkAll = function() {
            angular.forEach($scope.neData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.ne = {};
            $scope.textboxErr = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.ne));
                neDataService.editNEData($scope.ne)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.ne));
                neDataService.addNEData($scope.ne)
                    .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

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
            var html = Mustache.to_html(dialog_tpl, error.err_data);
            $($compile(html)($scope)).modal({backdrop: "static"});
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in ne data is :");
            $log.info($scope.data.neData);
            var deleteArr = [];
            if (typeof id !== "undefined") {

                deleteArr.push(id);
            }
            else {
                angular.forEach($scope.checkboxes.items, function (value, key) {
                    if (value) {
                        console.log("deleting name is :" + key);
                        deleteArr.push(key);
                    }
                });
            }
            console.log("deleteArr: " + deleteArr);
            for (var i = 0; i < deleteArr.length; i++) {
                console.log("To be deleted : " + deleteArr[i]);
                neDataService.deleteNEData(deleteArr[i])
                    .then(function (data) {
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }
        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.neData, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.ne = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })
/*-------------------------------------------------------------------------------DATA CENTRE---------------------------------------------------------------------*/
    .controller("datacenterCtrl", function($scope,datacenterDataService,$log, $compile, NgTableParams, $state){

        $scope.title = "Data Center";

        $scope.init = function() {
            datacenterDataService.getDatacenterData()
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
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "plus-icon", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "type":"btn btn-default", "gType": "delete-icon", "iconPosition":"left", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_iconbutton_tpl, delete_data);
            $('#datacenterAction').html($compile(addhtml)($scope));
            $('#datacenterAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.neTableParams = new NgTableParams({count: 5, sorting: {Id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 20, 50], dataset: $scope.data.datacenterData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.data.datacenterData, function(item) {
                    if (angular.isDefined(item.Id)) {
                        $scope.checkboxes.items[item.Id] = value;
                    }
                });
            });

            var modelSubmit_data = {"title":"OK", "clickAction":"saveData(datacenter.Id)"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelBtn_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelBtn_html = Mustache.to_html(def_button_tpl, modelBtn_data);
            $('#myModal #footerBtns').append($compile(modelBtn_html)($scope));

            var text = $(modelTemplate).filter('#textfield').html();
            var ipv4 = $(modelTemplate).filter('#ipv4').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var dataId = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.Id"}};
            $('#myModal #Id').append($compile(Mustache.to_html(text, dataId.ErrMsg))($scope));

            var dataName = {"ErrMsg" :     {"errmsg" : "The name is required.", "modalVar":"datacenter.Name","errtag":"textboxErr", "errfunc":"validatetextbox","required":true}};
            $('#myModal #Name').append($compile(Mustache.to_html(text, dataName.ErrMsg))($scope));

            var dataStatus = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.Status"}};
            $('#myModal #Status').append($compile(Mustache.to_html(text, dataStatus.ErrMsg))($scope));

            $('#myModal #Country').append($compile(Mustache.to_html(dropDown, $scope.data.dropdowncountryData))($scope));

            $('#myModal #Location').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownlocationData))($scope));

            $('#myModal #ServiceName').append($compile(Mustache.to_html(dropDown, $scope.data.dropdownserviceData))($scope));

            var dataCPU = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.Cpu"}};
            $('#myModal #Cpu').append($compile(Mustache.to_html(text, dataCPU.ErrMsg))($scope));

            var dataMemory = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.Memory"}};
            $('#myModal #Memory').append($compile(Mustache.to_html(text, dataMemory.ErrMsg))($scope));

            var dataHarddisk = {"ErrMsg" :     {"textboxErr" : "The name is required.", "modalVar":"datacenter.HardDisk"}};
            $('#myModal #HardDisk').append($compile(Mustache.to_html(text, dataHarddisk.ErrMsg))($scope));



        }

        $scope.validatetextbox = function (value){
            if($scope.data.Name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }

        $scope.validatenumeric = function (value){
            if($scope.data.cpu) {
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
            angular.forEach($scope.datacenterData, function(data) {
                data.select = $scope.selectAll;
            });
        };

        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.datacenter = {};
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
            $scope.textboxErr = false;
            $scope.numericErr = false;
        }
        $scope.saveData = function(id) {
            if(id) {
                //edit data
                console.log("Editing data.." + JSON.stringify($scope.datacenter));
                datacenterDataService.editDatacenterData($scope.datacenter)
                    .then(function (data) {
                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            else {
                console.log("Adding data.." + JSON.stringify($scope.datacenter));
                datacenterDataService.addDatacenterData($scope.datacenter)
                    .then(function (data) {

                            $scope.message = "Success :-)";
                            $state.reload();
                        },
                        function (reason) {
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
            $('#myModal').modal('hide');
        }

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
            var html = Mustache.to_html(dialog_tpl, error.err_data);
            $($compile(html)($scope)).modal({backdrop: "static"});
        }

        $scope.deleteConfirmation = function(id) {
            console.log("data in datacenter data is :");
            $log.info($scope.data.datacenter);
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
                datacenterDataService.deleteDatacenterData(deleteArr[i])
                    .then(function(data){
                            $scope.message = "Successfully deleted :-)";
                            $state.reload();
                        },
                        function(reason){
                            $scope.message = reason.status + " " + reason.statusText;
                        });
            }
        }

        $scope.editData = function(id) {
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.data.datacenterData, function(data) {
                if(!dataFound) {
                    if (data.Id == id) {
                        console.log("Found : " + data.id);
                        $scope.datacenter = data;
                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }


    })

// ---------------------------------------------------------------------------------------------------------------------------------------------

var modelTemplate = "";
function loadTemplate() {

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


//------------------------------------------------- Common code ---------------------------------------------
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

