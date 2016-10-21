var commonUtil = {};

commonUtil.sendSynRequest = function(url){
	var response;
	$.ajax({
		"type": 'get',
		"url": url,
		"dataType": "json",
		"async": false,
		success: function (resp) {
			response = resp;
			 return response;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
		}
	});
};

commonUtil.strToJson = function(str){
	var json = eval('(' + str + ')');
	return json;
};

commonUtil.arrayRemove = function(aryInstance, index){
	if (aryInstance == undefined || aryInstance == null) {
		return;
	}
	for (var i = 0, n = 0; i < aryInstance.length; i++) {
		if (aryInstance[i] != aryInstance[dx]) {
			aryInstance[n++] = aryInstance[i];
		}
	}
	aryInstance.length -= 1;
};

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
commonUtil.parseDate = function(dateObj, format){
	var o = {
		"M+": dateObj.getMonth() + 1,
		"d+": dateObj.getDate(),
		"h+": dateObj.getHours(),
		"m+": dateObj.getMinutes(),
		"s+": dateObj.getSeconds(),
		"q+": Math.floor((dateObj.getMonth() + 3) / 3),
		"S": dateObj.getMilliseconds()
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
};

commonUtil.strToJson = function(str){
	var json = eval('(' + str + ')');
	return json;
};
