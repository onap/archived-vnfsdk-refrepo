var pm = {};
pm.query = {};
pm.query.vmPmQuery = avalon.define({
	$id: "pmQueryController",
	tableTitle:'',
	pmDataVisable:true,
	pmChartVisable:false,
	tableIconVisable:false,
	chartIconVisable:false,
	queryRuleVisable:false,
	boxVisible:true,
	pmQueries:[],		
	
	$postData:{},
	
	beginTime: "",
	endTime: "",
	granularity:"",
	
	granularities: [
        {id: '5', name: $.i18n.prop('com_zte_ums_ict_pm_query_5'), value: true},
        {id: '15', name: $.i18n.prop('com_zte_ums_ict_pm_query_15'), value: false},		
		{id: '60', name: $.i18n.prop('com_zte_ums_ict_pm_query_60'), value: false}
    ],
	
	granularityClicked: function(modelItem, item){
		if(modelItem.id =="5"){
			pm.query.vmPmQuery.granularity = "5*60";
			pm.query.vmPmQuery.granularities[0].value = true;  
			pm.query.vmPmQuery.granularities[1].value = false;  
			pm.query.vmPmQuery.granularities[2].value = false; 
		}else if(modelItem.id =="15"){
			pm.query.vmPmQuery.granularity = "15*60";
			pm.query.vmPmQuery.granularities[0].value = false;  
			pm.query.vmPmQuery.granularities[1].value = true;  
			pm.query.vmPmQuery.granularities[2].value = false;
		}else{
			pm.query.vmPmQuery.granularity = "60*60";
			pm.query.vmPmQuery.granularities[0].value = false;  
			pm.query.vmPmQuery.granularities[1].value = false;  
			pm.query.vmPmQuery.granularities[2].value = true;
		}
	},	
	
	resources: [
		/* {id: 'vnfInstance', name: $.i18n.prop('ngict-pm-iui-name-vnfInstance'), value: "SSS"},
		{id: 'host', name: $.i18n.prop('ngict-pm-iui-name-host'), value: ""} */
	],
	
	resourcesMap:{},
	
	resourceSlected:[],
	
	resourceSlectedObjs:[],
	
	rmSelectedResource: function(modelItem, elem){
		$(elem).parent().remove();
		pm.query.vmPmQuery.resourceSlected.splice(pm.query.vmPmQuery.resourceSlected.indexOf(modelItem.id), 1);
	},
	
	initResources: function(resourceTypeId){
		var that = this;
		$.ajax({
			async: false,
			"dataType": 'json',
			"type": "GET",
			//"url": "/api/umcpm/v1/resources/" + resourceTypeId,
			"url": "/api/umcpm/v1/resources/",
			"contentType": 'application/json; charset=utf-8',
			"success": function (res, textStatus, jqXHR) {
				//var nodes = res.content;	
				var nodes = res;
				that.resources = [];
				for (var i = 0; i < nodes.length; i++) {
					var resource = {
						id: nodes[i].id,
						name: nodes[i].name,
						resType: nodes[i].resType
					};
					that.resources.push(resource);
					//保存id和resource的映射关系
					var resourceCopy = {
						id: nodes[i].id,
						name: nodes[i].name,
						resType: nodes[i].resType
					};
					that.resourcesMap[nodes[i].id] = resourceCopy;
				}
				//过滤框注册
				$("input[id=resourcesToFilter]").keyup(function(){ 
					$("table#resources tbody tr").hide().filter(":contains('"+( $(this).val() )+"')").show(); 
				}); 
			},
			"error": function () {
			}
		});
	},
	
	resTypeArray : [],
	selectedResourceType : "",
	selectedResourceTypeId : "",
	
	moTypeArray:[],
	selectedMoType:"",
	selectedMoTypeId:"",
	
	counterArray:[],
	selectedCounter:[],
	
	resTypeSelectAction:function(){
		var resourceTypeId = getIdFromName(pm.query.vmPmQuery.selectedResourceType,pm.query.vmPmQuery.resTypeArray);
		pm.query.vmPmQuery.selectedResourceTypeId = resourceTypeId;
		getMoTypeArray(resourceTypeId);
		pm.query.vmPmQuery.counterArray=[];
		pm.query.vmPmQuery.initResources(resourceTypeId);
	},
	moTypeSelectAction:function(obj){
		 var resourceTypeId=getIdFromName(pm.query.vmPmQuery.selectedResourceType,pm.query.vmPmQuery.resTypeArray);
		 //var moTypeId=$(obj).val();
		 var moTypeId = getIdFromName(pm.query.vmPmQuery.selectedMoType, pm.query.vmPmQuery.moTypeArray);	
		 pm.query.vmPmQuery.selectedMoTypeId = moTypeId;		 
		 getCounterArray(resourceTypeId,moTypeId);
	},
	/* counterSelectAction:function(obj){
		 var counterId=$(obj).val();
		 pm.query.vmPmQuery.selectedCounter=counterId;		
		 pm.query.vmPmQuery.indexDescription+=pm.query.vmPmQuery.selectedCounter;
	}, */
	returnQueryPage: function(){
		pm.query.vmPmQuery.pmDataVisable=true;
		pm.query.vmPmQuery.pmChartVisable=false;
		pm.query.vmPmQuery.tableIconVisable=false;
		pm.query.vmPmQuery.chartIconVisable=true;
		pm.query.vmPmQuery.queryRuleVisable=false;
		pm.query.vmPmQuery.clickDisplayGraphAlink();
	},
	
	queryRuleView: function(event, el){
		event.stopPropagation();
		
		pm.query.vmPmQuery.tableTitle=$.i18n.prop('com_zte_ums_ict_pm_query_edit');   
		
		//取得测量任务详情
		var elem = {};
		$.ajax({
			async: false,
			"dataType": 'json',
			"type": "GET",
			"url": "/api/umcpm/v1/meatasks/" + el.id,
			"data": null,
			"contentType": 'application/json; charset=utf-8',
			"success": function (res, textStatus, jqXHR) {
				elem = res;
			},
			"error": function () {
			}
		});
		
		pm.query.vmPmQuery.pmDataVisable=false;
		pm.query.vmPmQuery.pmChartVisable=false;
		pm.query.vmPmQuery.tableIconVisable=false;
		pm.query.vmPmQuery.chartIconVisable=false;
		pm.query.vmPmQuery.queryRuleVisable=true;
		
		pm.query.vmPmQuery.beginTime = elem.beginTime;
		pm.query.vmPmQuery.endTime = elem.endTime;
		
		var timetext = pmUtil.formatTime(pm.query.vmPmQuery.beginTime) + " - " + pmUtil.formatTime(pm.query.vmPmQuery.endTime);
		$("#queryTimeRange").val(timetext);
		
		//选择粒度
		pm.query.vmPmQuery.granularity = elem.granularity;
		var granularity = pm.query.vmPmQuery.granularity / 60;
		var granularities = pm.query.vmPmQuery.granularities;
		for(var i=0;i<granularities.length;i++){
			if(granularity == granularities[i].id){
				granularities[i].value = true;
			}else{
				granularities[i].value = false;
			}
		}		
		
		//展开相关资源类型		
		pm.query.vmPmQuery.resTypeArray.push(elem.resourceType);
		pm.query.vmPmQuery.selectedResourceTypeId = elem.resourceType.id;
		pm.query.vmPmQuery.selectedResourceType = elem.resourceType.name;		
		//pm.query.vmPmQuery.resTypeSelectAction();
		pm.query.vmPmQuery.moTypeArray.push(elem.moType);
		pm.query.vmPmQuery.selectedMoTypeId = elem.moType.id;
		pm.query.vmPmQuery.selectedMoType = elem.moType.name;
		//pm.query.vmPmQuery.moTypeSelectAction();
		getCounterArray(elem.moType.id);		
		pm.query.vmPmQuery.initResources(elem.resourceType.id);
		
		$("select#resourceTypes").attr("disabled", true);
		$("select#moTypes").attr("disabled", true);
		
		//选中对象
		pm.query.vmPmQuery.resourceSlected = [];
		for(var j=0;j<elem.resources.length;j++){
			pm.query.vmPmQuery.resourceSlected.push(elem.resources[j].id);
			//pm.query.vmPmQuery.resourceSlected.push(elem.resources[j]);
		}
		
		//$("a#upArrow").click();
		pm.query.vmPmQuery.clickDisplayGraphAlink();
		
		$('.indexesAll').unbind().bind("change", function () {
			var table = $("table#indexes");
			var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
			var checked = $(this).is(":checked");
			$(set).each(function () {
				//$(this).attr("checked", checked);
				if(checked){
					if(!$(this).is(":checked")){
						$(this).click();
					}
				}else{
					if($(this).is(":checked")){
						$(this).click();
					}
				}		
			});
		});
		
		$('.resourceAll').unbind().bind("change", function () {
			var table = $("table#resources");
			var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
			var checked = $(this).is(":checked");
			$(set).each(function () {
				//$(this).attr("checked", checked);
				if(checked){
					if(!$(this).is(":checked")){
						$(this).click();
					}
				}else{
					if($(this).is(":checked")){
						$(this).click();
					}
				}		
			});
		});	
		//国际化
		var i18nItems = $("[name_i18n=com_zte_ums_ict_pm_query]");
		for(var i=0;i<i18nItems.length;i++){
			var $item = $(i18nItems.eq(i));
			var itemId = $item.attr('id');
			var itemValue = $.i18n.prop(itemId);						
			if(typeof($item.attr("title"))!="undefined"){
				$item.attr("title", itemValue);
			}else if(typeof($item.attr("placeholder"))!="undefined"){
				$item.attr("placeholder", itemValue);
			}else{
				$item.text(itemValue);
			}
		}	
	},
	
	queryRuleChanged: function(){
		
		pm.query.vmPmQuery.pmDataVisable=true;
		pm.query.vmPmQuery.pmChartVisable=false;
		pm.query.vmPmQuery.tableIconVisable=false;
		pm.query.vmPmQuery.chartIconVisable=true;
		pm.query.vmPmQuery.queryRuleVisable=false;
		pm.query.vmPmQuery.clickDisplayGraphAlink();
		
		var resourcesToPut = [];
		for(var i=0;i<pm.query.vmPmQuery.resourceSlected.length;i++){
			for(var j=0;j<pm.query.vmPmQuery.resources.length;j++){
				if(pm.query.vmPmQuery.resourceSlected[i] == pm.query.vmPmQuery.resources[j].id){
					resourcesToPut.push(pm.query.vmPmQuery.resources[j]);
					break;
				}
			}
		}
		
		var postData = {
		  "resourceTypeId": pm.query.vmPmQuery.selectedResourceTypeId,        
		  "moTypeId": pm.query.vmPmQuery.selectedMoTypeId,        
		  //"resources": pm.query.vmPmQuery.resourceSlected,	
	      "resources": resourcesToPut,	  
		  "counterOrIndexId": pm.query.vmPmQuery.selectedCounter,
		  "granularity": pm.query.vmPmQuery.granularity,
		  "beginTime": pm.query.vmPmQuery.beginTime,
		  "endTime": pm.query.vmPmQuery.endTime,
		  "pageNo": 0,
		  "pageSize": 10
		}
		pm.query.vmPmQuery.$postData = postData;
		$.ajax({
			//async:false,
			"type": 'post',
			"url": "/api/umcpm/v1/historydataqueries",
			"dataType": "json",
			"data": JSON.stringify(postData),
			"contentType": 'application/json; charset=utf-8',
			"success": function (resp) {		
				//if(resp.content[0]){
				if(resp.data[0]){
					//var datas = resp.content[0].datas;	
					var datas = resp.data[0].datas;
					//pm.query.vmPmQuery.$queryDataTableFields = pm.query.vmPmQuery.$queryDataTableFieldsBackup;
					collectDataFields(datas);
					//pm.query.vmPmQuery.postData = postData;
					pm.query.vmPmQuery.$initTable();
				}else{
					collectDataFields([]);					
					pm.query.vmPmQuery.$initTable();
				}		
			},
			"error":function(resp){
			
			}
		});			
	},
	
	queryTabClicked: function (el, item) {		
	
		//取得测量任务详情
		var modelItem = {};
		$.ajax({
			async: false,
			"dataType": 'json',
			"type": "GET",
			"url": "/api/umcpm/v1/meatasks/" + el.id,
			"data": null,
			"contentType": 'application/json; charset=utf-8',
			"success": function (res, textStatus, jqXHR) {
				modelItem = res;
			},
			"error": function () {
			}
		});
	
		pm.query.vmPmQuery.pmDataVisable=true;
		pm.query.vmPmQuery.pmChartVisable=false;
		pm.query.vmPmQuery.tableIconVisable=false;
		pm.query.vmPmQuery.chartIconVisable=true;
		pm.query.vmPmQuery.queryRuleVisable=false;
		//vmPmQuery.boxVisible= false;
		pm.query.vmPmQuery.tableTitle=modelItem.name + " " + $.i18n.prop('com_zte_ums_ict_pm_query_result');   

		//取得指标
		var getData = [];
		getData.push({
			name: "resourceTypeId",
			value: modelItem.resourceType.id
		});
		getData.push({
			name: "moTypeId",
			value: modelItem.moType.id
		});
		var counterOrIndexId = [];
		var MoTypeId = modelItem.moType.id;
		/* $.ajax({
			async: false,
			"dataType": 'json',
			"type": "GET",
			//"url": "/api/umcpm/v1/motypes/indexes",
			"url": "/api/umcpm/v1/indexes",
			"data": getData,
			"contentType": 'application/json; charset=utf-8',
			"success": function (res, textStatus, jqXHR) {
				for(var i=0;i<res.length;i++){
					counterOrIndexId.push(res[i].id);
				}
			},
			"error": function () {
			}
		}); */
		var url="/api/umcpm/v1/motypes/" + MoTypeId + "/counters";
		var data={};
		data.moTypeId=MoTypeId;
		$.ajax({
			"type": 'get',
			"url": url,
			"dataType": "json",
			data:data,
			 "async": false,
			"success": function (res) {
				for(var i=0;i<res.length;i++){
					counterOrIndexId.push(res[i].id);
				}
			},
			"error":function(res){
				counterOrIndexId=[]; 				
			}
		}); 
		
		var resources=[];
		for(var i=0;i<modelItem.resources.length;i++){
			var resource = {};
			resource.id = modelItem.resources[i].id;
			resource.name = modelItem.resources[i].name;
			resource.resType = modelItem.resources[i].resType;
			resources.push(resource);
		}
		var postData = {
		  "resourceTypeId": modelItem.resourceType.id,        
		  "moTypeId": modelItem.moType.id,        
		  "resources": resources,	  
		  "counterOrIndexId": counterOrIndexId,
		  "granularity": modelItem.granularity,
		  "beginTime": modelItem.beginTime,
		  "endTime": modelItem.endTime,
		  "pageNo": 0,
		  "pageSize": 10
		}
		pm.query.vmPmQuery.$postData = postData;		
		$.ajax({
			//async:false,
			"type": 'post',
			"url": "/api/umcpm/v1/historydataqueries",
			"dataType": "json",
			"data": JSON.stringify(postData),
			"contentType": 'application/json; charset=utf-8',
			"success": function (resp) {		
				//if(resp.content[0]){
				if(resp.data[0]){
					//var datas = resp.content[0].datas;	
					var datas = resp.data[0].datas;
					//pm.query.vmPmQuery.$queryDataTableFields = pm.query.vmPmQuery.$queryDataTableFieldsBackup;					
					collectDataFields(datas);					
					pm.query.vmPmQuery.$initTable();
				}else{
					collectDataFields([]);					
					pm.query.vmPmQuery.$initTable();
				}		
			},
			"error":function(resp){
			
			}
		});				
	},
	clickSelectedCommonCond: function () {
	   //显示统计图;
	},			
	clickDisplayGraphAlink: function () {
		pm.query.vmPmQuery.boxVisible = !pm.query.vmPmQuery.boxVisible;
	},	
	showPerformanceChart: function () {
		drawPerformanceChart();
		pm.query.vmPmQuery.pmDataVisable=false;
		pm.query.vmPmQuery.pmChartVisable=true;
		pm.query.vmPmQuery.tableIconVisable=true;
		pm.query.vmPmQuery.chartIconVisable=false;
	},
	showPerformanceTable: function () {
		pm.query.vmPmQuery.pmDataVisable=true;
		pm.query.vmPmQuery.pmChartVisable=false;
		pm.query.vmPmQuery.tableIconVisable=false;
		pm.query.vmPmQuery.chartIconVisable=true;
	},
	$queryDataTableFields: [		
		{
			"mData": "beginTime",
			sWidth: "10%",
			name: $.i18n.prop('com_zte_ums_ict_pm_query_start_time'),
			"fnRender": pmUtil.timeRender
		},
		{
			"mData": "endTime",
			sWidth: "10%",
			name: $.i18n.prop('com_zte_ums_ict_pm_query_end_time'),
			"fnRender": pmUtil.timeRender
		},		
		{
			"mData": "granularity",
			sWidth: "10%",
			name: $.i18n.prop('com_zte_ums_ict_pm_query_granularity')
		},
		{
			"mData": "resourceType.name",
			sWidth: "15%",
			name: $.i18n.prop('com_zte_ums_ict_pm_query_resource_type')
		},
		{
			"mData": "resource.name",
			sWidth: "15%",
			name: $.i18n.prop('com_zte_ums_ict_pm_query_resource_name')
		}
	] ,
	$language: {
		"sProcessing": "<img src='../common/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;处理中...</span>",
		"sLengthMenu": $.i18n.prop("ngict-log-iui-table-sLengthMenu"),
		"sZeroRecords": $.i18n.prop("ngict-log-iui-table-sZeroRecords"),
		"sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("ngict-log-iui-table-sInfo"),
		"sInfoEmpty": $.i18n.prop("ngict-log-iui-table-sInfoEmpty"),
		"sGroupActions": $.i18n.prop("ngict-log-iui-table-sGroupActions"),
		"sAjaxRequestGeneralError":$.i18n.prop("ngict-log-iui-table-sAjaxRequestGeneralError"),
		"sEmptyTable": $.i18n.prop("ngict-log-iui-table-sEmptyTable"),
		"oPaginate": {
			"sPrevious": $.i18n.prop("ngict-log-iui-table-sPrevious"),
			"sNext": $.i18n.prop("ngict-log-iui-table-sNext"),
			"sPage": $.i18n.prop("ngict-log-iui-table-sPage"),
			"sPageOf": $.i18n.prop("ngict-log-iui-table-sPageOf")
		}
	},
	$initTable: function () {
		var setting = {};
		setting.language = this.$language;
		setting.columns = this.$queryDataTableFields;
		setting.pageHtml="r<'table-scrollable't><'row page-info-bottom'<'col-md-12 col-sm-12'lip>>>";
		//setting.restUrl ="/api/umcpm/v1/indexes";
		//setting.restUrl ="../../json/thresholdList.json";
		setting.restUrl = "/api/umcpm/v1/historydataqueries";
		setting.tableId = "ict_pm_data";
		serverPageTable.initDataTable(setting,  'ict_pm_data_div' );		
	}
});

