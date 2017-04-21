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

var app = angular.module("lcApp", ["ui.router", "ngTable"])/*, 'ui.bootstrap', 'ui.bootstrap.modal'*/

    /*.run(function($rootScope, $location, $state, LoginService) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if (toState.authenticate && !LoginService.isAuthenticated()){
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
    })*/
    .run(function($rootScope, $location, $state, $stateParams) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            console.log("STATE CHANGE toState " + JSON.stringify(toState));
            console.log("STATE CHANGE fromState " + JSON.stringify(toParams));
            if($stateParams.id && toState.name == "home.lcTabs" && toParams.id == fromParams.id) {
                //$state.transitionTo("home.lcTabs.detailInfo");
                $state.go('home.lcTabs.detailInfo', {'id': toParams.id});
                event.preventDefault();
            }
        });
        $rootScope.$on('$viewContentLoaded', function() {
            //call it here
            loadTemplate();
        });
    })

    /*.provider('modalState', function($stateProvider) {
        var provider = this;
        this.$get = function() {
            return provider;
        }
        this.state = function(stateName, options) {
            var modalInstance;
            $stateProvider.state(stateName, {
                url: options.url,
                onEnter: function($modal, $state) {
                    modalInstance = $modal.open(options);
                    modalInstance.result['finally'](function() {
                        modalInstance = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^');
                        }
                    });
                },
                onExit: function() {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
            });
        };
    })*/


    .config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider){/*modalStateProvider*/
        //$routeProvider.caseInsensitiveMatch = true;
        $urlMatcherFactoryProvider.caseInsensitive(true);
        $urlRouterProvider.otherwise('/home');
        //$locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state("home", {

                url: "/home",

                templateUrl : "templates/home.html",
                controller : "homeCtrl"

            })
            .state("home.lcTabs", {
                url: "/lcTabs/:id",
                templateUrl : "templates/lctabs.html",
                controller : "lcTabsCtrl"
            })
            .state("home.lcTabs.detailInfo", {
                url : "/detailInfo",
                templateUrl : "templates/detailInfo.html",
                controller : "detailInfoCtrl"
            })
            /*.state("home.lcTabs.detailInfo1", {
                url : "/detailInfo",
                templateUrl : "templates/detailInfo.html",
                controller : "detailInfoCtrl"
            })*/
            .state("home.lcTabs.topo", {
                url : "/topo",
                templateUrl : "templates/topo.html",
                controller : "topoCtrl"
            })
            .state("home.lcTabs.inputData", {
                url : "/inputData",
                templateUrl : "templates/inputData.html",
                controller : "inputDataCtrl"
            })
            .state("home.lcTabs.detailInfo.nfvoDetail", {
                url : "/nfvoDetailInfo",
                templateUrl: "templates/nfvoDetail.html",
                controller: "nfvoDetailCtrl"
            })

            .state("home.lcTabs.detailInfo.vpnManager", {
                url : "/vpnManager",
                templateUrl : "templates/vpnManager.html",
                controller : "vpnManagerCtrl"
            })
            .state("home.lcTabs.detailInfo.vpnManager.overlayVPN", {
                url: "/overlayVPN",
                templateUrl : "templates/overlayVPN.html",
                controller : "overlayVPNCtrl"
            })
            .state("home.lcTabs.detailInfo.vpnManager.underlayVPN", {
                url: "/underlayVPN",
                templateUrl : "templates/underlayVPN.html",
                controller : "underlayVPNCtrl"
            })
        /*modalStateProvider.state("home.lcTabs1", {
            url: '/lcTabs',
            templateUrl: 'templates/lctabs.html'
        });*/

    })

    .controller('homeCtrl', function($scope, $compile, $state, $log, $timeout, DataService, NgTableParams) {
        $scope.param="lctableData";
        $scope.init = function() {
            jQuery.i18n.properties({
                language : 'en-US',
                name : 'lcm-template-parameters-i18n',
                path : 'i18n/',
                mode : 'map'
            });
            if(!DataService.getTableDataLoaded()) {
                DataService.loadGetServiceData()
                    .then(function (data) {
                        if (data) {
                            $scope.tableData = data.data;
                            var tableData = data.data;
                            loadTableData();
                            //$timeout(loadTableData, 0);
                        }
                        else {
                            $scope.error = "Error!";
							loadTableData();
                            //$timeout(loadTableData, 0);
                        }
                    }, function (reason) {
                        $scope.error = "Error ! " + reason;
						loadTableData();
                        //$timeout(loadTableData, 0);
                    });
                DataService.setTableDataLoaded();
            }
            $('#scalingTypeIn').on("change", function (e) {
                var value = $(e.target).val();
                if ('on' === value) {
                    $('#scalingTypeIn').attr("checked", "checked");
                    $('#scalingTypeOut').removeAttr("checked");
                }
            });
            $('#scalingTypeOut').on("change", function (e) {
                var value = $(e.target).val();
                if ('on' === value) {
                    $('#scalingTypeOut').attr("checked", "checked");
                    $('#scalingTypeIn').removeAttr("checked");
                }
            });
        };

        //loadTableData();
        $scope.callLcTab = function(id) {
            /*console.log("Call ME as hi" + id);
            $scope.param="lcTabData";
            DataService.getAllData($scope.param)
                .then(function (data) {
                    if (data) {
                        $scope.lctabsData = data;
                        console.log("bye"+data.id);
                        loadTabData();
                    }
                    else {
                        $scope.error = "Incorrect username/password !";
                    }
                }, function (reason) {
                    $scope.error = "Incorrect username/password !";
                });

            $scope.row_id = id;*/
        }
        $scope.callModal = function(id) {
            console.log("Call ME as " + id);
            // $scope.row_id = id;
            //$state.go('home.lcTabs', {'id': id});
            //$("#popupModal").modal();
            /*$state.go('home.lcTabs.detailInfo', {'id': id});*/
        }

        function loadTabData() {
            console.log("hi tab");
            var tab_tpl = $(lcmModelTemplate).filter('#tabs').html();
            var html = Mustache.to_html(tab_tpl, $scope.lctabsData.tabData);
            $('#lctabArea').html(html);
        }

        function loadTableData() {
            console.log("In loadData()");

            var def_button_tpl = $(lcmModelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(lcmModelTemplate).filter('#defaultIconButtons').html();
            /*var add_data = {"title":"Add", "clickAction":"showAddModal()"};*/
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "glyphicon-plus", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('#lcTableAction').html($compile(addhtml)($scope));
            //$('#lcTableAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.tableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 15], dataset: $scope.tableData});

            $scope.$watch('checkboxes.checked', function(value) {
				$scope.checkboxes.items = [];
                angular.forEach($scope.tableParams.data, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            $scope.tableParams_tpDetails = new NgTableParams({count: 5, sorting: {tp_name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 15], dataset: $scope.tableData});


            $scope.selectedRow = null;  // initialize our variable to null
            $scope.setClickedRow = function(index, id){  //function that sets the value of selectedRow to current index
                $scope.selectedRow = index;
                console.log("Selected Row : " +id+" is "+ $scope.selectedRow);
                //$state.go('home.lcTabs', {'id': id});
                $state.go('home.lcTabs.detailInfo', {'id': id});
            }



            var text = $(lcmModelTemplate).filter('#textfield').html();
            var number = $(lcmModelTemplate).filter('#numeric').html();
            var dropDown = $(lcmModelTemplate).filter('#simpleDropdownTmpl').html();

            var dataText = {"ErrMsg" :     {"errmsg" : "Service name is required.", "modalVar":"lifecycleData.serviceName", "placeholder":"", "errtag":"lcnameErr", "errfunc":"validatename", "required":true}};
    
            $('#myModal .serviceName').html($compile(Mustache.to_html(text, dataText.ErrMsg))($scope));

            var serviceDescriptionText = {"ErrMsg" :     {"errmsg" : "Description is required.", "modalVar":"lifecycleData.description", "placeholder":"", "errtag":"lctemplateErr", "errfunc":"validatetemplate", "required":true}};

            $('#myModal .serviceDescription').html($compile(Mustache.to_html(text, serviceDescriptionText.ErrMsg))($scope));

            //var creatorText = {"ErrMsg" :     {"textboxErr" : "Creator is required.", "modalVar":"lifecycleData.creator", "placeholder":"Creator"}};
            /*$scope.data = {
                "dropSimple_data": {
                    "title": "--Select--",
                    "items": [
                        {"itemLabel": "1.1"}, {"itemLabel": "1.2"}
                    ]
                }
            }
            $('#myModal #plainDropDown').html($compile(Mustache.to_html(dropDown, $scope.data.dropSimple_data))($scope));*/

            DataService.generateTemplatesComponent()
                .then(function (tmplatesResponse) {
                    console.log("Data Template :: ");
                    $log.info(tmplatesResponse);
                    var templatesInfo = translateToTemplatesInfo(tmplatesResponse);
                    document.getElementById("svcTempl").innerHTML = templatesInfo;
                  //  $scope.optionsValue = tmplatesResponse;
                   /* var dropSimple_data = {
                        "errmsg" : "Service template is required.",
                        "modalVar" : "lifecycleData.optSelect",
                        "labelField" : "templateName",
                        "optionsValue" : JSON.stringify(templatesInfo),
                        "errtag":"lcdropdownErr",
                        "errfunc":"validatedropdown",
                        "required":true
                    }*/
		    //$('#myModal #plainDropDown').html($compile(Mustache.to_html(dropDown, dropSimple_data))($scope));
                }, function (reason) {
                    $scope.error = "Error ! " + reason;
                });
		
		
            //$('#myModal .creator').html($compile(Mustache.to_html(text, creatorText.ErrMsg))($scope));

            var modelSubmit_data = {"title":"Submit", "clickAction":"saveData()"};
            var modelSubmit_html = Mustache.to_html(def_button_tpl, modelSubmit_data);
            $('#myModal #footerBtns').html($compile(modelSubmit_html)($scope));

            var modelDelete_data = {"title":"Close", "clickAction":"closeModal()"};
            var modelDelete_html = Mustache.to_html(def_button_tpl, modelDelete_data);
            $('#myModal #footerBtns').append($compile(modelDelete_html)($scope));
	    
        }


        /**
         * generate templates html string
         * @param templates
         * @returns
         */
        function translateToTemplatesInfo(templates) {
            var options = '<option value="select">--select--</option>';
            var i;
            for (i = 0; i < templates.length; i += 1) {
                var option = '<option value="' + templates[i].serviceTemplateId + '">' + templates[i].templateName
                    + '</option>';
                options = options + option;
            }

            return options;
        }

        $scope.validatetextbox = function (value){
            if($scope.lifecycleData.service_name) {
                $scope.textboxErr = false;
            }
            else
                $scope.textboxErr = true;
        }


        $scope.checkAll = function() {
            console.log("Checked ..");
            angular.forEach($scope.tableData, function(data) {
                //data.select = $scope.selectAll;
                $scope.checkboxes.items[data.id]
            });
        };
        $scope.test = function(id) {
            $state.go('home.lcTabs.detailInfo', {'id': id});

        }
	
	$scope.validatename = function (value){
                if($scope.lifecycleData.serviceName) {
                    $scope.lcnameErr = false;
                }
                else
                    $scope.lcnameErr = true;
            }



            $scope.validatetemplate = function (value){
                if($scope.lifecycleData.description) {
                    $scope.lctemplateErr = false;
                }
                else
                    $scope.lctemplateErr = true;
            }
            $scope.validatedropdown = function (value){
                if($scope.lifecycleData.optSelect || $("#svcTempl").val()) {
                    $scope.lcdropdownErr = false;
                }
                else
                    $scope.lcdropdownErr = true;
            }

        $scope.templateParam = function() {
            
          //  var template = $scope.lifecycleData.optSelect;
		    var template ={};
			template.serviceTemplateId = $("#svcTempl").val();
            var lastSelTempCreateParam = DataService.getCreateParamJsonObj();
            if(template == undefined){
                document.getElementById("templateParameters").innerHTML = "";
                return;
            }            
            //if the template not changed, no need to update the page.
            if(lastSelTempCreateParam.templateId == template.serviceTemplateId &&  document.getElementById("templateParameters").innerHTML != ""){
                return;
            }
            $.when(DataService.generateCreateParameters(template))
                .then(function (tmplatesParamResponse) {
                    console.log("Data Param Template :: ");
                    $log.info(tmplatesParamResponse);
                    document.getElementById("templateParameters").innerHTML = tmplatesParamResponse;
                }, function (reason) {
                    $scope.error = "Error ! " + reason;
                });

        }




        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            //$scope.lifecycleData = {};
            //$scope.textboxErr = false;
            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
        }
        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
            //$state.reload();
        }

        $scope.editData = function(id) {
            $scope.textboxErr = false;
            $scope.ipv4Err = false;
            $scope.numericErr = false;
            console.log("To be edited : " + id);
            var dataFound = false;
            angular.forEach($scope.tableData, function(data) {
                if(!dataFound) {
                    if (data.id == id) {
                        console.log("Found : " + data.id);
                        $scope.lifecycleData = data;
                        /*$scope.province.province_name = data.province_name;
                         $scope.province.ip = data.ip;
                         $scope.province.port = data.port;*/

                        $("#myModal").modal();
                        dataFound = true;
                    }
                }
            });
        }

        $scope.saveData = function() {
            //collect service  base info
            var serviceBaseInfo = {
                 'name' :  $scope.lifecycleData.serviceName,
                 'description' : $scope.lifecycleData.description,
                 //'templateId' :  $scope.lifecycleData.optSelect.serviceTemplateId
				 'templateId' :  $("#svcTempl").val()
            };
            //send message
            $.when(DataService.createService(serviceBaseInfo))
                .then(function (response) {
                    $log.info(response);
                    if(response.status === 'checkfailed'){
                        return;
                    }else if (response.status === 'finished') {
                        $.when(queryService(response.serviceId)).then(function(serviceInstance){  
                            $scope.tableData.push(serviceInstance);
                            $scope.$apply();
                            $scope.tableParams.reload();
                            $('#myModal').modal('hide');
                        });
                    } else{
                        showErrorMessage('Create service failed',response);
                    }
                });
        }
        $scope.deleteIndividualData = function(id){
            var deleteHandle = function(result) {
                if (result) {
                    var remove = function() {
                        var pos = 0;
                        for(var i= 0; i < $scope.tableData.length; i++){    
                            if($scope.tableData[i].serviceId === id){
                                pos = i;
                                break;
                            }
                        }
                        $scope.tableData.splice(pos, 1);
                        $scope.$apply();
                        $scope.tableParams.reload();
                    };
                    $.when(DataService.deleteService(id))
                    .then(function(response) {
                        if (response.status === 'finished') {
                            remove();
                        } else {
                            showErrorMessage('Delete service failed',response);
                        }
                    });
                }
            };
            bootbox.confirm("Do you confirm to delete service?", deleteHandle);     
        };

        $scope.scaleData = function (id) {
            var nsInstanceId = id;
            $('#scaleNS').click(
                function() {
                    var scaleIn = $('#scalingTypeIn').attr('checked');
                    var scaleType = scaleIn === undefined ? 'SCALE_OUT' : 'SCALE_IN';
                    var aspectId = $('#scalingAspect').val();
                    var numberOfSteps = $('#numberOfSteps').val();
                    var resultHandleFun = function(response) {
                        if (response.status === 'finished') {
                            console.log('scale successfully!');
                        } else {
                            console.log('Scaling service failed! ' + response);
                            //showErrorMessage('Scaling service failed',response);
                        }
                    };
                    DataService.scaleService(nsInstanceId, scaleType, aspectId, numberOfSteps, resultHandleFun);
                    $('#scaleNS').unbind('click');
                }
            );
            $('#scaleOptionDialog').modal();
        };

    })

    .controller('lcTabsCtrl', function($scope, $state, $stateParams) {
        //console.log("$stateParams.id:: " + $stateParams.id);
        //$state.transitionTo("home.lcTabs({id: "+$stateParams.id+"})");


        $state.go('home.lcTabs.detailInfo', {'id': $stateParams.id});

    })

    .controller('detailInfoCtrl', function($scope, $stateParams, $compile, DataService) {
        console.log("detailInfoCtrl --> $stateParams.id:: " + $stateParams.id);
        //$scope.currentId = $stateParams.id;
        $scope.rightPanelHeader = "VPN Manager";
        var rowData = DataService.getSavedLCData($stateParams.id);
        var jsonData =[];
        if(rowData.serviceType === "SDNO" || rowData.serviceType === "NFVO"){
            jsonData[0] = {"id": $stateParams.id, "name": rowData.serviceType};
        }
        else{
            jsonData = DataService.loadServiceTopoSequence($stateParams.id);
        }
        $(".accordion").html("");
        for (var i = 0; i < jsonData.length; i++) {
            //console.log("jsonData Name: " + jsonData[i].name);
            if (jsonData[i].name == "SDNO") {
                //$("#sdnoLink").text(jsonData[i].name.toUpperCase());
                //console.log("Adding Accordian to SDNO");
                $(".accordion").append($compile(addAccordionData("sdno", jsonData[i].name.toUpperCase(), jsonData[i].id))($scope));
            }
            else if (jsonData[i].name == "NFVO") {
                //console.log("Adding Accordian to NFVO");
                $(".accordion").append($compile(addAccordionData("nfvo", jsonData[i].name.toUpperCase(), jsonData[i].id))($scope));
            }
            else {

            }
        }

        function addAccordionData(type, text, id) {
            console.log("id:"+id);
            var content = '';
            content += '<div class="panel panel-default"><div class="panel-heading">';
            content += '<h6 class="panel-title">';
            content += '<a style="text-decoration:none;" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne_'+type+'" ui-sref=".vpnManager" ui-sref-active="link_active_DetailInfo" href="#/home/lcTabs/'+id+'/detailInfo/vpnManager">';
            content += '<span id="sdnoLink">'+text+'</span></a>';
            content += '</h6></div>';
            if(type == "sdno") {
                content += '<div id="collapseOne_' + type + '" class="panel-collapse collapse in">';
            } else {
                content += '<div id="collapseOne_' + type + '" class="panel-collapse collapse">';
            }
            //content += '<div id="collapseOne_' + type + '" class="panel-collapse collapse" ui-sref=".vpnManager" ui-sref-active="link_active_DetailInfo">';

            content += '<ul class="list-group nomargin">';

            if(type == "sdno") {
                /*content += '<li id="overLink" class="list-group-item selected textAlign"><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><a ui-sref=".overlayVPN" ui-sref-active="link_active_DetailInfo" href="#/home/lcTabs/'+id+'/detailInfo/overlayVPN">Overlay VPN</a>';
                content += '</li>';
                content += '<li id="underLink" class="list-group-item textAlign"><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><a ui-sref=".underlayVPN" ui-sref-active="link_active_DetailInfo" href="#/home/lcTabs/'+id+'/detailInfo/underlayVPN">Underlay VPN</a>';
                content += '</li>';*/
            }
            else if(type == "gso"){
                //content += '<li id="linkgso" class="list-group-item textAlign"><!--<span class="glyphicon glyphicon-pencil text-primary"></span>--><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><span>OPEN-O</span></li>';
            }
            else if(type == "nfvo"){
                //content += '<li id="linknfvo" class="list-group-item textAlign"><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><span>ZTE</span></li>';
            }
            content += '</ul></div></div>';
            return content;
        }
    })

    .controller('topoCtrl', function($scope, $stateParams, $log, DataService) {
        console.log("vpnManagerCtrl --> $stateParams.id:: " + $stateParams.id);
        $scope.msg = $stateParams.id;
    })

    /*-------------------------------------------------------------------------------VPN Manager---------------------------------------------------------------------*/

    .controller('vpnManagerCtrl', function($scope, $stateParams, $log, DataService) {
        console.log("vpnManagerCtrl --> $stateParams.id:: " + $stateParams.id);
        //$scope.rightPanelHeader = "VPN Manager";
        /*var vtab_tpl = $(lcmModelTemplate).filter('#vtabs').html();
        var vTabData = {
            "items": [{
                "tablabel": "Overlay VPN",
                "isActive": false
            }, {
                "tablabel": "Underlay VPN",
                "isActive": false
            }]
        };
        var html = Mustache.to_html(vtab_tpl, vTabData);
        $('#vpnLinks').html(html);*/

    })

    /*-------------------------------------------------------------------------------OverlayVPN---------------------------------------------------------------------*/

    .controller("overlayVPNCtrl", function($scope, $rootScope, $compile, DataService, NgTableParams){
        $scope.message = "Overlay VPN";

        $scope.init = function() {
            //console.log("Overlay VPN... ng-init + " +  $rootScope.lcmModelTemplate);
            DataService.getOverlayData()
                .then(function(data){
                    $scope.overlayData = data.overlayData;
                    console.log("Data: ");
                    loadButtons();
                }, function(reason){
                    $scope.message = "Error is :" + JSON.stringify(reason);
                });
        }
        function loadButtons() {
            //console.log("Got it : " + $scope.$parent.getTemplate("defaultButtons"));
            /*var def_button_tpl = $(lcmModelTemplate).filter('#defaultButtons').html();
            console.log("template: " + def_button_tpl);

            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('div.overlayAction').html($compile(deletehtml)($scope));*/

            $scope.tableParams = new NgTableParams({count: 5, sorting: {id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[], dataset: $scope.overlayData});

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.$watch('checkboxes.checked', function(value) {
				$scope.checkboxes.items = [];
                angular.forEach($scope.tableParams.data, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });
        }
        $scope.checkAll = function() {
            console.log("Checked ..");
            angular.forEach($scope.overlayData, function(data) {
                $scope.checkboxes.items[user.id]
            });
        };
    })

    /*-------------------------------------------------------------------------------UnderlayVPN---------------------------------------------------------------------*/

    .controller("underlayVPNCtrl", function($scope, $rootScope, $compile, DataService, NgTableParams){
        $scope.message = "Underlay VPN";

        $scope.init = function() {
            //console.log("Underlay VPN... ng-init + " +  $rootScope.lcmModelTemplate);
            DataService.getUnderlayData()
                .then(function(data){
                    $scope.underlayVPN = data.underlayVPN;
                    console.log("Data: ");
                    loadButtons();
                }, function(reason){
                    $scope.message = "Error is :" + JSON.stringify(reason);
                });
        }
        function loadButtons() {
            /*var def_button_tpl = $(lcmModelTemplate).filter('#defaultButtons').html();
            //console.log("template: " + def_button_tpl);

            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('div.underlayAction').html($compile(deletehtml)($scope));*/

            $scope.tableParams = new NgTableParams({count: 5, sorting: {id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10], dataset: $scope.underlayVPN.underlayData});

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.$watch('checkboxes.checked', function(value) {
					  $scope.checkboxes.items = [];
                angular.forEach($scope.tableParams.data, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes.items[item.id] = value;
                    }
                });
            });

            $scope.tableParams_tpDetails = new NgTableParams({count: 5, sorting: {id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10], dataset: $scope.underlayVPN.tp_details});
        }
        $scope.checkAll = function() {
            console.log("Checked ..");
            angular.forEach($scope.underlayVPN.underlayData, function(data) {
                $scope.checkboxes.items[data.id]
            });
        };
    })

    .controller('inputDataCtrl', function($scope, $stateParams, $log, DataService) {
        console.log("inputDataCtrl --> $stateParams.id:: " + $stateParams.id);
        var rowData = DataService.getSavedLCData($stateParams.id);
        $scope.inputData = rowData.inputParameters;
        $log.info($scope.inputData);
        $("div.inputDataElements").html("");
        $("div.inputDataElements").append(convertInputsToUI('', 'show', $scope.inputData));

    })

    .controller('nfvoDetailCtrl', function($scope, $stateParams, $compile, DataService) {
        console.log("nfvoDetailCtrl --> $stateParams.id:: " + $stateParams.id);
        //$scope.currentId = $stateParams.id;

        var jsonData = DataService.loadNfvoServiceDetails($stateParams.id);
        var table_tpl = $(lcmModelTemplate).filter('#table').html();
        var vnfData = fetchDataForVnf(jsonData);
        $('#vnfInfoTable').html(Mustache.to_html(table_tpl, vnfData));

        var vlData = fetchDataForVl(jsonData);
        $('#vlInfoTable').html(Mustache.to_html(table_tpl, vlData));

        var vnffgData = fetchDataForVnffg(jsonData);
        $('#vnffgInfoTable').html(Mustache.to_html(table_tpl, vnffgData));

        function fetchDataForVnf(jsonData) {
            var header = ["Vnf instance Name"];
            var rowData = jsonData.vnfInfoId.map(function (vnfInfo) {
                return {"values": [vnfInfo.vnfInstanceName]}
            });
            return {"itemHeader": header,"rowitem": rowData,"striped": false,"border": true,"hover": true,"condensed": false,"filter": false,"action": "","searchField": ""}
        }

        function fetchDataForVl(jsonData) {
            var header = ["Network Resource Name","Link Port Resource Name"];
            var rowData = jsonData.vlInfo.map(function (vl) {
                return {"values": [vl.networkResource.resourceName, vl.linkPortResource.resourceName]}
            });
            return {"itemHeader": header,"rowitem": rowData,"striped": false,"border": true,"hover": true,"condensed": false,"filter": false,"action": "","searchField": ""}
        }

        function fetchDataForVnffg(jsonData) {
            var header = ["vnfInstanceId of vnffg instance","vlInstanceId of vnffg instance","cpInstanceId of vnffg instance", "nfpInstanceId of vnffg instance"];
            var rowData = jsonData.vnffgInfo.map(function (vnffg) {
                return {"values": [vnffg.vnfId, vnffg.virtualLinkId, vnffg.cpId, vnffg.nfp]}
            });
            return {"itemHeader": header,"rowitem": rowData,"striped": false,"border": true,"hover": true,"condensed": false,"filter": false,"action": "","searchField": ""}
        }

    })



var lcmModelTemplate = "";
function loadTemplate() {
	//alert("sai");
    $.get('/openoui/framework/template.html', function (template) {
        lcmModelTemplate += template;
    });
    $.get('/openoui/framework/templateContainer.html', function (template) {
        lcmModelTemplate += template;
    });
    $.get('/openoui/framework/templateWidget.html', function (template) {
        //console.log("Template is : "+template);
        lcmModelTemplate += template;
    });
    $.get('/openoui/framework/templateNotification.html', function (template) {
        lcmModelTemplate += template;
    });
    $.get('/openoui/framework/templateFunctional.html', function (template) {
        lcmModelTemplate += template;
    });
}
