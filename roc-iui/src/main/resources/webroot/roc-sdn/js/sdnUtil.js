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
var sdnUtil = {};

sdnUtil.delSdn = function (el) {
    bootbox.confirm($.i18n.prop("roc-sdn-iui-message-delete-confirm"), function (result) {
        if (result) {
            $.ajax({
                type : "DELETE",
                url : vm.$restUrl.delSdnControllerInfoUrl + el.sdnControllerInstanceId,
                dataType : "json",
                success : function (data) {
                    if (data) {
                        for (var i = 0; i < vm.sdnInfo.length; i++) {
                            if (el.sdnControllerInstanceId == vm.sdnInfo[i].sdnControllerInstanceId) {
                                vm.sdnInfo.splice(i, 1);
                                break;
                            }
                        }
                        sdnUtil.showMessage($.i18n.prop("roc-sdn-iui-message-delete-success"), "success");
                    } else {
                        sdnUtil.showMessage($.i18n.prop("roc-sdn-iui-message-delete-fail"), "warning");
                    }
                },
                error : function () {
                    sdnUtil.showMessage($.i18n.prop("roc-sdn-iui-message-delete-fail"), "warning");
                }
            });
        }
    });
}

sdnUtil.updateSdn = function (data) {
    vm.addSdn.sdnId = data.sdnControllerInstanceId;
    vm.addSdn.name = data.name;
    vm.addSdn.type = data.controllerType;
    vm.addSdn.typeDisabled = true;
    vm.addSdn.url = data.url;
    vm.addSdn.userName = data.userName;
    vm.addSdn.password = data.password;
    vm.addSdn.saveType = "update";
    vm.addSdn.title = $.i18n.prop("roc-sdn-iui-text-update");
    vm.server_rtn.info_block = false;
    vm.server_rtn.warning_block = false;

    $(".form-group").each(function () {
        $(this).removeClass('has-success');
        $(this).removeClass('has-error');
        $(this).find(".help-block[id]").remove();
    });
    $("#addSdnDlg").modal("show");
}

sdnUtil.tooltipSdnStatus = function () {
    $("[data-toggle='tooltip']").tooltip();
}

sdnUtil.growl = function (message, type) {
    $.growl({
        icon : "fa fa-envelope-o fa-lg",
        title : "&nbsp;&nbsp;Notice: ",
        message : message + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    }, {
        type : type
    });
}

sdnUtil.showMessage = function(message, type) {
    $.growl({
        icon: "fa fa-envelope-o fa-lg",
        title: "&nbsp;&nbsp;" + $.i18n.prop("roc-sdn-iui-common-tip"),
        message: message
    },{
        type: type
    });
};
