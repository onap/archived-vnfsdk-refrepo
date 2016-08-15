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
var pmUtil = {};

pmUtil.actionRender = function(obj) {
	return '<a href="#" class="btn-xs grey btn-editable" onclick="pmUtil.delPackage(\'' + obj.aData.name + '\')">'
       + '<i class=\"ict-delete\"></i>' + $.i18n.prop('nfv-software-iui-action-delete') + '</a>';
}

pmUtil.statusRender = function(obj) {
    var status;
    var attr;
    switch(obj.aData.status) {
    	case "Enabled" :
    		attr = 'class="label label-success"';
            status = $.i18n.prop("nfv-package-iui-status-active");
    		break;
    	case "activating" : 
    		attr = 'class="label label-info"';
            status = $.i18n.prop("nfv-package-iui-status-activating");
    		break;
        case "deleting" : 
            attr = 'class="label label-warning"';
            status = $.i18n.prop("nfv-package-iui-status-deleting");
            break;
        case "deletefail" : 
            attr = 'class="label label-danger"';
            status = $.i18n.prop("nfv-package-iui-status-deletefail");
            break;
    	default :
    		attr = 'class="label label-info status" data-toggle="tooltip" title="' + $.i18n.prop("nfv-package-iui-status-tip") + '"'
        		+ 'onclick="pmUtil.changeStatus(\'' + obj.aData.name + '\',\'Enabled\')"';
            status = $.i18n.prop("nfv-package-iui-status-inactive");
    }
    return '<span ' + attr + '>' + status + '</span>';
}

pmUtil.changeStatus = function(name, status) {
	pmUtil.changeTableStatus(name, "activating");
    $.ajax({
        type : "PUT",
        url : vm.$restUrl.changePackageStatusUrl + "?csarName=" + name + "&status=" + status,
        success : function() {
            refreshByCond();
        },
        error : function() {
        	refreshByCond();
        }
    });
}

pmUtil.changeTableStatus = function(name, status) {
	var table = $("#" + vm.$tableId).dataTable();
	var tableData = table.fnGetData();
	for (var i=0; i<tableData.length; i++) {
        if(tableData[i]["name"] == name) {
        	table.fnUpdate(status, i, 4, false, false);
        	break;
        }
    }
}

pmUtil.isRowDeletingStatus = function(name) {
    var table = $("#" + vm.$tableId).dataTable();
    var tableData = table.fnGetData();
    for (var i=0; i<tableData.length; i++) {
        if(tableData[i]["name"] == name && 
           tableData[i]["status"].indexOf($.i18n.prop("nfv-package-iui-status-deleting")) > -1) {
            return true;            
        }
    }
    return false;
}

pmUtil.delPackage = function(name) {
    if(pmUtil.isRowDeletingStatus(name)){
        return;
    }

	bootbox.confirm($.i18n.prop("nfv-package-iui-message-delete-confirm"), function(result){
		if(result) {
            pmUtil.changeTableStatus(name, "deleting");
			var url = vm.$restUrl.delPackageUrl + "?csarName=" + name;
			commonUtil.delete(url, function(resp) {
				
			});
		}
	});		
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
        url : vm.$restUrl.queryPackageInfoUrl + "?csarName=" + name,
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
    if(message.status == "true" || message.status == "deletionPending") {                
        commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-delete-success"), "success");
        refreshByCond();
    } else {
        pmUtil.changeTableStatus(message.csarid, "deletefail");
    }
}
