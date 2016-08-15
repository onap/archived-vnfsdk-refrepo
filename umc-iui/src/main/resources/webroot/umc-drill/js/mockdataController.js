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
			$id: "mockdataController",
			$addHOSTtitleName:"增加HOST",
			$addVNFtitleName:"增加VNF实例",
			$addVDUtitleName:"增加VDU实例", 
			$addVNFCtitleName:"增加VNFC实例", 
			$addNStitleName:"编排NS实例", 
			$mockAlarmTooltip:"点我就能模拟5条告警，告警码随机选取，祝你好运！",
			$mockAlarmRemark:"关于模拟告警说明:<br/>1.创建资源后才能模拟告警; <br/>2.创建资源后要等会儿告警模块才能查询到资源信息，所以创建后等6秒再模拟告警吧！",
			alarmbtnvalue:"模拟告警",
			alarmbtndisabled:true,

			server_rtn:{
				info_block:false,
				warning_block:false,
				info_text:"",
				warning_text:""
			},	

			HOSTInfo : {
				oid:"",
				name:"wangyg test host001",
				moc:"nfv.host.linux",
				ipAddress:"10.74.151.88",
				vendor:"",
				version:"",
				type:"",
				user:"test",
				password:"123456",
				protocol:"ssh",
				port:"21",
				vimId:"-1",
				customPara:"",
				alarmbtndisabled:true,
                alarmbtnvalue:"模拟告警"
			},

			VNFInfo : {
				oid:"",
				name:"wangyg test vnf001",
				moc:"nfv.vnf.bn.vbras",
				ipAddress:"",
				vendor:"",
				version:"",
				type:"",
				vnfd:"vnfd-1",
				autoScalePolicy:"",
				localization:"zh",
				monitoringParameter:"",
				status:"active",
				createTime:commonUtil.parseDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
				customPara:"",
				flavourId:"flavour-No-001",
				vnfmid:"-1",
				vimId:"-1",
				alarmbtndisabled:true,
                alarmbtnvalue:"模拟告警"
			},

			VDUInfo : {
				oid:"",
				name:"wangyg test vdu001",
				moc:"nfv.vdu.linux",
				ipAddress:"10.74.75.8",
				vendor:"",
				version:"",
				type:"",
				vduImage:"ubuntu12.0",
				parentOid:"",
				vnfId:"-1",
				createTime:commonUtil.parseDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
				customPara:"",
				flavourId:"flavour-No-001",
				vimId:"-1",
				hostId:"-1",
				alarmbtndisabled:true,
                alarmbtnvalue:"模拟告警"
			},
			VNFCInfo : {
				oid:"",
				name:"wangyg test VNFC",
				moc:"nfv.vnfc.bn.vbras.protocol",
				ipAddress:"",
				vendor:"",
				version:"",
				type:"",
				vnfId:"-1",
				vduId:"-1",
				createTime:commonUtil.parseDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
				alarmbtndisabled:true,
                alarmbtnvalue:"模拟告警"
			},
			NSInfo : {
				oid:"",
				name:"wangyg编排服务测试1",
				moc:"nfv.ns.raisecom.nanocellgw",
				vendor:"zte",
				version:"ns1.0",
				type:"CN",
				nsd:"nsd1",
				autoScalePolicy:"",
				monitoringParameter:"",
				flavour:"e2d65cc9",
				status:"active",
				customPara:"",
				vnfIds:[],
				alarmbtndisabled:true,
                alarmbtnvalue:"模拟告警"
			},
			$operationResult:{
				success:"SUCCESS",
				fail:"FAIL"
			},
			$queryVimInfoUrl : '/api/roc/v1/resource/vims',
			$queryHostInfoUrl : '/api/roc/v1/resource/hosts',
			$queryVnfInfoUrl : '/api/roc/v1/resource/vnfs',
			$queryVduInfoUrl : '/api/roc/v1/resource/vdus',
			$queryVnfmInfoUrl : '/api/roc/v1/resource/vnfms',

			$addVduInfoUrl: '/api/roc/v1/resource/vdus',
			$addVnfcInfoUrl: '/api/roc/v1/resource/vnfcs',
			$addVnfInfoUrl: '/api/roc/v1/resource/vnfs',
			$addHostInfoUrl: '/api/roc/v1/resource/hosts',
			$addNSInfoUrl: '/api/roc/v1/resource/nsrs',
			$raiseAlarmUrl:'/api/umc/v1/monitor/alarm',
			vimList:[],
			hostList:[],
			vnfList:[],
			vduList:[],
			vnfmList:[],

