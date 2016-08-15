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
avalon.config({
	interpolate: ["<!--", "-->"]
});

var vm = avalon.define({
	$id: "pmController",
    $tableId : "ict_package_table",
	$packageTableFields : {// table columns
		table: [
            {"mData": "name", name: $.i18n.prop("nfv-package-iui-field-name")},
            {"mData": "type", name: $.i18n.prop("nfv-package-iui-field-type")},
            {"mData": "size", name: $.i18n.prop("nfv-package-iui-field-size")},
            {"mData": "createTime", name: $.i18n.prop("nfv-package-iui-field-createTime")},
            {"mData": "status", name: $.i18n.prop("nfv-package-iui-field-status"), "fnRender" : pmUtil.statusRender},
            {"mData": null, name: $.i18n.prop("nfv-package-iui-field-operation"), "fnRender" : pmUtil.actionRender}
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
        queryPackageInfoUrl: "/api/nsoc/v1/csars",
        uploadPackageUrl: "/api/nsoc/v1/csars",
        delPackageUrl: "/api/nsoc/v1/csars",
        changePackageStatusUrl : "/api/nsoc/v1/csars"
    },
    $getPackageCond: function() {
    	var cond = {};
		return cond;
    },
	$initTable: function() {
		var setting = {
            language : vm.$language,
            paginate : true,
            info : true,
            columns : vm.$packageTableFields.table,
            restUrl : vm.$restUrl.queryPackageInfoUrl + "?deletionPending=false",
            tableId : vm.$tableId
        };
		serverPageTable.initDataTable(setting, vm.$getPackageCond(),
				vm.$tableId + '_div');
	},
    /*$initUpload : function() {
        var fileLanguage = getLanguage();
        if (lang == "zh-CN") {
            fileLanguage = "zh";
        } else {
            fileLanguage = "en";
        }
        $("#csarFile").fileinput({
            language: fileLanguage,
            showPreview : true,
            uploadUrl : vm.$restUrl.uploadPackageUrl,
            uploadAsync : true,
            layoutTemplates : {
                actions : '' //hide the delete button and upload button
            }, 
            allowedFileExtensions : ['zip','csar'],
            allowedPreviewTypes : ['image'],
            previewSettings : {
                other: {width: '160px', height: '20px'}
            },
            dropZoneTitleClass : 'package-drop-zone-title',            
            ajaxSettings : {
                success : function(resp) {
                    commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-upload-success"), 'success');
                    refreshByCond();                                     
                }
            },
            elErrorContainer : '#fileError',
            showAjaxErrorDetails : false
        });
        $('#csarFile').on('fileuploaderror', function(event, data, previewId, index) {
            $('#fileError').hide();
            commonUtil.showMessage($.i18n.prop("nfv-package-iui-message-upload-fail"), 'danger');
        });

        $('#csarFile').on('fileloaded', function(event, file, previewId, index, reader) {
            //hide original upload button
            $('a.fileinput-upload-button').hide();
            $('#confirm').show();
        });

        $('.btn-file').removeClass("btn-primary").addClass("blue1");

        //replace upload button for confirm
        var css = $('a.fileinput-upload-button').attr("class");
        var children = $('a.fileinput-upload-button').eq(0).html();
        $('<button id="confirm" class="'+css+'">'+children+'</button>').insertAfter('.fileinput-upload-button');
        $('#confirm').on('click', function(e){
            e.preventDefault();

            var fileName = $('.file-caption-name').eq(0).text();
            var existPackage = pmUtil.getExistPackageByName(fileName);
            if(existPackage == 0){//0:package is not exist
                $('a.fileinput-upload-button').trigger('click');
                return;
            }
            var msg = "";
            if(existPackage == 1){//1:package not exist, instance reference this csar
                msg = $.i18n.prop("nfv-package-iui-message-upload-csar-deletionpending");
            }
            if(existPackage == 2){//2:package exist
                msg = $.i18n.prop("nfv-package-iui-message-upload-csar-exist");
            }

            bootbox.confirm(msg, function(result){
                if(result) {
                    $('a.fileinput-upload-button').trigger('click');
                }
            });
        });
    },*/
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
                $('<button id="filesubmit" class="btn btn-default" type="button"/>').text("上传")
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
    $initCometd : function() {
        commonUtil.registerCometdMessage("/api/nsocnotification/v1", "/package/delete", function(message) {
            pmUtil.updateDeletedPackageStatus(message);
        });
    }
});
avalon.scan();
vm.$initUpload();
vm.$initTable();
vm.$initCometd();

var refreshByCond = function() {
    vm.$initTable();
};