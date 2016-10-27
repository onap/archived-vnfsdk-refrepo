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
var pmUtil = {};
function html_encode(str) {
    vars = "";
    if (str.length == 0)return "";
    s = str.replace(/&/g, "&amp;");  //1
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
};
pmUtil.indexOperate = function (obj) {
    
	var aIndex={};
	aIndex.id=obj.aData.id;
	aIndex.name=obj.aData.indexName;
	aIndex.dataType=obj.aData.indexDataType;
	aIndex.indexDes=obj.aData.indexDes;
	aIndex.strExpression=obj.aData.strExpression;
	aIndex.resourceType=obj.aData.resourceType;
	aIndex.moType=obj.aData.moType;
	var index = html_encode(JSON.stringify(aIndex));
    var indexId = obj.aData.id;
    var innerHtml =  "<div class='table-btn'><span class='modify_user'><a class=\"btn-xs grey btn-editable\" href='#' onclick=\"pmUtil.modifyIndex('"+index+"')\"><i class=\"ict-modify\"></i>" + $.i18n.prop('com_zte_ums_ict_pm_action_modify') +
	"</a></span><span><a href='#' class=\"btn-xs grey btn-editable\" onclick=\"pmUtil.deleteIndex('" +
	indexId + "','"+obj.aData.moType.id+"')\"><i class=\"ict-delete\"></i>" + $.i18n.prop('com_zte_ums_ict_pm_action_delete') + "</a></span></div>";	

    return innerHtml;
};
pmUtil.dataTypeRender = function (obj) {
    var record = obj.aData;
	obj.aData.indexDataType=obj.aData.dataType;
    var innerHtml = "<span>"+$.i18n.prop(record.dataType)+"</span>"
    return innerHtml;
};
pmUtil.indexNameLink = function (obj) {
	var index = html_encode(JSON.stringify(obj.aData));
	obj.aData.indexName=obj.aData.name;
	return "<a  id='indexName' href='#' onclick=\"pmUtil.queryIndex('"+index+"')\">" + obj.aData.name + "</a>";
};
pmUtil.queryIndex=function(index){
    
       newIndexWizard(commonUtil.strToJson(index),"query");
	   pm.index.vm.title="查看指标";
	   $(".form-group").attr("disabled",true);
	   pm.index.vm.viewVisible=false;
	   pm.index.vm.rtnVisible=true;
       pm.index.vm.indexVisible=true;
};
pmUtil.addIndex=function(){
    
       newIndexWizard();
	   pm.index.vm.title="新建指标";
	   pm.index.vm.viewVisible=false;
       pm.index.vm. indexVisible=true;
};
pmUtil.modifyIndex=function(index){
    
       newIndexWizard(commonUtil.strToJson(index));
	   pm.index.vm.title="修改指标";
	   pm.index.vm.viewVisible=false;
       pm.index.vm.indexVisible=true;
};
pmUtil.deleteIndex=function(indexId,moTypeId){
        bootbox.confirm($.i18n.prop('com_zte_ums_ict_sm_confirmToDeleteIndex'), function (result) { 
		if (result) {
		    var ids=[];
			var del={};
			ids.push(indexId);
			del.ids=ids;
			$.ajax({			
			"dataType": 'json',
			"type": "DELETE",
			"url": "/api/umcpm/v1/motype/"+moTypeId+"/indexes",
			"data" : JSON.stringify(del),
			"contentType": 'application/json; charset=utf-8',
			"success": function (res, textStatus, jqXHR) {
				window.location.href="./indexView.html";
			},
			"error": function () {
			}
		});
		}
	});
}

pmUtil.idLink = function (obj) {
	var record = obj.aData;
    var thresholdId = new String(record.id);
	return "<a href='#' onclick=\"pm.threshold.vm.queryThreshold('" + thresholdId + "')\">" + thresholdId + "</a>";
}

pmUtil.congfirmDel = function (obj) {
	bootbox.confirm($.i18n.prop('com_zte_ums_ict_sm_confirmToDeleteThreshold'), function (result) { 
		if (result) {
			pm.threshold.vm.deleteThreshold(obj);
		}
	});
}