pm.query.vmPmQuery.resourceSlected.$watch("length", function(newValue, oldValue){
   var resourceSlected = pm.query.vmPmQuery.resourceSlected;
   //pm.query.vmPmQuery.resourceSlectedObjs = [];
   var resourceSlectedObjs = [];
   for(var i=0;i<resourceSlected.length;i++){
		//var obj = getObjById(resourceSlected[i], pm.query.vmPmQuery.resources);
		var obj = $.extend(true, {}, pm.query.vmPmQuery.resourcesMap[resourceSlected[i]]);
		//pm.query.vmPmQuery.resourceSlectedObjs.push(obj);
		resourceSlectedObjs.push(obj);
   }
   //给绑定变量一次性赋值，否则非常慢
   //pm.query.vmPmQuery.resourceSlectedObjs = $.extend(true, [], resourceSlectedObjs);
   pm.query.vmPmQuery.resourceSlectedObjs=[];
   for(var j=0;j<resourceSlectedObjs.length;j++){
	   pm.query.vmPmQuery.resourceSlectedObjs.push(resourceSlectedObjs[j]);
   }
});

function getObjById(id,array){
   for(var i=0;i<array.length;i++){
	  if(array[i].id==id){
		 return array[i];
	  }
   }
}
	
avalon.scan();

