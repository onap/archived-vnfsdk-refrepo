var seriesCount = 3;
var xMaxLength = 60;
var colors = ["#d12610", "#37b7f3", "#52e136"];

var ICT_CPU_UsageLine_C3 = function (placeholderC3) {

    var c3Line = ICT_Line_C3(placeholderC3);

    var data = {};
    var maxNumber = 60;

    function randomNumber() {
        return Math.floor((Math.random() * maxNumber) + 1);
    }

    if (!$.facebox.isExpand(placeholderC3)) {
        $.facebox.intervals[placeholderC3] = window.setInterval(function () {

            //var newSeriesData = {};
            var newSeriesData = [];

            $.ajax({
                dataType: "json",
                "type": "GET",
                url: "/web/rest/web/dm/dashboard/selfcpu/queryValues",
                "data": JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                "success": function (data) {
                    //newSeriesData.data1 = data.cpuUseRatios[0];
                    //newSeriesData.data2 = randomNumber();
                    newSeriesData.push({name: "data1", value: data.cpuUseRatios[0]});
                    newSeriesData.push({name: "data2", value: randomNumber()});
                    newSeriesData.push({name: "data3", value: randomNumber()});
                    c3Line.setC3Data(newSeriesData);
                }
            });

        }, 3 * 1000);
    }

}