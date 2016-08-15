var DashboardICT = function () {

    var chartObjs;
    var plotsSelected;
    var plotControlCallbacks = {};
    var plotControlHtmlFrags = {};

    var wall;

    var addDroppableItem = function () {
        $(".plotsWrapper").droppable({
            accept: ".draggableItems",
            drop: function (event, ui) {
                //var dropLocation = $( ".plotsWrapper" );
                var plotTypeId = $(ui.draggable).attr("id");
                if ($("#" + chartObjs[plotTypeId].placeholderId).length > 0) {
                    alert("Plot already exits!");
                    return;
                }
                addDraggablePortlet(plotTypeId);
            }
        });
    }

    var addDraggablePortlet = function (plotTypeId) {

        var portletId = chartObjs[plotTypeId].typeId;
        var portletLabel = chartObjs[plotTypeId].plotLabel;
        var placeholderId = chartObjs[plotTypeId].placeholderId;
        var plotCallback = eval(chartObjs[plotTypeId].plotCallbackName);
        var plotSize = "size11";
        if (chartObjs[plotTypeId].plotSize) {
            plotSize = chartObjs[plotTypeId].plotSize;
        }

        var faceboxDivIndex = $("a[rel=facebox]").length + 1;
        var portletHtml = '<div id="' + portletId + '" class="portlet portlet-sortable light bg-inverse ' + plotSize + ' brickDraggable">' +
            '<div class="portletLabel">' + portletLabel + '</div>' +
            '<div class="removeflot"></div>' +
            '<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox">' +
            '<div id="faceboxDiv_' + faceboxDivIndex + '" flot_id="' + placeholderId + '" class="flot-placeholder-wrapper-portlet">' +
            '<div id="' + placeholderId + '" class="flot-placeholder"></div>' +
            '</div>' +
            '</a>' +
            '</div>';

        if (chartObjs[plotTypeId].plotControlCallback) {
            portletHtml = '<div id="' + portletId + '" class="portlet portlet-sortable light bg-inverse ' + plotSize + '  brickDraggable">' +
            '<div class="portletLabel">' + portletLabel + '</div>' +
            '<div class="removeflot"></div>' +
            plotControlHtmlFrags[plotTypeId] +
            '<a href="#faceboxDiv_' + faceboxDivIndex + '" rel="facebox">' +
            '<div id="faceboxDiv_' + faceboxDivIndex + '" flot_id="' + placeholderId + '" class="flot-placeholder-wrapper-portlet">' +
            '<div id="' + placeholderId + '" class="flot-placeholder flot-placeholder-high"></div>' +
            '</div>' +
            '</a>' +
            '</div>';
        }

        //插入图例
        wall.prepend(portletHtml);
        wall.refresh($(".plotsWrapper").width(), $(".plotsWrapper").height());

        //添加图例控制回调
        if (chartObjs[plotTypeId].plotControlCallback) {
            plotControlCallbacks[plotTypeId](plotCallback, placeholderId);
        }

        plotCallback(placeholderId);

        var args = [placeholderId];
        $.facebox.flotRedrawCallbackObjs[placeholderId] = {
            callback: plotCallback,
            arguments: args
        }

        $.facebox.settings.closeImage = '/web/newict/framework/thirdparty/facebox/closelabel.png';
        $.facebox.settings.loadingImage = '/web/newict/framework/thirdparty/facebox/loading.gif';
        //$('a[rel*=facebox]').facebox();

        //addDroppableItem();

        //调整放大后的宽度
        var portlet = $("#" + portletId + ".portlet");
        /*if($(portlet).parent().hasClass("col-md-6")){
         $("a > div", portlet).addClass("flot-placeholder-wrapper-portlet-wide");
         }else{
         $("a > div", portlet).removeClass("flot-placeholder-wrapper-portlet-wide");
         }*/
        if (plotSize == "size21") {
            $("div[flot_id=" + placeholderId + "]").addClass("flot-placeholder-wrapper-portlet-wide");
        } else {
            $("div[flot_id=" + placeholderId + "]").removeClass("flot-placeholder-wrapper-portlet-wide");
        }
    }

    return {

        init: function () {

            $.ajax({
                async: false,
                "type": "GET",
                url: "/web/newict/framework/thirdparty/dashboard/DashboardConfig.json",
                dataType: "json",
                "success": function (res, textStatus, jqXHR) {
                    var plotItemsSelectionDiv = $(".plotItemsSelectionWrapper");
                    //初始化左边的图列类型列表
                    chartObjs = res.chartTypes;
                    var chartSelectHtml = "";
                    for (var chartObj in chartObjs) {
                        chartSelectHtml =
                            '<div id="' + chartObjs[chartObj].typeId + '" class="draggableItems">' +
                            '<img width="100%" height="100%" src="' + chartObjs[chartObj].imageURL + '">' +
                            '</div>';
                        $(plotItemsSelectionDiv).append(chartSelectHtml);
                    }
                    //初始化已选图例
                    plotsSelected = res.initPlots;
                },
                "error": function () {
                    alert("Config file load error!");
                }
            });

            //组件放大显示插件
            $.facebox.settings.closeImage = '../facebox/closelabel.png';
            $.facebox.settings.loadingImage = '../facebox/loading.gif';
            //$('a[rel*=facebox]').facebox();
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

                $(".plotsWrapper").toggleClass("dashboardExpand", 500, "linear");
                $(".plotItemsSelectionWrapper").toggleClass("sideBarClose", 500, "linear");

                setTimeout(function () {
                    wall.refresh($(".plotsWrapper").width(), $(".plotsWrapper").height());
                    setTimeout(function () {
                        var charts = $.facebox.charts;
                        for (var chart in charts) {
                            charts[chart].resize();
                        }
                    }, 700);
                }, 700);
            });
            $('.plotItemsSelectionWrapper').slimScroll({
                position: 'right',
                width: '177px',
                height: '610px',
                color: 'rgb(100, 150, 240)',
                railColor: '#fff',
                railOpacity: 0.3
            });
            $('.slimScrollDiv').css({
                'float': 'left',
                'margin-right': '-100%',
                'margin-top': '10px'
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
                    });
                } else {
                    $("#deleteIcon .top").removeClass("deleteIconHidden", 500);
                    $("#deleteIcon .bottom").addClass("deleteIconHidden", 500);
                    //去掉删除小图标
                    $(".removeflot.removeIcon").removeClass("removeIcon");
                }
            });
            //自由拖拽
            wall = new freewall("#freeDraggable");
            wall.reset({
                draggable: true,
                selector: '.portlet',
                animate: true,

                /*cellW: function(width) {
                 var cellWidth = width / 9;
                 return cellWidth + 10;
                 },*/
                cellW: 140,
                cellH: 125,
                /* cellW: 140,
                 cellH: 125, */
                delay: 50,
                fixSize: false,
                gutterY: 5,
                gutterX: 5,
                onResize: function () {
                    //wall.fitWidth();
                    wall.refresh($(".plotsWrapper").width(), $(".plotsWrapper").height());
                    //wall.refresh();
                    /* var callbackObjs = $.facebox.flotRedrawCallbackObjs;
                     for(var callbackObj in callbackObjs){
                     callbackObjs[callbackObj].callback.apply(null, callbackObjs[callbackObj].arguments);
                     } */
                    setTimeout(function () {
                        //wall.refresh($( ".plotsWrapper" ).width(), $( ".plotsWrapper" ).height());
                        var charts = $.facebox.charts;
                        for (var chart in charts) {
                            charts[chart].resize();
                        }
                    }, 700);
                },
                onBlockMove: function () {
                    //wall.fitWidth();
                    wall.refresh($(".plotsWrapper").width(), $(".plotsWrapper").height());
                    $(window).trigger("resize");
                    //console.log(this);
                }
            });
            //wall.fitWidth();
            wall.refresh($(".plotsWrapper").width(), $(".plotsWrapper").height());
            //wall.fitHeight();
            //wall.fitZone($( ".plotsWrapper" ).width(), $( ".plotsWrapper" ).height());
            $(window).trigger("resize");
            //初始化已选图例
            for (var i = 0; i < plotsSelected.length; i++) {
                addDraggablePortlet(plotsSelected[i]);
            }

            setTimeout(function () {
                var charts = $.facebox.charts;
                for (var chart in charts) {
                    charts[chart].resize();
                }
            }, 700);

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
            return plotsSelected;
        },

        addPlotControlCallbacks: function (plotId, callback) {
            plotControlCallbacks[plotId] = callback;
        },

        addPlotControlHtmlFrags: function (plotId, htmlFrag) {
            plotControlHtmlFrags[plotId] = htmlFrag;
        }
    }
}();