var ICT_Line_C3 = function (placeholderC3, seriesNames, colors) {

    var xkeys = {"x": "x", "value": []};

    //��ʼ�����
    var config = {};
    config.bindto = '#' + placeholderC3;
    config.data = {};
    config.data.keys = xkeys;
    config.data.json = [];
    config.axis = {};
    config.axis.x = {"type": "timeseries", "tick": {"format": "%H:%M:%S'", count: 5}};
    config.axis.y = {
        padding: {
            left: 0,
            right: 0,
        },
        //,inner: true
        max: 100,
        min: 0
    };
    config.axis.y.tick = {
        format: function (data) {
            return (data + "").substring(0, 4) + "%";
        }
        , values: [0, 20, 40, 60, 80, 100]
        //,centered: true
        //,fit: true
        , outer: false
    };
    config.data.colors = {};
    config.data.types = {};
    if (!colors) {
        colors = ['#ffb980', '#5ab1ef', '#b6a2de'];
    }
    if (seriesNames) {
        for (var i = 0; i < seriesNames.length; i++) {
            config.data.colors[seriesNames[i]] = colors[i];
            config.data.types[seriesNames[i]] = "spline";
        }
    }

    /* config.data.color = function(inColor, data) {
     if(data.index !== undefined) {
     return colors[data.index];
     }
     return inColor;
     }; */
    config.grid = {
        y: {
            show: true
        }
    }

    var c3Chart = c3.generate(config);

    var dataService = new function () {
        var data = [];
        var numDataPoints = 60;

        this.loadData = function (callback, newSeriesData) {
            if (data.length > numDataPoints) {
                data.shift();
            }
            var newValue = {"x": new Date()};
            for (var i = 0; i < newSeriesData.length; i++) {
                newValue[newSeriesData[i].name] = newSeriesData[i].value;
            }
            //data.push({"x":new Date(),"data1":newSeriesData.data1,"data2":newSeriesData.data2});
            data.push(newValue);
            callback(data);
        };
        //return this;
    }

    return {

        setC3Data: function (newSeriesData) {
            var values = [];
            for (var i = 0; i < newSeriesData.length; i++) {
                values.push(newSeriesData[i].name);
            }
            xkeys.value = values;
            //var dataServiceFunc = new dataService();
            dataService.loadData(function (newData) {
                var data = {};
                data.keys = xkeys;
                data.json = newData;
                //data.done = DashboardICT.removeYaxisScale;
                c3Chart.load(data);
                //c3Chart.resize();
            }, newSeriesData);

        }

    };

}
