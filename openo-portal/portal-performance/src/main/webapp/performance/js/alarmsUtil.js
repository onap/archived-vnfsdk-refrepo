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
var alarmsUtil = {};
var alarmTemp=[];

alarmsUtil.timeRender = function (obj) {
	if (obj.aData[obj.mDataProp] == -1 || obj.aData[obj.mDataProp] == 0) {
		return "";
	} else {
		var date = new Date(obj.aData[obj.mDataProp]);
		return commonUtil.parseDate(date, 'yyyy-MM-dd hh:mm:ss');
	}
};

alarmsUtil.LinkRender = function (obj) {
	return '<a href="">' + obj.aData[obj.mDataProp] + '</a>';
};
 
alarmsUtil.ackState = function (obj) {
	
	var innerHtml = "";
	var ackState = obj.aData.ackState;
	var alarmId = obj.aData.id;
	var alarmIdArr = [alarmId];
	var tableId="\'" + obj.oSettings.sTableId + "\'";
	var divId="\'" + obj.oSettings.nTableWrapper.parentElement.id + "\'";
	if (ackState == "1" && vm.ruleType == 1) {
		innerHtml = "<a class=\"label label-sm label-info\"   onclick=\" alarmsUtil.unaffirm([" + alarmIdArr + "]," + tableId + "," + divId + ","+obj.iDataRow+")  \">Acknowledge</a>";
	} else if(ackState == "1" && vm.ruleType == 2){
		innerHtml = "<div class=\"label label-sm label-info\">Acknowledge</div>";
	} else if(ackState == "2" ){
		innerHtml = "<a class=\"label label-sm acknow-purple\"    onclick=\" alarmsUtil.affirm([" + alarmIdArr + "]," + tableId + "," + divId + ","+obj.iDataRow+")\">Unacknowledge</a>";
	} 
	return innerHtml;
};

alarmsUtil.Severity = function (obj) {

	var innerHtml = "";
	var Severity = obj.aData.perceivedSeverity;
	if (Severity == "1") {
		innerHtml = "<span style=\"color:#E24949 \"  class=\"ict-alarm \" ></span><sapn  \">Critical</sapn>";
	} else if (Severity == "2") {
		innerHtml = "<span style=\"color:#E59313 \" class=\"ict-alarm\" ></span><sapn \">Major</sapn>";
	} else if (Severity == "3") {
		innerHtml = "<span style=\"color:#F7E51B \" class=\"ict-alarm\" ></span><sapn  \">Minor</sapn>";
	} else if (Severity == "4") {
		innerHtml = "<span style=\"color:#61C2DE \" class=\"ict-alarm\" ></span><sapn \">Warning</sapn>";
	}
	return innerHtml;

};

alarmsUtil.operate = function (obj) {

	var alarmId = obj.aData.alarmId;
	return "<div class='row col-xs-12'><div><a href='#' class=\"btn-xs grey btn-editable\" onclick=\" alarmsUtil.congfirms('" + alarmId + "')\"><i class=\"ict-delete\"></i>清除</a></div></div>";

};

alarmsUtil.congfirms = function (alarmId) {

	bootbox.confirm('你确定要删除该告警吗？', function (result) { //你确定要删除该用户吗？

		if (result) {
			var sSource = "/web/rest/web/fm/curalarms?data={\"alarmId\":" + alarmId + "}&_dataSource=isc_PageRestDataSource_0&isc_metaDataPrefix=_&isc_dataFormat=json&_operationType=remove&_componentId=isc_com_zte_ums_aos_fm_view_eventview_table_AlarmTable_0";
			$.ajax({
				dataType : "json",
				type : "DELETE",
				//数据格式：[tab标签id,tabItem的名字,图片路径,tabItem的描述,更多的LInk地址]
				contentType : 'application/json; charset=utf-8',
				url : sSource,
				data : null,
				async : false,
				success : function (msg) {
					setTimeout(function () {
						refreshByCond();
					}, 500);
				}
			});
		}

	});

};

alarmsUtil.allOperate = function (obj) {

	var record = obj.aData;
	var hasModify = commonUtil.hasRigth('uep.pfl.sm.updateuser');
	var hasDel = commonUtil.hasRigth('uep.pfl.sm.deluser');
	var selectUsername = new String(record.userName);
	var innerHtml = "";
	
	// 如果有权限，显示操作列
	if (hasModify) {
		if (hasDel && selectUsername != "admin") {
			innerHtml = "<div class='row col-xs-12'><div class='col-xs-6 modify_user'><a class=\"btn-xs grey btn-editable\" href='#' onclick=\"vm.modifyUser('" + selectUsername + "')\"><i class=\"ict-modify\"></i>修改</a></div><div class='col-xs-6'><a href='#' class=\"btn-xs grey btn-editable\" onclick=\"smUtil.congfirms('" + selectUsername + "')\"><i class=\"ict-delete\"></i>删除</a></div></div>";
		} else {
			innerHtml = "<div class='row col-xs-12'><div class='col-xs-6 modify_user'><a class=\"btn-xs grey btn-editable\" href='#' onclick=\"vm.modifyUser('" + selectUsername + "')\"><i class=\"ict-modify\"></i>修改</a></div>";
		}
	}

	return innerHtml;

};

alarmsUtil.refresh = function () {

	refreshByCond();

}

