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

var breadcrumbEle;

if(window.parent.ZteFrameWork) {
	breadcrumbEle = window.parent.ZteFrameWork.getBreadcrumbEle(); 
}

/* var vnfnodeDetail = [
	{
		name:"名称",
		value:"moc_name"
	}，
	{
		name:"状态",
		value:"status"
	}，
	{
		name:"网络服务提供商",
		value:"vendor"
	}，
	{
		name:"归属VNFM",
		value:"vnfm_name"
	}
]; */
var i18nTages = function(){		
	var i18nItems = $("span[name_i18n=com_zte_umc_monitor]");
	for(var i=0;i<i18nItems.length;i++){
		var $item = $(i18nItems.eq(i));
		var itemId = $item.attr('id');
		if(typeof($item.attr("title"))!="undefined"){
		$item.attr("title", $.i18n.prop(itemId));
		}else{
		   $item.text($.i18n.prop(itemId));
		}
	}
}

var nodeDetailMap = {
	//name:"标题",
	name: $.i18n.prop("com_zte_umc_monitor_title"),
	moc: $.i18n.prop("com_zte_umc_monitor_detail_moc_id"),
	moc_name: $.i18n.prop("com_zte_umc_monitor_detail_moc"),
	//status:"状态",
	status: $.i18n.prop("com_zte_umc_monitor_status"),
	//vendor:"网络服务提供商",
	vendor: $.i18n.prop("com_zte_umc_monitor_service_provider"),
	//version:"版本号",
	version: $.i18n.prop("com_zte_umc_monitor_version_no"),
	//vnfm_name:"归属VNFM",
	vnfm_name: $.i18n.prop("com_zte_umc_monitor_vnfm_blongs_to"),
	//vim_name:"归属VIM",
	vim_name: $.i18n.prop("com_zte_umc_monitor_vim_blongs_to"),
	/* vnf_address:"IP地址", */
	//ip_addresses:"IP地址",
	ip_addresses: $.i18n.prop("com_zte_umc_monitor_ip_address"),
	/* vdu_image:"镜像文件", */
	//createtime:"创建时间",
	createtime: $.i18n.prop("com_zte_umc_monitor_create_time"),
	//protocol:"协议",
	protocol: $.i18n.prop("com_zte_umc_monitor_protocol"),
	//port:"端口",
	port: $.i18n.prop("com_zte_umc_monitor_port"),
	//user:"用户名"
	port: $.i18n.prop("com_zte_umc_monitor_user_name"),
	//user:"用户名"
	type: $.i18n.prop("com_zte_umc_monitor_type")
};

var transformQueryViewData = function(queryViewData, pageSize){
	var newData = [];
	var pageNo = Math.floor(queryViewData.length / pageSize) + 1;
	for(var i=0;i<pageNo;i++){
		newData.push({array:[]});
	}
	for(var j=0;j<queryViewData.length;j++){
		newData[Math.floor(j/pageSize)].array.push(queryViewData[j]);  
	}	
	return newData;
}

var transformDataByType = function(childs){
	var newData = [];
	newData.push({array:[]});
	newData.push({array:[]});
	for(var i=0;i<childs.length;i++){
		if(childs[i].rendertype == "ns"){
			newData[0].array.push(childs[i]);
		}else{
			newData[1].array.push(childs[i]);
		}
	}
	return newData;
}

var drillURL = {
	
	/* 钻取vnf
	http://10.74.44.30:21180/nfv/rest/umc/monitor/topology/vnf/e4fe8c5f-7136-463c-9297-f90ee184baf2
	钻取vnfc
	http://10.74.44.30:21180/nfv/rest/umc/monitor/topology/vnfc/139e7944-2429-432b-9ac9-e2d1fabdcd40
	钻取vdu
	http://10.74.44.30:21180/nfv/rest/umc/monitor/topology/vdu/8f193d66-5b07-47e2-8bd2-78664390a7c2
	钻取host
	http://10.74.44.30:21180/nfv/rest/umc/monitor/topology/host/b2230479-590e-4e3a-a3e6-b5b36d39769f */
	
	ns: "/api/umcdrill/v1/topology/ns/",
	vnf: "/api/umcdrill/v1/topology/vnf/",
	vnfc: "/api/umcdrill/v1/topology/vnfc/",
	vdu: "/api/umcdrill/v1/topology/vdu/",
	host: "/api/umcdrill/v1/topology/host/"	
}

