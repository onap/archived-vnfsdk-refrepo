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
var vmAppUtil = {};

vmAppUtil.COLUMN_STATUS_INDEX = 4;
vmAppUtil.COLUMN_OPERATION_INDEX = 5;
vmAppUtil.TYPE_SUCCESS = "success";
vmAppUtil.TYPE_DANGER = "danger";

vmAppUtil.nameRender = function(obj) {
    return '<a href="#" onclick="vm.$openDetail(\'' + obj.aData.instanceId + '\', '
        + '\'' + obj.aData.serviceTemplateId + '\')">' + obj.aData.instanceName + '</a>';
}

vmAppUtil.operationRender = function(obj) {
    var table = $('#' + vm.$tableId).dataTable();
    var row = obj.iDataRow;
    var operationInfo = table.fnGetData(row)["operationInfo"];
    var instanceOperating = table.fnGetData(row)["instanceOperating"];
    var instanceStatus = table.fnGetData(row)["instanceStatus"];
    var disabled = "";

    var statusText = $.i18n.prop("nfv-virtualApplication-iui-status-" + instanceOperating);
    if (status.indexOf("nfv-virtualApplication") > -1) {
        statusText = $.i18n.prop("nfv-virtualApplication-iui-status-execute");
    }
    if($(instanceStatus).text() == statusText) {
        disabled = "disabled";
    }

    var optionHtml = "<option></option>";
    if (operationInfo) {
        for(var i=0; i<operationInfo.length; i++) {
            var name = $.i18n.prop("nfv-virtualApplication-iui-operation-" + operationInfo[i].operationname);
            if (name.indexOf("nfv-virtualApplication") > -1) {
                name = operationInfo[i].operationname;
            }

            if (operationInfo[i].operationid == instanceOperating) {
                optionHtml += "<option value=" + operationInfo[i].operationid + " selected>" + name + "</option>";
            } else {
                optionHtml += "<option value=" + operationInfo[i].operationid + ">" + name + "</option>";
            }
        }
    }
    return '<span><span class="span-action"><select name="type" ' + disabled + '>' + optionHtml + '</select></span>'
    + '&nbsp&nbsp<button type="button" ' + disabled + ' class="btn blue1 btn-sm btn-operation" '
    + 'onclick="vmAppUtil.execute('+ obj.iDataRow +')"><i class="ict-start"></i></button></span>';
};

vmAppUtil.statusRender = function(obj) {
    var attr = 'class="label label-success"';
    var status = $.i18n.prop("nfv-virtualApplication-iui-status-" + obj.aData.instanceStatus);
    if (obj.aData.instanceStatus == "failed") {
        attr = 'class="label label-danger"';
    } else if (obj.aData.instanceStatus == "processing") {
        status = $.i18n.prop("nfv-virtualApplication-iui-status-" + obj.aData.instanceOperating);
        if (status.indexOf("nfv-virtualApplication") > -1) {
            status = $.i18n.prop("nfv-virtualApplication-iui-status-execute");
        }
    }
    return '<span ' + attr + '>' + status + '</span>';
};

vmAppUtil.delRender = function(obj) {
    return '<div><a href="#" class="btn-xs grey btn-editable" onclick="vmAppUtil.deleteVmApp(\'' 
        + obj.aData.instanceId + '\', \'' + obj.aData.serviceTemplateId + '\')">'
        + '<i class=\"ict-delete\"></i>' + $.i18n.prop('nfv-software-iui-action-delete') + '</a></div>';
};

vmAppUtil.dateRender = function(obj) {
    var date = new Date(obj.aData[obj.mDataProp]);
    return commonUtil.parseDate(date, "yyyy-MM-dd hh:mm:ss");
};

vmAppUtil.deleteVmApp = function(instanceId, servicetemplateid) {
    bootbox.confirm($.i18n.prop("nfv-virtualApplication-iui-message-delete-confirm"), function(result){
        if(result) {
            var url = vm.$restUrl.deleteAppinstancesUrl + instanceId;
            $.ajax({
                type : "delete",
                url : url,
                dataType : "json",
                success : function(resp) {
                    if(resp.deleteresult == "true"){
                        var packageurl = vm.$restUrl.delInstanceTemplateUrl + servicetemplateid;
                        commonUtil.delete(packageurl, function(resp) {
                            refreshByCond();
                        });  
                    }else{
                        commonUtil.showMessage($.i18n.prop("nfv-virtualApplication-iui-message-delete-fail"), vmAppUtil.TYPE_DANGER);
                        refreshByCond();
                    }
                },
                error : function() {
                    commonUtil.showMessage($.i18n.prop("nfv-virtualApplication-iui-message-delete-fail"), vmAppUtil.TYPE_DANGER);
                    refreshByCond();
                }
            });
        }
    });
};

