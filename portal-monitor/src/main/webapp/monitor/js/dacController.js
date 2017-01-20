/*
 * Copyright 2016, CMCC Technologies Co., Ltd.
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
        $id : "dacController",
        $queryDACsRestUrl : '/openoapi/umc/v1/monitor/dacs',
        server_rtn:{
                info_block:false,
                warning_block:false,
                rtn_info:""
            },
        dacLoading:false,
        dacChecking:false,     
        dacInfoArray :  [],
        dacInfo:{
            oid:"",
            moc:"",
            nodeLabel : '',
            ipAddress : '',
            note : ''
        },
        dacDlgInfo:{
                titleName:"",
                saveType:""
        },       
        initDAC:function(){
            vm.dacLoading=true;

            $.ajax({
                    "type": 'get',
                    "url":  vm.$queryDACsRestUrl,
                    "dataType": "json",
                    success: function (resp) {  
                         vm.dacInfoArray = (resp==null)?[]:resp;  
                         vm.dacInfoArray.sort(function(a,b){return a.nodeLabel>b.nodeLabel?1:-1});                 
                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                           // bootbox.alert("query DAC Info fail："+":"+errorThrown);   
                           monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_dac_query_failInfo')+errorThrown,"danger");                    
                           return;
                     },
                     complete:function(){
                        vm.dacLoading=false;
                     }                     
                });
        },
        testDAC:function(){
           vm.server_rtn.warning_block=false;
           vm.server_rtn.info_block=true;
           vm.server_rtn.rtn_info="DAC Access Test Pass";
        },
        addDAC:function(){

                vm.dacInfo.oid="";
                vm.dacInfo.moc="it.dac";
                vm.dacInfo.nodeLabel="";
                vm.dacInfo.ipAddress="";
                vm.dacInfo.note="";

                vm.dacDlgInfo.saveType = "add";
                vm.dacDlgInfo.titleName=$.i18n.prop('com_zte_openo_umc_monitor_dac_register');
                vm.server_rtn.warning_block=false;
                vm.server_rtn.info_block=false;


                $(".form-group").each(function () {
                        $(this).removeClass('has-success');
                        $(this).removeClass('has-error');
                        $(this).find(".help-block[id]").remove();
                 });
                $("#dacDlg").modal("show");
        },
        saveDAC : function() {
            success.hide();
            error.hide();
            if (form.valid() == false) {
                    return false;
             }

             vm.server_rtn.warning_block=false;
             vm.server_rtn.info_block=true;
             vm.server_rtn.rtn_info='<i class="fa fa-spinner fa-spin fa-lg"></i>  '+$.i18n.prop('com_zte_openo_umc_monitor_dac_register_check_Info');
             

             var data= JSON.stringify({
                              "oid":vm.dacInfo.oid,  
                              "moc": vm.dacInfo.moc,
                              "nodeLabel":vm.dacInfo.nodeLabel,
                              "ipAddress":vm.dacInfo.ipAddress,
                              "note":vm.dacInfo.note
                        });

             if(vm.dacDlgInfo.saveType=="add")
              {
                    vm.dacChecking=true;
                    for(var i=0;i<vm.dacInfoArray.length;i++){
                    
                            if(vm.dacInfoArray[i].ipAddress==vm.dacInfo.ipAddress)
                            {
                                vm.server_rtn.warning_block=true;
                                vm.server_rtn.info_block=false; 
                                vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_dac_register_repeat_errInfo',[vm.dacInfo.ipAddress]);
                                vm.dacChecking=false;
                                return;
                            }
                        
                    }

                    $.ajax({
                    "type": 'POST',
                    "url":  vm.$queryDACsRestUrl,
                    "data" : data,
                    "dataType": "json",
                    "contentType":"application/json",
                    success: function (resp) {  
                         if(resp.result=="SUCCESS"){
                              var newDac=JSON.parse(data);
                              newDac.oid=resp.info;

                              vm.dacInfoArray.push(newDac); 
                               // vm.dacInfoArray.sort(function(a,b){return a.nodeLabel>b.nodeLabel?1:-1});
                               $('#dacDlg').modal('hide');                            
                                monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_dac_register_successInfo'),"success"); 
                                vm.dacChecking=false;  
                         }
                         else{
                            vm.server_rtn.warning_block=true;
                            vm.server_rtn.info_block=false; 
                            vm.server_rtn.rtn_info= resp.info;
                            vm.dacChecking=false;
                         }    
                      
                                      
                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                        
                           vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_dac_save_failInfo')+errorThrown;   
                           vm.dacChecking=false;             
                          
                     }
                });
              }
              else{

                    $.ajax({
                    "type": 'PUT',
                    "url": vm.$queryDACsRestUrl,
                     "data" :data,
                    "dataType": "json",
                    "contentType":"application/json",
                    success: function (resp) {  
                        if(resp.result=="SUCCESS"){
                            for(var i=0;i<vm.dacInfoArray.length;i++){
                                if(vm.dacInfoArray[i].oid == vm.dacInfo.oid)
                                { 
                                    vm.dacInfoArray[i].nodeLabel=vm.dacInfo.nodeLabel; 
                                    vm.dacInfoArray[i].ipAddress=vm.dacInfo.ipAddress;
                                    vm.dacInfoArray[i].note=vm.dacInfo.note;  

                                   
                                    break;
                                }
                             }
                  


                        $('#dacDlg').modal('hide');      

                        monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_dac_update_successInfo'),"success");

                        }
                    else{
                    
                          vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= resp.info;       
                        }

                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                        
                           vm.server_rtn.warning_block=true;
                           vm.server_rtn.info_block=false; 
                           vm.server_rtn.rtn_info= $.i18n.prop('com_zte_openo_umc_monitor_dac_save_failInfo')+errorThrown;                
                          
                     }
                });


              }


        },
        updateDAC:function(dacInfo){

                vm.dacInfo.oid=dacInfo.oid;
                vm.dacInfo.moc=dacInfo.moc;
                vm.dacInfo.nodeLabel=dacInfo.nodeLabel;
                vm.dacInfo.ipAddress=dacInfo.ipAddress;
                vm.dacInfo.note=dacInfo.note;


                vm.dacDlgInfo.saveType = "update";
                vm.dacDlgInfo.titleName=$.i18n.prop('com_zte_openo_umc_monitor_dac_edit');
                vm.server_rtn.warning_block=false;
                vm.server_rtn.info_block=false;


                $(".form-group").each(function () {
                        $(this).removeClass('has-success');
                        $(this).removeClass('has-error');
                        $(this).find(".help-block[id]").remove();
                    });

                $("#dacDlg").modal("show");
        },
        delDAC:function(oid){
                bootbox.confirm($.i18n.prop('com_zte_openo_umc_monitor_dac_delete_sureInfo'),function(result){
                if(result){
                $.ajax({
                    "type": 'DELETE',
                    "url": vm.$queryDACsRestUrl+"/"+oid,
                    "dataType": "json",
                    success: function (resp) {  
                            
                            if(resp.result=="SUCCESS"){
                             for(var i=0;i<vm.dacInfoArray.length;i++){
                                   if(vm.dacInfoArray[i].oid == oid){
                                        vm.dacInfoArray.splice(i, 1);
                                        break;
                                    }
                                }   

                              monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_dac_delete_successInfo'),"success");
                            }
                            else{
                             monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_dac_delete_failInfo')+resp.info,"danger");    
                            }

                
                    },
                     error: function(XMLHttpRequest, textStatus, errorThrown) {
                             monitorUtil.growl($.i18n.prop('com_zte_openo_umc_monitor_dac_delete_failInfo')+errorThrown,"danger");
                         
                     }
                  });
                }
                    
                
            });
           
        },
        gotoMonitorPage:function(){
            window.location.href="monitorSettingList.html";
        }

       
    });
avalon.scan();
vm.initDAC();
