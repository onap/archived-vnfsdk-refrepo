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
var vmAppDetailUtil = {};
vmAppDetailUtil.timer = null;

vmAppDetailUtil.nameRender = function(obj) {
    return '<a href="#" onclick="vm.nodesTab.nodesDetail.$showDetails('
    + '\'block\',\'' + obj.aData.nodeTemplateId + '\', \'' + obj.aData.nodeName + '\')">' + obj.aData.nodeName + '</a>';
}

/**
 * Content is too long, add the tooltip
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
vmAppDetailUtil.keyRender = function(obj) {
    return '<span title="' + obj.aData.key + '">' + obj.aData.key + '</span>';
}

vmAppDetailUtil.valueRender = function(obj) {
    return '<span title="' + obj.aData.value + '">' + obj.aData.value + '</span>';
}

vmAppDetailUtil.sourceNodeNameRender = function(obj) {
	return '<span title="' + obj.aData.sourceNodeName + '">' + obj.aData.sourceNodeName + '</span>';
}

vmAppDetailUtil.targetNodeNameRender = function(obj) {
	return '<span title="' + obj.aData.targetNodeName + '">' + obj.aData.targetNodeName + '</span>';
}

vmAppDetailUtil.typeRender = function(obj) {
    return '<span title="' + obj.aData.type + '">' + obj.aData.type + '</span>';
}

vmAppDetailUtil.initSteps = function() {
	$.ajax({
		type : "GET",
		url : vm.$restUrl.queryEventsInfoUrl,
		data : "json",
		success : function(data) {
			console.log("initSteps");
			if (data) {
				var step = $(".step");
	            if (step.getStep().length == 0) {
	            	vm.executionTab.steps = [{title : "start"}, {title : "install VM"}, {title : "execute"}, {title : "complete"}];
	                step.loadStep({
	                    size : "large",
	                    color : "blue",
	                    steps : vm.executionTab.steps
	                });
	            }
			}
		}
	});
}

vmAppDetailUtil.initTopoData = function(topoTemplateData) {
	$.ajax({
		type : "GET",
		url : vm.$restUrl.queryNodesInfoUrl,
		data : "json",
		success : function(resp){			
			topoUtil.initTopoData(topoTemplateData, resp);
		}
	});
}