var getVNFData = function(url, id){
	var resJson;
	var getData = [];
	/* getData.push({
		name:"data",
		value:JSON.stringify({"ruleType":1,"ruleSort":1})
	}); */
	$.ajax( {
		async:false,
		"dataType": 'json',
		"type": "GET",
		"url": url + id,
		"data": getData,
		"contentType": 'application/json; charset=utf-8',
		"success": function(res, textStatus, jqXHR) {			
			resJson = res;
		},
		"error": function() {
			alert("Communication Error!");
		}
	} );	
	return resJson;
}

var generateDetailInfo = function(obj){
	vmVNF.selfDetail = [];
	for(var p in obj){ 
		if(typeof(obj[p])!="function" && nodeDetailMap[p]){ 
			if(p=="name"){
				vmVNF.detailTitle = obj[p];
			}else{
				vmVNF.selfDetail.push({
					name:nodeDetailMap[p],
					value:obj[p]
				});
			}
		} 
	} 
}

var setModelData = function(modelItem){
	var resJson = getVNFData(drillURL[modelItem.rendertype], modelItem.id);
	if(resJson.parents && resJson.parents.length>0){
		vmVNF.parent = resJson.parents;	
		if(vmVNF.parent.length==1 && vmVNF.parent[0].id=="root"){
			$(".row-fluid.parents").hide();
			$("#arrowParent").show();
			$(".parentWrapper").show();
		}else{
			$(".row-fluid.parents").show();
			$("#arrowParent").show();
			$(".parentWrapper").show();
		}
	}else{
		vmVNF.parent = [];
		$(".row-fluid.parents").hide();
		$("#arrowParent").hide();
		$(".parentWrapper").hide();
	}
	vmVNF.self = resJson.self;
	if(vmVNF.self.id=="root"){
		vmVNF.rootNodeVisable = true;
	}else{
		vmVNF.rootNodeVisable = false;
	}
	if(resJson.childs && resJson.childs.length>0){
		vmVNF.sun = transformQueryViewData(resJson.childs, 6);
		$(".row-fluid.suns").show();
		$("#arrowSun").show();
	}else{
		vmVNF.sun = [];	
		$(".row-fluid.suns").hide();
		$("#arrowSun").hide();
	}
	vmVNF.selfdetail = resJson.self;	
	//生成详细信息
	/* vmVNF.selfDetail = [];
	var obj = resJson.self;
	for(var p in obj){ 
		if(typeof(obj[p])!="function" && nodeDetailMap[p]){ 
			if(p=="name"){
				vmVNF.detailTitle = obj[p];
			}else{
				vmVNF.selfDetail.push({
					name:nodeDetailMap[p],
					value:obj[p]
				});
			}
		} 
	}  */
	generateDetailInfo(resJson.self);	
}

