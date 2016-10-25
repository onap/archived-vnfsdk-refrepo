/*
 * Copyright 2016 ZTE Corporation.
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
var vm = avalon.define({
	$id : "pmController",
    $tableId : "ict_package_table",
    resource : {
        packageInfo : [],
        packageDetails : "",
        vimSelectItems : []
    },
    csarIdSelected : "",
	$packageTableFields : {// table columns
		table: [
            //{"mData":"",name:$.i18n.prop("nfv-package-iui-field-sn")},
            {"mData": "csarId", name: "ID", "bVisible": false},
            {"mData": "name", name: $.i18n.prop("nfv-package-iui-field-name"),"fnRender" : pmUtil.nameRender},
            {"mData": "type", name: $.i18n.prop("nfv-package-iui-field-type")},
            {"mData": "usageState", name: $.i18n.prop("nfv-package-iui-field-usagestate")},
            {"mData": "processState", name: $.i18n.prop("nfv-package-iui-field-processstate")},
            {"mData": "operationalState", name: $.i18n.prop("nfv-package-iui-field-operationalstate")},
            {"mData": "onBoardState", name: $.i18n.prop("nfv-package-iui-field-onboardstate"), "fnRender" : pmUtil.onBoardRender},
            {"mData": "", name: $.i18n.prop("nfv-package-iui-field-operation"), "fnRender" : pmUtil.operationRender}
		]
	},
	$language: {
        "sProcessing": "<img src='../common/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;"
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
    $restUrl:{
        queryPackageInfoUrl: "/openoapi/catalog/v1/csars",
        uploadPackageUrl: "/openoapi/catalog/v1/csars",
        gsarDelPackageUrl: "/openoapi/gso/v1/nspackages",
        ssarDelPackageUrl: "/openoapi/catalog/v1/csars",
        nsarDelPackageUrl: "/openoapi/nslcm/v1/nspackage",
        nfarDelPackageUrl: "/openoapi/nslcm/v1/vnfpackage",
        gsarOnboardUrl: "/openoapi/gso/v1/nspackages",
        ssarOnboardUrl: "/openoapi/catalog/v1/csars",
        nsarOnboardUrl: "/openoapi/nslcm/v1/nspackage",
        nfarOnboardUrl: "/openoapi/nslcm/v1/vnfpackage",
        changePackageStatusUrl : "/openoapi/catalog/v1/csars",
        queryVimInfoUrl : "/openoapi/extsys/v1/vims"
    },
    $getPackageCond: function() {
    	var cond = {};
		return cond;
    },
	//$initTable: function() {
     //   var url=vm.$restUrl.queryPackageInfoUrl;
     //   commonUtil.get(url,null,function(resp) {
     //       if (resp) {
     //           vm.resource.packageInfo=resp;
     //       }
     //   })
	//},
    $initTable: function() {
        var setting = {};
        setting.language = vm.$language;
        setting.paginate = true;
        setting.info = true;
        setting.columns = vm.$packageTableFields.table;
        setting.restUrl = vm.$restUrl.queryPackageInfoUrl;
        setting.tableId = vm.$tableId;
        serverPageTable.initDataTable(setting,{},vm.$tableId + '_div');
    },
    packageDetail : {
        detailTitle : "",
        isShow : "none",
        detailIndex : 0,
        detailData : [{
            id : "general",
            name : $.i18n.prop("com_zte_ums_eco_roc_rsview_info"),
            isActive : true
        }, {
            id : "relationShips",
            name : $.i18n.prop("com_zte_ums_eco_roc_rsview_relation"),
            isActive : false
        }
        ],
        $showDetails : function (isShow, csarId, name) {
            vm.packageDetail.isShow = isShow;
            vm.packageDetail.detailCondChange(0);
            if (isShow == "block") {
                vm.packageDetail.detailTitle = name + "-" + $.i18n.prop("nfv-package-iui_packageview_packageDetail"),
                    $('#' + vm.packageDetail.detailData[0].id).click();
                vm.packageDetail.detailData[0].isActive = true;
                vm.packageDetail.$initPackageDetailTable(csarId);
            }
        },
        detailCondChange : function (index) {
            vm.packageDetail.detailIndex = index;
            for (var i = 0; i < vm.packageDetail.detailData.length; i++) {
                vm.packageDetail.detailData[i].isActive = false;
            }
            vm.packageDetail.detailData[index].isActive = true;
        },
        $initPackageDetailTable : function (csarId) {
            var data;
            for(var i=0; i<vm.resource.packageInfo.length; i++) {
                if (vm.resource.packageInfo[i].csarId == csarId) {
                    data = vm.resource.packageInfo[i];
                    break;
                }
            }
            vm.resource.packageDetails = data;
            vm.resource.relationInfo = [];
        },
        $isRowDeletingStatus : function(name) {
            var table = $("#" + vm.$tableId).dataTable();
            var tableData = table.fnGetData();
            for (var i=0; i<tableData.length; i++) {
                if(tableData[i]["name"] == name &&
                    tableData[i]["status"].indexOf($.i18n.prop("nfv-package-iui-status-deleting")) > -1) {
                    return true;
                }
            }
            return false;
        },
    },
    selectVimDialog : {
        currentRadioClicked : [],
        clickedIndex : "",
        nfarOnBoardParam : {
            csarId : "",
            vimIds : [],
            labVimId : "",
        },
        $initData : function(csarId) {
            var url=vm.$restUrl.queryVimInfoUrl;
            commonUtil.get(url,null,function(resp) {
                if (resp) {
                    vm.resource.vimSelectItems=resp;
                }
            })
            vm.selectVimDialog.nfarOnBoardParam.csarId = csarId;
        },
        $confirmBtnClick : function () {
            var labVimId = "";
            var vimIds = [];
            var testEnvCount = 0;
            for(var i=0; i<vm.resource.vimSelectItems.length; i++) {
                var radioId = "testEnvRadios" + i;
                var checkboxId = "produceEnvChecks" + i;
                if(document.getElementById(radioId).checked) {
                    labVimId = vm.resource.vimSelectItems[i].vimId;
                }
                if(document.getElementById(checkboxId).checked) {
                    vimIds.push(vm.resource.vimSelectItems[i].vimId);
                }
            }
            vm.selectVimDialog.nfarOnBoardParam.labVimId = labVimId;
            vm.selectVimDialog.nfarOnBoardParam.vimIds = vimIds;
            var extData = vm.selectVimDialog.nfarOnBoardParam;
            pmUtil.doNFAROnboard(extData);
            $("#selectVimDialog").modal("hide");
        },
        $radioClicked : function(index) {
            var radioId = "testEnvRadios" + index;
            var checkboxId = "produceEnvChecks" + index;
            if(vm.selectVimDialog.currentRadioClicked[index] && vm.selectVimDialog.clickedIndex == index) {
                vm.selectVimDialog.currentRadioClicked[index] = false;
                document.getElementById(radioId).checked = false;
                document.getElementById(checkboxId).disabled = false;
            } else {
                for(var i=0; i<vm.resource.vimSelectItems.length; i++) {
                    var uncheckId = "produceEnvChecks" + i;
                    document.getElementById(uncheckId).disabled = false;
                }
                document.getElementById(checkboxId).checked = false;
                document.getElementById(checkboxId).disabled = true;
                vm.selectVimDialog.currentRadioClicked[index] = true;
                vm.selectVimDialog.clickedIndex = index;
            }
        }
    },

    $delPackage : function(csarId,type) {
        bootbox.confirm($.i18n.prop("nfv-package-iui-message-delete-confirm"), function(result){
            var url = "";
            if(result) {
                if(type == "NSAR") {
                    url = vm.$restUrl.nsarDelPackageUrl + "/" + csarId;
                } else if(type == "NFAR") {
                    url = vm.$restUrl.nfarDelPackageUrl + "/" + csarId;
                } else if(type == "GSAR") {
                    url = vm.$restUrl.gsarDelPackageUrl + "/" + csarId;
                } else if(type == "SSAR") {
                    url = vm.$restUrl.ssarDelPackageUrl + "/" + csarId;
                }
                pmUtil.delPackage(url);
            }
        });
    },
    isRowOnBoardingStatus : function(csarId) {
        var table = $("#" + vm.$tableId).dataTable();
        var tableData = table.fnGetData();
        for (var i=0; i<tableData.length; i++) {
            if(tableData[i]["name"] == name &&
                tableData[i]["status"].indexOf($.i18n.prop("nfv-package-iui-status-onboarding")) > -1) {
                return true;
            }
        }
        return false;
    },

    onBoardPackage : function(csarId,type,onBoardState) {
        var param = {
            csarId : csarId
        };
        if(type == "NSAR") {
            var url = vm.$restUrl.nsarOnboardUrl;
            pmUtil.doOnBoard(url, param);
        } else if(type == "NFAR") {
            vm.csarIdSelected = csarId;
            vm.showOnboardDialog(csarId);
        } else if(type == "GSAR") {
            var url = vm.$restUrl.gsarOnboardUrl;
            pmUtil.doOnBoard(url, param);
        } else if(type == "SSAR") {
            var ssarTarOnbardState="";
            var operationalState="";
            if(onBoardState =="onBoarded") {
                ssarTarOnbardState = "non-onBoarded";
                operationalState = "Disabled";
            } else {
                ssarTarOnbardState = "onBoarded";
                operationalState = "Enabled";
            }
            var url = vm.$restUrl.ssarOnboardUrl+"/"+csarId+"?onBoardState="+ssarTarOnbardState+"&operationalState="+operationalState;
            pmUtil.doSSAROnboard(url);
        }
    },
    showOnboardDialog : function(csarId) {
        vm.selectVimDialog.$initData(csarId);
        $("#selectVimDialog").modal("show");
    },
    $initUpload : function() {
        $("#fileupload").fileupload({
            url : vm.$restUrl.uploadPackageUrl,
            dropZone: $('#dropzone'),
            maxNumberOfFiles : 1,
            maxChunkSize : 20000000, //20M
            autoUpload : false,
            add : function(e, data) {
                $("#bar").css('width', '0%');
                $("#persent").text('0%');
                $("#fileName").text(data.files[0].name);
                $("#fileremove").attr("disabled", false);
                $("#filesubmit").attr("disabled", false);

                $("#filesubmit").remove();
                $('<button id="filesubmit" class="btn btn-default" type="button"/>').text($.i18n.prop("nfv-package-iui-drop-zone-uploadBtn"))
                    .appendTo($(".input-group-btn")[0])
                    .click(function () {
                        var fileName = data.files[0].name;
                        var existPackage = pmUtil.getExistPackageByName(fileName);
                        if(existPackage == 0){//0:package is not exist
                            $(".progress").addClass("active");
                            data.submit();
                        } else {
                            var msg = "";
                            if(existPackage == 1){//1:package not exist, instance reference this csar
                                msg = $.i18n.prop("nfv-package-iui-message-upload-csar-deletionpending");
                            }
                            if(existPackage == 2){//2:package exist
                                msg = $.i18n.prop("nfv-package-iui-message-upload-csar-exist");
                            }

                            bootbox.confirm(msg, function(result){
                                if(result) {
                                    $(".progress").addClass("active");
                                    data.submit();
                                }
                            });
                        }
                    });
                $("#fileremove").click(function(){
                    $("#bar").css('width', '0%');
                    $("#persent").text("");
                    $("#fileName").text("");
                    $("#filesubmit").attr("disabled", true);
                    $("#fileremove").attr("disabled", true);
                });
            },
            done : function(e, data) {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-upload-success"), 'success');
            },
            fail : function(e, data) {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-upload-fail"), 'danger');
            },
            always : function(e, data) {
                refreshByCond();
                $(".progress").removeClass("active");
                $("#bar").css('width', '100%');
                $("#persent").text('100%');
            },
            progressall : function(e ,data) {
                var progress = parseInt(data.loaded / data.total * 80, 10);
                $("#bar").css('width', progress + '%');
                $("#persent").text(progress + '%');
            }
        });
    },
    gotoPackageListPage:function(){
        window.location.href="./csarPackage.html";
        refreshByCond();
    }
});
avalon.scan();
vm.$initUpload();

$(function(){
    vm.$initTable();
});
var refreshByCond = function() {
    vm.$initTable();
};