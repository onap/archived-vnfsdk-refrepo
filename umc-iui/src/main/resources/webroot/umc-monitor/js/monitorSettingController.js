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
			$id : "monitorController",
			server_rtn:{
				info_block:false,
				warning_block:false,
				rtn_info:""
			},
            resource:{
                monitorList:[]
            },
            ifPROXYIPChange:"",
            monitorUrl:"",
            oldmonitorInfo:{
                ipAddress:"",
                label:"",
                customPara:{

               }     
            },
            monitorInfo:{
                oid:"",
                origin:"",
                neTypeId:"",
                label:"",
                ipAddress:"",
				extendPara:"",
                customPara:{

               }     
            },
            dataTableLanguage: {
                "sProcessing": "<img src='../../component/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;Loadding...</span>",   
                "sLengthMenu": $.i18n.prop("openo-umc-monitor-iui-table-sLengthMenu"),
                "sZeroRecords": $.i18n.prop("openo-umc-monitor-iui-table-sZeroRecords"),
                "sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("openo-umc-monitor-iui-table-sInfo"),
                "sInfoEmpty": $.i18n.prop("openo-umc-monitor-iui-table-sInfoEmpty"),
                "sGroupActions": $.i18n.prop("openo-umc-monitor-iui-table-sGroupActions"),
                "sAjaxRequestGeneralError": $.i18n.prop("openo-umc-monitor-iui-table-sAjaxRequestGeneralError"),
                "sEmptyTable": $.i18n.prop("openo-umc-monitor-iui-table-sEmptyTable"),
                "oPaginate": {
                    "sPrevious": $.i18n.prop("openo-umc-monitor-iui-table-sPrevious"),
                    "sNext": $.i18n.prop("openo-umc-monitor-iui-table-sNext"),
                    "sPage": $.i18n.prop("openo-umc-monitor-iui-table-sPage"),
                    "sPageOf": $.i18n.prop("openo-umc-monitor-iui-table-sPageOf")
                }
            },

			$monitorListRestUrl :'../../api/umcmonitor/v1/monitorinfos', //all ne
            $monitorInstanceRestUrl :'../../api/umcmonitor/v1/monitorinfo/', 
            $queryDacsRestUrl : '../../api/umcmonitor/v1/dacs',
            $updateMonitorTaskRestUrl : '../../api/umcmonitor/v1/monitortask/',            
			$loginProtocol:  {
               selectItems : [
                {
                    cond_value : 'SSH',
                    name :"SSH"
                },                
                {
                    cond_value : 'TELNET',
                    name : "TELNET"
                }
                
            ]
        },
        dac:  {
               selectItems : []
        },
		
		monitorSettingDlgInfo:{
                titleName:"",
                saveType:""
        }, 
		queryMonitorList : function() {

              $.ajax({
                "type": 'get',
                "url": vm.$monitorListRestUrl,   
                "dataType": "json",
                "success": function (resp) {
					for(index in resp)
					{
						var monitorInfo=resp[index]
						var customPara={};
						if(monitorInfo.customPara!=""){
							customPara=JSON.parse(monitorInfo.customPara);
							if(typeof(customPara.PROXYIP) == "undefined")
							{
								customPara.PROXYIP="127.0.0.1";
							}
						 }
						 else{
							 customPara={PROXYIP:"127.0.0.1"};
						 }
						 monitorInfo.customPara=customPara;
					}

                     vm.resource.monitorList = resp;

                     $('#monitorManagerTable').DataTable({                    
                      "oLanguage": vm.dataTableLanguage,
                      "sDom": '<"top"rt><"bottom"lip>',
                      "sPaginationType": "bootstrap_extended", 
                      "bSort": false
                    });

                },
                 error: function(XMLHttpRequest, textStatus, errorThrown) {
                       monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_query_list_errInfo')+errorThrown,"danger");
                 }
              
              });
				  

		},
        queryMonitorInstance : function(oid){

            vm.monitorInfo.oid=oid;
             vm.monitorUrl=vm.$monitorInstanceRestUrl+oid;

             $.ajax({
                "type": 'GET',
                "url": vm.monitorUrl,   
                "dataType": "json",
                "success": function (resp) {

                    var monitorInfo=resp;
					var customPara={};
                    if(monitorInfo.customPara!=""){
                        customPara=JSON.parse(monitorInfo.customPara);
						if(typeof(customPara.PROXYIP) == "undefined")
						{
							customPara.PROXYIP="127.0.0.1";
						}
                     }
					 else{
						 customPara={PROXYIP:"127.0.0.1"};
					 }
					 monitorInfo.customPara=customPara;
                     vm.monitorInfo=monitorInfo;
					 
                     vm.oldmonitorInfo.ipAddress=monitorInfo.ipAddress;
                     vm.oldmonitorInfo.label=monitorInfo.label;
                     vm.oldmonitorInfo.customPara=customPara;

                     

                },
                 error: function(XMLHttpRequest, textStatus, errorThrown) {
                       monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_query_monitor_errInfo')+errorThrown,"danger");
                 }

              
              });

        },
		
		deleteMonitorInfo : function(oid){
            vm.monitorInfo.oid=oid;
            vm.monitorUrl=vm.$monitorInstanceRestUrl+oid;

             $.ajax({
                "type": 'DELETE',
                "url": vm.monitorUrl,   
                "dataType": "json",
                "success": function (resp) {
                     vm.gotoMonitorListPage();
                },
                 error: function(XMLHttpRequest, textStatus, errorThrown) {
                       monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_query_monitor_errInfo')+errorThrown,"danger");
                 }

              
              });

        },
		updateMonitorSet:function(){


                vm.monitorSettingDlgInfo.titleName=$.i18n.prop('com_zte_openo_umc_monitor_btn_monitorset');
                vm.server_rtn.warning_block=false;
                vm.server_rtn.info_block=false;

                $(".form-group").each(function () {
                        $(this).removeClass('has-success');
                        $(this).removeClass('has-error');
                        $(this).find(".help-block[id]").remove();
                });

                if(vm.monitorInfo.customPara.PROXYIP=="" && vm.dac.selectItems.length>0){
                    vm.monitorInfo.customPara.PROXYIP=vm.dac.selectItems[0].ipAddress;
                }

                if(vm.monitorInfo.customPara.PROTOCOL==""){
                    vm.monitorInfo.customPara.PROTOCOL="SSH";
                    vm.monitorInfo.customPara.PORT="22";
                }

                $("#monitorSettingDlg").modal("show");
        },
        testMonitorSet:function(){
           vm.server_rtn.warning_block=false;
           vm.server_rtn.info_block=true;
           vm.server_rtn.rtn_info="Monitor Set Access Test Pass";
        },
        saveMonitorSet : function() {
            success.hide();
            error.hide();
            if (form.valid() == false) {
                    return false;
             }
			var propertyNames=vm.monitorInfo.customPara.$propertyNames.split("&shy;");
			var isPropertyUnEqual=false;
			for(index in propertyNames)
			{
				var name=propertyNames[index]
				if(vm.oldmonitorInfo.customPara[name]!=vm.monitorInfo.customPara[name])
				{
					isPropertyUnEqual=true;
					break;
				}
			}
             // judge monitorInfo whether change
             if( vm.oldmonitorInfo.ipAddress!=vm.monitorInfo.ipAddress ||
            isPropertyUnEqual){

             vm.server_rtn.warning_block=false;
             vm.server_rtn.info_block=true;
             vm.server_rtn.rtn_info=$.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_checkInfo');
			var customPara=JSON.stringify(vm.monitorInfo.customPara.$model);
                    $.ajax({
                    "type": 'POST',
                    "url": vm.monitorUrl,
                    "data": JSON.stringify({
                             "ipAddress": vm.monitorInfo.ipAddress,
                             "oid": vm.monitorInfo.oid,
							 "neTypeId": vm.monitorInfo.neTypeId,
							 "label": vm.monitorInfo.label,
							 "origin": vm.monitorInfo.origin,
							 "extendPara": vm.monitorInfo.extendPara,
                             "customPara": customPara
                        }),
                    "dataType": "json",
                    "contentType" : "application/json",
                    success: function (resp) {  
                         // judge PROXYIP whether change
                         
                         if(vm.oldmonitorInfo.customPara.PROXYIP!=vm.monitorInfo.customPara.PROXYIP){
                               vm.ifPROXYIPChange=1;     
                         }
                         else{
                               vm.ifPROXYIPChange=0;  
                         }

                         vm.updateMonitorTask();

                        vm.oldmonitorInfo.ipAddress=vm.monitorInfo.ipAddress;
                        vm.oldmonitorInfo.label=vm.monitorInfo.label;
						var customPara=vm.monitorInfo.customPara.$model;
                        vm.oldmonitorInfo.customPara=customPara;


                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                        
                           vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_save_failInfo')+errorThrown;                
                     }
             });

             }
             else if(vm.oldmonitorInfo.label!=vm.monitorInfo.label){
                //only change label label
                
                //save new monitorInfo
          
             vm.server_rtn.warning_block=false;
             vm.server_rtn.info_block=true;
             vm.server_rtn.rtn_info=$.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_checkInfo');
			var customPara=JSON.stringify(vm.monitorInfo.customPara.$model);

                    $.ajax({
                    "type": 'POST',
                    "url": vm.monitorUrl,
                    "data": JSON.stringify({
                             "ipAddress": vm.monitorInfo.ipAddress,
                             "oid": vm.monitorInfo.oid,
							 "neTypeId": vm.monitorInfo.neTypeId,
							 "label": vm.monitorInfo.label,
							 "origin": vm.monitorInfo.origin,
							 "extendPara": vm.monitorInfo.extendPara,
                             "customPara": customPara
                        }),
                    "dataType": "json",
                    "contentType" : "application/json",
                    success: function (resp) {  
                    if(resp.result=="SUCCESS"){

                        vm.oldmonitorInfo.label=vm.monitorInfo.label;
                        $('#monitorSettingDlg').modal('hide');                            
                         monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_save_successInfo'),"success"); 

                       
                    }
                    else{
                           vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_save_failInfo'); 
                        }

                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                        
                           vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_save_failInfo')+errorThrown;                
                     }
                });
                
             }
             else{
                //no change
                 $('#monitorSettingDlg').modal('hide');                            
                 monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_save_successInfo'),"success"); 
             }
             


            

        },
        cancelMonitorSet: function() {

            vm.monitorInfo.ipAddress=vm.oldmonitorInfo.ipAddress;
            vm.monitorInfo.name=vm.oldmonitorInfo.name;
            vm.monitorInfo.customPara=vm.oldmonitorInfo.customPara;
             $('#monitorSettingDlg').modal('hide');   

        },
        queryDACs:function(){
           

            $.ajax({
                    "type": 'get',
                    "url":  vm.$queryDacsRestUrl,
                    "dataType": "json",
                    success: function (resp) {  
                         vm.dac.selectItems = (resp==null)?[]:resp;  
                         // vm.proxy.selectItems.sort(function(a,b){return a.ipAddress>b.ipAddress?1:-1});                 
                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) { 
                           monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_dac_query_failInfo')+errorThrown,"danger");                    
                     }                  
                });
        },
        updateMonitorTask:function(){
            vm.server_rtn.warning_block=false;
             vm.server_rtn.info_block=true;
             vm.server_rtn.rtn_info=$.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_task_checkInfo');


                     var data= JSON.stringify({
                                oid:vm.monitorInfo.oid,
                                moc:vm.monitorInfo.neTypeId,
                                proxyIp:vm.monitorInfo.customPara.PROXYIP
                            });

                   $.ajax({
                    "type": 'PUT',
                    "url": vm.$updateMonitorTaskRestUrl+vm.ifPROXYIPChange,
                     "data" :data,
                    "dataType": "json",
                    "contentType":"application/json",
                    success: function (resp) {  
                        if(resp.result=="SUCCESS"){
                         
                        $('#monitorSettingDlg').modal('hide');                            
                         monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_save_successInfo'),"success"); 

                        }
                        else
                        {
                               vm.server_rtn.warning_block=true;
                               vm.server_rtn.info_block=false; 
                               vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_task_failInfo')+resp.info;     
                        }

                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                        
                           vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_monitorsetting_monitor_task_failInfo')+errorThrown;                
                          
                     }
                });
               
        },
     
				   
		    gotoDACPage:function(){
		    	// window.parent.ZteFrameWork.goToURLByIDAndNewAction('sdn-manager-gwList');
		    	window.location.href="./dacList.html";
		    },	
		    gotoMonitorSettingPage:function(oid){
		    	// window.parent.ZteFrameWork.goToURLByIDAndNewAction('sdn-manager-gwList');
		    	window.location.href="./monitorSetting.html?"+oid;
		    },	   
		    gotoMonitorListPage:function(){
		    	// window.parent.ZteFrameWork.goToURLByIDAndNewAction('sdn-manager-gwList');
		    	window.location.href="./monitorSettingList.html";
		    }	   
		   	

		});

avalon.scan();


