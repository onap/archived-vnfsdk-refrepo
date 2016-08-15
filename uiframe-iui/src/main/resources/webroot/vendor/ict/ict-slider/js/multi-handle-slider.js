var vmMultiHandleSlider = function (controller) {
    return avalon.define({
        $id: controller,
        items: [],
        $setItems: function (items) {
            this.items = items;
            for (var i = 0; i < items.length; i++) {
                this.handleValues.push(items[i].value);
                this.handleTips.push(items[i].name);
            }
        },
        handleTips: [],
        $setHandleTips: function (tips) {
            this.handleTips = tips;
        },
        handleValues: [],
        $setHandleValues: function (values) {
            this.handleValues = values;
        },
        $initSlider: function (sliderDivId, wrapperId) {
            var that = this;

            if (this.handleValues.length != this.handleTips.length || this.handleValues.length != this.items.length) {
                alert("handle value and tips dis-match!");
                return;
            }

            var tooltip = '<div class="tooltip tooltip-style"><div class="tooltip-inner tooltip-text">$value</div></div>' +
                '<div class="tooltip tooltip-style-bottom"><div class="tooltip-inner tooltip-label">$type</div></div>';

            var showLabel = function (event, ui) {
                //防止滑块碰撞
                for (var i = 0; i < that.handleValues.length; i++) {
                    if (ui.values[i] >= ui.values[i + 1]) {
                        return false;
                    }
                }

                var curValue = ui.value || $(this).slider("option", "value");
                var target = ui.handle || $('.ui-slider-handle');
                var handleId = $(target).attr("handleId");
                if ($(target).parents(".sliderWrapper").attr("classId") == "count")
                    $(target).html(tooltip.replace("$value", curValue).replace("$type", that.handleTips[handleId]));
                else
                    $(target).html(tooltip.replace("$value", curValue + "%").replace("$type", that.handleTips[handleId]));

                var handleInt = parseInt(handleId);
                that.items[handleInt].value = curValue;
            }

            var sliderAlarm = $("div#" + sliderDivId).slider({
                min: 0,
                max: 100,
                values: this.handleValues,
                slide: showLabel
            });

            for (var i = 0; i < this.handleTips.length; i++) {
                $($('#' + wrapperId + ' .ui-slider-handle')[i]).attr("handleId", i).html(tooltip.replace("$value", 20 * (i + 1) + "%").replace("$type", this.handleTips[i]));
            }

        }
    });
}