/*

1.确认

2.反确认

 */

alarmsUtil.loopAffirm = function (type) {

	var checkArr = $('#ict_alarms_table_div .details-check input[type="checkbox"]');
	var aidArr = [];
	for (var i = 0; i < checkArr.length; i++) {
		if($(checkArr[i]).prop("checked")){
			if ($(checkArr[i]).attr('alarmId') != 'undefined' && $(checkArr[i]).attr('alarmId') != null) {
				aidArr.push($(checkArr[i]).attr('alarmId'));
			}
		}
	}

	if (type == "1" && aidArr.length > 0) {
		alarmsUtil.affirm(aidArr);
	} else if (type == "2" && aidArr.length > 0) {
		alarmsUtil.unaffirm(aidArr);
	}

}

/*



 */

alarmsUtil.loopDelAralms = function () {

	var checkArr = $('#ict_alarms_table_div .details-check input[type="checkbox"]');
	var aidArr = [];
	for (var i = 0; i < checkArr.length; i++) {
		if($(checkArr[i]).prop("checked")){
			if ($(checkArr[i]).attr('alarmId') != 'undefined' && $(checkArr[i]).attr('alarmId') != null) {
				aidArr.push($(checkArr[i]).attr('alarmId'));
			}
		}
	}

	if (aidArr.length > 0) {
		bootbox.confirm('Are you sure to delete alarm(s)', function (result) { 
			if (result) {
				var sSource = "/api/umcfm/v1/curalarms?request={\"ids\":["+ aidArr +"]}";
				$.ajax({
					type : "DELETE", 
					dataType : "json",
					contentType : 'application/json; charset=utf-8',
					url : sSource,
					data : null,
					async : false,
					success : function (msg) {
						setTimeout(function () {
							refreshByCond()
						}, 500);
					}
				});
			}
		});
	}
}

alarmsUtil.affirm = function (alarmIdArr,tableId,divId) {

	var getData = {};
	var request = {};
	request.ids=[];
	for(i=0;i<alarmIdArr.length;i++){
		request.ids.push(alarmIdArr[i]);
	}
	var url = "";
	if (vm.ruleType == 1) { //当前告警
		request.ackState=1;
		getData.request = JSON.stringify(request);
		url = "/api/umcfm/v1/curalarms";
	} else { //历史告警
		url = "/ngict/rest/fm/hisalarms"
	}

	$.ajax({
		type : "PUT",
		contentType : 'application/json; charset=utf-8',
		url : url + "?" + "request=" + JSON.stringify(request),
		async : false,
		success : function (msg) {
			setTimeout(function () {
				refreshByCond(tableId,divId);
			}, 100);
		},	
		error : function(msg){
			setTimeout(function () {
				refreshByCond(tableId,divId);
			}, 100);	
		}
	});

}

alarmsUtil.unaffirm = function (alarmIdArr,tableId,divId) {

	var getData = {};
	var request = {};
	request.ids=[];
	for(i=0;i<alarmIdArr.length;i++){
		request.ids.push(alarmIdArr[i]);
	}
	request.ackState=2;
	getData.request = JSON.stringify(request);
	var url = "";
	if (vm.ruleType == 1) { //当前告警
		url = "/api/umcfm/v1/curalarms";
		$.ajax({
			"type" : "PUT",
			"contentType" : 'application/json; charset=utf-8',
			"url" : url + "?request=" + JSON.stringify(request),
			async : false,
			success : function (msg) {
				setTimeout(function () {
					refreshByCond(tableId,divId);
				}, 100);
			},
			error : function(msg){		
				setTimeout(function () {
					refreshByCond(tableId,divId);
				}, 100);		
			}
		});
	} 

	
	
}

alarmsUtil.checkBox = function (obj) {

	var alarmId = obj.aData.id;
	var innerHtml = '<input type="checkbox" alarmId="' + alarmId + '"/> ';
	return innerHtml;
}

