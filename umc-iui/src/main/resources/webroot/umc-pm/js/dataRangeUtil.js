var dataRangeUtil={};
/*

 初始化组件

 @param parentId     父组件的ID。

 @param dataRangeId  插入的日历组件的ID

 */

dataRangeUtil.initDataRang = function (parentId, dataRangeId, title, vm) {
    //拼接插入的html
    var htmlStr = jointDataRange(dataRangeId, title);
    $('#' + parentId).append(htmlStr);

    //调用datarangepicker组件生成 datarange
    setDateRange(dataRangeId, vm);

    //增加日期文本框数值按钮点击事件
    $('button[upname=' + dataRangeId + ']').click(function () {
        //当复选框选中时   
        if($('#'+dataRangeId+'Check').parent().hasClass('checked')){    
            var num = $(this).parent().prev('input[type="text"]').eq(0).val();
            var type = $(this).parent().parent().next().val();
            $(this).parent().prev('input[type="text"]').val(parseInt(num) + 1);
            $('#' + dataRangeId).val(reduceDate(new Date(), (parseInt(num) + 1), type) + ' - ' + new Date().format('yyyy-MM-dd'));
            setTime($('#' + dataRangeId));
        }
    })

    //减少日期文本框数值按钮点击事件
    $('button[downname=' + dataRangeId + ']').click(function () {
        //当复选框选中时   
        if($('#'+dataRangeId+'Check').parent().hasClass('checked')){   
            var num = $(this).parent().prev('input[type="text"]').eq(0).val();
            var type = $(this).parent().parent().next().val();
             if (parseInt(num) > 0) {
                 $(this).parent().prev('input[type="text"]').val(parseInt(num) - 1);
                $('#' + dataRangeId).val(reduceDate(new Date(), (parseInt(num) - 1), type) + ' - ' + new Date().format('yyyy-MM-dd'));
                setTime($('#' + dataRangeId));
            }
        }
    });

    $('input[tname=' + dataRangeId + ']').keyup(function () {
        //如果输入非数字，则替换为''，如果输入数字，则在每4位之后添加一个空格分隔
        this.value = this.value.replace(/[^\d]/g, '');
    })
    //文本框输入数字失去焦点后的事件
    $('input[tname=' + dataRangeId + ']').blur(function () {
    //当复选框选中时   
        if($('#'+dataRangeId+'Check').parent().hasClass('checked')){
            var type = $(this).parent().next().val();
            var num = $(this).val();
            $('#' + dataRangeId).val(reduceDate(new Date(), (parseInt(num)), type) + ' - ' + new Date().format('yyyy-MM-dd'));
            setTime($('#' + dataRangeId));
        }
    })
    //文本框按下键盘的事件
    $('input[tname=' + dataRangeId + ']').keydown(function (e) {
        //当复选框选中时   
        if($('#'+dataRangeId+'Check').parent().hasClass('checked')){  
            if (e.keyCode == 13) {
                var type = $(this).parent().next().val();
                var num = $(this).val();
                $('#' + dataRangeId).val(reduceDate(new Date(), (parseInt(num)), type) + ' - ' + new Date().format('yyyy-MM-dd'));
                setTime($('#' + dataRangeId));
            }
        }
    });

    //天、周、月、年下拉框内容改变事件。
    $('select[sname=' + dataRangeId + ']').change(function () {
    //当复选框选中时   
    if($('#'+dataRangeId+'Check').parent().hasClass('checked')){  
        var num = $('input[tname=' + dataRangeId + ']').val();
        var type = $(this).val();
        $('#' + dataRangeId).val(reduceDate(new Date(), (parseInt(num)), type) + ' - ' + new Date().format('yyyy-MM-dd'));
        var a=$('input[ckeckItemId='+dataRangeId+']'); 
        setTime($('#' + dataRangeId));
        }    
    })
  

    $('#'+dataRangeId+'Check').on('ifClicked',function(){
        var flag=$(this).parent().hasClass('checked');
        if(!flag){//被选中
           var relId=$(this).attr('ckeckitemid');
           if(relId=="dataRangeLocation"){
              vm.dataRangeLocationDisabled=false;  
           }else if(relId=="dataRangeType"){
              vm.dataRangeTypeDisabled=false;
           }else{
              vm.dataRangeDisabled=false;
           }
            setTime($('#' + dataRangeId));
        }else{//未选中
            var relId=$(this).attr('ckeckitemid');
            if(relId=="dataRangeLocation"){
                vm.dataRangeLocationDisabled=true;  
            }else if(relId=="dataRangeType"){
                vm.dataRangeTypeDisabled=true;
            }else{
                vm.dataRangeDisabled=true;
            }            
           $('#' + dataRangeId).val('');//清空日历text里的信息。
            $('select[sname=' + dataRangeId + ']  option').eq(0).attr('selected', 'true');//设置初始化下拉框
            $('input[tname=' + dataRangeId + ']').val('1');        //初始化text里的内容                    
        }
    })
}

