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
var hmUtil = {};

hmUtil.actionRender = function(obj) {
	return '<a href="#" class="btn-xs grey btn-editable" onclick="hmUtil.delHost(\'' 
	+ obj.aData.id + '\', \'' + obj.aData.vimId + '\')"><i class="ict-delete"></i>' 
	+ $.i18n.prop('nfv-host-iui-operation-delete') + '</a>';
}

hmUtil.progressRender = function(obj) {
	return $.i18n.prop("nfv-host-iui-progress-" + obj.aData.progress);
}

hmUtil.delHost = function(id, vimId) {
	bootbox.confirm($.i18n.prop("nfv-host-iui-message-delete-confirm"), function(result){
		if(result) {
			$.ajax({
				type : "DELETE",
				url : vm.$restUrl.delHostUrl + id + "?vimid=" + vimId,
				dataType : "json",
				success : function(resp) {
					if (resp) {
						commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-delete-success"), "success");
						refreshByCond();
					} 
				},
				error : function(resp) {
					commonUtil.showMessage($.i18n.prop("nfv-host-iui-message-delete-failed"), "warning");
				}
			});
		}
	});		
}

hmUtil.queryVimInfo = function() {
	$.get(
        vm.$restUrl.queryVimInfoUrl,
        function(resp) {
            if (resp) {
                vm.uploadHostImage.vimSelectItems = resp.data;
            }
        },
        "json"      
    );
}