//初始化告警码树
alarmsUtil.initProbableCausesTree = function () {
	//zTree设置
	var setting = {
		view : {
			selectedMulti : false, //设置是否可以同时选中多个借点。
			showIcon : true, //不显示图标
			showLine : false, //是否显示节点之间的连线
		},
		data : {
			simpleData : {
				enable : true //如果设置为 true，请务必设置 setting.data.simpleData 内的其他参数: idKey / pIdKey / rootPId，并且让数据满足父子关系。
			}
		},
		callback : {
			onExpand : zTreeOnExpand, //每次节点展开后触发的事件。
			onCollapse : zTreeOnCollapse,
			//onClick: zTreeOnClick
		}
	};
	var probableCausesNodes;
	
	//获取告警码树数据
	getProbableCausesTreeNodes("");
	//创建告警码树
	$.fn.zTree.init($("#probableCausesTree"), setting, probableCausesNodes);
	//获取所有现有的tree节点
	var treeObj = $.fn.zTree.getZTreeObj("probableCausesTree");
	initDataAtTree();
	function initDataAtTree(){
		getAllNodesWithoutTypeEqual2("")		
	};
	
	function getAllNodesWithoutTypeEqual2(parentId){
		var treeNodes=treeObj.getNodesByParam("parentId", parentId, null);
		for(var i=0;i<treeNodes.length;i++){
			if(treeNodes[i].type===0){
				getProbableCausesTreeNodes(treeNodes[i].id);
				addNodesToTree(treeNodes[i],"probableCausesTree");
				getAllNodesWithoutTypeEqual2(treeNodes[i].id);
			}
		}
	}

	function zTreeOnExpand(event, treeId, treeNode) {
		var childrenNodes = treeNode.children;
		if (!childrenNodes) { //当没有子节点的时候才加载，否则会重复加载。
			getProbableCausesTreeNodes(treeNode.id);
			addNodesToTree(treeNode,treeId);
		}
	};
	
	function addNodesToTree(treeNode, treeId) {
		var obj = $.fn.zTree.getZTreeObj(treeId);
		var node=obj.getNodeByParam("id", treeNode.id, null)
		obj.addNodes(node, probableCausesNodes);
	};

	function zTreeOnCollapse(event, treeId, treeNode) {};

	//告警信息中的type为0、1是父节点，2为子节点
	function isParentNode(type) {
		if (type != 2)
			return true;
		else
			return false;
	};
	
	function constructProblemCauseName(node){
		if(node.type===0){
			return node.desc;
		}else{
			return node.desc + "(" + node.value + ")";
		}
	}

	function getProbableCausesTreeNodes(alarmCodeParentId) {
		probableCausesNodes = new Array();
		var getData = {};
		var request = {};
		request.parentId = alarmCodeParentId;
		getData.request = JSON.stringify(request);
		$.ajax({
			async : false,
			"dataType" : 'json',
			"type" : "GET",
			"url" : "/api/umcfm/v1/probablecausestree",
			"data" : getData,
			"contentType" : 'application/json; charset=utf-8',
			"success" : function (res, textStatus, jqXHR) {
				var nodes = res;
				chkDisabled = false;
				if (nodes) {
					for (var i = 0; i < nodes.length; i++) {
						probableCausesNodes.push({
							id : nodes[i].id,
							pId : nodes[i].parentId,
							name : constructProblemCauseName(nodes[i]),
							chkDisabled : false,
							isParent : isParentNode(nodes[i].type),
							parentId : alarmCodeParentId,//treenode节点
							codeId : nodes[i].value,
							type : nodes[i].type
						});
					}
				}
			},
			"error" : function () {}
		});
	}
}

//初始化位置树
alarmsUtil.initDeptTree = function () {
	//zTree设置
	var setting = {
		view : {
			selectedMulti : false, //设置是否可以同时选中多个借点。
			showIcon : true, //不显示图标
			showLine : false, //是否显示节点之间的连线
		},
		data : {
			simpleData : {
				enable : true //如果设置为 true，请务必设置 setting.data.simpleData 内的其他参数: idKey / pIdKey / rootPId，并且让数据满足父子关系。
			}
		},
		callback : {
			onExpand : zTreeOnExpand, //每次节点展开后触发的事件。
			onCollapse : zTreeOnCollapse,
			//onClick: zTreeOnClick
		}
	};
	var zNodes = [];
	initDeptTree();
	function initDeptTree() {
		zNodes.push({
			id:"VDU",
			name:"VDU",
			isParent:true
		},
		{
			id:"HOST",
			name:"HOST",
			isParent:true
		});
		$.fn.zTree.init($("#deptTree"), setting, zNodes);
		zNodes=[];
	}
	function getDeptTreeNode(alarmCodeParentId) {
		if(alarmCodeParentId === "VDU"){
			url="/api/roc/v1/resource/vdus";
		}else if(alarmCodeParentId === "HOST"){
			url="/api/roc/v1/resource/hosts";
		}
		$.ajax({
			async : false,
			"dataType" : 'json',
			"type" : "GET",
			"url" : url,
			"contentType" : 'application/json; charset=utf-8',
			"success" : function (res, textStatus, jqXHR) {
				var nodes = res.data;
				if (nodes) {
					for (var i = 0; i < nodes.length; i++) {
						zNodes.push({
							id : nodes[i].oid,
							parentId : alarmCodeParentId,//treenode节点
							name : nodes[i].name,
							isParent : false,
							oid:nodes[i].oid
						});
					}
				}
			},
			"error" : function () {}
		});
	}
	function zTreeOnExpand(event, treeId, treeNode) {
		getDeptTreeNode(treeNode.id);
		addNodesToTree(treeNode,treeId);
		zNodes=[];
	};
	function addNodesToTree(treeNode, treeId) {
		var obj = $.fn.zTree.getZTreeObj(treeId);
		var node=obj.getNodeByParam("id", treeNode.id, null)
		obj.addNodes(node, zNodes);
	};
	function zTreeOnCollapse(event, treeId, treeNode) {};
}