//取得任务列表
var queryViewData;
$.ajax({
	async: false,
	"dataType": 'json',
	"type": "GET",
	"url": "/api/umcpm/v1/meatasks",
	//"url": "../../js/meatask/testList.json",
	"data": null,
	"contentType": 'application/json; charset=utf-8',
	"success": function (res, textStatus, jqXHR) {
		//queryViewData = res.content;
		queryViewData = res;
	},
	"error": function () {
	}
});

pm.query.vmPmQuery.pmQueries = transformQueryViewData(queryViewData, 8);

/* var postData = {
  "resourceTypeId": "vnf.cn.cscf",        
  "moTypeId": "vnf.cn.cscf.metrictype",        
  "resources": [
	{
	  "id": "vnf.cn.cscf.001",
	  "name": "cscf001",
	  "resType": "vnf.cn.cscf"
	}
  ],	  
  "counterOrIndexId": [
	"001"
  ],
  "granularity": 900,
  "beginTime": 1449023738672,
  "endTime": 1449023738672
} */

var queryDataTableFieldsBackup = [		
	{
		"mData": "beginTime",
		sWidth: "10%",
		name: $.i18n.prop('com_zte_ums_ict_pm_query_start_time'),
		"fnRender": pmUtil.timeRender
	},
	{
		"mData": "endTime",
		sWidth: "10%",
		name: $.i18n.prop('com_zte_ums_ict_pm_query_end_time'),
		"fnRender": pmUtil.timeRender
	},		
	{
		"mData": "granularity",
		sWidth: "10%",
		name: $.i18n.prop('com_zte_ums_ict_pm_query_granularity')
	},
	{
		"mData": "resourceType.name",
		sWidth: "15%",
		name: $.i18n.prop('com_zte_ums_ict_pm_query_resource_type')
	},
	{
		"mData": "resource.name",
		sWidth: "15%",
		name: $.i18n.prop('com_zte_ums_ict_pm_query_resource_name')
	}
];

