var AlarmCount_BarChart_C3 = function (placeholdeC3) {

    var callbackList = [];
    var callback = function (data) {
        if (data.index !== undefined) {
            var severity = data.index + 1;
            window.open(
                "/web/res/web-framework/default.html?showNav=false&severity="
                + severity + "#uep-ict-fm-currentAlarm", "fm_portlet_page_title"
                + severity, "");
        }
    }
    callbackList.push(callback);

    $.ajax({
        async: false,
        "dataType": "json",
        "type": "GET",
        "url": "/web/rest/web/fm/count/total",
        "data": null,
        "Content-Type": "application/json; charset=utf-8",
        "success": function (json, textStatus, jqXHR) {
            var alarmcount = json;
            var inputData = [];
            for (var i = 0; i < alarmcount.ackedCount.length; i++) {
                inputData.push(alarmcount.unAckedCount[i] + alarmcount.ackedCount[i]);
            }
            ICT_Bar_Chart_C3(placeholdeC3, inputData, callbackList);
        },
        "error": function () {
        }
    });

}
