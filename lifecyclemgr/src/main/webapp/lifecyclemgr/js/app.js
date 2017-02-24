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
                templateUrl : "templates/topo.html"
            })
            .state("home.lcTabs.inputData", {
                url : "/inputData",
                templateUrl : "templates/inputData.html",
                controller : "inputDataCtrl"
            })
            .state("home.lcTabs.detailInfo.overlayVPN", {
                url: "/overlayVPN",
                templateUrl : "templates/overlayVPN.html",
                controller : "overlayVPNCtrl"
            })
            .state("home.lcTabs.detailInfo.underlayVPN", {
                url: "/underlayVPN",
                templateUrl : "templates/underlayVPN.html",
                controller : "underlayVPNCtrl"
            })
        /*modalStateProvider.state("home.lcTabs1", {
            url: '/lcTabs',
            templateUrl: 'templates/lctabs.html'
        });*/

    })

    .controller('homeCtrl', function($scope, $compile, $state, $log, DataService, NgTableParams) {
        $scope.param="lctableData";

        $scope.init = function() {
            DataService.loadGetServiceData()
                .then(function (data) {
                    if (data) {
                        $scope.tableData = data.lcData;
                        var tableData = data.lcData;
                        loadTableData();
                    }
                    else {
                        $scope.error = "Error!";
                    }
                }, function (reason) {
                    $scope.error = "Error ! " + reason;
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
            var tab_tpl = $(modelTemplate).filter('#tabs').html();
            var html = Mustache.to_html(tab_tpl, $scope.lctabsData.tabData);
            $('#lctabArea').html(html);
        }

        function loadTableData() {
            console.log("In loadData()");

            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            var def_iconbutton_tpl = $(modelTemplate).filter('#defaultIconButtons').html();
            /*var add_data = {"title":"Add", "clickAction":"showAddModal()"};*/
            var add_data = {"title":"Create", "type":"btn btn-default", "gType": "glyphicon-plus", "iconPosition":"left", "clickAction":"showAddModal()"};
            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var addhtml = Mustache.to_html(def_iconbutton_tpl, add_data);
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('#lcTableAction').html($compile(addhtml)($scope));
            $('#lcTableAction').append($compile(deletehtml)($scope));

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.tableParams = new NgTableParams({count: 5, sorting: {name: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10, 15], dataset: $scope.tableData});

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.tableData, function(item) {
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



            var text = $(modelTemplate).filter('#textfield').html();
            var number = $(modelTemplate).filter('#numeric').html();
            var dropDown = $(modelTemplate).filter('#simpleDropdownTmpl').html();

            var dataText = {"ErrMsg" :     {"textboxErr" : "Service name is required.", "modalVar":"lifecycleData.name", "placeholder":"Service Name"}};
            $('#myModal .serviceName').html($compile(Mustache.to_html(text, dataText.ErrMsg))($scope));

            var TempNameText = {"ErrMsg" :     {"textboxErr" : "Template name is required.", "modalVar":"lifecycleData.template", "placeholder":"Template Name"}};
            $('#myModal .templateName').html($compile(Mustache.to_html(text, TempNameText.ErrMsg))($scope));

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
                   // var templatesInfo = translateToTemplatesInfo(tmplatesResponse);
                  //  document.getElementById("svcTempl").innerHTML = templatesInfo;
                    $scope.optionsValue = tmplatesResponse;
                    //$scope.someOptions = [{serviceTemplateId:"1",templateName:"1.1"}, {serviceTemplateId:"2",templateName:"1.2"}];
                    // $scope.someOptions = [{"serviceTemplateId": '1', "templateName": "1.1"},{"serviceTemplateId": '2', "templateName": "1.2"}]
                    // console.log(":: " + JSON.stringify($scope.optionsValue));
                }, function (reason) {
                    $scope.error = "Error ! " + reason;
                });



            //$('#myModal .creator').html($compile(Mustache.to_html(text, creatorText.ErrMsg))($scope));

            var modelSubmit_data = {"title":"Submit", "clickAction":"saveData(lifecycleData.id)"};
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

        $scope.templateParam = function() {
            //$scope.lifecycleData.optSelect = 1.2;
            //$log.info($scope.lifecycleData);

            DataService.fetchCreateParameters($scope.lifecycleData.optSelect)
                .then(function (tmplatesParamResponse) {
                    console.log("Data Param Template :: ");
                    $log.info(tmplatesParamResponse);
                    $scope.paramJsonObj= tmplatesParamResponse.templateName;

                }, function (reason) {
                    $scope.error = "Error ! " + reason;
                });

        }




        $scope.showAddModal = function() {
            console.log("Showing Modal to Add data");
            $scope.lifecycleData = {};
            $scope.textboxErr = false;

            //$("#myModal").modal();
            $("#myModal").modal({}).draggable();
        }
        $scope.closeModal = function() {
            console.log("Closing Modal...");
            $('#myModal').modal('hide');
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
            //TODO
            var sengMsgObj = {};//collectCreateParamfromUI('', 'create', $scope.templateParameters.paramJsonObj);
            //createServiceInstance(sengMsgObj)
            DataService.createServiceInstance(lifecycleData, sengMsgObj)
                .then(function (response) {
                    $log.info(response);
                    //TODO
                }, function (reason) {
                    $scope.error = "Error ! " + reason;
                });
        }

        /**
         * convert the template params obj to html UI string
         *
         * @param identify the object identify, it should be different every time
         * @return the html component string
         */
        function collectCreateParamfromUI(parentHost,identify, createParam) {
            // the create params used for create msg
            var paramSentObj = {
                domainHost:'',
                nodeTemplateName:'',
                nodeType:'',
                segments:[],
                additionalParamForNs:{}
            };
            // get the domain value
            if (undefined !=  createParam.domainHost && 'enum' === createParam.domainHost.type) {
                var domain = collectParamValue(identify, createParam.domainHost);
                paramSentObj.domainHost = collectParamValue(identify, createParam.domainHost)
            }
            //if parent domainHost is not '' and local domain host is'', it should be setted as parent
            if('' != parentHost && '' == paramSentObj.domainHost){
                paramSentObj.domainHost = parentHost;
            }
            paramSentObj.nodeTemplateName = createParam.nodeTemplateName;
            paramSentObj.nodeType = createParam.nodeType;

            // get own param value from UI
            createParam.additionalParamForNs.forEach(function(param) {
                paramSentObj.additionalParamForNs[param.name] = collectParamValue(identify, param);
            });
            // get segments param value from UI
            createParam.segments.forEach(function(segment) {
                // the identify for segment
                var segmentIdentify = '' == identify ? segment.nodeTemplateName
                    : identify + '_' + segment.nodeTemplateName;
                var segmentObj = collectCreateParamfromUI(paramSentObj.domainHost, segmentIdentify, segment);
                paramSentObj.segments.push(segmentObj);
            });
            return paramSentObj;
        }


    })

    .controller('lcTabsCtrl', function($scope, $state, $stateParams) {
        //console.log("$stateParams.id:: " + $stateParams.id);
        //$state.transitionTo("home.lcTabs({id: "+$stateParams.id+"})");


        $state.go('home.lcTabs.detailInfo', {'id': $stateParams.id});

    })

    .controller('detailInfoCtrl', function($scope, $stateParams, $compile, DataService) {
        console.log("detailInfoCtrl --> $stateParams.id:: " + $stateParams.id);
        //$scope.currentId = $stateParams.id;
        $scope.rightPanelHeader = "SDNO-VPN Manager";

        var jsonData = DataService.loadServiceDetails($stateParams.id);
        $(".accordion").html("");
        for (var i = 0; i < jsonData.length; i++) {
            //console.log("jsonData Name: " + jsonData[i].name);
            if (jsonData[i].name == "sdno") {
                //$("#sdnoLink").text(jsonData[i].name.toUpperCase());
                //console.log("Adding Accordian to SDNO");
                $(".accordion").append($compile(addAccordionData("sdno", jsonData[i].name.toUpperCase(), $stateParams.id))($scope));
            }
            else if (jsonData[i].name == "gso") {
                //console.log("Adding Accordian to GSO");
                $(".accordion").append($compile(addAccordionData("gso", jsonData[i].name.toUpperCase(), $stateParams.id))($scope));
            }
            else if (jsonData[i].name == "nfvo") {
                //console.log("Adding Accordian to NFVO");
                $(".accordion").append($compile(addAccordionData("nfvo", jsonData[i].name.toUpperCase(), $stateParams.id))($scope));
            }
            else {

            }
        }

        function addAccordionData(type, text, id) {
            console.log("id:"+id);
            var content = '';
            content += '<div class="panel panel-default"><div class="panel-heading">';
            content += '<h6 class="panel-title">';
            content += '<a style="text-decoration:none;" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne_'+type+'" onClick="fnLoadTblData(this, \''+type+'\');">';
            content += '<span id="sdnoLink">'+text+'</span></a>';
            content += '</h6></div>';
            if(type == "sdno") {
                content += '<div id="collapseOne_' + type + '" class="panel-collapse collapse in">';
            } else {
                content += '<div id="collapseOne_' + type + '" class="panel-collapse collapse">';
            }
            content += '<ul class="list-group nomargin">';

            if(type == "sdno") {
                content += '<li id="overLink" class="list-group-item selected textAlign"><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><a ui-sref=".overlayVPN" ui-sref-active="link_active_DetailInfo" href="#/home/lcTabs/'+id+'/detailInfo/overlayVPN">Overlay VPN</a>';
                content += '</li>';
                content += '<li id="underLink" class="list-group-item textAlign"><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><a ui-sref=".underlayVPN" ui-sref-active="link_active_DetailInfo" href="#/home/lcTabs/'+id+'/detailInfo/underlayVPN">Underlay VPN</a>';
                content += '</li>';
            }
            else if(type == "gso"){
                content += '<li id="linkgso" class="list-group-item textAlign"><!--<span class="glyphicon glyphicon-pencil text-primary"></span>--><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><span>OPEN-O</span></li>';
            }
            else if(type == "nfvo"){
                content += '<li id="linknfvo" class="list-group-item textAlign"><span class="glyphicon glyphicon-pencil text-primary pencilimg"></span><span>ZTE</span></li>';
            }
            content += '</ul></div></div>';
            return content;
        }
    })

    /*-------------------------------------------------------------------------------OverlayVPN---------------------------------------------------------------------*/

    .controller("overlayVPNCtrl", function($scope, $rootScope, $compile, DataService, NgTableParams){
        $scope.message = "Overlay VPN";

        $scope.init = function() {
            //console.log("Overlay VPN... ng-init + " +  $rootScope.modelTemplate);
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
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            console.log("template: " + def_button_tpl);

            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('div.overlayAction').html($compile(deletehtml)($scope));

            $scope.tableParams = new NgTableParams({count: 5, sorting: {id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[], dataset: $scope.overlayData});

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.overlayData, function(item) {
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
            //console.log("Underlay VPN... ng-init + " +  $rootScope.modelTemplate);
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
            var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            //console.log("template: " + def_button_tpl);

            var delete_data = {"title":"Delete Selected", "clickAction":"deleteData()"};
            var deletehtml = Mustache.to_html(def_button_tpl, delete_data);
            $('div.underlayAction').html($compile(deletehtml)($scope));

            $scope.tableParams = new NgTableParams({count: 5, sorting: {id: 'asc'}    //{page: 1,count: 10,filter: {name: 'M'},sorting: {name: 'desc'}
            }, { counts:[5, 10], dataset: $scope.underlayVPN.underlayData});

            $scope.checkboxes = { 'checked': false, items: {} };

            $scope.$watch('checkboxes.checked', function(value) {
                angular.forEach($scope.underlayVPN.underlayData, function(item) {
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
        $scope.inputData = DataService.getSavedLCData($stateParams.id);
        $log.info($scope.inputData);
        /*for(var i = 0; i < $scope.inputData.length; i++) {
            //var def_button_tpl = $(modelTemplate).filter('#defaultButtons').html();
            $("#inputDataElements").appendChild("<span>Shahid</span>");

        }*/

        $("div.inputDataElements").html("");
        for (var prop in $scope.inputData) {
            //console.log('obj.' + prop, '=', $scope.inputData[prop]);
            //$("#inputDataElements").append("<div><span>"+prop+": </span><span>"+$scope.inputData[prop]+"</span></div>");
            $("div.inputDataElements").append('<div class="mT15 form-group row" style="margin-top:35px;"><div class="col-md-2 col-xs-2 col-lg-2 col-sm-2" align="left"><label class="control-label"><span style="font-size:16px;">'+ prop + ':</span></label></div><div class="col-md-3 col-xs-3 col-lg-3 col-sm-3"><input  type="text" name="" maxlength="256" data-toggle="tooltip" data-placement="top" title="'+ $scope.inputData[prop] + '" value="'+ $scope.inputData[prop] + '" readonly disabled/></div></div>');
        }
    })


var modelTemplate;
function loadTemplate() {
    $.get('template.html', function(template) {
        modelTemplate = template;
    });
}

