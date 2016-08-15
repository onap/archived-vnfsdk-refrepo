var DashboardICT = function () {

    var chartObjs;
    var plotsSelected;
    var plotControlCallbacks = {};
    var plotControlHtmlFrags = {};

    var addDroppableItem = function () {
        $(".column.sortable").droppable({
            accept: ".draggableItems",
            drop: function (event, ui) {
                //var dropLocation = $( ".plotsWrapper" );
                var plotTypeId = $(ui.draggable).attr("id");
                /* if($("#" + chartObjs[plotTypeId].placeholderId).length >0){
                 alert("Plot already exits!");
                 return;
                 } */
                addDraggablePortlet(this, plotTypeId);
            }
        });
    }

    var addDraggablePortlet = function (droppableItem, plotTypeId) {

        if (!chartObjs[plotTypeId].chartType || chartObjs[plotTypeId].chartType != "prototype") {
            $("div#" + plotTypeId).remove();
        }

        var portletId = chartObjs[plotTypeId].typeId;
        var portletLabel = chartObjs[plotTypeId].plotLabel;
        var placeholderId = chartObjs[plotTypeId].placeholderId;
        if ($("div[id^=" + placeholderId + "]").length > 0) {
            var placeholderIdCount = $("div[id^=" + placeholderId + "]").length;
            placeholderId = placeholderId + "_" + placeholderIdCount;
        }
        var plotCallback = eval(chartObjs[plotTypeId].plotCallbackName);
        var plotSize = "size11";
        if (chartObjs[plotTypeId].plotSize) {
            plotSize = chartObjs[plotTypeId].plotSize;
        }
        plotSize = "";

        var faceboxDivIndex = $("a[rel=facebox]").length + 1;
        var portletHtml = '<div id="' + portletId + '" class="portlet portlet-sortable light bg-inverse ' + plotSize + '"   style="position: relative;">' +
            '<div class="portletLabel">' + portletLabel + '</div>' +
            '<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox" class="expandLink"><img  src="/ngict/iui/component/ict/ict-dashboard/images/zoom.png" /></a>' +
            '<div class="removeflot"></div>' +
                //'<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox">' +
            '<div id="faceboxDiv_' + faceboxDivIndex + '" flot_id="' + placeholderId + '" class="flot-placeholder-wrapper-portlet">' +
            '<div id="' + placeholderId + '" class="flot-placeholder"></div>' +
            '</div>' +
                //'</a>' +
            '</div>';

        if (chartObjs[plotTypeId].plotControlCallback) {
            portletHtml = '<div id="' + portletId + '" class="portlet portlet-sortable light bg-inverse ' + plotSize + '"  style="position: relative;">' +
            '<div class="portletLabel">' + portletLabel + '</div>' +
            '<div class="removeflot"></div>' +
            plotControlHtmlFrags[plotTypeId] +
                //'<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox">' +
            '<div id="faceboxDiv_' + faceboxDivIndex + '" flot_id="' + placeholderId + '" class="flot-placeholder-wrapper-portlet">' +
            '<div id="' + placeholderId + '" class="flot-placeholder flot-placeholder-high"></div>' +
            '</div>' +
                //'</a>' +
            '</div>';
        }

        if (chartObjs[plotTypeId].htmlSrc) {
            portletHtml = '<div id="' + portletId + '" class="portlet portlet-sortable light bg-inverse ' + plotSize + '"  style="position: relative;">' +
            '<div class="portletLabel">' + portletLabel + '</div>' +
            '<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox" class="expandLink"><img  src="/ngict/iui/component/ict/ict-dashboard/images/zoom.png" /></a>' +
            '<div class="removeflot"></div>' +
            '<div id="htmlFrag" ></div>' +
                /* '<div ms-include-src="' + chartObjs[plotTypeId].htmlSrc + '"></div>' +  */
                //'<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox">' +
            '<div id="faceboxDiv_' + faceboxDivIndex + '" flot_id="' + placeholderId + '" class="flot-placeholder-wrapper-portlet">' +
            '<div id="' + placeholderId + '" class="flot-placeholder flot-placeholder-high"></div>' +
            '</div>' +
                //'</a>' +
            '</div>';
        }

        //插入图例
        //$(droppableItem).before(portletHtml);
        $(droppableItem).prepend(portletHtml);
        //$( ".plotsWrapper" ).append(portletHtml);
        if (chartObjs[plotTypeId].htmlSrc) {
            $.ajax({
                async: false,
                "dataType": "html",
                "type": "GET",
                "url": chartObjs[plotTypeId].htmlSrc,
                "data": null,
                "success": function (html, textStatus, jqXHR) {
                    $("div#htmlFrag").html(html);
                },
                "error": function () {
                    alert("Communication error!");
                }
            });
        }

        //添加图例控制回调
        if (chartObjs[plotTypeId].plotControlCallback) {
            plotControlCallbacks[plotTypeId](plotCallback, placeholderId);
        }

        var args = [placeholderId];
        if (chartObjs[plotTypeId].arguments) {
            var argsArray = chartObjs[plotTypeId].arguments.split(",");
            args = args.concat(argsArray);
        }
        //plotCallback(placeholderId);
        plotCallback.apply(null, args);

        $.facebox.flotRedrawCallbackObjs[placeholderId] = {
            callback: plotCallback,
            arguments: args
        }

        //调整放大后的宽度
        var portlet = $("#" + portletId + ".portlet");
        if ($(portlet).parent().hasClass("col-md-6")) {
            $("div.flot-placeholder-wrapper-portlet", portlet).addClass("flot-placeholder-wrapper-portlet-wide");
        } else {
            $("div.flot-placeholder-wrapper-portlet", portlet).removeClass("flot-placeholder-wrapper-portlet-wide");
        }

        //添加点击范围
        /* var graphToExpand = $("div#" + placeholderId + " > svg > g")[0];
         $(graphToExpand).attr("id", "graphToExpand_" + placeholderId);
         var gNode = d3.select("g#graphToExpand_" + placeholderId);
         gNode.attr("href", "#faceboxDiv_" + faceboxDivIndex);
         gNode.attr("rel", "facebox"); */

        $.facebox.settings.closeImage = '/web/newict/framework/thirdparty/facebox/closelabel.png';
        $.facebox.settings.loadingImage = '/web/newict/framework/thirdparty/facebox/loading.gif';
        $('a[rel*=facebox]').facebox();

        addDroppableItem();
    }

    var restoreDragItems = function (chartId) {
        if (!chartObjs[chartId].chartType || chartObjs[chartId].chartType != "prototype") {
            var plotItemsSelectionDiv = $(".plotItemsSelectionWrapper");
            if ($("div#" + chartId, plotItemsSelectionDiv).length == 0) {
                var chartSelectHtml =
                    '<div id="' + chartObjs[chartId].typeId + '" class="draggableItems">' +
                    '<img width="100%" height="100%" src="' + chartObjs[chartId].imageURL + '">' +
                    '<div class="dragItemLabel">' + chartObjs[chartId].plotLabel + '</div>' +
                    '</div>';
                $(plotItemsSelectionDiv).append(chartSelectHtml);
                $(".draggableItems").draggable({
                    //containment:"body",
                    revert: false,
                    appendTo: "div.plotsWrapper",
                    scroll: false,
                    zIndex: 9999,
                    helper: "clone",
                    opacity: 0.75
                });
            }
        }
    }

    var jsonTransformFromBackend = function (json) {
        var charts = json;
        var obj = {};
        obj.chartTypes = {};
        for (var i = 0; i < charts.length; i++) {
            obj.chartTypes[charts[i].id] = charts[i];
            obj.chartTypes[charts[i].id].typeId = charts[i].id;
        }
        //obj.initPlots = ["ictCPULineC3", "currentAlarm"];
        return obj;
    }

    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }

    return {

        init: function (restPath, dashboardDivId, dashboardHtmlPath) {

            if (dashboardDivId && dashboardHtmlPath) {
                $.ajax({
                    async: false,
                    "dataType": "html",
                    "type": "GET",
                    "url": dashboardHtmlPath,
                    "data": null,
                    "success": function (html, textStatus, jqXHR) {
                        $('div#' + dashboardDivId).html(html);
                    },
                    "error": function () {
                        alert("Communication error!");
                    }
                });
            }

            //sleep(500);

            $.ajax({
                async: false,
                "type": "GET",
                url: "/ngict/rest/dashboard/charts",
                dataType: "json",
                "success": function (res, textStatus, jqXHR) {
                    res = jsonTransformFromBackend(res);
                    var plotItemsSelectionDiv = $(".plotItemsSelectionWrapper");
                    //初始化左边的图列类型列表
                    chartObjs = res.chartTypes;
                    var chartSelectHtml = "";
                    for (var chartObj in chartObjs) {
                        chartSelectHtml =
                            '<div id="' + chartObjs[chartObj].typeId + '" class="draggableItems">' +
                            '<img width="100%" height="100%" src="' + chartObjs[chartObj].imageURL + '">' +
                            '<div class="dragItemLabel">' + chartObjs[chartObj].plotLabel + '</div>' +
                            '</div>';
                        $(plotItemsSelectionDiv).append(chartSelectHtml);
                    }
                    //初始化已选图例
                    //plotsSelected = res.initPlots;
                },
                "error": function () {
                    alert("Config file load error!");
                }
            });

            PortletDraggable.init();
            //Portlet
            $(".draggableItems").draggable({
                //containment:"body",
                revert: false,
                appendTo: "div.plotsWrapper",
                scroll: false,
                zIndex: 9999,
                helper: "clone",
                opacity: 0.75
            });
            $("#deleteIcon").droppable({
                accept: ".portlet",
                drop: function () {
                    if ($("#deleteIcon .top").hasClass("deleteIconHidden")) {
                        //$( "#droppableItem" ).removeClass("droppedOver");
                        var portletRemoveId = $(".ui-sortable-helper").attr("id");
                        if (portletRemoveId != "droppable") {
                            $("#" + portletRemoveId).remove();
                            restoreDragItems(portletRemoveId);
                        }
                    }
                },
                tolerance: "touch",
                over: function (event, ui) {
                    //$( "#droppableItem" ).addClass("droppedOver");
                }
            });
            addDroppableItem();
            $(".sidebar-toggler").click(function () {
                $("#cf5 img.top").toggleClass("scale");
                $("#cf5 img.bottom").toggleClass("rotate");

                $(".plotsWrapper").toggleClass("dashboardExpand", 300, "linear");
                $(".plotItemsSelectionWrapper").toggleClass("sideBarClose", 300, "linear");

                setTimeout(function () {
                    var charts = $.facebox.charts;
                    for (var chart in charts) {
                        charts[chart].resize();
                    }
                    DashboardICT.removeYaxisScale();
                }, 300);
            });
            $('.plotItemsSelectionWrapper').slimScroll({
                position: 'right',
                distance: '-2px',
                //width: '177px',
                width: '158px',
                //height:'630px',
                //color:'rgb(100, 150, 240)',
                color: "#F1F3FA",
                //railColor: '#fff',
                //railOpacity: 0.3,
                railOpacity: 0,
                railVisible: true,
                allowPageScroll: true
            });
            $('.slimScrollDiv').css({
                'float': 'left',
                'margin-right': '-100%',
                //'margin-top': '10px',
                //'padding-left': '5px'
            });

            $("#deleteIcon").click(function () {
                if ($("#deleteIcon .bottom").hasClass("deleteIconHidden")) {
                    $("#deleteIcon .top").addClass("deleteIconHidden", 500);
                    $("#deleteIcon .bottom").removeClass("deleteIconHidden", 500);
                    //添加删除小图标
                    $(".removeflot").addClass("removeIcon");
                    $(".removeflot.removeIcon").click(function () {
                        var placeholderId = $(".flot-placeholder", $(this).parent()).attr("id");
                        if ($.facebox.intervals[placeholderId]) {
                            clearInterval($.facebox.intervals[placeholderId]);
                        }
                        $(this).parent().remove();
                        if ($(".flot-placeholder").length == 0) {
                            $("#deleteIcon").click();
                        }
                        //恢复左侧列表
                        var chartId = $(this).parent().attr("id");
                        restoreDragItems(chartId);
                    });
                } else {
                    $("#deleteIcon .top").removeClass("deleteIconHidden", 500);
                    $("#deleteIcon .bottom").addClass("deleteIconHidden", 500);
                    //去掉删除小图标
                    $(".removeflot.removeIcon").removeClass("removeIcon");
                }
            });
            /*
             $(window).unload(function(){
             var savedPlots = DashboardICT.saveSelectedPlots();
             //alert("Goodbye!" + savedPlots);
             });

             if ($.cookie && $.cookie('dashboard_selected')){
             plotsSelected = $.cookie('dashboard_selected').split(",");
             }
             */
            $.ajax({
                async: false,
                "type": "GET",
                url: "/ngict/rest/dashboard/initcharts",
                dataType: "json",
                "success": function (res, textStatus, jqXHR) {
                    //初始化已选图例
                    plotsSelected = res;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                }
            });

            //初始化已选图例
            if (plotsSelected && plotsSelected.length > 0) {
                for (var i = 0; i < plotsSelected.length; i++) {
                    /* var portlets = $(".portlet-sortable");
                     var maxIndex = portlets.length -1;
                     addDraggablePortlet(portlets[maxIndex], plotsSelected[i]); */
                    addDraggablePortlet($(".column.sortable")[i % 3], plotsSelected[i]);
                }
            }

            //$( ".sidebar-toggler" ).click();
            $("#cf5 img.top").addClass("scale");
            $("#cf5 img.bottom").addClass("rotate");
            $(".plotsWrapper").addClass("dashboardExpand");
            $(".plotItemsSelectionWrapper").addClass("sideBarClose");

            $('.slimScrollBar').hide();
            window.onresize = function () {
                DashboardICT.removeYaxisScale();
            }
        },

        saveSelectedPlots: function () {
            var placeholders = [];
            var plots = $(".flot-placeholder");
            $.each(plots, function (index, plot) {
                placeholders.push($(plot).attr('id'));
            });
            plotsSelected = [];
            for (var chartObj in chartObjs) {
                if (jQuery.inArray(chartObjs[chartObj].placeholderId, placeholders) > -1) {
                    plotsSelected.push(chartObj);
                }
            }
            if ($.cookie) {
                $.cookie('dashboard_selected', plotsSelected);
            }
            return plotsSelected;
        },

        addPlotControlCallbacks: function (plotId, callback) {
            plotControlCallbacks[plotId] = callback;
        },

        addPlotControlHtmlFrags: function (plotId, htmlFrag) {
            plotControlHtmlFrags[plotId] = htmlFrag;
        },

        graphChangeToExpand: function (placeholderId) {
            var graphToExpand = $("div#" + placeholderId + " > svg > g")[0];
            $(graphToExpand).attr("id", "graphToExpand_" + placeholderId);
            var faceboxDivId = $($("div[flot_id=" + placeholderId + "]")[0]).attr("id");
            var gNode = d3.select("g#graphToExpand_" + placeholderId);
            gNode.attr("href", "#" + faceboxDivId);
            gNode.attr("rel", "facebox");
            $('g[rel*=facebox]').facebox();
        },

        setGraphChangeToExpand: function (placeholderId, callbackObj) {
            $.facebox.flotRedrawCallbackObjs[placeholderId] = callbackObj;
        },

        registerChartsToReDraw: function (placeholderId, chartObj) {
            $.facebox.charts[placeholderId] = chartObj;
        },

        registerIntervalsToClear: function (placeholderId, intervalId) {
            $.facebox.intervals[placeholderId] = intervalId;
        },

        graphIsExpanded: function (placeholderId) {
            return $.facebox.isExpand(placeholderId);
        },

        removeYaxisScale: function () {
            var lines = d3.selectAll(".c3-axis.c3-axis-y").selectAll(".tick line");
            $(lines).each(function () {
                $(this).attr("x2", "0");
            });
        }
    }
}();