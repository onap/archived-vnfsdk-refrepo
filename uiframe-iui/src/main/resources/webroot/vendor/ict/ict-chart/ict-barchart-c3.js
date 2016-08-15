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
    config.axis = {};
    config.axis.x = {
        type: 'category',
        categories: [language[0].value, language[1].value, language[2].value, language[3].value]
    };
    /* config.axis.y.tick = {
     format: function(data){
     return data + "%";
     }
     }; */
    config.axis.y = {};
    config.axis.y.tick = {
        values: [0, 20, 40, 60]
        , outer: false
    };
    config.data.types = {};
    config.data.types["告警"] = "bar";
    config.data.color = function (inColor, data) {
        if (data.index !== undefined) {
            return language[data.index].color;
        }
        return inColor;
    },
        config.data.onclick = function (data, element) {
            $.each(callbackList, function (index, callback) {
                callback(data);
            });
        },
        config.legend = {
            show: false
        };
    config.bar = {
        width: {
            ratio: 0.3
        }
    };
    config.grid = {
        y: {
            show: true
        }
    };

    c3.generate(config);

}