//pm.query.vmPmQuery.$initTable();
function  fnServerData(sSource, aoData, fnCallback, oSettings) {
	
	var oPaging = oSettings.oInstance.fnPagingInfo();
	var pageLength = oPaging.iLength;
	var curPageNo = oPaging.iPage;
	
	pm.query.vmPmQuery.$postData.pageNo = curPageNo;
	pm.query.vmPmQuery.$postData.pageSize = pageLength;
	
	oSettings.jqXHR = $.ajax({
		"type": 'post',
		//"type": 'get',
		"url": sSource,
		//"url": "../../js/meatask/testMulti1.json",
		"dataType": "json",
		"data": JSON.stringify(pm.query.vmPmQuery.$postData),
		"contentType": 'application/json; charset=utf-8',
		"success": function (resp) {
			oSettings.iDraw = oSettings.iDraw + 1;
			var data = {};
			//添加动态列
			//for(var i=0;i<resp.content.length;i++){
			for(var i=0;i<resp.data.length;i++){
				//var row = resp.content[i];
				var row = resp.data[i];
				for(var j=0;j<row.datas.length;j++){
					row["counterOrIndex" + row.datas[j].counterOrIndexId] = row.datas[j].value;
				}
			}
			/* data.aaData = resp.content;			
			data.iTotalRecords = resp.content.length;
            data.iTotalDisplayRecords = resp.content.length; */
			data.aaData = resp.data;			
			data.iTotalRecords = resp.totalCout;
            data.iTotalDisplayRecords = resp.totalCout;
			data.sEcho = oSettings;					
			fnCallback(data);			
		},
		"error":function(resp){
		
		}
	});
}

