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
var refreshByCond;
var lang = 'en-US';

avalon.config({
	interpolate: ["<!--", "-->"]
})

refreshByCond = function(){
	vm.$initTable();
};

var vm = avalon.define({
	$id: "curAlarmsController",
	logType: 'secLog',
	severity: '',
	ackState: '',
	filterState: '',
	ruleType: 1,
	curalarmsType: 'curalarms',
	moreCondBtn: false,
	showClear: true,
	dataRangeLocationDisabled:true,
	dataRangeTypeDisabled:true,
	dataRangeCodeDisabled:true,
	alCodeTree_affirm:false,
	alLocationTree_affirm:false,
	alarmCodeSelectedCount: 0,
	alarmLocationSelectedCount: 0,
	alarmTypeSelectedCount: 0,
	tempHide:false,
	treeIcons: [
		"ict-arrowRight",
		"ict-arrowLeft",
		"ict-selectLeft"
	],

	severityTypes: [
		{id: '1', name: $.i18n.prop("ngict_fm_iui_curalarm_critical"), value: true, type: "severityTypes", class: "alarm-serious"},
		{id: '2', name: $.i18n.prop("ngict_fm_iui_curalarm_major"), value: true, type: "severityTypes", class: "alarm-important"},
		{id: '3', name: $.i18n.prop("ngict_fm_iui_curalarm_minor"), value: true, type: "severityTypes", class: "alarm-secondary"},
		{id: '4', name: $.i18n.prop("ngict_fm_iui_curalarm_warning"), value: true, type: "severityTypes", class: "alarm-slightly"}
	],

	ackStateTypes: [
		{id: '1', name: $.i18n.prop("ngict_fm_iui_curalarm_ackAlarm"), value: false, type: "ackStateTypes"},
		{id: '2', name: $.i18n.prop("ngict_fm_iui_curalarm_unackAlarm"), value: true, type: "ackStateTypes"}
	],

	filterStateTypes: [
		{id: '1', name: $.i18n.prop("ngict_fm_iui_curalarm_visible"), value: true, type: "filterStateTypes"},
		{id: '0', name: $.i18n.prop("ngict_fm_iui_curalarm_invisible"), value: false, type: "filterStateTypes"}
	],

	alTypes:[
		"Communications Alarm",
		"Processing Error Alarm",
		"Quality of Service Alarm",
		"Equipment Alarm",
		"Environmental Alarm",
		"OMC Alarm",
		"Integrity Violation",
		"Operational Violation",
		"Physical Violation",
		"Security Violation",
		"Time Domain Violation"
	],

	$alarmsTableFields: {
		curalarms: [
			{"mData": null,name: "<input id='dataTableCheckBox' type='checkBox'/>","sClass": 'details-check',"sWidth": '5%',"fnRender": alarmsUtil.checkBox},
			{"mData": "order", name: $.i18n.prop("ngict_fm_iui_curalarm_order"),"sClass": 'details-control', "sWidth": '6%'},
			{"mData": "id", sWidth : "10%",name: $.i18n.prop("ngict_fm_iui_curalarm_id"),"bVisible": true},
			{"mData": "position1DisplayName", sWidth : "10%",name:$.i18n.prop("ngict_fm_iui_curalarm_ne")},
			{"mData": "mocName",sWidth : "14%", name: $.i18n.prop("ngict_fm_iui_curalarm_moc")},
			{"mData": "probableCauseCodeNameAndCode", 	sWidth : "14%",name: $.i18n.prop("ngict_fm_iui_curalarm_probableCauseCode")},
			{"mData": "alarmRaisedTime", sWidth : "15%",name: $.i18n.prop("ngict_fm_iui_curalarm_alarmRaisedTime"),"fnRender": alarmsUtil.timeRender},
			{"mData": "perceivedSeverity",sWidth : "10%", name: $.i18n.prop("ngict_fm_iui_curalarm_perceivedSeverity"),fnRender:alarmsUtil.Severity},
			{"mData": "alarmType",sWidth : "10%", name: $.i18n.prop("ngict_fm_iui_curalarm_alarmType"),"bVisible": false},
			{"mData": "ackState",sClass:"ackState",sWidth : "10%", name: $.i18n.prop("ngict_fm_iui_curalarm_ackState"),"fnRender":alarmsUtil.ackState},
			{"mData": "ackTime", sWidth : "13%",name: $.i18n.prop("ngict_fm_iui_curalarm_ackTime"),"fnRender": alarmsUtil.timeRender,"bVisible": false},
			{"mData": "position1", name: $.i18n.prop("ngict_fm_iui_curalarm_position1"),"bVisible": false},
			{"mData": "alarmChangedTime", name: $.i18n.prop("ngict_fm_iui_curalarm_alarmChangedTime"),"bVisible": false,"fnRender": alarmsUtil.timeRender},
			{"mData": "ackUserId", name: $.i18n.prop("ngict_fm_iui_curalarm_ackUserId"),"bVisible": false},
			{"mData": "ackSystemId", name: $.i18n.prop("ngict_fm_iui_curalarm_ackSystemId"),"bVisible": false},
			{"mData": "alarmClearedTime", name: $.i18n.prop("ngict_fm_iui_curalarm_alarmClearedTime"),"bVisible": false,"fnRender": alarmsUtil.timeRender},
			{"mData": "additionalText", name: $.i18n.prop("ngict_fm_iui_curalarm_additionalText"),"bVisible": false},
			{"mData": "ackSystemId", name: $.i18n.prop("ngict_fm_iui_curalarm_ackSystem"),"bVisible": false},
			{"mData": "clearUserId", name: $.i18n.prop("ngict_fm_iui_curalarm_clearUserId"),"bVisible": false},
			{"mData": "clearSystemId", name: $.i18n.prop("ngict_fm_iui_curalarm_clearSystemId"),"bVisible": false},
			{"mData": "clearType", name: $.i18n.prop("ngict_fm_iui_curalarm_clearType"),"bVisible": false},
			{"mData": "probableCauseCode", name: $.i18n.prop("ngict_fm_iui_curalarm_probableCauseCode"),"bVisible": false},
			{"mData": "specificProblem", name: $.i18n.prop("ngict_fm_iui_curalarm_specificProblem"),"bVisible": false},
			{"mData": "neIp", name: $.i18n.prop("ngict_fm_iui_curalarm_neIp"),"bVisible": false},
			{"mData": "pathIds", name: $.i18n.prop("ngict_fm_iui_curalarm_pathIds"),"bVisible": false},
			{"mData": "pathName", name: $.i18n.prop("ngict_fm_iui_curalarm_pathName"),"bVisible": false}
		],
	},

	$language: {
		"sProcessing": "<img src='../common/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;处理中...</span>",
		"sLengthMenu": $.i18n.prop("ngict-fm-iui-table-sLengthMenu"),
		"sZeroRecords": $.i18n.prop("ngict-fm-iui-table-sZeroRecords"),
		"sInfo": "<span class='seperator'></span>" + $.i18n.prop("ngict-fm-iui-table-sInfo"),
		"sInfoEmpty": $.i18n.prop("ngict-fm-iui-table-sInfoEmpty"),
		"sGroupActions": $.i18n.prop("ngict-fm-iui-table-sGroupActions"),
		"sAjaxRequestGeneralError": $.i18n.prop("ngict-fm-iui-table-sAjaxRequestGeneralError"),
		"sEmptyTable": $.i18n.prop("ngict-fm-iui-table-sEmptyTable"),
		"oPaginate": {
			"sPrevious": $.i18n.prop("ngict-fm-iui-table-sPrevious"),
			"sNext": $.i18n.prop("ngict-fm-iui-table-sNext"),
			"sPage": $.i18n.prop("ngict-fm-iui-table-sPage"),
			"sPageOf": $.i18n.prop("ngict-fm-iui-table-sPageOf")
		}
	},

	$queryAlarmsInfoUrl: '/openoapi/umc/v1/fm/curalarms',
	$saveCondUrl: '/web/rest/web/fm/rules?isc_dataFormat=json',
	fmConds: {},
	$sunburstSetting: {width: 450, height: 400},

	$getLogCond: function(){
		var cond = {};
		var severitys = [];
		var ackState = [];
		var filterState = [];
		for (var i = 0; i < vm.severityTypes.length; i++) {
			vm.severityTypes[i].value ? severitys.push(vm.severityTypes[i].id) : null;
		};
		for (var i = 0; i < vm.ackStateTypes.length; i++) {
			vm.ackStateTypes[i].value ? cond.ackState = ackState.push(vm.ackStateTypes[i].id) : null;
		};
		for (var i = 0; i < vm.filterStateTypes.length; i++) {
			vm.filterStateTypes[i].value ? cond.filterState = filterState.push(vm.filterStateTypes[i].id) : null;
		};
		cond.severity = severitys;
		cond.ackState = ackState;
		cond.filterState = filterState;
		cond.location=vm.fmConds.location;
		cond.ackTimeStarTime = vm.fmConds.ackTimeStarTime;
		cond.ackTimeEndTime = vm.fmConds.ackTimeEndTime;
		cond.ackRelativeTime = vm.fmConds.ackRelativeTime;
		cond.ackTimeMode = vm.fmConds.ackTimeMode;
		cond.alarmRaisedStartTime = vm.fmConds.alarmRaisedStartTime;
		cond.alarmRaisedEndTime = vm.fmConds.alarmRaisedEndTime;
		cond.alarmRaisedRelativeTime = vm.fmConds.alarmRaisedRelativeTime;
		cond.alarmRaisedTimeMode = vm.fmConds.alarmRaisedTimeMode;
		cond.clearedTimeStarTime = vm.fmConds.clearedTimeStarTime;
		cond.clearedTimeEndTime = vm.fmConds.clearedTimeEndTime;
		cond.clearedTimeMode = vm.fmConds.clearedTimeMode;
		cond.probableCause = vm.fmConds.probableCause;
		cond.alarmType = vm.fmConds.alarmType;
		cond.ruleType = vm.ruleType;
		return cond;
	},

	$initRegister: function(){
		$('#alCode .condSelect').click(function(){
			$('#alCodeTree').modal('show');
		});

		$('#alCodeTree').on('hide.bs.modal', function(){
			$table = $("#selectedProbableCausesTreeTable");
			if(vm.alCodeTree_affirm===false){
				$('#selectedProbableCausesTreeTable tbody').children().remove();
				for(i=0;i<alarmTemp.length;i++){
					$table.append(alarmTemp[i]);
				}
			}
			vm.alCodeTree_affirm=false;
		});

		$('#alCodeTree').on('show.bs.modal', function(){
			vm.alCodeTree_affirm=false;
			alarmTemp=[];
			var $trs=$("#selectedProbableCausesTreeTable tr");
			if($trs.length!=0){
				for(var i=0;i<$trs.length;i++){
					alarmTemp.push($trs.eq(i)[0].outerHTML);
				}
				$('#selectedProbableCausesTreeTable td').on("click", function(){
					var $tds = $('#selectedProbableCausesTreeTable td');
					for (var i = 0; i < $tds.length; i++) {
						$tds.eq(i).removeClass('tallCellSelected');
						$tds.eq(i).parent().removeClass('checked');
					}
					$(this).addClass('tallCellSelected');
					$(this).parent().addClass("checked");
				});
			}	
		})

		$('#alType .condSelect').click(function(){
			$('#alTypeTree').modal('show');
		});

		//告警位置初始化
		$('#alLocation .condSelect').click(function(){
			$('#alLocationTree').modal('show');
		});

		$('#alLocationTree').on('hide.bs.modal', function(){
			$table = $("#selectedDeptTreeTable");
			if(vm.alLocationTree_affirm===false){
				$('#selectedDeptTreeTable tbody').children().remove();
				for(i=0;i<alarmTemp.length;i++){
					$table.append(alarmTemp[i]);
				}
			}
			vm.alLocationTree_affirm=false;
		});

		$('#alLocationTree').on('show.bs.modal', function(){
			vm.alLocationTree_affirm=false;
			alarmTemp=[];
			var $trs=$("#selectedDeptTreeTable tr");
			if($trs.length!=0){
				for(var i=0;i<$trs.length;i++){
					alarmTemp.push($trs.eq(i)[0].outerHTML);
				}
			}
			$('#selectedDeptTreeTable td').on("click", function(){
				var $tds = $('#selectedDeptTreeTable td');
				for (var i = 0; i < $tds.length; i++) {
					$tds.eq(i).removeClass('tallCellSelected');
					$tds.eq(i).parent().removeClass('checked');
				}
				$(this).addClass('tallCellSelected');
				$(this).parent().addClass("checked");
			});
		})

		$(document).on("click", function(e){ 
			var target = $(e.target);
			if(target.closest("#alLocationTree").length == 0 && target.closest("#alLocation .condSelect").length==0){
				$("#alLocationTree").fadeOut();
			}
			if(target.closest("#alCodeTree").length == 0 && target.closest("#alCode .condSelect").length==0){
				$('#alCodeTree').fadeOut();
			}
			if(target.closest("#alTypeTree").length == 0 && target.closest("#alType .condSelect").length==0){
				$('#alTypeTree').fadeOut();
			}
		});

		 //主表格确认
		$('#affirm').hover(function(){
			$('#affirmTrip').show();
		},function(){
			$('#affirmTrip').hide();
		});

		//主表格反确认
		$('#unAffirm').hover(function(){
			$('#unAffirmTrip').show();
		},function(){
			$('#unAffirmTrip').hide();
		});

		 //初始化 checkBox
		 $('.confirmTime input[type="radio"]').iCheck({
			radioClass: 'iradio_square-aero',
			increaseArea: '20%'
		 });
 
		//告警类型树的选项被选中时
		$('#selectedAlTypeTable input[type="checkBox"]').on("ifChecked", function(){
			$(this).parent().parent().addClass('tallCellSelected');
		});

		//告警类型未被选中时
		 $('#selectedAlTypeTable input[type="checkBox"]').on("ifUnchecked", function(){
			$(this).parent().parent().removeClass('tallCellSelected');
		});
	},

	$initTable: function(){
		var setting = {};
		setting.language = vm.$language;
		setting.columns = vm.$alarmsTableFields[vm.curalarmsType];
		setting.restUrl = vm.$queryAlarmsInfoUrl;
		setting.tableId = "ict_alarms_table";
		serverPageTable.initDataTable(setting, vm.$getLogCond(), 'ict_alarms_table_div');
	},

	condChange: function(){
		refreshByCond();
	},

	moreCondClicked: function(){
		$('#moreCond').fadeToggle();
		var icon = $(this).children('span').eq(0);
		if ($(this).hasClass('blueactive')) {
			vm.moreCondBtn = false;
			icon.removeClass('borderBottom');
			icon.addClass('borderBotTop');
			$("div.fliterline").show();
		} else {
			vm.moreCondBtn = true;
			icon.removeClass('borderTop');
			icon.addClass('borderBottom');
			$("div.fliterline").hide();
		}
	},

	alarmsCondSave: function(){
		if ($('#saveCondId').val() != null && $.trim($('#saveCondId').val()) != '') {
			var name = $('#saveCondId').val();
			alarmsUtil.condSave(vm.$getLogCond(), vm.$saveCondUrl, name);
		}
	},

	saveModal: function(){
		$('#myModal').modal('show');
	},

	searchModal: function(){
		refreshByCond();
	},

	tabClicked: function(modelItem, item){
		if (!modelItem.value) {
			modelItem.value = true;
		} else {
			modelItem.value = false;
		}
		refreshByCond();
	},

	moveTreeNode: function(item){
		 alarmsUtil.moveNode(item);
	},

	//告警位置——确认
	deptTreeAffirm: function(){
		var selectName="";
		var locationObj=[];
		var $tds= $("#selectedDeptTreeTable td");
		for (var i = 0; i < $tds.length; i++) {
			var obj={};
			obj.id=$tds.eq(i).attr('nodeid');
			obj.oid=$tds.eq(i).attr('oid');
			locationObj.push(obj);
			if(i==0){
				selectName+=$tds.eq(i).text();
			}else{
				selectName+=","+$tds.eq(i).text();
			}
		};
		vm.fmConds.location=locationObj;
		vm.alarmLocationSelectedCount=locationObj.length;
		vm.alLocationTree_affirm=true;
		$('#alLocationTree').modal('hide')
	},

	//告警码树 确认
	probableCausesTreeAffirm: function(){
		var selectName="";
		var probableCause=[];
		var $tds= $("#selectedProbableCausesTreeTable td");
		var systemType=[];
		for (var i = 0; i < $tds.length; i++) {
			var obj={};
			obj.codeid=$tds.eq(i).attr('codeid');
			obj.parentid=$tds.eq(i).attr('parentid');
			obj.type=$tds.eq(i).attr('type');
			probableCause.push(obj);
		};
		vm.fmConds.probableCause=probableCause;
		vm.alarmCodeSelectedCount = probableCause.length;
		vm.alCodeTree_affirm=true;
		$('#alCodeTree').modal('hide');
	},

	//告警类型 确认
	alTypeTreeAffirm: function(){
		var selectName="";
		var alType=[];
		var $tds=$("#selectedAlTypeTable td.tallCellSelected");
		for (var i = 0; i < $tds.length; i++) {
			var obj={};
			alType.push(obj);
			if(i==0){
				selectName+=$tds.eq(i).text();
			}else{
				selectName+=","+$tds.eq(i).text();
			}
		};
		vm.fmConds.alType=alType;
		if(selectName!=""){
			$('#alType .condSelect :selected').text(selectName);
		}else{
			$('#alType .condSelect :selected').text("请选择告警类型");
		}
		vm.alarmTypeSelectedCount = alType.length;
		//$('#alTypeTree').fadeOut();
		$('#alTypeTree').modal('hide')
	}
});

//初始化 告警类型
initAlTypeTable = function(){
	var html = "";
	for (var i = 0; i < vm.alTypes.length; i++) {
		html += "<tr><td><input type='checkbox'>" + vm.alTypes[i] + "</td></tr>";
	};
	$('#selectedAlTypeTable').append(html);
}

initPage = function(){
	bootbox.setDefaults({
		locale: lang.replace("-", "_")
	});
	//自定义确认时间组件
	alarmsUtil.setDateRange("daterangeConfirm", vm);
	alarmsUtil.dateRangeEnableDisable("customAckTime");
	//自定义发生时间组件
	alarmsUtil.setDateRange("daterangeOccur", vm);
	alarmsUtil.dateRangeEnableDisable("customRaisedTime");
	//高级菜单界面中，对告警发生时间、确认时间、清除时间初始化
	alarmsUtil.dateRangeCustom(vm);
	//告警码树初始化
	alarmsUtil.initTree();
	//告警类型初始化
	initAlTypeTable();
	vm.$initRegister();
	refreshByCond();
	localStorage.setItem("curRuleDataId",0);
}

initPage();
