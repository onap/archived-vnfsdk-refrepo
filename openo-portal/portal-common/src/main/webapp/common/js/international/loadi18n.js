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
var lang = 'en-US';

function loadProperties(propertiesFileName, propertiesFilePath , name_i18n) {
	jQuery.i18n.properties({
		language:lang,
		name:propertiesFileName,
		path:propertiesFilePath,
		mode:'map',
		callback: function() {
			var i18nItems = $('[name_i18n='+ name_i18n + ']');
			for (var i = 0; i < i18nItems.length; i++) {
				var $item = $(i18nItems.eq(i));
				var itemId = $item.attr('id');
				var itemValue = $.i18n.prop(itemId);
				if (itemValue.indexOf(';') > 0) {
					itemValue = itemValue.replace(';', '');
				}
				if (/[\'\"]/.test(itemValue)) {
					itemValue = itemValue.replace(/\"/g,'');
					itemValue = itemValue.replace(/\'/g,'');
				}
				if (typeof($item.attr("title")) != "undefined") {
					$item.attr("title", itemValue);
				} else if (typeof($item.attr("placeholder")) != "undefined") {
					$item.attr("placeholder", itemValue);
				} else {
					$item.text(itemValue);
				}
			}
		}
	});
}

function loadi18n_WebFramework(propertiesFileName, propertiesFilePath, name_i18n) {
	loadProperties(propertiesFileName, propertiesFilePath, name_i18n);
}