//初始化所有的树
alarmsUtil.initTree = function () {
	//初始化告警码树和告警位置树
	alarmsUtil.initProbableCausesTree();
	alarmsUtil.initDeptTree();
	
	function initFormData(ruleType) {

		$("#confirmAction").hide();
		$("#filterType").hide();
		$("#action").hide();
		if (ruleType == "alarmFilter") {
			$("#filterType").show();
		} else if (ruleType == "ack") {
			$("#confirmAction").show();
		} else if (ruleType == "forward") {
			$("#action").show();
		}

	}

	function getNumbers(rule) {

		for (var i = 0; i < textValues.length; i++) {
			rule[textValues[i]] = $("input[name='" + textValues[i] + "']").val();
		}

	}

	function getCheckboxs(rule) {

		for (var i = 0; i < else_checkboxNames.length; i++) {
			rule[else_checkboxNames[i]] = $("input[name='" + else_checkboxNames[i] + "']").parent().hasClass('checked');
		}
		for (var item in checkboxNames_pair_spinnerIds) {
			rule[item] = $('#' + checkboxNames_pair_spinnerIds[item]).val();
		}
	}

	function setCheckboxs(rule) {

		for (var item in checkboxNames_pair_spinnerIds) {
			var value = 0;
			if (rule != "") {
				value = rule[item];
			}
			$('#' + item).val(value);
			setSpinnerIsEnable(item, value);
		}
		for (var i = 0; i < else_checkboxNames.length; i++) {
			$("input[name='" + else_checkboxNames[i] + "']").parent().iCheck(rule[else_checkboxNames[i]] ? 'check' : 'uncheck');
		}
	}
}

alarmsUtil.moveNode = function (item) {
	if (item.hasClass("ict-arrowRight")) {
		alarmsUtil.rightNode(item);
	} else if (item.hasClass("ict-arrowLeft")) {
		alarmsUtil.leftNode(item);
	} else {
		alarmsUtil.removeAll(item);
	}
}

/*树添加信息到右侧的功能*/

alarmsUtil.rightNode = function (item) {

	var selecedNodeIds = [];
	var treeType = item.attr('treeType');
	var obj = $.fn.zTree.getZTreeObj(treeType);
	var treeNodes = obj.getSelectedNodes();
	var $table;

	if (treeType == "deptTree") {
		var $tds = $("#selectedDeptTreeTable  td");
		$table = $("#selectedDeptTreeTable");
		for (var i = 0; i < $tds.length; i++) {
			selecedNodeIds.push($tds.eq(i).attr('nodeid'));
		}
	} else if (treeType == "probableCausesTree") {
		var $tds = $("#selectedProbableCausesTreeTable  td");
		$table = $("#selectedProbableCausesTreeTable");
		for (var i = 0; i < $tds.length; i++) {
			var systemTypeAndProbableCause={};
			systemTypeAndProbableCause.codeId=$tds.eq(i).attr('codeId');
			systemTypeAndProbableCause.parentid=$tds.eq(i).attr('parentid');
			systemTypeAndProbableCause.type=$tds.eq(i).attr('type');
			selecedNodeIds.push(systemTypeAndProbableCause);
		}
	}
	
	//树上被选中的元素
	for (var i = 0; i < treeNodes.length; i++) {

		var htmlStr = "";
		var text = treeNodes[i].name;
		var id = treeNodes[i].id;
		var codeId = treeNodes[i].codeId;
		var type;
		var parentId;
		if (treeType == "deptTree") {
			var oid = treeNodes[i].oid;
			htmlStr = "<tr><td nodeId=" + id + "  oid=" + oid + "  >" + text + "</td></tr>";
		} else if (treeType == "probableCausesTree") {

			parentId = treeNodes[i].parentId;
			type = treeNodes[i].type;
			htmlStr = "<tr><td codeId=" + codeId + "  parentId=" + parentId + " type=" + type + "  >" + text + "</td></tr>";
		}
		
		if(treeType == "probableCausesTree"){
			if(treeNodes[i].type === 2){
				for(i=0;i<selecedNodeIds.length;i++){
					if(selecedNodeIds[i].codeId === codeId || selecedNodeIds[i].codeId === parentId){
						bootbox.alert("此节点（子树）或其父子树已经被添加！", function () {});
						return;
					}
				}
			}else if(treeNodes[i].type === 1){
				$('#selectedProbableCausesTreeTable [parentid='+codeId+']').remove();
				for(i=0;i<selecedNodeIds.length;i++){
					if(selecedNodeIds[i].codeId === codeId ){
						bootbox.alert("此节点（子树）或其父子树已经被添加！", function () {});
						return;
					}
				}
			}else if(treeNodes[i].type === 0){
				bootbox.alert("不支持添加MOC", function () {});
				break;
			}
		}

		$table.append(htmlStr);

	}

	$('#selectedDeptTreeTable td').on("click", function () {

		//获得所有选择的td
		var $tds = $('#selectedDeptTree td');
		//遍历改变样式
		for (var i = 0; i < $tds.length; i++) {
			$tds.eq(i).removeClass('tallCellSelected');
			$tds.eq(i).parent().removeClass('checked');
		}
		//当前td设为选中
		$(this).addClass('tallCellSelected');
		$(this).parent().addClass("checked"); //tr 添加一个 checked 样式。
	});

	$('#selectedProbableCausesTreeTable td').on("click", function () {

		//获得所有选择的td
		var $tds = $('#selectedProbableCausesTreeTable td');
		//遍历改变样式
		for (var i = 0; i < $tds.length; i++) {
			$tds.eq(i).removeClass('tallCellSelected');
			$tds.eq(i).parent().removeClass('checked');
		}
		//当前td设为选中
		$(this).addClass('tallCellSelected');
		$(this).parent().addClass("checked"); //tr 添加一个 checked 样式。
	});

}



alarmsUtil.leftNode = function (item) {

	var treeType = item.attr('treeType');
	if (treeType == "deptTree") {
		$('#selectedDeptTreeTable').children().children(".checked").remove();
	} else if (treeType == "probableCausesTree") {
		$('#selectedProbableCausesTreeTable').children().children(".checked").remove();
	}

}