vmAppUtil.execute = function(row) {
    var oSelect = $("tbody tr select").eq(row);
    var operation = oSelect.find("option:selected").val();
    if (operation) {
        var table = $('#' + vm.$tableId).dataTable();
        var templateId = table.fnGetData(row)["serviceTemplateId"];
        var url = vm.$restUrl.queryOperationParamsUrl + templateId + "/operations/" + operation + "/parameters";
        //query operation params
        commonUtil.get(url, null, function(data) {
            //empty operation params
            vm.vmAppDialog.operationParams = [];
            //empty template input params
            vm.vmAppDialog.templateInputParams = [];
            if(vmAppUtil.isScaleOperation(operation)) {
                vm.vmAppScaleDialog.operation = operation;
                vm.vmAppScaleDialog.currentRow = row;
                vm.vmAppScaleDialog.instanceId = table.fnGetData(row)["instanceId"];
                vm.vmAppScaleDialog.templateId = templateId;
                vm.vmAppScaleDialog.$initScaleParams();
                $("#scaleModal").modal("show");
            } else if ((data && data.length > 0)) {
                vm.vmAppDialog.type = "execute";
                vm.vmAppDialog.title = $.i18n.prop("nfv-virtualApplication-iui-text-params");
                vm.vmAppDialog.btnTitle = $.i18n.prop("nfv-virtualApplication-iui-text-confirmBtn");
                vm.vmAppDialog.operation = operation;
                vm.vmAppDialog.currentRow = row;
                vm.vmAppDialog.templateId = templateId;
                vm.vmAppDialog.operationParams = data;
                vm.vmAppDialog.$initData();
                $("#vmAppDialog").modal("show");
            } else {
                var group = {
                    flavor : "",
                    flavorParams : [],
                    operationParams : []
                }
                vmAppUtil.executeOperation(group, row, operation);
            }
        });
    }
};

vmAppUtil.executeOperation = function(group, row, operation) {
    vmAppUtil.changeBtnStatus("processing", operation, row, true);
    var table = $('#' + vm.$tableId).dataTable();
    var instanceId = table.fnGetData(row)["instanceId"];
    var url = vm.$restUrl.executeOperationUrl + instanceId + "/operations/" + operation;
    $.ajax({
        type : "POST",
        url : url,
        data : JSON.stringify(group),
        contentType : "application/json",
        dataType : "json",
        error : function() {
            vmAppUtil.changeBtnStatus("failed", operation, row, false);
        }
    });
    if(vmAppUtil.isScaleOperation(operation)) {
        $("#scaleModal").modal("hide");
    } else {
        $("#vmAppDialog").modal("hide");
    }
};

vmAppUtil.changeBtnStatus = function(status, operation, row, disabled) {
    var table = $('#' + vm.$tableId).dataTable();
    var oBtn = $("tbody tr button i.ict-start").eq(row).parent();
    var oSelect = $("tbody tr select").eq(row);

    oSelect.attr("disabled", disabled);
    oBtn.attr("disabled", disabled);
    table.fnUpdate(status, row, vmAppUtil.COLUMN_STATUS_INDEX, false, false);
    table.fnUpdate(operation, row, vmAppUtil.COLUMN_OPERATION_INDEX, false, false);
};

vmAppUtil.queryTemplate = function() {
    var url = vm.$restUrl.queryServiceTemplate + "&status=Enabled";
    commonUtil.get(url, null, function(data) {
        vm.vmAppDialog.templateSelectItems = data || [];
    });
};

vmAppUtil.queryFlavorParam = function(templateId, flavorName) {
    var url = vm.$restUrl.queryFlavorParamUrl + templateId + "/flavors/" + flavorName + "/parameters";
    commonUtil.get(url, null, function(data) {
        vm.vmAppDialog.flavorParams = data || [];
    });
};

vmAppUtil.queryVimInfo = function() {
    var url = vm.$restUrl.queryVimInfoUrl;
    commonUtil.get(url, null, function(resp) {
        if (resp) {
            vm.vmAppDialog.vimSelectItems = resp.data;
        }
    });
};

vmAppUtil.queryVnfmInfo = function() {
    var url = vm.$restUrl.queryVnfmInfoUrl;
    commonUtil.get(url, null, function(resp) {
        if (resp) {
            vm.vmAppDialog.vnfmSelectItems = resp.data;
        }
    });
};

