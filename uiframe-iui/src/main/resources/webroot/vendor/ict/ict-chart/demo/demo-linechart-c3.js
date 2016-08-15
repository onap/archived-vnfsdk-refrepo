var ICT_CPU_UsageLine_C3 = function (placeholderC3) {

    //取得数据系列的名称
    var seriesNames = [];
    $.ajax({
        async: false,
        dataType: "json",
        "type": "GET",
        url: "/web/rest/web/dm/dashboard/selfcpu/queryValues",
        "data": JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        "success": function (data) {
            seriesNames.push(data.deviceLabels[0]);
        }
    });

    var colors = ["#fc4400", '#5ab1ef', '#b6a2de'];
    var c3Line = ICT_Line_C3(placeholderC3, seriesNames, colors);

    var data = {};

    window.setInterval(function () {

        var newSeriesData = [];

        $.ajax({
            dataType: "json",
            "type": "GET",
            url: "/web/rest/web/dm/dashboard/selfcpu/queryValues",
            "data": JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            "success": function (data) {
                newSeriesData.push({name: data.deviceLabels[0], value: data.cpuUseRatios[0]});
                c3Line.setC3Data(newSeriesData);
            }
        });

    }, 3 * 1000);

}