/*根据ID拼接 datarange的html*/
function jointDataRange(dataRangeId, title) {
    var htmlStr = '<input value="请选择时间" dtitle="' + title + '"  id="' + dataRangeId + '"type="select" class="btn btn-default dropdown-toggle  dataRange" data-toggle="dropdown"></label></div>';
    return htmlStr;
}

/*
 设置dataRang组件的开始时间,结束时间。
 @param dataRangeId  组件ID
 @param startTime    开始时间  String 类型 yyyy-MM-dd
 @param endTime      结束时间  String 类型 yyyy-MM-dd
 */

dataRangeUtil.setDataRangeValue = function (dataRangeId, startTime, endTime) {
    $('input[id="' + dataRangeId + '"]').val(startTime + " - " + endTime);
    if(!$('#'+dataRangeId+'Check').parent().hasClass("checked")){ //如果未被选中
              vm.dataRangeDisabled=false;
              $('#'+dataRangeId+'Check').iCheck('check');
    }

}



/*

 获取dataRange组件的开始时间结束时间。

 @param dataRangeId  组件ID



 */

dataRangeUtil.getDataRangeValue = function (dataRangeId) {



    var value = $('#' + dataRangeId).val();

    var arr = value.split(" - ");//空格必须有

    return arr;

}





//调用datarangepicker组件生成 datarange

setDateRange = function (dataRangeId, vm) {
    var open = 'right';
    var month = "月";
    var optionSet1 = {
        //startDate: moment().subtract(179, 'days'),
        //endDate: moment(),
        startDate: "2015-08-02",
        endDate: "2015-08-03",
        format: 'YYYY-MM-DD',
        dateLimit: {days: 180},
        showWeekNumbers: false,
        opens: open,
        separator: ' - ',
        locale: {
            applyLabel: "确定",
            cancelLabel: "取消",
            fromLabel: "从",
            toLabel: "到",
            customRangeLabel: "自定义",
            daysOfWeek: [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"],
            monthNames: ['1' + month, '2' + month, '3' + month, '4' + month, '5' + month, '6' + month, '7' + month, '8' + month, '9' + month, '10' + month, '11' + month, '12' + month],
            firstDay: 1

        }

    };

    $('input[id="' + dataRangeId + '"]').bind('apply.daterangepicker', function () {
        //获取时间范围，查询
        // 都设置为0点
        setTime($(this));
    });
    $('input[id="' + dataRangeId + '"]').daterangepicker(optionSet1);
};





/*格式化日期*/

Date.prototype.format = function (format) {

    /*

     * format="yyyy-MM-dd hh:mm:ss";

     */

    var o = {

        "M+": this.getMonth() + 1,

        "d+": this.getDate(),

        "h+": this.getHours(),

        "m+": this.getMinutes(),

        "s+": this.getSeconds(),

        "q+": Math.floor((this.getMonth() + 3) / 3),

        "S": this.getMilliseconds()

    }



    if (/(y+)/.test(format)) {

        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4

        - RegExp.$1.length));

    }



    for (var k in o) {

        if (new RegExp("(" + k + ")").test(format)) {

            format = format.replace(RegExp.$1, RegExp.$1.length == 1

                ? o[k]

                : ("00" + o[k]).substr(("" + o[k]).length));

        }

    }

    return format;

}

function setTime($obj) {
    var title = $obj.attr('dtitle');
    var arr = $obj.val().split(' - ');
     //排除日历组件空字符串的情况。

    if(arr[0]!=''){

        var starTime = new Date(arr[0].replace(/-/g, "/")).getTime();

        var endTime = new Date(arr[1].replace(/-/g, "/")).getTime();



        if (title == "确认时间") {

            vm.fmConds.ackTimeStarTime = starTime;

            vm.fmConds.ackTimeEndTime = endTime;

        } else if (title == "发生时间") {

            vm.fmConds.alarmRaisedStartTime = starTime;

            vm.fmConds.alarmRaisedEndTime = endTime;

        } else if (title == "清除时间") {

            vm.fmConds.clearedTimeStarTime = starTime;

            vm.fmConds.clearedTimeEndTime = endTime;

        }

        refreshByCond();

    }   

}

/*
 @param type 1 day 2 week  3 month  4 year
 */
function reduceDate(date, val, type) {

    var d = new Date(date);

    if (type == 'day') {

        d.setDate(d.getDate() - val);

    } else if (type == 'week') {

        d.setDate(d.getDate() - val * 7);

    } else if (type == 'month') {

        d.setMonth(d.getMonth() - val);

    } else if (type == 'year') {

        d.setFullYear(d.getFullYear() - val);

    }

    var month = d.getMonth() + 1;

    var day = d.getDate();

    if (month < 10) {

        month = "0" + month;

    }

    if (day < 10) {

        day = "0" + day;

    }

    var val = d.getFullYear() + "-" + month + "-" + day;

    return val;

}