var vmVNF = avalon.define({
	$id: "vnfController",
	currentNodeType: 'VNF',
	tableTitle:'拓扑结构',
	parentVisable:true,
	sunVisable:true,
	boxVisible:true,
	rootNodeVisable:true,
	parent:[
		/* {id: 'deyang', name: "网络监控服务", rendertype:"ns", alarmCount:123},
		{id: 'chengdu', name: "网络监控服务", rendertype:"ns", alarmCount:112},
		{id: 'mianyang', name: "网络监控服务", rendertype:"ns", alarmCount:23} */
	],
	self:{
		/* id: 'e4fe8c5f-7136-463c-9297-f90ee184baf2', name: "2G 语音交换", rendertype:"vnf", alarmCount:112 */
	},	
	selfdetail:{
		/* "id":"e4fe8c5f-7136-463c-9297-f90ee184baf2",
		"name" : "VNF 2G 语音交换",
		"status" : "acitve",
		"vendor" : "ZTE Corp",
		"alarm" : "5",
		"vnfm_info":"VNFM no.1",
		"version":"1.0.0.1",
		"vnf_address":"10.5.25.96" */
	},
	selfDetail:[],
	detailTitle:"",
	sun:[	
			/* {
				array:[
					{id: '139e7944-2429-432b-9ac9-e2d1fabdcd40', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'chengdu', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'mianyang', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'wenchuan', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'leshan', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'emei', name: "控制进程", rendertype:"vnfc", alarmCount:23}
				]
			},
			{
				array:[
					{id: 'wuhan', name: "VDU映像", rendertype:"vdu", alarmCount:23},
					{id: 'xian', name: "VDU映像", rendertype:"vdu", alarmCount:23}		
				]
			} */
	],	
	parentExpandClicked: function (modelItem, item) {			
		vmVNF.parentVisable=true;
	},
	sunExpandClicked: function (modelItem, item) {			
		vmVNF.sunVisable=true;	
	},
	parentsRended: function(a,b,c){
		if(vmVNF.parent.length < 3){
			$($(".parentWrapper .col-xs-4")[0]).addClass("col-xs-offset-4");			
		}
		//root的情况隐藏边框
		if(vmVNF.parent.length == 1 && vmVNF.parent[0].id == "root"){
			$(".parentWrapper").css("border-width", "0px");
			$(".parentWrapper").css("margin-bottom", "0px"); 
			$("#arrowParent").css("padding-top", "0px");
		}else{
			$(".parentWrapper").css("border-width", "2px");
			$(".parentWrapper").css("margin-bottom", "10px");
			$("#arrowParent").css("padding-top", "15px");
		}
	},
	childrenRended: function (a, b, c, d, e) {
		for(var i=0;i<vmVNF.sun.length;i++){
			if(vmVNF.sun[i].array.length < 3){
				//$($(".sunWrapper .col-xs-12 .col-xs-4")[i]).addClass("col-xs-offset-4");
				$($(".col-xs-4", $(".sunWrapper .col-xs-12.sunRow")[i])[0]).addClass("col-xs-offset-4");
			}
		}
		if(vmVNF.sun.length == 0){
			$(".sunWrapper").css("border-width", "0px");
		}else{
			$(".sunWrapper").css("border-width", "2px");
		}
	},			
	boxDetailClicked: function(modelItem, item){
		$(".titleArea").removeClass("titleAreaHover");
		$(".portletIcon").removeClass("portletIconHover");
		$(".portletLabel").removeClass("portletLabelHover");
		$(".titleArea", $(item).parent()).addClass("titleAreaHover");
		$(".portletIcon", $(item).parent()).addClass("portletIconHover");
		$(".portletLabel", $(item).parent()).addClass("portletLabelHover");
		//var id = modelItem.id;
		/* vmVNF.selfdetail.id = modelItem.id;
		vmVNF.selfdetail.name = modelItem.name;
		vmVNF.selfdetail.vendor = modelItem.vendor; */
		//生成详细信息
		/* vmVNF.selfDetail = [];
		var obj = modelItem;
		for(var p in obj){ 
			if(typeof(obj[p])!="function" && nodeDetailMap[p]){ 
				if(p=="name"){
					vmVNF.detailTitle = obj[p];
				}else{
					vmVNF.selfDetail.push({
						name:nodeDetailMap[p],
						value:obj[p]
					});
				}
			} 
		}  */
		generateDetailInfo(modelItem);
	},
	nodeClicked: function(modelItem, item){		
	
		if($(item).parents(".vnfBox").hasClass("self")){
			return;
		}
		
		$(item).parents(".vnfBox").addClass("vnfBoxShrink");		
		setTimeout(function(){
			$("#mainContent").addClass("mainContentShrink");
			setTimeout(function(){
				setModelData(modelItem);				
				$("#mainContent").addClass("mainContentExpand");		
				$("#mainContent").removeClass("mainContentShrink").removeClass("mainContentExpand");
				$(".self .boxMainArea").click();
				setTimeout(function(){
					i18nTages();
				}, 100);
			}, 500);				
			/* $("#mainContent").animate({ height: "toggle"}, 1000, function(){		
				setModelData(modelItem);
				$("#mainContent").animate({ height: "toggle"}, 1000);
			}); */
		}, 500);
		
		//面包屑相关
		if($(item).parents(".parentWrapper").length >0){
			var currentNodeALink = $("a#" + vmVNF.self.id, breadcrumbEle);
			var rightArrow = currentNodeALink.next();
			$(rightArrow).remove();
			$(currentNodeALink).remove();
		}else{
			$(breadcrumbEle).append("<a id='" + modelItem.id + "'>" + modelItem.name + "</a><i class='fa fa-angle-right'></i>");
			var currentNode = $("#" + modelItem.id, breadcrumbEle);
			$(currentNode).click(function(e){
				e.preventDefault();
				$("#mainContent").animate({ height: "toggle"}, 1000, function(){		
					setModelData(modelItem);
					$("#mainContent").animate({ height: "toggle"}, 1000);
				});
				$(currentNode).nextAll().remove();
				$(breadcrumbEle).append("<i class='fa fa-angle-right'></i>");
			});			
		}
		/* $(item).parent(".vnfBox").fadeOut(1000, function(){
		//$(".vnfBox").fadeOut(1000, function(){
			setModelData(modelItem);
			setTimeout(function(){
				$("div.vnfBox").fadeIn(0, function(){
					// setTimeout(function(){
						// $("div.vnfBox").unbind().hover(
							// function(){
								// $(".titleArea", this).addClass("titleAreaHover");
							// },
							// function(){
								// $(".titleArea", this).removeClass("titleAreaHover");
							// }
						// );
					// }, 100);
				});
			}, 100);		   
		}); */
	},
	clickDisplayGraphAlink: function () {
		vmVNF.boxVisible = !vmVNF.boxVisible;		
		/* if(!vmVNF.boxVisible){
			parentHeight = $(".parentWrapper").height();
			//$(".parentWrapper").animate({ opacity: 'hide'}, 1000, "swing"); 
			$(".parentWrapper").animate({ height: '0px'}, 1000); 
		}else{
			//$(".parentWrapper").animate({ opacity: 'show'}, 1000, "swing"); 
			$(".parentWrapper").animate({ height: parentHeight + 'px'}, 1000); 
		}  */
		$(".parentWrapper").animate({ height: "toggle"}, 1000); 
		//$(".parentWrapper").toggleClass("parentClose", 1000, "linear");	
		
		if(vmVNF.boxVisible){
			//$("#contianArea").css("margin-top", "0px");
			$("#contianArea").animate({"margin-top":"0px"}, 1000);
			
		}else{
			//$("#contianArea").css("margin-top", "30px");
			$("#contianArea").animate({"margin-top":"30px"}, 1000);
		}
		//$("#contianArea").css("margin-top", "30px");
	},
	clickSunDisplayGraphAlink: function () {
		vmVNF.sunVisable = !vmVNF.sunVisable;
		/* if(!vmVNF.sunVisable){
			//$(".sunWrapper").hide('slide', {direction: 'right'}, 1000);
			$(".sunWrapper").animate({ opacity: 'hide'}, 500, "swing"); 
			//$(".sunWrapper").animate( { height: "0px"}, 1000 );
		}else{
			//$(".sunWrapper").show(1000);
			$(".sunWrapper").animate({ opacity: 'show'}, 500, "swing"); 
			//$(".sunWrapper").animate( { height: "100px"}, 1000 );
		} */
		$(".sunWrapper").animate({ height: "toggle"}, 1000); 
		if(vmVNF.sunVisable){
			//$("#arrowSun").css("padding-bottom", "0px");
			$("#contianAreaSun").animate({"margin-bottom":"-10px"}, 1000);
		}else{
			//$("#arrowSun").css("padding-bottom", "10px");
			$("#contianAreaSun").animate({"margin-bottom":"0px"}, 1000);
		}
	}
});
	
