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
	$id: "hmController",
    $tableId : "ict_host_table",
	$hostTableFields : {// table columns
		table: [
            {"mData": "id", "name": "ID", "bVisible": false},
            {"mData": "name", "name": $.i18n.prop("nfv-host-iui-field-name")},
            {"mData": "size", "name": $.i18n.prop("nfv-host-iui-field-size")},
            {"mData": "vimId", "name": "VIMID", "bVisible": false},
            {"mData": "vimName", "name": "VIM"},
            {"mData": "vimUser", "name": $.i18n.prop("nfv-host-iui-field-vimUser")},
            {"mData": "createTime", "name": $.i18n.prop("nfv-host-iui-field-createTime")},
            {"mData": "progress", "name": $.i18n.prop("nfv-host-iui-field-progress"), "fnRender" : hmUtil.progressRender},
            {"mData": "status", "name": $.i18n.prop("nfv-host-iui-field-status")},
            {"mData": null, "name": $.i18n.prop("nfv-host-iui-field-operation"), "fnRender" : hmUtil.actionRender}
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
        uploadHostImage: '/api/nsoc/v1/hostimages',
        queryHostInfoUrl: "/api/nsoc/v1/hostimages",
        delHostUrl: "/api/nsoc/v1/hostimages/",
        updateHostUrl: "/api/nsoc/v1/hostimages/",
        queryVimInfoUrl : "/api/roc/v1/resource/vims"
    },
	$initTable: function() {
		var setting = {
            language : vm.$language,
            paginate : true,
            info : true,
            columns : vm.$hostTableFields.table,
            restUrl : vm.$restUrl.queryHostInfoUrl,
            tableId : vm.$tableId
        };
		serverPageTable.initDataTable(setting, {}, vm.$tableId + '_div');
	},
    uploadHostImage : {
        vimSelectItems : [],
        tenant : "",
        localVisible : true,
        /*$initUpload : function() {
            var fileLanguage = getLanguage();
            if (lang == "zh-CN") {
                fileLanguage = "zh";
            } else {
                fileLanguage = "en";
            }           
            $("#hostfile").fileinput({
                language: fileLanguage,
                showPreview : false,
                showUpload : false,
                uploadExtraData : function(){
                    var index = $("#vim").val();
                    var selectVim = vm.uploadHostImage.vimSelectItems[index];
                    var vimid = selectVim.oid; 
                    var extraData = {
                        url : $("#hosturl").val(),
                        name : $("#hostName").val(),
                        vimid : vimid
                    }
                    return extraData;
                },
                uploadUrl : vm.$restUrl.uploadHostImage,
                layoutTemplates : {progress : ''}, //hide progress
                ajaxSettings : {
                    success : function(resp) {
                        commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-upload-success"), "success");
                        refreshByCond();
                    },
                    error : function(resp) {
                        commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-upload-failed"), "warning");
                    }
                }
            });            
        },*/
        $initUpload : function() {
            var maxChunkSize = 20000000; //20M
            $("#hostForm").fileupload({
                url : vm.$restUrl.uploadHostImage,
                maxNumberOfFiles : 1,
                maxChunkSize : maxChunkSize,
                autoUpload : false,
                add : function(e, data) {
                    $("#fileName").text(data.files[0].name);
                    $("#fileremove").attr("disabled", false);

                    $("#uploadBtn").remove();
                    $('<button id="uploadBtn" class="btn blue1" type="button"/>')
                        .text($.i18n.prop("nfv-software-iui-btn-upload"))
                        .appendTo($(".modal-footer")[0])
                        .click(function () {
                            var index = $("#vim").val();
                            var selectVim = vm.uploadHostImage.vimSelectItems[index];
                            var vimid = selectVim.oid;
                            var extData = {
                                url : $("#hosturl").val(),
                                name : $("#hostName").val(),
                                vimid : vimid,
                                imageId : ""
                            };
                            vm.uploadHostImage.$uploadFile(data, extData);
                    });
                    $("#fileremove").click(function(){
                        $("#fileName").text("");
                        $("#uploadBtn").attr("disabled", true);
                        $("#fileremove").attr("disabled", true);
                    });
                },
                done : function(e, data) {
                    refreshByCond();
                },
                fail : function(e, data) {
                    commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-upload-failed"), "danger");
                },
                chunkdone : function(e, data) {
                    //get imageid from server and send it to server
                    var imageId = data.jqXHR.responseText;
                    data.formData.imageId = imageId;
                    //the first chunk file is uploaded, refresh table
                    if(data.loaded <= maxChunkSize) {
                        refreshByCond();
                    }
                },
                chunkfail : function(e, data) {
                    var imageId = data.formData.imageId;
                    if(imageId) {
                        $.ajax({
                            type : "PUT",
                            async : false, //to prevent the ajax request has been cancelled
                            url : vm.$restUrl.updateHostUrl + imageId + "?progress=fail",
                            success : function() {
                                //refreshByCond();
                            }
                        });
                    }
                }
            });
        },
        $showUploadImage: function() {
            hmUtil.queryVimInfo();
            $("#fileName").text("");
            $("#hosturl").val("");
            $("#hostName").val("");

            $("#uploadImage").modal("show");
            $('.btn-file').removeClass("btn-primary").addClass("blue1");
            $(".form-group").each(function () {
                $(this).removeClass('has-success')
                    .removeClass('has-error')
                    .find(".help-block").remove();
            });
        },
        $uploadFile : function(data, extData) {
            var form = $("#hostForm");
            if(!form.valid()) {
                return false;
            }

            if(vm.uploadHostImage.localVisible) {
                $("#hostForm").fileupload({ formData : extData });
                data.submit();
            } else {
                $.ajax({
                    type : "POST",
                    contentType : "application/x-www-form-urlencoded; charset=UTF-8",
                    url : vm.$restUrl.uploadHostImage + "?url=" + extData.url 
                        + "&name=" + extData.name + "&vimid=" + extData.vimid,
                    success : function(resp) {
                        commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-upload-success"), "success");
                        refreshByCond();
                    },
                    error : function(resp) {
                        commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-upload-failed"), "warning");
                    }
                });
            }           
            $("#uploadImage").modal("hide");
        },
        $changeEvent : function() {
            var index = $("#vim").val();
            var selectVim = vm.uploadHostImage.vimSelectItems[index];
            if (selectVim) {
                $("#tenant").val(selectVim.user);
            }           
        },
        $showLocalOrUrl : function(type) {
            $(".form-group").each(function () {
                $(this).removeClass('has-success')
                    .removeClass('has-error')
                    .find(".help-block").remove();
            });
            type == "local" ? vm.uploadHostImage.localVisible = true : vm.uploadHostImage.localVisible = false;
        }
    },
    initTenant : function(action) { //init tenant value
        if (action === "add") {
            vm.uploadHostImage.$changeEvent();
        }        
    },
    $initCometd : function() {
        commonUtil.registerCometdMessage("/api/nsocnotification/v1", "/hostimages/update", function(message) {
            var table = $('#' + vm.$tableId).dataTable();
            var tableData = table.fnGetData();
            var image = message.image;
            if(image) {
                for (var i=0; i<tableData.length; i++) {
                    if(tableData[i]["id"] == image.id) {
                        table.fnUpdate(image.size, i, 2, false, false);
                        table.fnUpdate(image.status, i, 8, false, false);
                    }
                }
            }
        });
    }
});
avalon.scan();
vm.$initTable();
vm.uploadHostImage.$initUpload();
vm.$initCometd();

var refreshByCond = function() {
    vm.$initTable();
};