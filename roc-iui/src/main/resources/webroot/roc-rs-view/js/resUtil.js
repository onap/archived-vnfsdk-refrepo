/*
 * Copyright (C) 2015 ZTE, Inc. and others. All rights reserved. (ZTE)
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
var resUtil = {};

resUtil.queryResource = function () {

    $.ajax({
        "type" : 'get',
        "url" : vm.url.$queryResInfoUrl,
        "dataType" : "json",
        "data" : {
            types : "all"
        },
        "success" : function (resp) {
            if (resp.operationResult == "SUCCESS") {
                vm.resource.nsInfo = (resp == null) ? [] : resp.ns;
                vm.resource.vnfInfo = (resp == null) ? [] : resp.vnf;
                vm.resource.vnfcInfo = (resp == null) ? [] : resp.vnfc;
                vm.resource.vduInfo = (resp == null) ? [] : resp.vdu;
                vm.resource.hostInfo = (resp == null) ? [] : resp.host;
                vm.resource.cpInfo = (resp == null) ? [] : resp.connectPoint;
                vm.resource.vimInfo = (resp == null) ? [] : resp.vim;
                vm.resource.vnfmInfo = (resp == null) ? [] : resp.vnfm;
                vm.resource.sdnInfo = (resp == null) ? [] : resp.sdnController;
                vm.resource.nfpInfo = (resp == null) ? [] : resp.nfp;
                vm.resource.vnffgInfo = (resp == null) ? [] : resp.vnffg;

                if (vm.resource.nsInfo.size() == 0 && vm.resource.vnfInfo.size() == 0 &&
                    vm.resource.vnfcInfo.size() == 0 && vm.resource.vduInfo.size() == 0 &&
                    vm.resource.hostInfo.size() == 0 && vm.resource.vimInfo.size() == 0 &&
                    vm.resource.vnfmInfo.size() == 0 && vm.resource.cpInfo.size() == 0 &&
                    vm.resource.sdnInfo.size() == 0 && vm.resource.nfpInfo.size() == 0 &&
                    vm.resource.vnffgInfo.size() == 0) {
                    vm.emptyVisible = true;
                    vm.resType = "none";
                } else {
                    vm.resType = "NS";
                    vm.emptyVisible = false;
                    resUtil.initResChart(resp);
                }

            } else {
                bootbox.alert($.i18n.prop("com_zte_ums_eco_roc_rsview_err") + ":" + resp.exception);
            }
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
            bootbox.alert($.i18n.prop("com_zte_ums_eco_roc_rsview_err") + textStatus + ":" + errorThrown);
        }
    });

}

resUtil.formatNumber = function (data) {
    return data == 0 ? "" : data;

}

resUtil.initResChart = function (resp) {
    //init Chart data
    var vendorData = {
        vendor : [],
        ns : [],
        vnf : [],
        vnfc : [],
        vdu : [],
        host : [],
        connectPoint : [],
        vim : [],
        vnfm : [],
        sdnController : [],
        vnffg : [],
        nfp : []
    };
    var chartData = {
        vendor : [],
        series : []
    };
    var resType = ["ns", "vnf", "vnfc", "vdu", "host", "connectPoint", "vim", "vnfm", "sdnController", "vnffg", "nfp"];
    var vendorArray = new Array();

    //get grouped resource data by vendor
    for (var i = 0; i < resType.length; i++) {
        var resArray = resp[resType[i]];
        for (var n = 0; n < resArray.length; n++) {

            //grouped  by vendor
            var idx = resArray[n].vendor;
            if (idx == null || idx == "")
                idx = $.i18n.prop("com_zte_ums_eco_roc_rsview_unknown");
            if (vendorData[resType[i]][idx]) {
                vendorData[resType[i]][idx] = parseInt(vendorData[resType[i]][idx]) + 1;
            } else {
                vendorData[resType[i]][idx] = 1;
            }

            if (vendorData["vendor"][idx]) {
                vendorData["vendor"][idx] = parseInt(vendorData["vendor"][idx]) + 1;
            } else {
                vendorData["vendor"][idx] = 1;
                chartData.vendor.push(idx);
            }

        }

    }

    for (var i = 0; i < chartData.vendor.length; i++) {
        var vendor = chartData.vendor[i];
        var series = {
            name : vendor,
            type : 'bar',
            stack : $.i18n.prop("com_zte_ums_eco_roc_rsview_total"),
            itemStyle : {
                normal : {
                    label : {
                        show : false,
                        position : 'insideTop'
                    }
                }
            },
            data : []
        };

        for (var n = 0; n < resType.length; n++) {

            if (vendorData[resType[n]][vendor]) {
                series.data.push(parseInt(vendorData[resType[n]][vendor]));
            } else {
                series.data.push(0);
            }

        }

        chartData.series.push(series);
    }

    resUtil.showResChart(chartData);

}

resUtil.showResChart = function (data) {
    var resChart = echarts.init(document.getElementById('resChartDiv'));
    var option = {
        tooltip : {
            trigger : 'axis',
            axisPointer : {
                type : 'shadow'
            }
        },
        legend : {
            data : data.vendor,
            formatter : $.i18n.prop("com_zte_ums_eco_roc_rsview_vendor") + '：{name}'
        },
        toolbox : {
            show : true,

            feature : {
                saveAsImage : {
                    show : true,
                    title : $.i18n.prop('com_zte_ums_eco_roc_rsview_resource_chart_save_picture'),
                    type : 'png',
                    lang : [$.i18n.prop('com_zte_ums_eco_roc_rsview_resource_chart_click_save')]
                }
            }
        },
        calculable : true,
        xAxis : [{
                type : 'value'
            }
        ],
        yAxis : [{
                type : 'category',
                data : ['NS', 'VNF', 'VNFC', 'VDU', 'HOST', 'CP', 'VIM', 'VNFM', 'SDN', 'VNFFG', 'NFP']
            }
        ],
        series : data.series
    };

    resChart.setOption(option);
    resChart.setTheme("macarons");
    resChart.on(echarts.config.EVENT.CLICK, resUtil.eConsole);
    window.onresize = resChart.resize;
}

resUtil.eConsole = function (param) {
    vm.nodesDetail.isShow = "none";
    vm.resType = param.name

}

resUtil.showStatus = function (status) {
    if (status === vm.$Status.active) {
        return " <span class='label label-success'>" + status + "</span>";
    } else if (status === vm.$Status.inactive) {
        return " <span class='label label-warning'>" + status + "</span>";
    } else if (status === vm.$Status.terminated) {
        return " <span class='label label-danger'>" + status + "</span>";
    } else {
        return " <span class='label label-info'>" + status + "</span>";
    }

}