pmUtil.allOperate = function (obj) {
	
    var record = obj.aData;
    var thresholdId = record.id;
	//此时的id字段已经被渲染成html片段，如<a href="#" onclick="pm.threshold.vm.queryThreshold('10001')">10001</a>需要提取id
	thresholdId = thresholdId.substring(thresholdId.indexOf("('") + 2, thresholdId.indexOf("')"));
	
    var innerHtml = "";
	
	innerHtml = "<div class='table-btn'><span class='modify_user'><a class=\"btn-xs grey btn-editable\" href='#' onclick=\"pm.threshold.vm.modifyThreshold('" +
	thresholdId + "')\"><i class=\"ict-modify\"></i>" + $.i18n.prop('com_zte_ums_ict_pm_action_modify') +
	"</a></span><span><a href='#' class=\"btn-xs grey btn-editable\" onclick=\"pmUtil.congfirmDel('" +
	thresholdId + "')\"><i class=\"ict-delete\"></i>" + $.i18n.prop('com_zte_ums_ict_pm_action_delete') + "</a></span></div>";	

    return innerHtml;
}

//获取QueryId
pmUtil.getUrlParam=function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var search =decodeURIComponent(location.search.substring(1)); //decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
		var r =search.match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); //unescape() 函数可对通过 escape() 编码的字符串进行解码。
		return null; //返回参数值
}


pmUtil.addMeatask = function() {
    newMeataskWizard();
    pm.meatask.vm.pageTitle="新建任务";
    pm.meatask.vm.viewVisible=false;
    pm.meatask.vm.createMeataskVisible=true;
    pm.meatask.vm.queryMeataskVisible=false;
}

pmUtil.meataskOperate = function (obj) {
    var record = obj.aData;
    var meataskId = record.id;
	//此时的id字段已经被渲染成html片段，如<a href="#" onclick="pm.threshold.vm.queryThreshold('10001')">10001</a>需要提取id
	meataskId = meataskId.substring(meataskId.indexOf("('") + 2, meataskId.indexOf("')"));
	
    var innerHtml = "";
	
	innerHtml = 
	[
		"<div class=\"table-btn\">",
			"<span class=\"modify_user\">",
				"<a class=\"btn-xs grey btn-editable\" href=\"#\" onclick=\"pmUtil.queryMeatask('" + meataskId +
					"')\"><i class=\"ict-Magnifier\"></i>",
					$.i18n.prop('com_zte_ums_ict_pm_action_query'),
				"</a>",
			"</span>",
			"<span class=\"modify_user\">",
				"<a class=\"btn-xs grey btn-editable\" href=\"#\" onclick=\"pmUtil.modifyMeatask('" + meataskId + "'," + obj.iDataRow +
					")\"><i class=\"ict-modify\"></i>",
					$.i18n.prop('com_zte_ums_ict_pm_action_modify'),
				"</a>",
			"</span>",
			"<span>",
				"<a href=\"#\" class=\"btn-xs grey btn-editable\" onclick=\"pmUtil.deleteMeatask('" + meataskId + "'," + obj.iDataRow +
					")\"><i class=\"ict-delete\"></i>",
					$.i18n.prop('com_zte_ums_ict_pm_action_delete'),
				"</a>",
			"</span>",
		"</div>"
	].join("\n");
    return innerHtml;
}

pmUtil.getActiveStatus = function(obj) {
	var meataskId = obj.aData.id;
	meataskId = meataskId.substring(meataskId.indexOf("('") + 2, meataskId.indexOf("')"));
	var activeStatus = obj.aData.activeStatus;

	var prefixStr = "";		
	var suffixStr = "";	
	if(activeStatus == 0){
	    prefixStr = "<a  href='#' class=\"label label-sm label-danger\" onclick=\"pm.meatask.vm.changeActiveStatus('"; 
	    suffixStr = ")\">暂停</a>";
	}else{
	    prefixStr = "<a href='#' class=\"label label-sm label-info\" onclick = \"pm.meatask.vm.changeActiveStatus('";
	    suffixStr = ")\">激活</a>";
	}

	var innerHtml = prefixStr + meataskId + "'," + activeStatus + "," + obj.iDataRow + suffixStr;

	return innerHtml;
}

