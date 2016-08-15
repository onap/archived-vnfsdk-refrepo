var commonUtil = {};
commonUtil.sendSynRequest=function(url) {
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
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //commonUtil.growl("", "发送同步消息失败. url=" + url + ". " + textStatus + ":" + errorThrown, "warning");
        }
    });
}
commonUtil.strToJson = function (str) {
    var json = eval('(' + str + ')');
    return json;
} 
/**commonUtil.growl=function(title, message, type){
    $.growl({
        icon: "fa fa-envelope-o fa-lg",
        title: "&nbsp;&nbsp;提示： "+title,
        message: message+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            },{
                type: type
            });
}**/

commonUtil.arrayRemove = function (aryInstance, index) {
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

//对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
commonUtil.parseDate = function (dateObj, format) {
    var o = {
        "M+": dateObj.getMonth() + 1, //month
        "d+": dateObj.getDate(),    //day
        "h+": dateObj.getHours(),   //hour
        "m+": dateObj.getMinutes(), //minute
        "s+": dateObj.getSeconds(), //second
        "q+": Math.floor((dateObj.getMonth() + 3) / 3),  //quarter
        "S": dateObj.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
