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
	$id: "smController",
    $tableId : "ict_software_table",
	$softwareTableFields : {// table columns
		table: [
            {"mData": "imageName", name: $.i18n.prop("nfv-software-iui-field-name")},
            {"mData": "size", name: $.i18n.prop("nfv-software-iui-field-size")},
            {"mData": "type", name: $.i18n.prop("nfv-software-iui-field-type")},
            {"mData": "version", name: $.i18n.prop("nfv-software-iui-field-version")},
            {"mData": "createTime", name: $.i18n.prop("nfv-software-iui-field-createTime")},
            {"mData": "location", name: $.i18n.prop("nfv-software-iui-field-location")},
            {"mData": null, name: $.i18n.prop("nfv-software-iui-field-operation"), "fnRender" : smUtil.actionRender}
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
        uploadSoftwareImageUrl: "/api/nsoc/v1/softwareimages",
        querySoftwareImageUrl: "/api/nsoc/v1/softwareimages",
        delSoftwareImageUrl: "/api/nsoc/v1/softwareimages"
    },
    $getSoftwareCond: function() {
		return {};
    },
	$initTable: function() {
		var setting = {
            language : vm.$language,
            paginate : true,
            info : true,
            columns : vm.$softwareTableFields.table,
            restUrl : vm.$restUrl.querySoftwareImageUrl,
            tableId : vm.$tableId
        };
		serverPageTable.initDataTable(setting, vm.$getSoftwareCond(),
				vm.$tableId + '_div');
	},
    $initCometd : function() {
        commonUtil.registerCometdMessage("/api/nsocnotification/v1", "/softwareimages/uploadProcess", function(message){
            var table = $('#' + vm.$tableId).dataTable();
            var tableData = table.fnGetData();
            //var message = JSON.parse(jsonMessage);
            if(message.softwareImage) {
                var imageArray = JSON.parse(message.softwareImage);
                table.fnAddData(imageArray[0], true);
            } else {
                for (var i=0; i<tableData.length; i++) {
                    if(tableData[i]["imageName"] == message.imageName) {
                        table.fnUpdate(message.progress , i, 2, false, false);
                    }
                }
            }
        });
    },
    uploadSoftwareImage : {        
        $initUpload : function() {
            $("#softwareFile").fileupload({
                url : vm.$restUrl.uploadSoftwareImageUrl,
                //dropZone: $('#dropzone'),
                maxNumberOfFiles : 1,
                maxChunkSize : 20000000,
                autoUpload : false,               
                add : function(e, data) {
                    $("#bar").css('width', '0%');
                    $("#persent").text('0%');
                    $("#fileName").text(data.files[0].name);
                    $("#fileremove").attr("disabled", false);

                    $("#uploadBtn").remove();
                    $('<button id="uploadBtn" class="btn blue1" type="button"/>')
                        .text($.i18n.prop("nfv-software-iui-btn-upload"))
                        .appendTo($(".modal-footer")[0])
                        .click(function () {
                            var extData = {
                                type : $("#type").val(),
                                version : $("#version").val()
                            };
                            $("#softwareFile").fileupload({ formData : extData });
                            data.submit();
                            $("#uploadImage").modal("hide");
                    });
                    $("#fileremove").click(function(){
                        //$("#bar").css('width', '0%');
                        //$("#persent").text("");
                        $("#fileName").text("");
                        $("#uploadBtn").attr("disabled", true);
                        $("#fileremove").attr("disabled", true);
                    });
                },
                chunkalways : function(e, data) {
                    //refreshByCond();
                    console.log("success");
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
        $showUploadImage: function() {       
            $("#type").val("");
            $("#version").val("");
            $("#fileName").text("");
            $("#uploadImage").modal("show");
        }       
    }
});
avalon.scan();
vm.uploadSoftwareImage.$initUpload();
vm.$initTable();
vm.$initCometd();

var refreshByCond = function() {
    vm.$initTable();
};