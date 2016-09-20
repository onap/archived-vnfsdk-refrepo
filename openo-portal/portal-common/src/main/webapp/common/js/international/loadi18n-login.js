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
//加载本模块国际化文件并处理静态国际化部分
function loadProperties_login(lang){
    jQuery.i18n.properties({
        language:lang,
        name:'web-portal-login-integration-i18n',
        path:'i18n/', 
        mode:'map', 
        callback: function() {
			var i18nItems = $('[name_i18n=com_zte_ums_ict_framework_ui_i18n_login]');
			for(var i=0;i<i18nItems.length;i++){
			    var $item = $(i18nItems.eq(i));
			    var itemId = $item.attr('id');
				var itemValue = $.i18n.prop(itemId);
				//从老的js文本文件中读取可能包含"和;字样
				if(itemValue.indexOf(';')>0){
					itemValue = itemValue.replace(';', '');
				}
				if(/[\'\"]/.test(itemValue)){
					itemValue = itemValue.replace(/\"/g,'');
					itemValue = itemValue.replace(/\'/g,'');
				}
				if(typeof($item.attr("title"))!="undefined"){
					$item.attr("title", itemValue);
				}else if(typeof($item.attr("placeholder"))!="undefined"){
					$item.attr("placeholder", itemValue);
				}else{
					$item.text(itemValue);
				}
			}			
        }
    });
}

function loadi18n_login(lang){
    loadProperties_login(lang);
}