pmUtil.granularityRender = function(obj) {
	var data = obj.aData;
	switch(data.granularity){
		case (300): 
			return "5分钟";
		case (900): 
			return "15分钟";
		case (3600): 
			return "1小时";
	}
	return "5分钟";
}

pmUtil.queryMeatask = function(meataskId) {
	queryMeataskWizard("queryID");
	pm.meatask.vm.pageTitle="查询任务";
    pm.meatask.vm.viewVisible=false;
    pm.meatask.vm.createMeataskVisible=false;
    pm.meatask.vm.queryMeataskVisible=true;
	
	$("#queryMeataskSubmit").click(function() {
        pm.meatask.vm.$showResultTable();
    });
}

pmUtil.meataskIdLink = function(obj) {
	var meatskId = obj.aData.id;
	return "<a href='#' onclick=\"pmUtil.viewMeataskById('" + meatskId + "')\">" + meatskId + "</a>";
}

pmUtil.viewMeataskById = function(meatskId) {
	newMeataskWizard(meatskId);
    pm.meatask.vm.pageTitle="查看任务";
    pm.meatask.vm.viewVisible=false;
    pm.meatask.vm.createMeataskVisible=true;
    pm.meatask.vm.queryMeataskVisible=false;
}

pmUtil.timeRender = function( obj ){
    var time=obj.aData[obj.mDataProp];
	if(time!="0"){
    var date = new Date(obj.aData[obj.mDataProp]);
    return commonUtil.parseDate(date , 'yyyy-MM-dd hh:mm:ss');
	}
};

pmUtil.deleteMeatask=function(meataskId, row){
	bootbox.confirm("确认删除此任务吗？", function (result) { 
		if (result) {
			$("#ict_meatask_table_div tr:eq("+(row+1)+")").attr('style', 'display:none;');
		}
	});
}

pmUtil.modifyMeatask = function(meataskId, row) {
	modifyMeataskWizard("modifyID");
    pm.meatask.vm.pageTitle="修改任务";
    pm.meatask.vm.viewVisible=false;
    pm.meatask.vm.createMeataskVisible=true;
    pm.meatask.vm.queryMeataskVisible=false;
}

pmUtil.randomCPU = function() {
	var percent = Math.random()*100;
	percent = Math.round(percent);
	return percent + "%";
}

pmUtil.calculateTime = function(obj) {
	var data = obj.aData;
	var time = data.beginTime + data.granularity;

	if(time!="0"){
    	var date = new Date(data.granularity * 1000 + obj.aData[obj.mDataProp]);
    	return commonUtil.parseDate(date , 'yyyy-MM-dd hh:mm:ss');
	}
}

pmUtil.queryMeatask = function(meataskId) {
	pm.meatask.vm.pageTitle="查询任务";
    pm.meatask.vm.viewVisible=false;
    pm.meatask.vm.createMeataskVisible=false;
    pm.meatask.vm.queryMeataskVisible=true;
}

