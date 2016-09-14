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

var vm = avalon
    .define({
        $id : "sdnController",
        sdnInfo : [],
        server_rtn : {
            info_block : false,
            warning_block : false,
            rtn_info : "",
            $RTN_SUCCESS : "RTN_SUCCESS",
            $RTN_FAILED : "RTN_FAILED"
        },
        $Status : {
            success : "active",
            failed : "inactive"
        },
        $restUrl : {
            querySdnControllerInfoUrl : '/openoapi/extsys/v1/sdncontrollers',
            addSdnControllerInfoUrl : '/openoapi/extsys/v1/sdncontrollers',
            updateSdnControllerInfoUrl : '/openoapi/extsys/v1/sdncontrollers',
            delSdnControllerInfoUrl : '/openoapi/extsys/v1/sdncontrollers'
        },
        $htmlText : {
            saveSuccess : $.i18n.prop("roc-sdn-iui-message-save-success"),
            saveFail : $.i18n.prop("roc-sdn-iui-message-save-fail"),
            updateSuccess : $.i18n.prop("roc-sdn-iui-message-update-success"),
            updateFail : $.i18n.prop("roc-sdn-iui-message-update-fail")
        },
        $initTable : function () {
            $.ajax({
                "type" : 'GET',
                "url" : vm.$restUrl.querySdnControllerInfoUrl,
                "dataType" : "json",
                "success" : function (resp) {
                    if (resp.operationResult == "SUCCESS") {
                        vm.sdnInfo = (resp == null) ? [] : resp.data;
                    } else {
                        vm.sdnInfo = [];
                        bootbox.alert($.i18n.prop("roc-sdn-iui-message-query-fail"));
                        return;
                    }
                },
                error : function (XMLHttpRequest, textStatus, errorThrown) {
                    bootbox.alert($.i18n.prop("roc-sdn-iui-message-query-fail") + "：" + textStatus + ":" + errorThrown);
                    return;
                },
                complete : function () {
                    sdnUtil.tooltipSdnStatus();
                }
            });
        },
        $sdnType : {
            condName : $.i18n.prop("roc-sdn-iui-text-type"),
            component_type : 'select',
            selectItems : [{
                    cond_value : 'ODL',
                    name : "ODL",
                    value : true
                }, {
                    cond_value : 'ONOS',
                    name : "ONOS",
                    value : true
                }
            ]
        },
        addSdn : {
            title : $.i18n.prop("roc-sdn-iui-text-register"),
            sdnId : "",
            name : "",
            type : "ODL",
            typeDisabled : false,
            url : "",
            urlTip : $.i18n.prop("roc-sdn-iui-text-url-tip"),
            userName : "",
            password : "",
            saveType : "add"
        },
        $showSdnTable : function () {
            vm.addSdn.title = $.i18n.prop("roc-sdn-iui-text-register"),
            vm.addSdn.sdnId = "";
            vm.addSdn.name = "";
            vm.addSdn.type = "ODL";
            vm.addSdn.typeDisabled = false;
            vm.addSdn.url = "";
            vm.addSdn.userName = "";
            vm.addSdn.password = "";
            vm.addSdn.saveType = "add";
            vm.server_rtn.warning_block = false;
            vm.server_rtn.info_block = false;

            $(".form-group").each(function () {
                $(this).removeClass('has-success');
                $(this).removeClass('has-error');
                $(this).find(".help-block[id]").remove();
            });
            $("#addSdnDlg").modal("show");
        },
        $saveSdn : function () {
            var form = $('#sdn_form');
            if (form.valid() == false) {
                return false;
            }
            vm.server_rtn.info_block = true;
            vm.server_rtn.warning_block = false;
            vm.addSdn.status = vm.$Status.success;

            var param = {
                name : vm.addSdn.name,
                controllerType : $("#type").val(),
                url : vm.addSdn.url,
                userName : vm.addSdn.userName,
                password : vm.addSdn.password
            }
            if (vm.addSdn.saveType == "add") {
                for( var i = 0; i < vm.sdnInfo.length; i ++ ){
                    if(vm.addSdn.url == vm.sdnInfo[i].url){
                        sdnUtil.growl($.i18n.prop("roc-sdn-iui-message-growl-msg-title") +  'already exist',"info");
                        $('#addSdnDlg').modal('hide');
                        return;
                    }
                }
                $.ajax({
                    type : "POST",
                    url : vm.$restUrl.addSdnControllerInfoUrl,
                    data : JSON.stringify(param),
                    dataType : "json",
                    contentType : "application/json",
                    success : function (data) {
                        vm.server_rtn.info_block = false;
                        vm.server_rtn.warning_block = false;
                        if (data) {
                            vm.sdnInfo = [];
                            vm.$initTable();

                            $('#addSdnDlg').modal('hide');
                            sdnUtil.showMessage(vm.$htmlText.saveSuccess, "success");
                        } else {
                            vm.server_rtn.warning_block = true;
                            vm.server_rtn.rtn_info = vm.$htmlText.saveFail;
                            sdnUtil.showMessage(vm.$htmlText.saveFail, "failed");
                        }
                    },
                    error : function (XMLHttpRequest, textStatus, errorThrown) {
                        vm.server_rtn.warning_block = true;
                        vm.server_rtn.rtn_info = textStatus + ":" + errorThrown;
                        vm.server_rtn.info_block = false;
                    }
                });
            } else {
                $.ajax({
                    type : "PUT",
                    url : vm.$restUrl.updateSdnControllerInfoUrl + vm.addSdn.sdnId,
                    data : JSON.stringify(param),
                    dataType : "json",
                    contentType : "application/json",
                    success : function (data) {
                        vm.server_rtn.info_block = false;
                        vm.server_rtn.warning_block = false;
                        if (data) {
                            for (var i = 0; i < vm.sdnInfo.length; i++) {
                                if (vm.sdnInfo[i].sdnControllerInstanceId == vm.addSdn.sdnId) {
                                    vm.sdnInfo[i].name = vm.addSdn.name;
                                    vm.sdnInfo[i].type = $("#type").val();
                                    vm.sdnInfo[i].url = vm.addSdn.url;
                                    vm.sdnInfo[i].userName = vm.addSdn.userName;
                                    vm.sdnInfo[i].password = vm.addSdn.password;
                                }
                            }
                            $('#addSdnDlg').modal('hide');
                            sdnUtil.showMessage(vm.$htmlText.updateSuccess, "success");
                        } else {
                            vm.server_rtn.warning_block = true;
                            vm.server_rtn.rtn_info = vm.$htmlText.updateFail;
                            sdnUtil.showMessage(vm.$htmlText.updateFail, "failed");
                        }
                    },
                    error : function (XMLHttpRequest, textStatus, errorThrown) {
                        vm.server_rtn.warning_block = true;
                        vm.server_rtn.rtn_info = textStatus + ":" + errorThrown;
                        vm.server_rtn.info_block = false;
                    }
                });
            }
        },
    });
avalon.scan();
vm.$initTable();
