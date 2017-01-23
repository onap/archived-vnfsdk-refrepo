/*
 * Copyright 2016-2017, CMCC Technologies Co., Ltd.
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
var initLeftMenu = function() {
	var i18nName = "openo_frame_left_menu_i18n";
	var parentMenus;
	var childMenus;

	$.ajax({
		async : false,
		"type" : "GET",
		url : "json/menu_list.json",
		dataType : "json",
		"success" : function (res, textStatus, jqXHR) {
			parentMenus = res.parentMenus;
			childMenus = res.childMenus;
		},
		error : function () {
		}
	});

	var templateParent = "<a href='javascript:'>" +
		"<i class='{iconClass}'></i>" +
		"<span id='{id}' name_i18n='{i18nName}' class='title'></span>" +
		"<span class='selected'></span>" +
		"<span class='arrow'></span>" +
		"</a>";

	var templateChild = "<li>" +
		"<a href='{url}' class='iframe' id='{hrefId}'>" +
		"<i class='{iconClass}'></i>" +
		"<span id='{id}' name_i18n='{i18nName}'></span>" +
		"</a>" +
		"</li>";

	var menuContent = "";
	for (var i = 0; i < parentMenus.length; i++) {
		var parentMenuContent = templateParent.replace("{id}", parentMenus[i].id)
			.replace("{iconClass}", parentMenus[i].iconClass)
			.replace("{i18nName}", i18nName);

		var childMenuContent = "";
		for (var j = 0; j < childMenus.length; j++) {
			if (childMenus[j].parentId == parentMenus[i].id) {
				childMenuContent = childMenuContent + templateChild.replace("{id}", childMenus[j].id)
					.replace("{url}", childMenus[j].url)
					.replace("{iconClass}", childMenus[j].iconClass)
					.replace("{hrefId}", childMenus[j].id + "_href")
					.replace("{i18nName}", i18nName);
			}
		}
		childMenuContent = "<ul class='sub-menu'>" + childMenuContent + "</ul>";

		menuContent = menuContent + "<li>" + parentMenuContent + childMenuContent + "</li>";
	}

	return menuContent;
}