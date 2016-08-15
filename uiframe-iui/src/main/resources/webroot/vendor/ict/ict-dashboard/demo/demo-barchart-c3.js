var AlarmCount_BarChart_C3 = function (placeholdeC3) {

    var callbackList = [];
    var callback = function () {

    }
    callbackList.push(callback);

    $.ajax({
        "dataType": "json",
        "type": "GET",
        "url": "/web/rest/web/fm/count/total",
        "data": null,
        "Content-Type": "",
        "success": function (json, textStatus, jqXHR) {
            var alarmcount = json;
            var inputData = [];
            for (var i = 0; i < alarmcount.ackedCount.length; i++) {
                inputData.push(alarmcount.unAckedCount[i] + alarmcount.ackedCount[i]);
            }
            //for test
            inputData = [50, 10, 20, 40];
            ICT_Bar_Chart_C3(placeholdeC3, inputData, callbackList);
        },
        "error": function () {
        }
    });

}