/* var tableFieldsMap = {
	beginTime: "开始时间",
	endTime: "结束时间"	
}; */

function collectDataFields(datas){
	pm.query.vmPmQuery.$queryDataTableFields = [];
	for(var i=0;i<queryDataTableFieldsBackup.length;i++){
		pm.query.vmPmQuery.$queryDataTableFields.push(queryDataTableFieldsBackup[i]);
	}	
	for(var i=0;i<datas.length;i++){
		if(!datas[i].name){
			datas[i].name="测试列"
		}		
		pm.query.vmPmQuery.$queryDataTableFields.push({
				//"mData": "datas["+ i +"].value",
				//"mData": "datas.value",
				//"mData": "datas",
				"mData": "counterOrIndex" + datas[i].counterOrIndexId,
				sWidth: "10%",
				name: datas[i].counterOrIndexName
				//,fnRender: pmUtil.indexValue
		});
	}
}

/* function tranverseObjFields(obj){
	for(var p in obj){ 
		if(typeof(obj[p])!="function" && tableFieldsMap[p]){
			if(obj[p]){
				
			}
			pm.query.vmPmQuery.$queryDataTableFields.push({
				"mData": p,
				sWidth: "10%",
				name: tableFieldsMap[p]
			})
		} 
	} 
} */