vmAppUtil.queryVnfInfo = function(templateId) {
    var url = vm.$restUrl.queryVnfInfoUrl + templateId + "/vnftemplates";
    commonUtil.get(url, null, function(resp) {
        if (resp) {
            vm.vmAppDialog.vnfItems = resp;
        }
    });
};

vmAppUtil.newApp = function(param) {
    $.ajax({
        type : "POST",
        url : vm.$restUrl.newAppinstancesUrl,
        contentType : "application/json",
        data : JSON.stringify(param),
        dataType : "text",
        success : function(data) {
            refreshByCond();
            commonUtil.showMessage($.i18n.prop("nfv-virtualApplication-iui-message-create-success"), vmAppUtil.TYPE_SUCCESS);
        },
        error : function() {
            refreshByCond();
            commonUtil.showMessage($.i18n.prop("nfv-virtualApplication-iui-message-create-fail"), vmAppUtil.TYPE_DANGER);
        }
    });
    $("#vmAppDialog").modal("hide");

};

vmAppUtil.isScaleOperation = function(operation) {
    if(operation == "scaleIn" || operation == "scaleOut") {
        return true;
    } else {
        return false;
    }
}

vmAppUtil.generateGourpParams = function(data) {
    var groupParams = [];
    $.each(data, function(index, group){  
        var groupParam = {
            groupName : group.groupName,
            params : []
        }
        $.each(group.params, function(index, element){
            var id = vm.vmAppDialog.$getGoupParamKey(group.groupName, element.key);
            var value = $("#" + id).val();
            if(value) {
                var param = {
                    key : element.key,
                    value : value
                }
                groupParam.params.push(param);
            }
        });
        if(groupParam.params.length) {
            groupParams.push(groupParam);
        }
    });
    return groupParams;
}

vmAppUtil.generateAdditionalParams = function(data) {
    var additionalParams = [];
    $.each(data, function(index, group){  
        var param = {
            key : "object_" + group.groupName, //前缀objec_标识为value是一个对象字符串，方便plan解析参数
            value : ""
        }
        var templateParam = {};
        $.each(group.params, function(index, element){
            var id = vm.vmAppDialog.$getGoupParamKey(group.groupName, element.key);
            var value = $("#" + id).val();
            if(value) {
                templateParam[element.key] = value;
            } else {
                templateParam[element.key] = "";
            }
        });
        param.value = JSON.stringify(templateParam);
        additionalParams.push(param);
    });
    return additionalParams;
}

vmAppUtil.generateVNFRelationInfos = function(data) {
    var vnfRelationInfos = [];
    $.each(data, function(index, element){
        var info = {
            vnfdid : element.templateid,
            vnfmid : $("#" + element.templateid).val()
        }
        vnfRelationInfos.push(info);
    });
    return vnfRelationInfos;
}

vmAppUtil.delVduRender = function(obj) {
    return '<div><a href="#" class="btn-xs grey btn-editable" onclick="vmAppUtil.deleteVdu(\'' 
        + obj.aData.id + '\', \'' + obj.aData.vnfId + '\')">'
        + '<i class=\"ict-delete\"></i>' + $.i18n.prop('nfv-software-iui-action-delete') + '</a></div>';
}

vmAppUtil.deleteVdu = function(vduId, vnfId) {
    var oTable = $("#" + vm.vmAppScaleDialog.$tableId).dataTable();
    var tableData = oTable.fnGetData();
    for(i=0;i<tableData.length;i++) {
        if((tableData[i].id == vduId) && (tableData[i].vnfId == vnfId)) {
            //remove the vdu from vduTableData
            oTable.fnDeleteRow(i);
            break;
        }
    }
}

vmAppUtil.checkRender = function(obj) {
    var checkHtml = "";
    var oid = obj.aData.oid;
    //get selected vdu node instanceid
    var iCheckData = vm.vmAppScaleDialog.currentVnfData.vduTableData;
    for(var i=0;i<iCheckData.length;i++) {
        if(oid == iCheckData[i].oid) {
            checkHtml = "checked";
            break;
        }
    }
    return '<input type="checkbox" class="form-control" '+checkHtml+'/>';
}

