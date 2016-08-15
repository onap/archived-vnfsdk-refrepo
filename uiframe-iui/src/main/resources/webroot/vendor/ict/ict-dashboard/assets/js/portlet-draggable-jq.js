var PortletDraggable = function () {

    return {
        //main function to initiate the module
        init: function () {

            if (!jQuery().sortable) {
                return;
            }

            $(".column").sortable({
                connectWith: ".column",
                items: ".portlet",
                opacity: 0.8,
                forceHelperSize: true,
                placeholder: 'portlet-sortable-placeholder',
                forcePlaceholderSize: true,
                tolerance: "pointer",
                helper: "clone",
                /* tolerance: "pointer",
                 forcePlaceholderSize: !0,
                 helper: "clone", */
                cancel: ".portlet-sortable-empty, .portlet-fullscreen", // cancel dragging if portlet is in fullscreen mode
                revert: 250, // animation in milliseconds
                update: function (b, c) {
                    if (c.item.prev().hasClass("portlet-sortable-empty")) {
                        c.item.prev().before(c.item);
                    }
                    //换位置后重绘图例
                    var portlet = $(c.item);
                    /* var placeHolderId = $("a > div", portlet).attr("flot_id");
                     if(placeHolderId){
                     var itemCallbackObj = $.facebox.flotRedrawCallbackObjs[placeHolderId];
                     var args = itemCallbackObj.arguments;
                     $.facebox.isDragged = true;
                     var placeHolder = $("div[id=" + placeHolderId + "]");
                     if($(placeHolder).length > 0){
                     $(placeHolder).empty();
                     //eChart的情况需要去掉_echarts_instance_属性才能重绘
                     if($(placeHolder).attr("_echarts_instance_")){
                     $(placeHolder).removeAttr("_echarts_instance_");
                     }
                     if(itemCallbackObj.callback && args.length > 0){
                     args[0] = placeHolderId;
                     itemCallbackObj.callback.apply(null, args);
                     }
                     }
                     $.facebox.isDragged = false;
                     } */
                    //刷新图例大小
                    var charts = $.facebox.charts;
                    for (var chart in charts) {
                        charts[chart].resize();
                    }
                    DashboardICT.removeYaxisScale();
                    //调整放大后的宽度
                    if ($(portlet).parent().hasClass("col-md-6")) {
                        $("a > div", portlet).addClass("flot-placeholder-wrapper-portlet-wide");
                    } else {
                        $("a > div", portlet).removeClass("flot-placeholder-wrapper-portlet-wide");
                    }
                }
            });
        }
    };
}();