/* Copyright 2016-2017, Huawei Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var app_url;
function getUrl(){
	var url="";
	$.ajax({
		url:"./conf/globalconfig.json",
		async:false,
		dataType:"json",
		success:function(jsonData) {
			url = jsonData.url + ":" + jsonData.port +"/"+jsonData.context_name;
			console.log("url = " + url);
		}
	});
	return url;
}
app_url = getUrl();