vmAppUtil.queryScalableVnfInfo = function(templateId) {
    var url = vm.$restUrl.queryVnfInfoUrl + templateId + "/vnftemplates";
    $.ajax({
        type : "GET",
        url : url,
        dataType : "json",
        success : function(resp) {
            resp = resp || [];
            for(var i=0; i<resp.length; i++) {
                var vnfData = {
                    id : resp[i].templateid,
                    name : resp[i].name,
                    operationType : "",
                    vduTypeList : [],
                    vduTableData : [],
                    vduTypeStr : "",
                    vduNumStr : "",
                    vduNameStr : ""
                }
                var nodetemplates = resp[i].nodetemplates;
                for(var j=0; j<nodetemplates.length; j++) {
                    //only display these vdus which have the scalable attribute
                    if(nodetemplates[j].scalable && (nodetemplates[j].parentType.indexOf(".VDU") > -1)) {
                        vnfData.vduTypeList.push(nodetemplates[j]);
                    }
                }

                if(vnfData.vduTypeList.length) {
                    vm.vmAppScaleDialog.vnfSelectItems.push(vnfData);
                }
            }
        }
    });
}

vmAppUtil.queryScalableVduInstance = function(instanceId, vnfTemplateId, vduTypeList) {
    //query vnf instances by ns id
    var vnfUrl = vm.$restUrl.queryRocInfoBaseUrl + "/vnfs?nsId=" + instanceId;
    //var vnfUrl = vm.$restUrl.queryRocInfoBaseUrl + "/vnfs/" + instanceId;
    $.ajax({
        type : "GET",
        url : vnfUrl,
        dataType : "json",
        success : function(resp) {
            if(resp.operationResult == "SUCCESS") {
                var data = resp.data;
                for(var i=0; i<data.length; i++) {
                    if(data[i].type == vnfTemplateId) {
                        //query vdu node instances by vnf id
                        var vduUrl = vm.$restUrl.queryRocInfoBaseUrl + "/vdus?vnfId=" + data[i].oid;
                        $.ajax({
                            type : "GET",
                            url : vduUrl,
                            dataType : "json",
                            success : function(resp) {
                                if(resp.operationResult == "SUCCESS") {
                                    var vduInstanceNodes = resp.data;
                                    var data = [];
                                    for(var j=0; j<vduInstanceNodes.length; j++) {
                                        if($.inArray(vduInstanceNodes[j].type, vduTypeList)) {
                                            data.push(vduInstanceNodes[j]);
                                        }
                                    }
                                    vm.vmAppScaleDialog.$initTable("instance", data);
                                }
                            }
                        });
                        break;
                    }
                }
            }
        }
    });
}

vmAppUtil.generateScaleParams = function(vnfDatas) {
    var scaleParams = [];
    for(var i=0; i<vnfDatas.length; i++) {
        var param = {
            key : "object_VNF_" + vnfDatas[i].id, //前缀object_VNF_标识为value是一个对象字符串，方便plan解析参数
            value : ""
        }
        var aspect = {};
        //get vdu input param
        if(vnfDatas[i].operationType == "type") {
            aspect.scaleBy = "byType";
            aspect.vduTypes = [];
            $.each(vnfDatas[i].vduTableData, function(index, element){
                var vduType = {
                    vduType : element.id,
                    instancesNum : element.num,
                    vduName : element.name
                }
                aspect.vduTypes.push(vduType);
            });
        } else {
            aspect.scaleBy = "byInstance";
            aspect.vduInstances = [];
            $.each(vnfDatas[i].vduTableData, function(index, element){
                var vduInstance = {
                    vduId : element.oid
                }
                aspect.vduInstances.push(vduInstance);
            });
        }
        param.value = JSON.stringify(aspect);
        scaleParams.push(param);
    }
    return scaleParams;
}

vmAppUtil.initFormValidator = function(formId) {
    $(function(){
        var form = $("#" + formId);
        var error = $('.alert-danger', form);
        var success = $('.alert-success', form);

        $.extend($.validator.messages, {
            required: $.i18n.prop("nfv-virtualApplication-iui-validate-inputParam"),
            digits: $.i18n.prop("nfv-virtualApplication-iui-validate-digits"),
            range: $.i18n.prop("nfv-virtualApplication-iui-validate-range")
        });

        form.validate({
            doNotHideMessage : true,
            errorElement : 'span',
            errorClass : 'help-block',
            focusInvalid : false,
            errorPlacement : function(error, element) {
                error.insertAfter(element);
            },
            invalidHandler : function(event, validator) {
                success.hide();
                error.show();
            },
            highlight : function(element) {
                $(element).closest("div").removeClass("has-success").addClass("has-error");
            },
            unhighlight: function (element) {
                $(element).closest("div").removeClass("has-error");
            },
            success : function(label) {
                label.addClass("valid").closest(".form-group").removeClass("has-error");
            },
            submitHandler: function (form) {
                success.show();
                error.hide();
            }
        });
    });
}

vmAppUtil.isNSTemplate = function(type) {
    if(type == "NS") {
        return true;
    }
    return false;
}