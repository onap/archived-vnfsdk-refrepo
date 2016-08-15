var ICT_Bar_Chart_C3 = function (placeholdeC3, inputData, callbackList) {

    var language;
    //取得国际化信息
    $.ajax({
        dataType: "json",
        url: "/web/newict/framework/thirdparty/flotchart/i18n/ict-barchart-flot-" + getLanguage() + ".json",
        async: false,
        contentType: "application/json; charset=utf-8",
        "success": function (data) {
            language = data.language;
        },
        "error": function (xhr, info) {
            alert("Communication Error! Error reason:" + info);
        }
    });

    var config = {};
    config.bindto = '#' + placeholdeC3;
    config.data = {};
    config.data.json = {};
    config.data.json["告警"] = inputData;
    config.axis = {"y": {"label": {"text": "Number of Alarms", "position": "outer-middle"}}};
    config.axis.x = {
        type: 'category',
        categories: [language[0].value, language[1].value, language[2].value, language[3].value]
    };
    /* config.axis.y.tick = {
     format: function(data){
     return data + "%";
     }
     }; */
    config.data.types = {};
    config.data.types["告警"] = "bar";
    config.data.color = function (inColor, data) {
        if (data.index !== undefined) {
            return language[data.index].color;
        }
        return inColor;
    },
        config.data.onclick = function (data, element) {
            if (data.index !== undefined) {
                var severity = data.index + 1;
                window.open(
                    "/web/res/web-framework/default.html?showNav=false&severity="
                    + severity + "#uep-ict-fm-currentAlarm", "fm_portlet_page_title"
                    + severity, "");
            }
        },
        //config.data.colors = ['red', 'green', 'blue', 'yellow'];
        config.legend = {
            show: false
        };
    $.facebox.charts[placeholdeC3] = c3.generate(config);

    /* if($.facebox.isExpand(placeholdeC3)){
     barChartData = $.facebox.barChartData;
     }else{
     $.facebox.barChartData = barChartData;
     }		 */

    $.each(callbackList, function (index, callback) {
        callback();
    });

}