alarmsUtil.removeAll = function (item) {

	var treeType = item.attr('treeType');
	if (treeType == "deptTree") { //如果是资源树
		$('#selectedDeptTreeTable').children().remove();
	} else if (treeType == "probableCausesTree") {
		$('#selectedProbableCausesTreeTable').children().remove();
	}
}





//调用datarangepicker组件 datarange 初始化

alarmsUtil.setDateRange = function (dataRangeId, vm) {

	var open = 'right';
	var optionSet1 = {
		startDate : "2015-08-02",
		endDate : "2015-08-03",
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
			applyLabel : $.i18n.prop('ngict_fm_iui_curalarm_ok'),
			cancelLabel : $.i18n.prop('ngict_fm_iui_curalarm_cancel'),
			fromLabel : $.i18n.prop('ngict_fm_iui_curalarm_from'),
			toLabel : $.i18n.prop('ngict_fm_iui_curalarm_to'),
			daysOfWeek : [
				$.i18n.prop('ngict_fm_iui_curalarm_Sun'),
				$.i18n.prop('ngict_fm_iui_curalarm_Mon'),
				$.i18n.prop('ngict_fm_iui_curalarm_Tues'),
				$.i18n.prop('ngict_fm_iui_curalarm_Wed'),
				$.i18n.prop('ngict_fm_iui_curalarm_Thurs'),
				$.i18n.prop('ngict_fm_iui_curalarm_Fri'),
				$.i18n.prop('ngict_fm_iui_curalarm_Sat')
				],
			monthNames : [$.i18n.prop('ngict_fm_iui_curalarm_January'), $.i18n.prop('ngict_fm_iui_curalarm_February'), $.i18n.prop('ngict_fm_iui_curalarm_March'), $.i18n.prop('ngict_fm_iui_curalarm_April'), $.i18n.prop('ngict_fm_iui_curalarm_May'), $.i18n.prop('ngict_fm_iui_curalarm_June'), $.i18n.prop('ngict_fm_iui_curalarm_July'), $.i18n.prop('ngict_fm_iui_curalarm_August'), $.i18n.prop('ngict_fm_iui_curalarm_September'), $.i18n.prop('ngict_fm_iui_curalarm_October'), $.i18n.prop('ngict_fm_iui_curalarm_November'), $.i18n.prop('ngict_fm_iui_curalarm_December')],
			firstDay : 1
		}
	};

	//datarangepicker确认
	$('input[id="' + dataRangeId + '"]').bind('apply.daterangepicker', function () {
		//获取时间范围，查询
		// 都设置为0点
		setTime($(this));
		// 更新tooltip内容
		$(this).attr("data-original-title", $(this).val());
	});

	$('input[id="' + dataRangeId + '"]').daterangepicker(optionSet1);

};

//关闭打开datarangepicker选择器
alarmsUtil.dateRangeEnableDisable = function (customDateRangeId) {

	$('#' + customDateRangeId).on('ifChecked', function () {

		if (customDateRangeId == "customAckTime") {
			vm.dataRangeLocationDisabled = false;
			if(vm.fmConds.ackTimeStarTime!=null && vm.fmConds.ackTimeEndTime!=null){
				vm.fmConds.ackTimeMode=0;
			}
		} else if (customDateRangeId == "customRaisedTime") {
			vm.dataRangeTypeDisabled = false;
			if(vm.fmConds.alarmRaisedStartTime!=null && vm.fmConds.alarmRaisedEndTime!=null){
				vm.fmConds.alarmRaisedTimeMode=0;
			}
		} else if (customDateRangeId == "customClearTime"){
			vm.dataRangeCodeDisabled = false;
			if(vm.fmConds.clearedTimeStartTime!=null && vm.fmConds.clearedTimeEndTime!=null){
				vm.fmConds.clearedTimeMode=0;
			}
		}
	});
	//setTime($('#' + dataRangeId));

	$('#' + customDateRangeId).on('ifUnchecked', function () {

		if (customDateRangeId == "customAckTime") {

			vm.dataRangeLocationDisabled = true;
			vm.fmConds.ackTimeMode=null;

		} else if (customDateRangeId == "customRaisedTime") {

			vm.dataRangeTypeDisabled = true;
			vm.fmConds.alarmRaisedTimeMode=null;
			
		} else if (customDateRangeId == "customClearTime"){
		
			vm.dataRangeCodeDisabled = true;
			vm.fmConds.clearedTimeMode=null;
			
		}
	});

}