/* avalon.config({
    interpolate: ["<!--","-->"]
}) */
avalon.scan();

var rootData = function(){
	var resJson;
	var getData = [];
	$.ajax( {
		async:false,
		"dataType": 'json',
		"type": "GET",
		"url": "/api/umcdrill/v1/layer/ns",
		"data": getData,
		"contentType": 'application/json; charset=utf-8',
		"success": function(res, textStatus, jqXHR) {			
			resJson = res;
			if(resJson.operationresult=="FAIL"){
				alert(resJson.errorinfo);
				return;
			}
			if(resJson.parents && resJson.parents.length>0){
				vmVNF.parent = resJson.parents;		
				$(".row-fluid.parents").show();
				$("#arrowParent").show();
				$(".parentWrapper").show();
			}else{
				vmVNF.parent = [];
				$(".row-fluid.parents").hide();
				$("#arrowParent").hide();
				$(".parentWrapper").hide();
			}
			vmVNF.self = resJson.self;			
			if(resJson.childs && resJson.childs.length>0){
				vmVNF.sun = transformDataByType(resJson.childs);
				$(".row-fluid.suns").show();
				$("#arrowSun").show();
			}else{
				vmVNF.sun = [];	
				$(".row-fluid.suns").hide();
				$("#arrowSun").hide();
			}
			vmVNF.selfdetail = resJson.self;	
			$(breadcrumbEle).append("<a>" + vmVNF.self.name + "</a><i class='fa fa-angle-right'></i>");			
			//生成详细信息
			/* vmVNF.selfDetail = [];
			var obj = resJson.self;
			for(var p in obj){ 
				if(typeof(obj[p])!="function" && nodeDetailMap[p]){ 
					if(p=="name"){
						vmVNF.detailTitle = obj[p];
					}else{
						vmVNF.selfDetail.push({
							name:nodeDetailMap[p],
							value:obj[p]
						});
					}
				} 
			}  */
			generateDetailInfo(resJson.self);
		},
		"error": function() {
			alert("Communication Error!");
		}
	} );	
	return resJson;
}();