function transformQueryViewData(queryViewData, pageSize) {
    var newData = [];
    var pageNo = Math.floor(queryViewData.length / pageSize) + 1;
	if(queryViewData.length % pageSize == 0){
		pageNo--;
	}
    for (var i = 0; i < pageNo; i++) {
        newData.push({array: []});
    }
    for (var j = 0; j < queryViewData.length; j++) {
        newData[Math.floor(j / pageSize)].array.push(queryViewData[j]);
    }
    return newData;
}
    
setTimeout(function(){
	$($(".item", $(".carousel-inner"))[0]).addClass("active");
	pmUtil.setDateRange("queryTimeRange");
}, 100);

newIndexWizard = function (idx,action) {	    
          //获取资源类型
		//getResTypeArray();
		var resourceTypeId;
		var moTypeId;
         
		//默认取资源第一个的测量类型
		/* if(pm.query.vmPmQuery.resTypeArray && pm.query.vmPmQuery.resTypeArray.length>0){
			pm.query.vmPmQuery.selectedResourceType=pm.query.vmPmQuery.resTypeArray[0].name;
			resourceTypeId=pm.query.vmPmQuery.resTypeArray[0].id;
			pm.query.vmPmQuery.selectedDataType=pm.query.vmPmQuery.dataTypeArray[0].name;
			getMoTypeArray( pm.query.vmPmQuery.resTypeArray[0].id);
			getCounterArray(resourceTypeId,moTypeId);
		} */
}();

