/*
 * Copyright 2016-2017, CMCC Technologies Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// draw the chart by performance datas
function drawPerformanceChart() {
    var chartType = "";
    var titleText = document.getElementById("tableTitleText").innerHTML;
    var subTitleText = "subTitleText";
    var chartDataList = [];
    var resourceNameList = [];
    var timeList = [];

    // get table datas
    var tableObj = document.getElementById("ict_pm_data");
    if (tableObj == null || tableObj.rows.length < 1) {
        return;
    }

    // distinguish between chart types
    var ratioType = tableObj.rows[0].cells[5].innerText;
    if (ratioType.indexOf("CPU") > -1) {
        chartType = "CPU";
        subTitleText = "CPU USE RATIO";
    } else if (ratioType.indexOf("RAM") > -1) {
        chartType = "RAM";
        subTitleText = "RAM USE RATIO";
    } else if (ratioType.indexOf("VOLUME") > -1) {
        chartType = "FILESYSTEM";
        subTitleText = "LOGIC VOLUME FILESYSTEM USE RATIO";
    } else if (ratioType.indexOf("NIC") > -1) {
        chartType = "NIC";
        subTitleText = "ERROR PACKET RATIO BY ONE COLLECT-PERIOD (SEND AND RECEIVED)";
    } else {
        return;
    }
    
    // collect datas for chart horizontal axis
    for (var i = 1; i < tableObj.rows.length; i++) {
        var strTime = tableObj.rows[i].cells[0].innerText;

        if (timeList.length == 0) {
            // push the first start time into the x-axis
            timeList.push(strTime);
        } else {
            // push the start times into the x-axis and sort them
            for (var j = 0; j < timeList.length; j++) {
                if (timeList[j] == strTime) {
                    break;
                } else if (timeList[j] > strTime) {
                    timeList.splice(j, 0, strTime);
                    break;
                } else if (j + 1 == timeList.length && timeList[j] < strTime) {
                    timeList.push(strTime);
                    break;
                }
            }
        }
    }

    // create chart resources
    for (var i = 1; i < tableObj.rows.length; i++) {
        var strTime = tableObj.rows[i].cells[0].innerText;
        var ratioIndex = getListIndex(timeList, strTime);
        var strName = "";
        var strRatio = "";

        if (chartType == "CPU" || chartType == "RAM") {
            strName = tableObj.rows[i].cells[4].innerText;
            strRatio = tableObj.rows[i].cells[5].innerText;
        } else if (chartType == "FILESYSTEM") {
            strName = tableObj.rows[i].cells[4].innerText + "(" + tableObj.rows[i].cells[6].innerText + ")";
            strRatio = tableObj.rows[i].cells[9].innerText;
        } else if (chartType == "NIC") {
            strName = tableObj.rows[i].cells[4].innerText + "(" + tableObj.rows[i].cells[5].innerText + ")";
            strRatio = parseFloat(tableObj.rows[i].cells[10].innerText) + parseFloat(tableObj.rows[i].cells[11].innerText);
        }

        if (chartDataList.length == 0) {
            // create the first chart resource and push it into the chartlist
            insertChartDataList(chartDataList, strName, strRatio, ratioIndex);
        } else {
            // update the chart resources which exist in chartlist
            var existFlg = false;
            for (var j = 0; j < chartDataList.length; j++) {
                if (chartDataList[j].name == strName) {
                    chartDataList[j].data[ratioIndex] = strRatio;
                    existFlg = true;
                    break;
                }
            }

            // create a new chart resource and push it into the chartlist
            if (!existFlg) {
                insertChartDataList(chartDataList, strName, strRatio, ratioIndex);
            }
        }
    }

    for (var i = 0; i < chartDataList.length; i++) {
        // complete length of datalist for each chart resource
        if (chartDataList[i].data.length < timeList.length) {
            chartDataList[i].data[timeList.length - 1] = "";
        }

        // create the name list of chart resources
        resourceNameList.push(chartDataList[i].name);
    }

    // initialize the chart
    var dom = document.getElementById("chartCanvasDiv");
    var myChart = echarts.init(dom);
    option = null;

    // set the chart by collected chart resources
    option = {
        title: {
            text: titleText,
            subtext: subTitleText,
            x: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:resourceNameList,
            top: '10%'
        },
        grid: {
            top: '20%'
        },
        toolbox: {
            show: true,
            feature: {
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data : timeList.map(function (str) {
                    return str.replace(' ', '\n')
                })
        },
        yAxis: {
            name : 'percentage(%)',
            type: 'value'
        },
        series: chartDataList
    };

    // draw the performance chart of all resources
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    };
};

// define the struct of chart resource
function chartData() {
    this.name = "";
    this.type = "line";
    this.smooth = true;
    this.data = [];
};

// create a new chart resource and push it into the chartlist
function insertChartDataList(chartDataList, name, data, dataIndex) {
    var cd = new chartData();
    cd.name = name;
    cd.data[dataIndex] = data;
    chartDataList.push(cd);
};

// return the index of the specified element in the list
function getListIndex(list, data) {
    var dataIndex = 0;
    for (var i = 0; i < list.length; i++) {
        if (list[i] == data) {
            return i;
        }
    }
    return dataIndex;
};
