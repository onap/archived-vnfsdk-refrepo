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
var pmUtil = {};

pmUtil.changeStatus = function(csarId, status) {
	pmUtil.changeTableStatus(csarId, "activating");
    $.ajax({
        type : "PUT",
        url : vm.$restUrl.changePackageStatusUrl + csarId + "?csarName="  + "&status=" + status,
        success : function() {
            refreshByCond();
        },
        error : function() {
        	refreshByCond();
        }
    });
}

pmUtil.changeTableStatus = function(csarId, status) {
	var table = $("#" + vm.$tableId).dataTable();
	var tableData = table.fnGetData();
	for (var i=0; i<tableData.length; i++) {
        if(tableData[i]["csarId"] == csarId) {
        	table.fnUpdate(status, i, 4, false, false);
        	break;
        }
    }
}

//query packages exist
//0: the package does not exist 
//1: the package does not exist, but the instance cite this package
//2: the package exists
pmUtil.getExistPackageByName = function(name) {
    var index = name.indexOf(".csar") || name.indexOf(".zip");
    if(index > 0){
        name = name.substring(0, index);
    }
    var result = $.ajax({
        type : "GET",
        url : vm.$restUrl.queryPackageInfoUrl + "?name=" + name,
        async: false
    });        
    var data = result.responseJSON;
    if(data != undefined && data.length == 0){
        return 0;
    }
    var result = data[0];
    if(result.deletionPending != undefined && result.deletionPending == "true"){                
        return 1;
    }            

    return 2;
}

pmUtil.updateDeletedPackageStatus = function(message) {
    var messageobj = JSON.parse(message);
    if(messageobj.status == "true" || messageobj.status == "deletionPending") {
        commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-delete-success"), "success");
        refreshByCond();
    } else {
        pmUtil.changeTableStatus(messageobj.csarid, "deletefail");
    }
}

pmUtil.queryVimInfo = function() {
    $.get(
        vm.$restUrl.queryVimInfoUrl,
        function (resp) {
            if (resp.data) {
                vm.selectVim.vimSelectItems = resp.data || [{
                        vimName: "test1",
                        oid: "123456"
                    },
                        {
                            vimName: "test2",
                            oid: "987654"
                        }];
            }
        },
        "json"
    )
}

pmUtil.doOnBoard = function(url,param) {
        $.ajax({
            type : "POST",
            url : url,
            data : JSON.stringify(param),
            contentType : "application/json",
            dataType : "json",
            success : function(resp) {
                if(resp != "" && resp.data.status == "failed") {
                    commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoard-error"), "failed");
                } else {
                    commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoarded"), "success");
                }
                refreshByCond();
            },
            error : function() {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoard-error"), "failed");
            }
        });
    }

pmUtil.doNFAROnboard = function(extData) {
    extData.csarId = vm.csarIdSelected;
    $.ajax({
        type : "POST",
        url : vm.$restUrl.nfarOnboardUrl,
        data : JSON.stringify(extData),
        contentType : "application/json",
        dataType : "json",
        success : function(resp) {
            if(resp != "" && resp.data.status == "failed") {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoard-error"), "failed");
            } else {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoarded"), "success");
            }
            refreshByCond();
        },
        error : function() {
            commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoard-error"), "failed");
        }
    });
}

pmUtil.doSSAROnboard = function(url) {
    $.ajax({
        type : "PUT",
        url : url,
        contentType : "application/json",
        success : function(resp) {
            if(resp != "" && resp.data.status == "failed") {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoard-error"), "failed");
            } else {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoarded"), "success");
            }
            refreshByCond();
        },
        error : function() {
            commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-onBoard-error"), "failed");
        }
    });
}

pmUtil.delPackage = function (url) {
    $.ajax({
        type : "DELETE",
        url : url,
        contentType : "application/json",
        success : function(resp) {
            //commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-delete-success"), "success");
            //setTimeout( function(){
            //    refreshByCond();
            //}, 1 * 1000 );
        },
        error : function(resp) {
            if(resp.status == 202 || resp.responseText == "success") {
                //commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-delete-success"), "success");
                //refreshByCond();
            } else {
                commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-delete-error"), "failed");
                refreshByCond();
            }
        }
    });
}

pmUtil.nameRender = function(obj) {
    return '<a href="#" onclick="vm.packageDetail.$showDetails('
        + '\'block\',\'' + obj.aData.id + '\', \'' + obj.aData.name + '\')">' + obj.aData.name + '</a>';
}

pmUtil.onBoardRender = function(obj) {
    var attr;
    attr = 'class="label label-info status" data-toggle="tooltip" title="nfv-package-iui-status-tip"';
    return '<span class="label label-info status" data-toggle="tooltip" title="nfv-package-iui-status-tip" onclick="vm.onBoardPackage(\'' + obj.aData.csarId
        + '\',\''+ obj.aData.type + '\', \''+ obj.aData.onBoardState +'\')">' + obj.aData.onBoardState + '</span>';
}

pmUtil.operationRender = function(obj) {
    return '<a href="#" class="btn-xs grey btn-editable" onclick="vm.$delPackage(\'' + obj.aData.csarId
        + '\',\''+ obj.aData.type + '\')">' + '<i class=\"ict-delete\"></i>' + $.i18n.prop('nfv-software-iui-action-delete') + '</a>';
}