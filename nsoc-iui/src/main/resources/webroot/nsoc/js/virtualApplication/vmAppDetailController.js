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
    $id : "vmAppDetailController",
    templateId : "",
    templateData : [
        {href: "#topology", name: "Topology", value: true},
        {href: "#nodes", name: "Nodes", value: false}
    ],
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
    tabChange : function(index) {
        refreshByCond(index);
    },
    $restUrl : {
        queryNodeTemplateUrl : "/api/nsoc/v1/servicetemplates/{0}/nodetemplates",
        queryNodesInfoUrl:"/api/nsoc/v1/appinstances/{0}/nodeintsances",
        queryEventsInfoUrl: "/api/nsoc/v1/appinstances/{0}/operateschedules"
    },
    $init : function() {
        $.ajax({
            type : "GET",
            url : vm.$restUrl.queryNodeTemplateUrl,
            success : function(resp) {
                if(resp) {
                    var nodeTemplateData = [];                
                    for(var i=0; i<resp.length; i++) {
                        var nodeTemplate = topoUtil.generateNodeTemplate(resp[i]);
                        nodeTemplateData.push(nodeTemplate); 
                    }
                    vm.nodesTab.nodesDetail.nodeTemplateDetailData = resp;
                    //generate node template table
                    vm.topologyTab.topoTemplateData = topoUtil.generateTopoTemplate(nodeTemplateData);
                    //initialize topology graph data
                    vmAppDetailUtil.initTopoData(vm.topologyTab.topoTemplateData.$model);
                }
            },
            error : function() {
                commonUtil.showMessage($.i18n.prop("nfv-topology-iui-message-error"), "danger");
            }
        });

        //initialize event table
        vm.executionTab.$initEventsTable();
    },
    $initCometd : function() {
        commonUtil.registerCometdMessage("/api/nsocnotification/v1", "/lifecycle/instance/process", function(message) {
            var table = $('#' + vm.executionTab.$eventsTabId).dataTable();
            var tableData = table.fnGetData();
            if(message.instanceProcess) {
                var instance = message.instanceProcess;
                if(instance.instanceid == vm.executionTab.$instanceId) {
                    table.fnAddData(instance.operationSchedule.currentStepInfo, true);
                }
            }
        });
    },
    topologyTab : {
        topology : "topology.html",
        vnfTip : $.i18n.prop("nfv-topology-iui-vnf-tip"),
        btnTip : $.i18n.prop("nfv-topology-iui-btn-return-tip"),
        topoTemplateData:[],
        boxTopoDatas:[],
        networkTopoDatas:[],
        isShowNum: true,
        eventVisible: false,
        returnBtnVisible : false,
        $getColor: function(index) {
            return topoUtil.getColor(index);
        },
        $getCidr: function(properties){
            return topoUtil.getCidr(properties.$model);
        },
        $getCpTop: function(index, parentBoxId){
            return topoUtil.getCpTop(index, parentBoxId);
        },
        $initTopology : function(topoTemplateData) {
            vmAppDetailUtil.initTopoData(topoTemplateData);
        },
        $showTopo:function(id, name){
            vm.nodesTab.nodesDetail.$showDetails("block", id, name);
        },
        $showEvent: function() {
            vm.topologyTab.eventVisible = !vm.topologyTab.eventVisible;
            if(vm.topologyTab.eventVisible) {
                //query event table data
                var oTable = $("#" + vm.executionTab.$eventsTabId).dataTable(); 
                oTable.fnAdjustColumnSizing();
            } else {
                //refresh topo data
                vm.topologyTab.$initTopology(vm.topologyTab.topoTemplateData.$model);
            }
        },
        $showVnfTopo: function(templateId) {
            vm.topologyTab.returnBtnVisible = true;
            vm.$restUrl.queryNodeTemplateUrl = "/api/nsoc/v1/servicetemplates/" + templateId + "/nodetemplates";
            vm.$init();
        },
        $returnNS: function() {
            vm.topologyTab.returnBtnVisible = false;
            vm.$restUrl.queryNodeTemplateUrl = "/api/nsoc/v1/servicetemplates/" + vm.templateId + "/nodetemplates";
            vm.$init();
        }
    },
    nodesTab : {
        $nodesTabId : "ict_nodes_table",
        $nodesTabFields : {// table columns
            table: [
                {"mData": "nodeId", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-nodeId"), "sClass" : "td_nodeId", "bVisible":false},
                {"mData": "nodeName", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-nodeName"), "bSortable":false, "fnRender" : vmAppDetailUtil.nameRender},
                {"mData": "nodeType", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-nodeType"), "sWidth" : "150px", "bSortable":true},
                {"mData": "nodeTemplateId", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-templateType"),"bSortable":false},
                {"mData": "nodeIp", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-host"), "bSortable":false},
                {"mData": "createTime", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-createTime"), "bSortable":false}
            ]
        },
        $initNodesTab: function() {
            var setting = {};
            setting.language = vm.$language;
            setting.paginate = true;
            setting.info = true;
            setting.sort = true;
            setting.columns = vm.nodesTab.$nodesTabFields.table;
            setting.restUrl = vm.$restUrl.queryNodesInfoUrl;
            setting.tableId = vm.nodesTab.$nodesTabId;
            serverPageTable.initDataTable(setting, {}, vm.nodesTab.$nodesTabId + '_div');
        },
        //Nodes Details
        nodesDetail : {
            nodeTemplateDetailData: [],
            nodeInstanceSelectItems: [],
            detailTitle : "",
            isShow : "none",
            detailIndex : 0,
            detailData : [
                {id: "general", name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-general"), isActive: true},
                {id: "properties", name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-properties"), isActive: false},
                {id: "relationShips", name: $.i18n.prop("nfv-templateDetail-nodesTab-iui-tab-relationShips"), isActive: false}
            ],
            $showDetails : function(isShow, nodetypeid, nodetypename) {
                console.log(isShow);
                vm.nodesTab.nodesDetail.isShow = isShow;
                if (isShow == "block") {
                    vm.nodesTab.nodesDetail.detailTitle = nodetypename + " " + $.i18n.prop("nfv-virtualApplicationDetail-iui-text-nodeDetail"),
                    $('#' + vm.nodesTab.nodesDetail.detailData[0].id).click();
                    vm.nodesTab.nodesDetail.detailData[0].isActive = true;
                    vm.nodesTab.nodesDetail.$initNodeDetailTable(nodetypeid);
                }                
            },
            detailCondChange : function(index) {
                vm.nodesTab.nodesDetail.detailIndex = index;
                for(var i=0; i<vm.nodesTab.nodesDetail.detailData.length; i++) {
                    vm.nodesTab.nodesDetail.detailData[i].isActive = false;
                }
                vm.nodesTab.nodesDetail.detailData[index].isActive = true;
            },
            $tableFields : {// table columns
                general: [
                    {"mData": "key", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-key"), "bSortable" : false},
                    {"mData": "value", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-value"), "bSortable" : false}
                ],
                properties: [
                    {"mData": "key", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-key"), "bSortable" : false},
                    {"mData": "value", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-value"), "bSortable" : false}
                ],
                relationShips: [
                    {"mData": "sourceNodeName", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-sourceNodeName"), "bSortable" : false},
                    {"mData": "targetNodeName", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-targetNodeName"), "bSortable" : false},
                    {"mData": "type", "name": $.i18n.prop("nfv-templateDetail-nodesTab-iui-field-type"), "bSortable" : false}
                ]
            },
            $initNodeDetailTable: function(nodetemplateid) {
                var data = topoUtil.getCurrentDetailData(vm.nodesTab.nodesDetail.nodeTemplateDetailData.$model, nodetemplateid);

                $.each(vm.nodesTab.nodesDetail.$tableFields, function(key, value){
                    var setting = {};
                    setting.language = vm.$language;
                    setting.paginate = false;
                    setting.info = false;
                    setting.columns = value;
                    setting.tableId = "ict_table_" + key;
                    serverPageTable.initTableWithData(setting, setting.tableId + '_div', data[key]);
                });
            }
        }
    },
    executionTab : {
        $eventsTabId : "ict_events_table",
        $eventsTabFields : {// table columns
            table: [
                {"mData": "name", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-currentStepName"), "bSortable": false, "sWidth":"15%"},
                {"mData": "status", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-currentStepStatus"), "bSortable": false, "sWidth":"10%"},
                {"mData": "percent", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-percent"), "bSortable": false, "sWidth":"10%"},
                {"mData": "description", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-currentStepDesc"), "bSortable": false, "sWidth":"50%"},
                {"mData": "currentTime", name: $.i18n.prop("nfv-virtualApplicationDetail-iui-field-executionTime"), "bSortable": true, "sWidth":"15%"}
            ]
        },
        $initEventsTable: function() {
            var setting = {};
            setting.language = vm.$language;
            setting.paginate = false;
            setting.info = false;
            setting.sort = true;
            setting.columns = vm.executionTab.$eventsTabFields.table;
            setting.restUrl = vm.$restUrl.queryEventsInfoUrl;
            setting.tableId = vm.executionTab.$eventsTabId;
            serverPageTable.initDataTableForEvent(setting, {},
                    vm.executionTab.$eventsTabId + '_div');

            var oTable = $("#" + setting.tableId).dataTable(); 
            oTable.fnSort( [ [4,'asc'] ] );
        },
        $instanceId : "",
        steps : [],
        $init: function() {
            vm.executionTab.$initEventsTable();
        }
    }
});

var refreshByCond = function (index) {    
    switch(index) {
        case 0 :
            vm.topologyTab.$initTopology(vm.topologyTab.topoTemplateData.$model);
            vm.executionTab.$initEventsTable();
            break;
        case 1 :
            vm.nodesTab.$initNodesTab();
            break;
    }
}

var initParam = function() { //initialize template detail params
    var paramStr = window.location.search.substring(1);
    if(paramStr.length > 0) {
        var params = paramStr.split("&");
        var paramArray = [];
        for(var i=0; i<params.length; i++) {
            paramArray.push(params[i].substring(params[i].indexOf("=") + 1));
        }

        avalon.scan();     
        vm.executionTab.$instanceId = paramArray[0];  
        vm.$restUrl.queryNodesInfoUrl = commonUtil.format(vm.$restUrl.queryNodesInfoUrl, paramArray[0]);
        vm.$restUrl.queryEventsInfoUrl = commonUtil.format(vm.$restUrl.queryEventsInfoUrl, paramArray[0]);
        vm.$restUrl.queryNodeTemplateUrl = commonUtil.format(vm.$restUrl.queryNodeTemplateUrl, paramArray[1]);
        vm.templateId = paramArray[1];

        vm.$init();
        vm.$initCometd();
    }
}
initParam();