function  getResTypeArray(){
	var url="/api/umcpm/v1/resourcetypes";
	$.ajax({
		"type": 'get',
		"url": url,
		"dataType": "json",
		 "async": false,
		"success": function (resp) {
			//pm.query.vmPmQuery.resTypeArray= resp.content;
			pm.query.vmPmQuery.resTypeArray= resp;
		},
		"error":function(resp){
		  // pm.index.vm.ResTypeArray=resp; 
		}
	});
}

function  getMoTypeArray(resourceTypeId){
	if(resourceTypeId){
	//获取测量类型
	var url="/api/umcpm/v1/motypes";
	var data={};
	data.resourceTypeId=resourceTypeId;
	$.ajax({
		"type": 'get',
		"url": url,
		data:data,
		"dataType": "json",
		 "async": false,
		"success": function (resp) {
			//pm.query.vmPmQuery.moTypeArray= resp.content;
			pm.query.vmPmQuery.moTypeArray= resp;
		},
		"error":function(resp){
			pm.query.vmPmQuery.moTypeArray=[]; 
			//for test
			/* var res = {"message":null,"content":[{"name":"性能KPI-1","id":"ns.cn.ims.metrictype"},{"name":"性能KPI-2","id":"ns.cn.ims.metrictype1"},{"name":"性能KPI-3","id":"ns.cn.ims.metrictype2"},{"name":"性能KPI-4","id":"ns.cn.ims.metrictype3"},{"name":"性能KPI-5","id":"ns.cn.ims.metrictype4"}],"status":0};
			pm.query.vmPmQuery.moTypeArray = res.content; */
		}
	}); 
	}
}

