var ICT_Line_C3 = function (placeholderC3) {

    //var dataSeries = [];
    var xkeys = {"x": "x", "value": []};

    //��ʼ�����
    var config = {};
    config.bindto = '#' + placeholderC3;
    config.data = {};
    config.data.keys = xkeys;
    config.data.json = [];
    //�Ŵ���ʾ�����ֱ��ȡ��������
    if (($.facebox.isExpand(placeholderC3) || $.facebox.isDragged) && $.facebox.flotRealTimeData) {
        config.data.json = $.facebox.flotRealTimeData;
        config.data.keys = $.facebox.xkeys;
    }
    config.axis = {};
    config.axis.x = {"type": "timeseries", "tick": {"format": "%S"}};
    config.axis.y = {"label": {"text": "Ratio of CPUs", "position": "outer-middle"}};
    config.axis.y.tick = {
        format: function (data) {
            return data + "%";
        }
    };
    config.data.types = {"data1": "line", "data2": "spline"};
    config.data.colors = {
        data1: '#ff0000',
        data2: '#00ff00',
        data3: '#0000ff'
    };
    var c3Chart = c3.generate(config);
    $.facebox.charts[placeholderC3] = c3Chart;

    if (!$.facebox.isExpand(placeholderC3)) {

        var dataService = function () {
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
                $.facebox.flotRealTimeData = data;
                $.facebox.xkeys = xkeys;
                callback(data);
            };
            return this;
        }();

        return {

            setC3Data: function (newSeriesData) {
                var values = [];
                for (var i = 0; i < newSeriesData.length; i++) {
                    values.push(newSeriesData[i].name);
                }
                xkeys.value = values;
                //dataSeries = recalculateSeries(dataSeries, newSeriesData);
                dataService.loadData(function (newData) {
                    var data = {};
                    data.keys = xkeys;
                    data.json = newData;
                    c3Chart.load(data);
                    //c3Chart.resize();
                }, newSeriesData);

                //$.facebox.flotRealTimeData = dataSeries;
            }

        };

    }

}
