/*
 * Copyright (C) 2015 ZTE, Inc. and others. All rights reserved. (ZTE)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vm = avalon.define({
    $id: "vmAppController",
    $tableId : "ict_virtualApplication_table",
    $virtualAppTableFields : {// table columns
        table: [
            {"mData": "instanceId", name: "ID", "bVisible": false},
            {"mData": "instanceName", name: $.i18n.prop("nfv-virtualApplication-iui-field-name"), "fnRender" : vmAppUtil.nameRender},
            {"mData": "serviceTemplateId", name: $.i18n.prop("nfv-virtualApplication-iui-field-template")},
            {"mData": "createdDate", name: $.i18n.prop("nfv-virtualApplication-iui-field-createDate")},
            {"mData": "instanceStatus", name: $.i18n.prop("nfv-virtualApplication-iui-field-status"), "fnRender" : vmAppUtil.statusRender},
            {"mData": "instanceOperating", name: "instanceOperating", "bVisible": false},
            {"mData": null, name: $.i18n.prop("nfv-virtualApplication-iui-field-action"), "fnRender" : vmAppUtil.operationRender, "sWidth" : "180px"},
            {"mData": "operationInfo", name: "operationinfo", "bVisible": false},
            {"mData": null, name: $.i18n.prop("nfv-virtualApplication-iui-field-operation"), "fnRender" : vmAppUtil.delRender}
        ]
    },
    $language: {
        "sProcessing": "<img src='../component/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;"
                        +$.i18n.prop("nfv-nso-iui-table-sProcess")+"</span>",
        "sLengthMenu": $.i18n.prop("nfv-nso-iui-table-sLengthMenu"),
        "sZeroRecords": $.i18n.prop("nfv-nso-iui-table-sZeroRecords"),
        "sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("nfv-nso-iui-table-sInfo"),
        "sInfoEmpty": $.i18n.prop("nfv-nso-iui-table-sInfoEmpty"),
        "sGroupActions": $.i18n.prop("nfv-nso-iui-table-sGroupActions"),
        "sAjaxRequestGeneralError":$.i18n.prop("nfv-nso-iui-table-sAjaxRequestGeneralError"),
        "sEmptyTable": $.i18n.prop("nfv-nso-iui-table-sEmptyTable"),
        "oPaginate": {
            "sPrevious": $.i18n.prop("nfv-nso-iui-table-sPrevious"),
            "sNext": $.i18n.prop("nfv-nso-iui-table-sNext"),
            "sPage": $.i18n.prop("nfv-nso-iui-table-sPage"),
            "sPageOf": $.i18n.prop("nfv-nso-iui-table-sPageOf")
        }
    },    
    $restUrl : {
        queryAppinstancesUrl: "/api/nsoc/v1/appinstances",
        queryStatusUrl: "/api/nsoc/v1/appinstances/",
        deleteAppinstancesUrl: "/api/nsoc/v1/appinstances/",
        newAppinstancesUrl: "/api/nsoc/v1/appinstances",
        queryAppinstancesByIdUrl: "/api/nsoc/v1/appinstances/",
        executeOperationUrl: "/api/nsoc/v1/appinstances/",
        queryOperationParamsUrl: "/api/nsoc/v1/servicetemplates/",        
        queryServiceTemplate: "/api/nsoc/v1/servicetemplates?deletionPending=false",
        queryVimInfoUrl : "/api/roc/v1/resource/vims",
        queryVnfmInfoUrl : "/api/roc/v1/resource/vnfms",
        delInstanceTemplateUrl: "/api/nsoc/v1/csars/",
        queryFlavorParamUrl: "/api/nsoc/v1/servicetemplates/",
        queryTemplateOptionsUrl: "/api/nsoc/v1/servicetemplates/",
        queryInputParamUrl: "/api/nsoc/v1/servicetemplates/",
        queryVnfInfoUrl : "/api/nsoc/v1/servicetemplates/",
        queryRocInfoBaseUrl : "/api/roc/v1/resource"
    },
    $initTable: function() {
        var setting = {};
        setting.language = vm.$language;
        setting.paginate = true;
        setting.info = true;
        setting.columns = vm.$virtualAppTableFields.table;
        setting.restUrl = vm.$restUrl.queryAppinstancesUrl;
        setting.tableId = vm.$tableId;
        serverPageTable.initDataTable(setting, {}, vm.$tableId + "_div");
    },
    $openDetail : function(instanceId, serviceTemplateId) {
        var url = "./virtualApplicationDetail.html?instanceId=" + instanceId
            + "&templateId=" + serviceTemplateId;
        window.open(url, "_self");
    },
    $initCometd : function() {
        var cometd = new $.Cometd();
        var cometdURL = location.protocol + "//" + location.host + "/api/nsocnotification/v1";
        cometd.configure({
            url : cometdURL,
            logLevel : "info"
        });
        // unregister websocket transport, use long-polling transport
        cometd.unregisterTransport('websocket');

        cometd.addListener("/meta/handshake", function(handshake){
            if(handshake.successful === true) {
                cometd.batch(function() {
                    //subscribe multiple channels
                    cometd.subscribe("/lifecycle/instance/status", function(message){
                        //message = JSON.parse(message.data);
                        message = message.data;
                        var table = $('#' + vm.$tableId).dataTable();
                        var tableData = table.fnGetData();
                        if(message.instanceStatus) {
                            var instance = message.instanceStatus;
                            for (var i=0; i<tableData.length; i++) {
                                if(tableData[i]["instanceId"] == instance.instanceid) {
                                    //if(instance.instancestatus == "normal" || instance.instancestatus == "failed") {
                                    refreshByCond();
                                    //}
                                }
                            }
                        }
                    });
                    cometd.subscribe("/servicetemplate/update", function(message){
                        //message = JSON.parse(message.data);
                        message = message.data;
                        var table = $('#' + vm.$tableId).dataTable();
                        var tableData = table.fnGetData();
                        if(message.oldTemplateid) {
                            var oldTemplateid = message.oldTemplateid;
                            for (var i=0; i<tableData.length; i++) {
                                if(tableData[i]["serviceTemplateId"] == oldTemplateid) {
                                    table.fnUpdate(message.newTemplateid , i, 2, false, false);
                                }
                            }
                        }
                    });
                });
            }
        });
        cometd.handshake();
    },
    //create vmapp
    showCreateApp : function() {
        vm.vmAppDialog.type = "create";
        vm.vmAppDialog.title = $.i18n.prop("nfv-virtualApplication-iui-text-title");
        vm.vmAppDialog.btnTitle = $.i18n.prop("nfv-virtualApplication-iui-text-createBtn");
        vm.vmAppDialog.$initData();

        $("a[href='#basicTab']").trigger("click");
        $("#vmAppDialog").modal("show");
    },
    $initWizard : function() {
        $(function(){
            $('#wizard').bootstrapWizard({
                'nextSelector' : '.button-next',
                'previousSelector' : '.button-previous',
                'onTabShow' : function(tab, navigation, index) {
                    //remove error message
                    $(".form-group").each(function () {
                        $(this).removeClass('has-success');
                        $(this).removeClass('has-error');
                        $(this).find(".help-block").remove();
                    });

                    var $total = navigation.find('li').length;
                    var $current = index+1;
                    if(($current == 1) || ($current == 2 && vm.vmAppDialog.type == "execute")) {
                        $('.button-previous').hide();
                        $('.button-next').show();
                        $('#createBtn').hide();
                    } else if ($current == $total) {
                        $('.button-previous').show();
                        $('.button-next').hide();
                        $('#createBtn').show();
                    } else {
                        $('.button-previous').show();
                        $('.button-next').show();
                        $('#createBtn').hide();
                    }
                },
                'onTabClick' : function() {
                    var $valid = $("#vmAppForm").valid();
                    if(!$valid) {
                        return false;
                    }
                },
                'onNext' : function(tab, navigation, index) {
                    var $valid = $("#vmAppForm").valid();
                    if(!$valid) {
                        return false;
                    }
                }
            });
            //prevent the validator from validating the next page input elements when click next button
            $(".button-next").click(function(e){
                e.preventDefault();
            });
        });
    },
    vmAppDialog : {
        type : "",
        title : "",
        btnTitle : "",
        name : "",
        currentRow : 0,
        templateId : "",
        operation : "",
        //basic tab
        templateSelectItems : [],
        vimSelectItems : [],
        vnfmSelectItems : [],
        vnfItems : [],
        templateType : "",
        description : "",
        //flavor tab
        flavorVisible : false,
        flavors : [],
        flavorDesc : "",
        flavorParams : [],
        //inputParams tab
        operationParams : [],
        templateInputParams : [],
        inputParamDescVisible : false,
        language : getLanguage(),
        //inputParams tab for scaleOut and scaleIn
        vmAppScaleHtml : "virtualApplicationScale.html",
        $initData : function() {
            $('#wizard ul').show();
            $('#wizard ul li').show();
            vm.vmAppDialog.inputParamDescVisible = false;
            vm.vmAppDialog.flavorParams = [];
            vm.vmAppDialog.flavorDesc = "";

            if(vm.vmAppDialog.type == "create") {
                //create new vmapp, show all tabs
                vmAppUtil.queryTemplate();
                vmAppUtil.queryVimInfo();
                vmAppUtil.queryVnfmInfo();
            } else {
                /*if(vmAppUtil.isScaleOperation(vm.vmAppDialog.operation)) {
                    vm.vmAppDialog.flavorVisible = true;
                    var url = vm.$restUrl.queryServiceTemplate + "&templateid=" + vm.vmAppDialog.templateId;
                    commonUtil.get(url, null, function(data) {
                        if (data) {
                            //default display the first template flavors
                            vm.vmAppDialog.flavors = data.flavors || [];
                            if(data.flavors.length) {
                                //default display the first flavor desc
                                vm.vmAppDialog.flavorDesc = data.flavors[0].desc;
                                var flavorName = data.flavors[0].name;
                                vmAppUtil.queryFlavorParam(vm.vmAppDialog.templateId, flavorName);
                            }
                        }
                    });
                } else {*/
                    //execute vmapp operation
                    $("a[href='#flavorTab']").trigger("click");
                    //hide basic tab
                    $('#wizard ul li').eq(0).hide();
                    
                    $("a[href='#inputParamTab']").trigger("click");
                    $('#wizard ul').hide();
                    $('.button-previous').hide();
                    $("#flavor").val("");
                //}
            }
        },
        $initInputParams : function(templateId) {
            vm.vmAppDialog.operationParams = [];
            vm.vmAppDialog.templateInputParams = [];
            //query sevicetemplate operation list
            $.ajax({
                type : "GET",
                url : vm.$restUrl.queryTemplateOptionsUrl + templateId + "/operations?returnJson=true",
                dataType : "json",
                success : function(data) {
                    var options = data || [];
                    for(var i=0;i<options.length;i++) {
                        if(options[i].name == "init") {
                            url = vm.$restUrl.queryOperationParamsUrl + templateId + "/operations/init/parameters";
                            //query operation params
                            $.ajax({
                                type : "GET",
                                url : vm.$restUrl.queryInputParamUrl + templateId + "/operations/init/parameters",
                                dataType : "json",
                                success : function(resp) {
                                    vm.vmAppDialog.operationParams = resp || [];
                                    if(vm.vmAppDialog.templateInputParams.length || vm.vmAppDialog.operationParams.length) {
                                        vm.vmAppDialog.inputParamDescVisible = false;
                                    } else {
                                        vm.vmAppDialog.inputParamDescVisible = true;
                                    }
                                }
                            });
                            break;
                        }
                    }                    
                }
            });
            //query template input params 
            $.ajax({
                type : "GET",
                url : vm.$restUrl.queryInputParamUrl + templateId + "/parameters",
                dataType : "json",
                success : function(resp) {
                    vm.vmAppDialog.templateInputParams = resp || [];
                    if(vm.vmAppDialog.templateInputParams.length || vm.vmAppDialog.operationParams.length) {
                        vm.vmAppDialog.inputParamDescVisible = false;
                    } else {
                        vm.vmAppDialog.inputParamDescVisible = true;
                    }
                }
            });
        },
        $initVnfInfo : function(templateInfo) {
            vm.vmAppDialog.vnfItems = [];
            vm.vmAppDialog.templateType = templateInfo.nfvtype;
            if(vmAppUtil.isNSTemplate(templateInfo.nfvtype)) {
                vmAppUtil.queryVnfInfo(templateInfo.templateid);
            } else {
                var vnfNode = {
                    templateid : templateInfo.templateid,
                    name : templateInfo.templatename
                }
                vm.vmAppDialog.vnfItems.push(vnfNode);
            }
        },
        $templateChange : function() {
            var $option = $("#serviceTemplateName option:selected");
            var index = $option.data("index");
            var templateItem = vm.vmAppDialog.templateSelectItems[index];
            vm.vmAppDialog.flavors = templateItem.flavors || [];
            //as template change，flavor change too
            vm.vmAppDialog.$flavorChange();
            if(vm.vmAppDialog.flavors.length) {
                vm.vmAppDialog.flavorDesc = vm.vmAppDialog.flavors[0].desc;
            } else {
                vm.vmAppDialog.flavorDesc = "";
            }
            //as template change，operationParams change too
            vm.vmAppDialog.$initInputParams(templateItem.templateid);
            //if the template is a ns template, query vnf templates
            vm.vmAppDialog.$initVnfInfo(templateItem);
        },
        $flavorChange : function() {
            var templateId = "";
            if(vm.vmAppDialog.type == "create") {
                templateId = $("#serviceTemplateName").val();
            } else {
                templateId = vm.vmAppDialog.templateId;
            }
            var $flavor = $("#flavor option:selected");
            var flavorName = $flavor.val();
            vm.vmAppDialog.flavorParams = [];
            vm.vmAppDialog.flavorDesc = $flavor.data("desc");
            if(templateId && flavorName) {
                vmAppUtil.queryFlavorParam(templateId, flavorName);
            }
        },
        $getFlavorI18nInfo : function(key) {
            return $.i18n.prop("nfv-virtualApplication-iui-text-flavor-" + key);
        },
        $getGoupParamKey : function(groupName, key) {
            //to prevent a duplicate key
            return groupName + key;
        },
        $getVnfmText : function(name) {
            if(vmAppUtil.isNSTemplate(vm.vmAppDialog.templateType)) {
                return name + " " + $.i18n.prop("nfv-virtualApplication-iui-text-vnfm");
            } else {
                return $.i18n.prop("nfv-virtualApplication-iui-text-vnfm");
            }
        },   
        $confirmBtnClick : function() {
            //validate rules
            var form = $("#vmAppForm");
            if(!form.valid()) {
                return false;
            }
            //flavor params
            var flavorParams = vmAppUtil.generateGourpParams(vm.vmAppDialog.flavorParams);            
            //additional params, include template input params
            var additionalParams = vmAppUtil.generateAdditionalParams(vm.vmAppDialog.templateInputParams);
            //vnfRelationInfos
            var vnfRelationInfos = vmAppUtil.generateVNFRelationInfos(vm.vmAppDialog.vnfItems);
            //operation param
            var inputParams = [];
            var operationParam = {
                groupName : vm.vmAppDialog.operation,
                params : []
            }
            $.each(vm.vmAppDialog.operationParams, function(index, element){
                var value = $("#" + element.paramKey).val();
                if(value) {
                    var groupParam = {
                        key : element.paramKey,
                        value : value
                    }
                    operationParam.params.push(groupParam);
                }
            });
            operationParam.params = operationParam.params.concat(additionalParams);
            inputParams.push(operationParam);

            if(vm.vmAppDialog.type == "create") {
                operationParam.groupName = "init";
                var param = {
                    instanceName : $("#instanceName").val(),
                    templateId : $("#serviceTemplateName").val(),
                    type : vm.vmAppDialog.templateType,
                    flavor : $("#flavor").val(),
                    flavorParams : flavorParams,
                    operationParams : inputParams,
                    //vnfRelationInfos : vnfRelationInfos
                    vnfmId : $("#vnfmId").val()
                };
                vmAppUtil.newApp(param);
            } else {
                var param = {
                    flavor : $("#flavor").val(),
                    flavorParams : flavorParams,
                    operationParams : inputParams
                }
                vmAppUtil.executeOperation(param, vm.vmAppDialog.currentRow, vm.vmAppDialog.operation);
            }
        }
    },
    vmAppScaleDialog : {
        $tableId : "ict_vdu_table",
        $virtualAppTableFields : {// table columns
            vduTemplateTable: [
                {"mData": "id", name: "ID", "bVisible": false},
                {"mData": "vnfId", name: "VNFID", "bVisible": false},
                {"mData": "type", name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-type")},
                {"mData": "num", name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-num")},
                {"mData": "name", name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-name")},
                {"mData": null, name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-operation"), "fnRender" : vmAppUtil.delVduRender}
            ],
            vduInstanceTable: [
                {"mData": "oid", name: "ID", "bVisible": false},
                {"mData": "type", name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-type")},
                {"mData": "name", name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-name")},
                {"mData": null, name: $.i18n.prop("nfv-virtualApplication-iui-scale-field-operation"), 
                 "sWidth" : "100px", "sClass" : "icheckbox", "fnRender" : vmAppUtil.checkRender}
            ]
        },
        $initTable: function(operationType, tableData) {
            var setting = {};
            setting.language = vm.$language;
            setting.paginate = true;
            setting.info = false;
            if(operationType == "type") {
                setting.columns = vm.vmAppScaleDialog.$virtualAppTableFields.vduTemplateTable;
            } else {
                setting.columns = vm.vmAppScaleDialog.$virtualAppTableFields.vduInstanceTable;
            }
            setting.tableId = vm.vmAppScaleDialog.$tableId;
            serverPageTable.initTableWithData(setting, setting.tableId + "_div", tableData);

            $('input:checkbox').iCheck({
                //initialize icheck style
                checkboxClass: 'icheckbox_square-aero'
            });
            var oTable = $("#" + vm.vmAppScaleDialog.$tableId).dataTable();
            oTable.on("draw", function(){
                //initialize icheck style
                $('input:checkbox').iCheck({
                    checkboxClass: 'icheckbox_square-aero'
                });
            });
        },
        currentRow : 0,
        operation : "",
        instanceId : "",
        templateId : "",
        scaleTitle : "",
        title : "",
        saveType : "add",
        instanceType : false,
        typeVisible : true,
        titleVisible : false,
        vnfDatas : [],
        currentVnfData : {},
        vnfSelectItems : [],
        vduSelectItems : [],
        btnTitle : $.i18n.prop("nfv-virtualApplication-iui-text-scale-vduBtn-title"),
        numTip : $.i18n.prop("nfv-virtualApplication-iui-text-scale-vnf-numTip"),
        nameTip : $.i18n.prop("nfv-virtualApplication-iui-text-scale-vnf-nameTip"),
        $initScaleParams : function() {
            //set riadio visible and checked attribution
            if(vm.vmAppScaleDialog.operation == "scaleOut") {
                vm.vmAppScaleDialog.scaleTitle = $.i18n.prop("nfv-virtualApplication-iui-text-scale-out-modal-title");
                vm.vmAppScaleDialog.instanceType = true;
            } else {
                vm.vmAppScaleDialog.scaleTitle = $.i18n.prop("nfv-virtualApplication-iui-text-scale-in-modal-title");
                vm.vmAppScaleDialog.instanceType = false;
            }
            vm.vmAppScaleDialog.vnfSelectItems = [];
            vm.vmAppScaleDialog.vnfDatas = [];
            vm.vmAppScaleDialog.titleVisible = false;

            vmAppUtil.queryScalableVnfInfo(vm.vmAppScaleDialog.templateId);
        },
        $addValidatorMethod : function() {
            $.validator.addMethod("vnfRepeat", function(value, element, params){
                var vnfId = $(element).val();
                var vnfDatas = vm.vmAppScaleDialog.vnfDatas;
                for(var i=0;i<vnfDatas.length;i++) {
                    if(vnfDatas[i].id == vnfId) {
                        return false;
                    }
                }
                return true;
            }, $.i18n.prop("nfv-virtualApplication-iui-text-scale-validate-message"));
        },
        $addVnf : function(action, vnf) {
            var vnfData;
            var operationType;
            if(action == "add") {
                var form = $("#vnfForm");
                if(!form.valid()) {
                    return false;
                }

                vm.vmAppScaleDialog.saveType = "add";
                var index = parseInt($("#vnfType option:selected").attr("data-index"));
                vnfData = vm.vmAppScaleDialog.vnfSelectItems[index];
                vnfData.vduTableData = [];
                operationType = $("input[name='operationType']:checked").val();
            } else {
                vm.vmAppScaleDialog.saveType = "edit";
                vnfData = vnf;
                operationType = vnfData.operationType;
            }

            vm.vmAppScaleDialog.currentVnfData = vnfData;
            vm.vmAppScaleDialog.vduSelectItems = vnfData.vduTypeList;
            
            if(operationType == "type") {
                vm.vmAppScaleDialog.typeVisible = true;
                vm.vmAppScaleDialog.title = $.i18n.prop("nfv-virtualApplication-iui-text-scale-type-title");
                vm.vmAppScaleDialog.$initTable(operationType, vnfData.vduTableData);
            } else {
                vm.vmAppScaleDialog.typeVisible = false;
                vm.vmAppScaleDialog.title = $.i18n.prop("nfv-virtualApplication-iui-text-scale-instance-title");
                //initialize table without data, in case of query vdu instances no data
                vm.vmAppScaleDialog.$initTable("instance", []);
                //query scalable vdu instances
                vmAppUtil.queryScalableVduInstance(vm.vmAppScaleDialog.instanceId, vnfData.id, vnfData.vduTypeList);
            }
            
            $("#addVduModal").modal("show");
        },
        $addVduToTable : function() {
            //validate vdu form
            var form = $("#vduForm");
            if(!form.valid()) {
                return false;
            }

            var currentVnfData = vm.vmAppScaleDialog.currentVnfData;
            var vduType = {
                id : $("#vduType option:selected").val(),
                vnfId : currentVnfData.id,
                type : $("#vduType option:selected").text(),
                num : $("#vduNum").val(),
                name : $("#vduName").val()
            }

            var oTable = $("#" + vm.vmAppScaleDialog.$tableId).dataTable();
            oTable.fnAddData(vduType);
        },
        $deleteVnf : function(vnfId) {
            var vnfDatas = vm.vmAppScaleDialog.vnfDatas;
            for(var i=0;i<vnfDatas.length;i++) {
                if(vnfDatas[i].id == vnfId) {
                    vnfDatas.splice(i, 1);
                }
            }
            vm.vmAppScaleDialog.titleVisible = vnfDatas.length;
        },
        $scaleConfirmClick : function() {
            var operationType = $("input[name='operationType']:checked").val();
            var currentVnfData = vm.vmAppScaleDialog.currentVnfData;
            currentVnfData.operationType = operationType;
            currentVnfData.vduTableData = [];
            var vduInstanceNameArray = [];
            var oTable = $("#" + vm.vmAppScaleDialog.$tableId).dataTable();
            var data = oTable.fnGetData();
            if(operationType == "instance") {
                var tr = oTable.fnGetNodes();
                for(var i=0;i<tr.length;i++) {
                    var isChecked = $(tr[i]).find("input:checked").length;
                    if(isChecked) {
                        var currentRowData = data[i];
                        currentVnfData.vduTableData.push(currentRowData);
                        vduInstanceNameArray.push(currentRowData.name);
                    }
                }
                currentVnfData.vduNameStr = vduInstanceNameArray.toString();
            } else {
                currentVnfData.vduTableData = data;
                var vduTypeArray = [];
                var vduNumArray = [];
                for(var i=0;i<currentVnfData.vduTableData.length;i++) {
                    vduTypeArray.push(currentVnfData.vduTableData[i].type);
                    vduNumArray.push(currentVnfData.vduTableData[i].num);
                }
                currentVnfData.vduTypeStr = vduTypeArray.toString();
                currentVnfData.vduNumStr = vduNumArray.toString();
            }

            if(vm.vmAppScaleDialog.saveType == "edit") {
                var vnfDatas = vm.vmAppScaleDialog.vnfDatas;
                for(var i=0;i<vnfDatas.length;i++) {
                    if(vnfDatas[i].id == currentVnfData.id) {
                        if(currentVnfData.vduTableData.length) {
                            vnfDatas[i] = currentVnfData;
                        } else {
                            //delete the vnf which has no vdu data
                            vm.vmAppScaleDialog.vnfDatas.splice(i, 1);
                        }
                    }
                }
            } else {
                if(currentVnfData.vduTableData.length) {
                    vm.vmAppScaleDialog.vnfDatas.push(currentVnfData);
                }
            }
            vm.vmAppScaleDialog.titleVisible = vm.vmAppScaleDialog.vnfDatas.length;
            $("#addVduModal").modal("hide");
        },
        $confirmBtnClick : function() {
            var scaleParams = [];
            var scaleParam = {
                groupName : vm.vmAppScaleDialog.operation,
                params : []
            }
            scaleParam.params = vmAppUtil.generateScaleParams(vm.vmAppScaleDialog.vnfDatas);
            scaleParams.push(scaleParam);

            var param = {
                operationParams : scaleParams
            }
            vmAppUtil.executeOperation(param, vm.vmAppScaleDialog.currentRow, vm.vmAppScaleDialog.operation);
        }
    },
    templateRender : function(action) {
        if(action == "add") {
            var data = vm.vmAppDialog.templateSelectItems;
            if(data.length) {
                //default display the first template flavors
                vm.vmAppDialog.flavors = data[0].flavors || [];
                if(vm.vmAppDialog.flavors.length) {
                    //default display the first flavor desc
                    vm.vmAppDialog.flavorDesc = vm.vmAppDialog.flavors[0].desc;
                }
                //default display the first template input params
                vm.vmAppDialog.$initInputParams(data[0].templateid);
                //if the template is a ns template, query vnf templates
                vm.vmAppDialog.$initVnfInfo(data[0]);
            }
        }
    },
    vnfRender : function(action) {
        if(action == "add") {
            //add vnfm rules
            $(this).find('select').each(function(){
                $(this).rules("add", {required : true});
            });
        }
    },
    flavorRender : function(action) {
        if(action == "add") {
            //default display the first flavor params
            vm.vmAppDialog.$flavorChange();
        }
    },
    paramRender : function(action) {
        if(action == "add") {
            //add dynamic validate rules
            $(this).find('input').each(function(){
                $(this).rules("add", {required : true});
            });
        }
    },
    operationParamRender : function(action) {
        if(action == "add") {
            //add dynamic validate rules
            $(this).find('input').each(function(){
                var required = $(this).attr("data-required");
                if(required == "true") {
                    $(this).rules("add", {required : true});
                }
            });
        }
    },
    includeRender : function() {
        //internationalize scale dialog
        var lang = getLanguage();
        loadPropertiesSideMenu(lang, 'nfv-nso-iui-i18n', 'i18n/');

        //initialize vnf form validator
        vmAppUtil.initFormValidator("vnfForm");
        //add dynamic validate rule
        vm.vmAppScaleDialog.$addValidatorMethod();
        $("#vnfType").rules("add", {vnfRepeat : true});
        //initialize vdu form validator
        vmAppUtil.initFormValidator("vduForm");
        $("#vduNum").rules("add", {digits : true, required : true});
    }
});
avalon.scan();
vm.$initTable();
vm.$initWizard();
vm.$initCometd();

var refreshByCond = function() {
    vm.$initTable();
    vm.$initWizard();
}