pmUtil.setDateRange = function (dataRangeId, vm) {

	var open = 'right';

	//var month = $.i18n.prop('ngict-iui-dateRange-month');

	var optionSet1 = {

		//startDate: moment().subtract(179, 'days'),

		//endDate: moment(),

		startDate : "2015-12-31",

		endDate : "2016-12-31",

		//format: 'YYYY-MM-DD',
		format : 'YYYY-MM-DD h:mm A',

		dateLimit : {
			days : 180
		},

		showWeekNumbers : false,

		timePicker : true,
		timePickerIncrement : 5,

		opens : open,

		separator : ' - ',

		locale : {

			applyLabel : $.i18n.prop('ngict-iui-dateRange-applyLabel'),

			cancelLabel : $.i18n.prop('ngict-iui-dateRange-cancelLabel'),

			fromLabel : $.i18n.prop('ngict-iui-dateRange-fromLabel'),

			toLabel : $.i18n.prop('ngict-iui-dateRange-toLabel'),

			customRangeLabel : $.i18n.prop('ngict-iui-dateRange-customRangeLabel'),

			daysOfWeek : [

				$.i18n.prop('ngict-iui-dateRange-Sunday'),

				$.i18n.prop('ngict-iui-dateRange-Monday'),

				$.i18n.prop('ngict-iui-dateRange-Tuesday'),

				$.i18n.prop('ngict-iui-dateRange-Wednesday'),

				$.i18n.prop('ngict-iui-dateRange-Thursday'),

				$.i18n.prop('ngict-iui-dateRange-Friday'),

				$.i18n.prop('ngict-iui-dateRange-Saturday')],

			//monthNames : ['1' + month, '2' + month, '3' + month, '4' + month, '5' + month, '6' + month, '7' + month, '8' + month, '9' + month, '10' + month, '11' + month, '12' + month],
			
			//months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			
			monthNames: [$.i18n.prop('ngict-iui-dateRange-Jan'),
						 $.i18n.prop('ngict-iui-dateRange-Feb'),
						 $.i18n.prop('ngict-iui-dateRange-Mar'),
						 $.i18n.prop('ngict-iui-dateRange-Apr'),
						 $.i18n.prop('ngict-iui-dateRange-May'),
						 $.i18n.prop('ngict-iui-dateRange-Jun'),
						 $.i18n.prop('ngict-iui-dateRange-Jul'),
						 $.i18n.prop('ngict-iui-dateRange-Aug'),
						 $.i18n.prop('ngict-iui-dateRange-Sep'),
						 $.i18n.prop('ngict-iui-dateRange-Oct'),
						 $.i18n.prop('ngict-iui-dateRange-Nov'),
						 $.i18n.prop('ngict-iui-dateRange-Dec')],

			firstDay : 1

		}

	};

	//datarangepicker确认
	$('input[id="' + dataRangeId + '"]').bind('apply.daterangepicker', function () {

		//获取时间范围，查询

		// 都设置为0点

		pmUtil.setTime($(this));

		// 更新tooltip内容
		//$(this).attr("data-original-title", $(this).val());

	});

	$('input[id="' + dataRangeId + '"]').daterangepicker(optionSet1);

};

//daterangepicker设置时间
pmUtil.setTime = function setTime($obj) {

	//var title = $obj.attr('dtitle');

	var arr = $obj.val().split(' - ');

	//排除日历组件空字符串的情况。

	if (arr[0] != '') {

		var beginTime = new Date(arr[0].replace(/-/g, "/")).getTime();

		var endTime = new Date(arr[1].replace(/-/g, "/")).getTime();
		
		pm.query.vmPmQuery.beginTime = beginTime;

		pm.query.vmPmQuery.endTime = endTime;		

	}

}

pmUtil.formatTime = function formatTime(ms) {
	var date = new Date(ms);
	return date.format("yyyy-MM-dd hh:mm:ss");
}

/*格式化日期*/

Date.prototype.format = function (format) {

	/*

	 * format="yyyy-MM-dd hh:mm:ss";

	 */

	var o = {

		"M+" : this.getMonth() + 1,

		"d+" : this.getDate(),

		"h+" : this.getHours(),

		"m+" : this.getMinutes(),

		"s+" : this.getSeconds(),

		"q+" : Math.floor((this.getMonth() + 3) / 3),

		"S" : this.getMilliseconds()

	}

	if (/(y+)/.test(format)) {

		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4

					 - RegExp.$1.length));

	}

	for (var k in o) {

		if (new RegExp("(" + k + ")").test(format)) {

			format = format.replace(RegExp.$1, RegExp.$1.length == 1

					 ? o[k]

					 : ("00" + o[k]).substr(("" + o[k]).length));

		}

	}

	return format;

}