$raiseAlarm : function(oid,name) {
		if(oid=='' || oid==undefined || oid==null){ 
			vm.server_rtn.info_block=false;
			vm.server_rtn.warning_block=true;
			vm.server_rtn.warning_text="oid为空，无法发送告警！请先创建资源吧~";
			return;
		}
		vm.server_rtn.info_text="模拟了如下资源的告警  资源ID："+oid+" 名称："+name;
		$.ajax({
			type: "POST",
			url: vm.$raiseAlarmUrl,
			data: oid,
			contentType:"text/plain; charset=utf-8",  //发送信息至服务器时内容编码类型
			success: function (data) {
					vm.server_rtn.warning_block=false;
					vm.server_rtn.info_block=true;		
					vm.server_rtn.info_text=vm.server_rtn.info_text+"<br/>服务器返回信息："+data;
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				vm.server_rtn.info_block=false;  
				vm.server_rtn.warning_block=true;	
				vm.server_rtn.warning_text=+"服务器返回错误："+textStatus+":"+errorThrown;                                               
			}
		});
},

$addNS : function() {
		if (vm.NSInfo.vnfIds.length==0) {
			alert("请选择包含的VNF");
			return false;
		}
        
		$.ajax({
			type: "POST",
			url: vm.$addNSInfoUrl,
			contentType:"application/json",
			data: JSON.stringify({
				name:vm.NSInfo.name,
				moc:vm.NSInfo.moc,
				vendor:vm.NSInfo.vendor,
				version:vm.NSInfo.version,
				type:vm.NSInfo.type,
				customPara:vm.NSInfo.customPara,
				nsd:vm.NSInfo.nsd,
				autoScalePolicy:vm.NSInfo.autoScalePolicy,
				monitoringParameter:vm.NSInfo.monitoringParameter,
				flavour:vm.NSInfo.flavour,
				status:vm.NSInfo.status,
				vnfIds:vm.NSInfo.vnfIds
			}),
			dataType: "json",
			success: function (data) {
				if (data.operationResult == vm.$operationResult.success) {
					vm.server_rtn.warning_block=false;
					vm.server_rtn.info_block=true;		
					vm.server_rtn.info_text="保存成功!新建NS的id为："+data.oid; 
					updateAlarmBtnState(vm.NSInfo);
					vm.NSInfo.oid=data.oid;
				}
				else{
					vm.server_rtn.info_block=false;
					vm.server_rtn.warning_block=true;
					vm.server_rtn.warning_text="保存NS失败！接口返回错误信息："+data.exception;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				vm.server_rtn.info_block=false;  
				vm.server_rtn.warning_block=true;	
				vm.server_rtn.warning_text=textStatus+":"+errorThrown;                                               

			}
		});
},



$addHost : function() {
		if (vm.HOSTInfo.vimId=="-1") {
			alert("请选择所属VIM");
			return false;
		}

		$.ajax({
			type: "POST",
			url: vm.$addHostInfoUrl,
			contentType:"application/json",
			data: JSON.stringify({
				name:vm.HOSTInfo.name,
				moc:vm.HOSTInfo.moc,
				ipAddress:vm.HOSTInfo.ipAddress,
				vendor:vm.HOSTInfo.vendor,
				version:vm.HOSTInfo.version,
				type:vm.HOSTInfo.type,
				customPara:vm.HOSTInfo.customPara,
				user:vm.HOSTInfo.user,
				password:vm.HOSTInfo.password,
				port:vm.HOSTInfo.port,
				protocol:vm.HOSTInfo.protocol,
				vimId:vm.HOSTInfo.vimId
			}),
			dataType: "json",
			success: function (data) {
				if (data.operationResult == vm.$operationResult.success) {
					vm.server_rtn.warning_block=false;
					vm.server_rtn.info_block=true;		
					vm.server_rtn.info_text="保存成功!新建Host的id为："+data.oid; 
					updateAlarmBtnState(vm.HOSTInfo);
					vm.HOSTInfo.oid=data.oid;
				}
				else{
					vm.server_rtn.info_block=false;
					vm.server_rtn.warning_block=true;
					vm.server_rtn.warning_text="保存Host失败！接口返回错误信息："+data.exception;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				vm.server_rtn.info_block=false;  
				vm.server_rtn.warning_block=true;	
				vm.server_rtn.warning_text=textStatus+":"+errorThrown;                                               

			}
		});
},


$addVNF : function() {
		if (vm.VNFInfo.vnfmid == "-1"||vm.VNFInfo.vimId=="-1") {
			alert("请选择所属的VNFM和VIM");
			return false;
		}
		
		$.ajax({
			type: "POST",
			url: vm.$addVnfInfoUrl,
			contentType:"application/json",
			data: JSON.stringify({
				name:vm.VNFInfo.name,
				moc:vm.VNFInfo.moc,
				ipAddress:vm.VNFInfo.ipAddress,
				vendor:vm.VNFInfo.vendor,
				version:vm.VNFInfo.version,
				type:vm.VNFInfo.type,
				vnfd:vm.VNFInfo.vnfd,
				autoScalePolicy:vm.VNFInfo.autoScalePolicy,
				localization:vm.VNFInfo.localization,
				monitoringParameter:vm.VNFInfo.monitoringParameter,
				status:vm.VNFInfo.status,
				customPara:vm.VNFInfo.customPara,
				flavourId:vm.VNFInfo.flavourId,
				vnfmid:vm.VNFInfo.vnfmid,
				vimId:vm.VNFInfo.vimId,
				createTime:vm.VNFInfo.createTime
			}),
			dataType: "json",
			success: function (data) {
				if (data.operationResult == vm.$operationResult.success) {
					vm.server_rtn.warning_block=false;
					vm.server_rtn.info_block=true;		
					vm.server_rtn.info_text="保存成功!新建VNF的id为："+data.oid; 
					updateAlarmBtnState(vm.VNFInfo);
					vm.VNFInfo.oid=data.oid;
				}
				else{
					vm.server_rtn.info_block=false;
					vm.server_rtn.warning_block=true;
					vm.server_rtn.warning_text="保存VNF失败！接口返回错误信息："+data.exception;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				vm.server_rtn.info_block=false;  
				vm.server_rtn.warning_block=true;	
				vm.server_rtn.warning_text=textStatus+":"+errorThrown;                                               

			}
		});
},
$addVNFC : function() {
		
		if (vm.VNFCInfo.vnfId == "-1" ||vm.VNFCInfo.vduId =="-1") {
			alert("请选择所属的VNF和部署到的VDU");
			return false;
		}

		$.ajax({
			type: "POST",
			url: vm.$addVnfcInfoUrl,
			contentType:"application/json",
			data: JSON.stringify({
				name:vm.VNFCInfo.name,
				moc:vm.VNFCInfo.moc,
				ipAddress:vm.VNFCInfo.ipAddress,
				vendor:vm.VNFCInfo.vendor,
				version:vm.VNFCInfo.version,
				type:vm.VNFCInfo.type,
				vnfId:vm.VNFCInfo.vnfId,
				vduId:vm.VNFCInfo.vduId,
				createTime:vm.VNFCInfo.createTime
			}),
			dataType: "json",
			success: function (data) {
				if (data.operationResult == vm.$operationResult.success) {
					vm.server_rtn.warning_block=false;
					vm.server_rtn.info_block=true;		
					vm.server_rtn.info_text="保存成功!新建VNFC的id为："+data.oid; 
					updateAlarmBtnState(vm.VNFCInfo);
					vm.VNFCInfo.oid=data.oid;
				}
				else{
					vm.server_rtn.info_block=false;
					vm.server_rtn.warning_block=true;
					vm.server_rtn.warning_text="保存VNFC失败！接口返回错误信息："+data.exception;
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				vm.server_rtn.info_block=false;  
				vm.server_rtn.warning_block=true;	
				vm.server_rtn.warning_text=textStatus+":"+errorThrown;                                               

			}
		});
},
$addVDU : function() {
		if (vm.VDUInfo.vnfId=="-1"||vm.VDUInfo.vimId=="-1"||vm.VDUInfo.hostId=="-1") {
			alert("请选择vim、host和vnf信息");
			return false;
		}
		
		$.ajax({
			type: "POST",
			url: vm.$addVduInfoUrl,
		    //contentType:"application/json;charset=utf-8",  //发送信息至服务器时内容编码类型。
		    contentType:"application/json",
			data: JSON.stringify({
		    	name:vm.VDUInfo.name,
		    	moc:vm.VDUInfo.moc,
		    	ipAddress:vm.VDUInfo.ipAddress,
		    	vendor:vm.VDUInfo.vendor,
		    	version:vm.VDUInfo.version,
		    	type:vm.VDUInfo.type,
		    	vduImage:vm.VDUInfo.vduImage,
		    	parentOid:vm.VDUInfo.parentOid,
		    	vnfId:vm.VDUInfo.vnfId,
		    	createTime:vm.VDUInfo.createTime,
		    	customPara:vm.VDUInfo.customPara,
		    	flavourId:vm.VDUInfo.flavourId,
		    	vimId:vm.VDUInfo.vimId,
		    	hostId:vm.VDUInfo.hostId
		    }),
		    dataType: "json",
		    success: function (data) {
		    	if (data.operationResult == vm.$operationResult.success) {
		    		vm.server_rtn.warning_block=false;
		    		vm.server_rtn.info_block=true;		
		    		vm.server_rtn.info_text="保存成功!新建VDU的id为："+data.oid; 
		    		updateAlarmBtnState(vm.VDUInfo);
		    		vm.VDUInfo.oid=data.oid;
		    	}
		    	else{
		    		vm.server_rtn.info_block=false;
		    		vm.server_rtn.warning_block=true;
		    		vm.server_rtn.warning_text="保存VDU失败！接口返回错误信息："+data.exception;
		    	}
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) {
		    	vm.server_rtn.info_block=false;  
		    	vm.server_rtn.warning_block=true;	
		    	vm.server_rtn.warning_text=textStatus+":"+errorThrown;                                               

		    }
		});
}
});
avalon.scan();

//公共方法，在点击了保存并保存成功后将模拟告警按钮置灰6秒钟
var updateAlarmBtnState=function(node){
  var waitsecs = 6; 
  var i=1;
  node.alarmbtndisabled=true;
  node.alarmbtnvalue="喝杯茶，稍等"+ waitsecs +"秒"; 
  var id = setInterval(function(){
    if(i<waitsecs){
    printnr = waitsecs-i;  
    node.alarmbtnvalue="喝杯茶，稍等"+ printnr +"秒"; 
    i++; 
  }else{
    node.alarmbtnvalue="模拟告警";
    node.alarmbtndisabled=false; 
    window.clearInterval(id);
  }
  },1000);
} 

//以下函数为点击导航菜单时组合刷新对应的下拉菜单
var updateSelectForAddHOST=function(){
	updateVimList();
	vm.server_rtn.warning_block=false;
	vm.server_rtn.info_block=false;	
}
var updateSelectForAddVNF=function(){
	updateVimList();
	updateVnfmList();
	vm.server_rtn.warning_block=false;
	vm.server_rtn.info_block=false;	
}
var updateSelectForAddVDU=function(){
	updateVimList();
	updateVnfList();
	updateHostList();
	vm.server_rtn.warning_block=false;
	vm.server_rtn.info_block=false;	
}
var updateSelectForAddVNFC=function(){
	updateVnfList();
	updateVduList();
	vm.server_rtn.warning_block=false;
	vm.server_rtn.info_block=false;	
}
var updateSelectForAddNS=function(){
	updateVnfList();
	vm.server_rtn.warning_block=false;
	vm.server_rtn.info_block=false;	
}
//以下函数为刷新下拉菜单对应的实现类
var updateVnfList=function(){
	 //ajax查询vnf列表
	 $.ajax({
	 	"type": 'get',
	 	"url": vm.$queryVnfInfoUrl,
	 	"dataType": "json",
	 	"success": function (resp) {
	 		if(resp.operationResult==vm.$operationResult.success)
	 		{
	 			vm.vnfList = (resp==null)?[]:resp.data;
	 		}
	 		else{
	 			alert("查询vnf列表失败");  
	 			vm.vnfList=[];
	 			return;
	 		}
	 	},
	 	error: function(XMLHttpRequest, textStatus, errorThrown) {
	 		alert("查询vnf列表失败："+textStatus+":"+errorThrown);                       
	 		return;
	 	}
	 });	
}

var updateVimList=function(){
	//ajax查询vim列表
	$.ajax({
		"type": 'get',
		"url": vm.$queryVimInfoUrl,
		"dataType": "json",
		"success": function (resp) {
			if(resp.operationResult==vm.$operationResult.success)
			{
				vm.vimList = (resp==null)?[]:resp.data;
			}
			else{
				vm.vimList=[];
				alert("查询vim列表失败");  
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("查询vim列表失败："+textStatus+":"+errorThrown);                       
			return;
		}
	});	
}

var updateHostList=function(){
   //ajax查询host列表
   $.ajax({
   	"type": 'get',
   	"url": vm.$queryHostInfoUrl,
   	"dataType": "json",
   	"success": function (resp) {
   		if(resp.operationResult==vm.$operationResult.success)
   		{
   			vm.hostList = (resp==null)?[]:resp.data;
   		}
   		else{
   			vm.hostList=[];
   			alert("查询host列表失败");  
   			return;
   		}
   	},
   	error: function(XMLHttpRequest, textStatus, errorThrown) {
   		alert("查询host列表失败："+textStatus+":"+errorThrown);                       
   		return;
   	}
   });
}
var updateVduList=function(){
   //ajax查询vdu列表
   $.ajax({
   	"type": 'get',
   	"url": vm.$queryVduInfoUrl,
   	"dataType": "json",
   	"success": function (resp) {
   		if(resp.operationResult==vm.$operationResult.success)
   		{
   			vm.vduList = (resp==null)?[]:resp.data;
   		}
   		else{
   			vm.vduList=[];
   			alert("查询vdu列表失败");  
   			return;
   		}
   	},
   	error: function(XMLHttpRequest, textStatus, errorThrown) {
   		alert("查询vdu列表失败："+textStatus+":"+errorThrown);                       
   		return;
   	}
   });	
}
var updateVnfmList=function(){
    //ajax查询vnfm列表
    $.ajax({
    	"type": 'get',
    	"url": vm.$queryVnfmInfoUrl,
    	"dataType": "json",
    	"success": function (resp) {
    		if(resp.operationResult==vm.$operationResult.success)
    		{
    			vm.vnfmList = (resp==null)?[]:resp.data;
    		}
    		else{
    			vm.vnfmList=[];
    			alert("查询vnfm列表失败");  
    			return;
    		}
    	},
    	error: function(XMLHttpRequest, textStatus, errorThrown) {
    		alert("查询vnfm列表失败："+textStatus+":"+errorThrown);                       
    		return;
    	}
    });	
}