function  getCounterArray(MoTypeId){
	if(MoTypeId){
		var url="/api/umcpm/v1/motypes/"+MoTypeId+"/counters";
		var data={};
		data.moTypeId=MoTypeId;
		$.ajax({
			"type": 'get',
			"url": url,
			"dataType": "json",
			data:data,
			 "async": false,
			"success": function (resp) {
				//pm.query.vmPmQuery.counterArray= resp.content;
				pm.query.vmPmQuery.counterArray= resp;
				//默认全选
				pm.query.vmPmQuery.selectedCounter = [];
				for(var i=0;i<resp.length;i++){
					pm.query.vmPmQuery.selectedCounter.push(resp[i].id);
				}
			},
			"error":function(resp){
				pm.query.vmPmQuery.counterArray=[]; 
				//for test
				/* var res = {"message":null,"content":[{"dataType":null,"name":"总用户数","id":"ns.cn.epc.businesskpi.totalUsers"},{"dataType":null,"name":"总用户数","id":"ns.cn.ims.businesskpi.totalUsers"},{"dataType":null,"name":"平均CPU使用率%","id":"vnf.runtimeInfo.averageCpuUsage"},{"dataType":null,"name":"平均内存使用率%","id":"vnf.runtimeInfo.averageMemoryUsage"},{"dataType":null,"name":"总用户数","id":"vnf.cn.cscf.businesskpi.totalUsers"}],"status":0};
				pm.query.vmPmQuery.counterArray = res.content; */
			}
		}); 
	}
}

function getIdFromName(name,array){
   for(var i=0;i<array.length;i++){
	  if(array[i].name==name){
		 return array[i].id;
	  }
   }
}
function getNameFromId(id,array){
   for(var i=0;i<array.length;i++){
	  if(array[i].id==id){
		 return array[i].name;
	  }
   }
}
function getObjFromId(id,array){
   for(var i=0;i<array.length;i++){
	  if(array[i].id==id){
		 return array[i];
	  }
   }
   return "";
}
function getObjFromName(name,array){
   for(var i=0;i<array.length;i++){
	  if(array[i].name==name){
		 return array[i];
	  }
   }
}

/* function allCheckbox(obj) {
	var isChecked = obj.checked;
	var tableId = $(obj).parents(".table").attr("id");
	$('td.checkBoxInFirstCol', $("#" + tableId)).each(function() {
		var temp = $(this).children('input');
		temp[0].checked = isChecked;
	});
} */


