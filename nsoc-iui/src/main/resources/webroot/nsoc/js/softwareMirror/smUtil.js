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
var smUtil = {};

smUtil.actionRender = function(obj) {
	return '<a href="#" class="btn-xs grey btn-editable" onclick="smUtil.delSoftWare(\'' + obj.aData.imageName + '\')">'
		+ '<i class=\"ict-delete\"></i>' + $.i18n.prop('nfv-software-iui-action-delete') + '</a>';
}

smUtil.delSoftWare = function(imageName) {
	bootbox.confirm($.i18n.prop("nfv-software-iui-message-delete-confirm"), function(result){
		if(result) {
			var url = vm.$restUrl.delSoftwareImageUrl + "?imageName=" + imageName;
			commonUtil.delete(url, function(resp) {
				commonUtil.showMessage($.i18n.prop("nfv-software-iui-message-delete-success"), "success");
				refreshByCond();
			});
		}
	});		
}