//侧栏跟随浏览器
$(function () {
	setTimeout(function(){
		if ($(".fixed_side").length > 0) {
			var offset = $(".fixed_side").offset();
			var width = $(".fixed_side").width();
			var height = $("#mainContent").height();
			$(".fixed_side").height(height + 20);
			$(window).scroll(function () {
				var scrollTop = $(window).scrollTop();
				//如果距离顶部的距离小于浏览器滚动的距离，则添加fixed属性。
				if (offset.top < scrollTop) {
					$(".fixed_side").addClass("fixed");
					$(".fixed_side").width(width);
					$(".fixed_side").height(height + 40);
				} else { //否则清除fixed属性
					$(".fixed_side").removeClass("fixed");
				}
			});
		}		
	}, 100);
});

$(".monitorJumpLabel").click(function(e){	
	e.preventDefault();
	$("#monitorInfo").show();
	$('ul[role=tablist] a[href="#fmpm"]').tab('show'); 			
	$("ul[role=tablist] > li:nth-child(2)").click();
});

$("body").show();

/* setTimeout(function(){
	$("div.vnfBox").unbind().hover(
		function(){
			$(".titleArea", this).addClass("titleAreaHover");
		},
		function(){
			$(".titleArea", this).removeClass("titleAreaHover");
		}
	);	
}, 100); */

/* $("span.ict-computer").click(function(){
	vmVNF.parent = [
		{id: 'deyang', name: "网络监控服务", rendertype:"NS", alarmCount:123},
		{id: 'chengdu', name: "网络监控服务", rendertype:"NS", alarmCount:112},
		{id: 'mianyang', name: "网络监控服务", rendertype:"NS", alarmCount:23},
		{id: 'zzz', name: "网络监控服务", rendertype:"NS", alarmCount:333} 
	];
	vmVNF.sun = [	
			{
				array:[
					{id: 'deyang', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'chengdu', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'mianyang', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'wenchuan', name: "控制进程", rendertype:"vnfc", alarmCount:23},
					{id: 'leshan', name: "控制进程", rendertype:"vnfc", alarmCount:23}					
				]
			},
			{
				array:[
					{id: 'wuhan', name: "VDU映像", rendertype:"vdu", alarmCount:23},
					{id: 'xian', name: "VDU映像", rendertype:"vdu", alarmCount:23},
					{id: 'emei', name: "控制进程", rendertype:"vnfc", alarmCount:23}
				]
			}
	];
}); */

/* var resJson = {
	"parents" : [{
	        "id":"02000026",
			"name" : "VNF 2G 语音交换",
			"status" : "acitve",
			"vendor" : "ZTE Corp",
			"vnfm_info":"VNFM no.1",
			"rendertype":"vnf"
		    }],
	"self" : {
	        "id":"03000042",
			"name" : "VNFC实例",
			"vdu_info" : "04000112",
			"rendertype":"vnfc"
		    },
"selfdetail" : {
	        "id":"03000026",
			"name" : "VNFC实例",
			"vdu_info" : "04000112",
			"type":"type1"
		    },
   "childs" : [
	        {
	        "id":"044000058",
			"vdu_image" : " vdu映像1",
			"vim_info" : "vim 1号",
			"ip_addresses" : "10.84.12.85",
			"rendertype":"vdu"
		    }
	],
"operationresult" : " SUCCESS "
}; */

