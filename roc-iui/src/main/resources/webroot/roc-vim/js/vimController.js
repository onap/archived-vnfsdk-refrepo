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
			$id : "vimController",
			vimInfo :  [],
			vimStatusTime:$.i18n.prop('com_zte_ums_eco_roc_vim_getting_info'),
			ifSearch : 0,
			server_rtn:{
				info_block:false,
				warning_block:false,
				rtn_info:"",
				$RTN_SUCCESS:"RTN_SUCCESS",
				$RTN_FAILED:"RTN_FAILED",
                wait : $.i18n.prop('com_zte_ums_eco_roc_vim_checking_status')
			},
            executeWait : {clazz : 'alert-info', visible : true, text : $.i18n.prop('com_zte_ums_eco_roc_vim_checking_status')},
            executeError : {clazz : 'alert-danger', visible : true, text : 'error'},
			$Status	:{
                success:"active",
                failed:"inactive",
				displayActive: $.i18n.prop('com_zte_ums_eco_roc_vim_normal'),
				displayInactive: $.i18n.prop('com_zte_ums_eco_roc_vim_abnormal')
			},
            isSave : true,
            action : {ADD : 'add', UPDATE : 'update'},
			$queryVimInfoUrl : '../../api/roc/v1/resource/vims',
            $addVimInfoUrl : '../../api/vim/v1/',
			$updateVimInfoUrl : '../../api/roc/v1/resource/vims/',
			$delVimInfoUrl : '../../api/vim/v1/{vim_id}',
			$initTable : function() {
                $.ajax({
                    "type": 'get',
                    "url": vm.$queryVimInfoUrl,
                    "dataType": "json",
                    "success": function (resp) {
                       if(resp.operationResult=="SUCCESS")
                       {
                         vm.vimInfo = (resp==null)?[]:resp.data;
						 for(var i = 0; i < vm.vimInfo.length; i ++){
							var vimInstance = vm.vimInfo[i];
							var checkTime = vimInstance.checkTime;
							if("" != checkTime){
								vm.vimStatusTime = checkTime;
								break;
							}
						 }
                       }
                       else{
                        vm.vimInfo=[];
                        bootbox.alert($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_query_failed"));
                        return;
                       }
                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                           bootbox.alert($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_query_failed") + textStatus+":"+errorThrown);
                           return;
                     },
                     complete: function() {
                       resUtil.tooltipVimStatus();
                     }
                });
				
			},		 
			$vimType:  {
					condName : $.i18n.prop("com_zte_ums_eco_roc_vim_type"),
					component_type : 'select',
					selectItems : [
							{
								cond_value : 'TECS',
								name : "TECS",
								value : true
							},
							{
								cond_value : 'openstack',
								name :"openstack",
								value : true
							}
							]
				},
			addVim : {
				titleName: $.i18n.prop("com_zte_ums_eco_roc_vim_register_info"),
                vimId : "",
                vimName : "",
                hostName : '',
				userName : "",
                tenant : "",
				password : "",
                ipAddress : '',
				url : "",
				saveType :"add",
				status : "",
                vimMoc :"nfv.vim.opencos",
                vimType :"TECS",
                vendor :""
			},
        $showVimTable : function(el, action) {
            vm.isSave = false;
            if(vm.action.ADD == action){
                vm.addVim.vimId = "";
                vm.addVim.vimName = "";
                vm.addVim.userName = "";
                vm.addVim.password = "";
                vm.addVim.url = "";
                vm.addVim.tenant = "";
                vm.addVim.vendor = "";
                vm.addVim.saveType = "add";
                vm.addVim.vimType = "TECS";
                vm.addVim.titleName = $.i18n.prop("com_zte_ums_eco_roc_vim_register_info");

            } else {
                vm.addVim.vimId = el.oid;
                vm.addVim.vimName = el.name;
                vm.addVim.url = el.url;
                vm.addVim.userName = el.userName;
                vm.addVim.password = el.password;
                vm.addVim.tenant = el.user;
                vm.addVim.saveType = "update";
                vm.addVim.titleName = $.i18n.prop('com_zte_ums_eco_roc_vim_modify_info');
                vm.addVim.vimType = el.type;
                vm.addVim.vendor = el.vendor;
            }
            vm.executeError.visible=false;
            vm.executeWait.visible=false;
            $(".form-group").each(function () {
                $(this).removeClass('has-success');
                $(this).removeClass('has-error');
                $(this).find(".help-block[id]").remove();
            });
            $("#addVimDlg").modal("show");
		},

        $saveVimTable : function() {
            vm.isSave = true;
            success.hide();
            error.hide();
            if (form.valid() == false) {
                vm.isSave = false;
                return false;
            }
            vm.executeWait.visible = true;
            vm.executeError.visible = false;
            if(vm.addVim.saveType=="add") {
                //不能重复添加
				/*
                for( var i = 0; i < vm.vimInfo.length; i ++ ){
                    if(vm.addVim.url == vm.vimInfo[i].url){
                        resUtil.growl($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_title") +  'already exists',"info");
                        $('#addVimDlg').modal('hide');
                        return;
                    }
                }
				*/
                if('TECS' == vm.addVim.vimType){
                    vm.addVim.vimMoc = 'nfv.vim.opencos';
                    var url = vm.addVim.url;
                    var from = url.indexOf('//') + 2;
                    var to = url.lastIndexOf(':');
                    vm.addVim.ipAddress = url.substring( from, to );
                } else if('openstack' == vm.addVim.vimType){
                    vm.addVim.vimMoc = 'nfv.vim.openstack';
                }
                vm.persistVim();
            } else if( vm.addVim.saveType == "update" ){
                vm.updateVim();
            }
        },
        //新增vim
        persistVim : function(){
            $.ajax({
                type : "Post",
                url : vm.$addVimInfoUrl,
                data : JSON.stringify({
                    vimName : vm.addVim.vimName,
                    tenant :vm.addVim.tenant,
                    vimType : vm.addVim.vimType,
                    hostName: "",
                    ipAddress: vm.addVim.ipAddress,
                    url : vm.addVim.url,
                    userName : vm.addVim.userName,
                    password : vm.addVim.password,
                    vimMoc:vm.addVim.vimMoc,
                    vendor: vm.addVim.vendor
                }),
                async : false,
                dataType : "json",
                contentType : 'application/json',
                success : function(data) {
                    vm.executeWait.visible=false;
                    vm.executeError.visible=false;
                    if ( 0 == data.respCode ) {
                        vm.addVim.vimId = data.result.vimId;
                        vm.addVim.status = data.result.status;
                        vm.addVim.name = data.result.vimName;
                        vm.addVim.oid = data.result.vimId;
                        vm.addVim.user = data.result.tenant;
                        vm.addVim.type = data.result.vimType;
                        var newVim=jQuery.extend({}, vm.addVim);
                        vm.vimInfo.push(newVim);

                        $('#addVimDlg').modal('hide');
                        resUtil.growl($.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_title") + $.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_save_success"),"success");
					} else{
						vm.executeError.visible=true;
						vm.executeError.text = $.i18n.prop("com_zte_ums_eco_roc_vim_growl_msg_save_failed");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  vm.executeError.visible = true;
                  vm.executeError.text = textStatus+":"+errorThrown;
                  vm.executeWait.visible = false;
				  vm.isSave = false;
               }
            });
        },
        //更新vim
        updateVim : function(){
            $.ajax({
                type : "Put",
                url : vm.$updateVimInfoUrl+vm.addVim.vimId,
				contentType : 'application/json',
                data : JSON.stringify({
                    name : vm.addVim.vimName,
                    userName : vm.addVim.userName,
                    password : vm.addVim.password,
                    url : vm.addVim.url,
                    user:vm.addVim.tenant,
                    type : vm.addVim.vimType,
                    vendor : vm.addVim.vendor
                }),
                dataType : "json",
                async : false,
                success : function(data) {
                    vm.executeWait.visible=false;
                    vm.executeError.visible=false;
                    if (data.operationResult == "SUCCESS") {
                        for(var i=0;i<vm.vimInfo.length;i++){
                            if(vm.vimInfo[i].oid == vm.addVim.vimId)
                            {
                                vm.vimInfo[i].name = vm.addVim.vimName;
                                vm.vimInfo[i].userName = vm.addVim.userName;
                                vm.vimInfo[i].password = vm.addVim.password;
                                vm.vimInfo[i].url = vm.addVim.url;
                                vm.vimInfo[i].user = vm.addVim.tenant;
                                vm.vimInfo[i].status = vm.addVim.status;
                                vm.vimInfo[i].type=vm.addVim.vimType;
                            }
                         }
                        $('#addVimDlg').modal('hide');
                     resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_save_success'),"success");
                    }
                    else{
                        vm.executeError.visible = true;
                        vm.executeError.text = $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_save_failed');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    vm.isSave = false;
                    vm.executeError.visible=true;
                    vm.executeError.text = textStatus+":"+errorThrown;
                    vm.executeWait.visible = false;
               }
            });
        },
        delVim : function(el){
            bootbox.confirm($.i18n.prop('com_zte_ums_eco_roc_vim_confirm_delete_vim_record'),function(result){
                if(result){
                    $.ajax({
                        type : "DELETE",
                        url : vm.$delVimInfoUrl.replace('{vim_id}', el.oid),
                        success : function(data) {
                            if(data.operationResult=="SUCCESS")
                            {
                                for(var i=0;i<vm.vimInfo.length;i++){
                                    if(el.oid == vm.vimInfo[i].oid){
                                        vm.vimInfo.splice(i, 1);
                                        break;
                                    }
                                }
                                resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_remove_success'),"success");
                            }
                            else{
                                resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') + $.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_remove_failed'),"warning");
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            resUtil.growl($.i18n.prop('com_zte_ums_eco_roc_vim_growl_msg_title') +  errorThrown, "danger");
                        }
                    });
                }
            });
        },
        gotoChartPage:function(oid,name,tenant){
            window.location.href = "vimChart.html?"+oid+"&"+name+"&"+tenant;
        }
});
avalon.scan();
vm.$initTable();