//checkbox时间选择
alarmsUtil.dateRangeCustom = function (vm) {

	$("input[name=timeConfirm]").on("ifClicked", function () {
		if ($(this).parent().hasClass("checked")) {
			$(this).iCheck('uncheck');
		}
	});

	$("input[name=timeOccur]").on("ifClicked", function () {
		if ($(this).parent().hasClass("checked")) {
			$(this).iCheck('uncheck');
		}
	});

	$("input[name=timeClear]").on("ifClicked", function () {
		if ($(this).parent().hasClass("checked")) {
			$(this).iCheck('uncheck');
		}
	});

	$("input[cond_id=time]").on('ifChecked', function () {

		var nowTime = (new Date()).toLocaleDateString();
		var condDate = $(this).attr("cond_value");

		if ($(this).attr("name") == "timeConfirm") {
			if (condDate == "1") {
				vm.fmConds.ackRelativeTime = 1 * 24 * 60 * 60 * 1000;
				vm.fmConds.ackTimeMode = 1;
			} else if (condDate == "2") {
				vm.fmConds.ackRelativeTime = 2 * 24 * 60 * 60 * 1000;
				vm.fmConds.ackTimeMode = 1;
			} else if (condDate == "7") {
				vm.fmConds.ackRelativeTime = 7 * 24 * 60 * 60 * 1000;
				vm.fmConds.ackTimeMode = 1;
			}
		}

		if ($(this).attr("name") == "timeOccur") {
			if (condDate == "1") {
				vm.fmConds.alarmRaisedRelativeTime = 1 * 24 * 60 * 60 * 1000;
				vm.fmConds.alarmRaisedTimeMode = 1;
			} else if (condDate == "2") {
				vm.fmConds.alarmRaisedRelativeTime = 2 * 24 * 60 * 60 * 1000;
				vm.fmConds.alarmRaisedTimeMode = 1;
			} else if (condDate == "7") {
				vm.fmConds.alarmRaisedRelativeTime = 7 * 24 * 60 * 60 * 1000;
				vm.fmConds.alarmRaisedTimeMode = 1;
			}
		}

		if ($(this).attr("name") == "timeClear") {
			if (condDate == "1") {
				vm.fmConds.clearedTimeRelativeTime =1 * 24 * 60 * 60 * 1000;
				vm.fmConds.clearedTimeMode = 1;
			} else if (condDate == "2") {
				vm.fmConds.clearedTimeRelativeTime =2 * 24 * 60 * 60 * 1000;
				vm.fmConds.clearedTimeMode = 1;
			} else if (condDate == "7") {
				vm.fmConds.clearedTimeRelativeTime =7 * 24 * 60 * 60 * 1000;
				vm.fmConds.clearedTimeMode = 1;
			}
		}

		//refreshByCond();
	});
	
	$("input[cond_id=time]").on('ifUnchecked', function () {
		if ($(this).attr("name") == "timeConfirm") {
			vm.fmConds.ackRelativeTime = null;
			vm.fmConds.ackTimeMode = null;
		}else if ($(this).attr("name") == "timeOccur") {
			vm.fmConds.alarmRaisedRelativeTime = null;
			vm.fmConds.alarmRaisedTimeMode = null;
		}else if ($(this).attr("name") == "timeClear") {
			vm.fmConds.clearedTimeRelativeTime = null;
			vm.fmConds.clearedTimeMode = null;
		}
	});

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

//daterangepicker设置时间
function setTime($obj) {

	var title = $obj.attr('dtitle');
	var arr = $obj.val().split(' - ');
	//排除日历组件空字符串的情况。
	if (arr[0] != '') {
		var starTime = new Date(arr[0].replace(/-/g, "/")).getTime();
		var endTime = new Date(arr[1].replace(/-/g, "/")).getTime();
		if (title == "ackTime") {
			vm.fmConds.ackTimeStarTime = starTime;
			vm.fmConds.ackTimeEndTime = endTime;
			vm.fmConds.ackTimeMode=0;
		} else if (title == "raisedTime") {
			vm.fmConds.alarmRaisedStartTime = starTime;
			vm.fmConds.alarmRaisedEndTime = endTime;
			vm.fmConds.alarmRaisedTimeMode=0;
		} else if (title == "clearTime") {
			vm.fmConds.clearedTimeStartTime = starTime;
			vm.fmConds.clearedTimeEndTime = endTime;
			vm.fmConds.clearedTimeMode=0;
		}
	}
}

/*
@param type 1 day 2 week  3 month  4 year
 */
function reduceDate(date, val, type) {

	var d = new Date(date);
	if (type == 'day') {
		d.setDate(d.getDate() - val);
	} else if (type == 'week') {
		d.setDate(d.getDate() - val * 7);
	} else if (type == 'month') {
		d.setMonth(d.getMonth() - val);
	} else if (type == 'year') {
		d.setFullYear(d.getFullYear() - val);
	}
	var month = d.getMonth() + 1;
	var day = d.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	var val = d.getFullYear() + "-" + month + "-" + day;
	return val;
}

alarmsUtil.condSave = function (cond, saveUrl, name) {

	var conds = [];
	if (cond.severity != null && cond.severity != "undefined" && cond.severity.length > 0) {
		var severity = '{ "type": "Severity", "data": [{"severity": "' + cond.severity + '"}]}'; //级别
		var severityObj = window.JSON.parse(severity)
			conds.push(severityObj);
	}
	if (cond.ackState != null && cond.ackState != "undefined") {
		var ackState = '{ "type": "AckState", "data": [{"ackState": "' + cond.ackState + '"}]}'; //级别
		var ackStateObj = window.JSON.parse(ackState)
			conds.push(ackStateObj);
	}
	if (cond.filterState != null && cond.filterState != "undefined") {
		var filterState = '{ "type": "FilterState", "data": [{"filterState": "' + cond.filterState + '"}]}'; //级别
		var filterStateObj = window.JSON.parse(filterState)
			conds.push(filterStateObj);
	}

	if (cond.ackTimeStarTime != null && cond.ackTimeStarTime != "undefined") {
		var ackTime = '{ "type": "AckTime", "data": [{"mode":"0","start":"' + cond.ackTimeStarTime + '","end":"' + cond.ackTimeEndTime + '" }]}'; //级别
		var ackTimeObj = window.JSON.parse(ackTime)
			conds.push(ackTimeObj);
	}
	if (cond.alarmRaisedStartTime != null && cond.alarmRaisedStartTime != "undefined") {
		var alarmRaisedTime = '{ "type": "RaisedTime", "data": [{"mode":"0","start":"' + cond.alarmRaisedStartTime + '","end":"' + cond.alarmRaisedEndTime + '" }]}'; //级别
		var alarmRaisedTimeObj = window.JSON.parse(alarmRaisedTime)
			conds.push(alarmRaisedTimeObj);
	}

	if (cond.clearedTimeStarTime != null && cond.clearedTimeStarTime != "undefined") {
		var clearedTime = '{ "type": "ClearedTime", "data": [{"mode":"0","start":"' + cond.clearedTimeStarTime + '","end":"' + cond.clearedTimeEndime + '" }]}'; //级别
		var severityObj = window.JSON.parse(clearedTime)
			conds.push(severityObj);
	}
	var resJsonObj = AlarmConds.parseActiveConds2JSon(conds);
	resJsonObj.rule.name = name;
	resJsonObj.rule.ruleType = vm.ruleType;
	var resStr = window.JSON.stringify(resJsonObj);
	var dataSource = "isc_AosRestDataSource_1";
	var operationType = "add";
	var data1 = {
		dataSource : dataSource,
		operationType : operationType,
		data : resJsonObj,
		oldValues : null
	};
	$.ajax({
		dataType : "json",
		type : "POST",
		contentType : 'application/json; charset=utf-8',
		url : saveUrl,
		data : JSON.stringify(data1),
		async : false,
		success : function (msg) {
			$('#saveModalCancle').trigger("click");
		}
	});

}

Array.prototype.contains = function (item) {
	return RegExp("(^|,)" + item.toString() + "($|,)").test(this);
};

/*
@param  alarmsType  1当前告警  2历史告警
@param  condRuleId  查询条件的RuleId
 */
alarmsUtil.queryByParma = function (alarmsType, condRuleId) {

	//1.判断是当前告警还是历史告警。

	var sourceUrl;
	if (alarmsType == 1) { //当前告警
		sourceUrl = '/web/rest/web/fm/curqueryview?' + 'data={"ruleType":1,"ruleSort":1}&isc_flag=smartClient&_operationType=fetch&_startRow=0&_endRow=75&_textMatchStyle=exact&_componentId=condList&_dataSource=isc_RestDataSource_7&isc_metaDataPrefix=_&isc_dataFormat=json';
		vm.ruleType = 1;
		vm.$queryAlarmsInfoUrl = "/ngict/rest/fm/curalarms";
		vm.curalarmsType = "curalarms";
		vm.showClear = true; //清除按钮

	} else if(alarmsType == 2){ //历史告警

		sourceUrl = '/web/rest/web/fm/curqueryview?' + 'data={"ruleType":2,"ruleSort":1}&isc_flag=smartClient&_operationType=fetch&_startRow=0&_endRow=75&_textMatchStyle=exact&_componentId=condList&_dataSource=isc_RestDataSource_7&isc_metaDataPrefix=_&isc_dataFormat=json';
		vm.ruleType = 2;
		vm.$queryAlarmsInfoUrl = "/ngict/rest/fm/hisalarms";
		vm.hisalarmsType = "hisalarms";
		vm.showClear = false; //清除按钮
	}else if(alarmsType == 3){ //通知
		sourceUrl = '/web/rest/web/fm/curqueryview?' + 'data={"ruleType":2,"ruleSort":1}&isc_flag=smartClient&_operationType=fetch&_startRow=0&_endRow=75&_textMatchStyle=exact&_componentId=condList&_dataSource=isc_RestDataSource_7&isc_metaDataPrefix=_&isc_dataFormat=json';
		vm.ruleType = 3;
		vm.$queryAlarmsInfoUrl = "/ngict/rest/fm/notify";
		vm.notificationType = "notification";
		vm.showClear = false; //清除按钮
	}

	//如果没传condRuleId 直接返回
	if (condRuleId == null || condRuleId == "undefined") {
		return;
	}

	//2.取出告警规则的数据。

	$.ajax({
		type : "get",
		data : null,
		url : sourceUrl,
		async : false,
		success : function (msg) {
			//1.遍历返回的条件数组确定是哪一个rule规则。
			var ruleCondArr = msg.response.data;
			var xmlData = "";
			for (var i = 0; i < ruleCondArr.length; i++) {
				if (ruleCondArr[i].ruleId == condRuleId) { //condRuleId
					xmlData = "<xml>" + ruleCondArr[i].ruleData + "</xml>" //在jQuery裡，如果要直接将字串转成XML物件，记得前后方要加上<xml>及</xml>，才会被当成XML处理；
						break;
				}
			};

			//3.解析数据的xml联动页面的组件。
			$(xmlData).find("CompoundCond").each(function () {
				//1.级别
				for (var i = 0; i < vm.severityTypes.length; i++) {
					vm.severityTypes[i].value = false;
				}
				if ($(this).find("PerceivedSeverity").attr('value') != null && $(this).find("PerceivedSeverity ").attr('value') != 'undefined') {
					var perceivedSeverityArr = $(this).find("PerceivedSeverity ").attr('value').split(',');
					for (var i = 0; i < perceivedSeverityArr.length; i++) {
						if (perceivedSeverityArr.contains(vm.severityTypes[i].id)) {
							vm.severityTypes[i].value = true;
						}
					};
				}

				//2.确认状态
				for (var i = 0; i < vm.ackStateTypes.length; i++) {
					vm.ackStateTypes[i].value = false;
				};
				var ackStateV = $(this).find("AckState").attr('value');
				if (ackStateV != null && ackStateV != "undefined") {
					var ackStateArr = ackStateV.split(',');
					for (var i = 0; i < vm.ackStateTypes.length; i++) {
						if (ackStateArr.contains(vm.ackStateTypes[i].id)) {
							vm.ackStateTypes[i].value = true;
						}
					};
				}

				//3.可见性
				if(vm.ruleType === 1){
					for (var i = 0; i < vm.filterStateTypes.length; i++) {
							vm.filterStateTypes[i].value = false;
						};
					var filterStateV = $(this).find("FilterState").attr('value')
						if (filterStateV != null && filterStateV != "undefined") {
							var filterStateArr = filterStateV.split(',');
							for (var i = 0; i < vm.filterStateTypes.length; i++) {
								if (filterStateArr.contains(vm.filterStateTypes[i].id)) {
									vm.filterStateTypes[i].value = true;
								}
							};
						}
				}
					//4.确认时间

				var dataRangeAck = $('input[dtitle="ackTime"]'); //日历组件
				vm.fmConds.ackTimeStarTime = null;
				vm.fmConds.ackTimeEndTime = null;
				dataRangeAck.val('');
				var ackTimeStartMs = $(this).find("AckTime").attr('start');
				var ackTimeEndMs = $(this).find("AckTime").attr('end');
				if (ackTimeStartMs != null && ackTimeStartMs != "undefined" && ackTimeEndMs != null && ackTimeEndMs != "undefined") {
					vm.fmConds.ackTimeStarTime = ackTimeStartMs; //确认时间
					vm.fmConds.ackTimeEndTime = ackTimeEndMs;
					var ackTimeStarTime = new Date(parseInt(ackTimeStartMs)).format('yyyy-MM-dd');
					var ackTimeEndTime = new Date(parseInt(ackTimeEndMs)).format('yyyy-MM-dd');
					dataRangeAck.val(ackTimeStarTime + ' - ' + ackTimeEndTime);
				}

				//5.发生时间
				vm.fmConds.alarmRaisedStartTime = null;
				vm.fmConds.alarmRaisedEndTime = null;
				var dataRangeRaised = $('input[dtitle="raisedTime"]'); //日历组件
				dataRangeRaised.val('');
				var raisedTimeStartMs = $(this).find("RaisedTime").attr('start');
				var raisedTimeEndMs = $(this).find("RaisedTime").attr('end');
				if (raisedTimeStartMs != null && raisedTimeStartMs != "undefined" && raisedTimeEndMs != null && raisedTimeEndMs != "undefined") {
					vm.fmConds.alarmRaisedStartTime = raisedTimeStartMs; //发生时间
					vm.fmConds.alarmRaisedEndTime = raisedTimeEndMs;
					var raisedTimeStart = new Date(parseInt(raisedTimeStartMs)).format('yyyy-MM-dd');
					var raisedTimeEnd = new Date(parseInt(raisedTimeEndMs)).format('yyyy-MM-dd');
					dataRangeRaised.val(raisedTimeStart + ' - ' + raisedTimeEnd);
				}

				//6.清除时间


				//7.告警码

				vm.fmConds.probableCause = null;
				var probableCauseArr = $(this).find("ProbableCause").attr('value');
				if (probableCauseArr != null && probableCauseArr != "undefined") {
					for (var i = 0; i < probableCauseArr.length; i++) {
						vm.fmConds.probableCause = probableCauseArr;
						// 联动
					};
				}

				//8.告警位置
				vm.fmConds.probableCause = null;
				var newPositionCondArr = $(this).find("NewPositionCond").attr('value');
				if (newPositionCondArr != null && newPositionCondArr != "undefined")
					for (var i = 0; i < newPositionCondArr.length; i++) {
						// 联动
					};

				//9.告警类型
				vm.fmConds.alarmType = null;
				var alarmTypeArr = $(this).find("AlarmType").attr('value');
				if (alarmTypeArr != null && alarmTypeArr != "undefined") {
					for (var i = 0; i < alarmTypeArr.length; i++) {
						vm.fmConds.alarmType = alarmTypeArr;
					};
				}
			});
		}
	});
}


/*
 获取系统类型中的告警码数量
*/
alarmsUtil.getProbableCauseCountBySystemType=function(systemType){
	
	//"/ngict/rest/fm/probableCause?request={"systemTypes":[6,12]}"
	var getData={};
	var request={};
	request.systemTypes=systemType;
	getData.request = JSON.stringify(request);
	$.ajax({
		type : "get",
		data : getData,
		url : "/ngict/rest/fm/probableCause",
		async : true,
		success : function (msg) {
			vm.alarmCodeSelectedCount+=msg.length;
		}});
}