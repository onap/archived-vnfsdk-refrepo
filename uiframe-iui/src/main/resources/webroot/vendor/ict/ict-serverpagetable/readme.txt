1、组件介绍：
   本组件基于jquery datatable开发，采用服务端分页的方式，界面翻页时，到服务端进行查询。

   对于列很多的情况，可以隐藏部分不重要的列，通过“+”展开一行记录来显示。

2、需要引用的其他文件

    <link href="/ngict/iui/component/thirdparty/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>

    <script src="/ngict/iui/component/thirdparty/data-tables/jquery.dataTables.js"></script>

3、接口

   serverPageTable.initDataTable = function( setting ,cond , divId) {}

   调用上面接口，则本组件会自动到服务器查询数据，并设置到页面上。

4、参数说明及应用举例

        var language = {            
            "sLengthMenu": $.i18n.prop("ngict-log-iui-table-sLengthMenu"),
            "sZeroRecords": $.i18n.prop("ngict-log-iui-table-sZeroRecords"),
            "sInfo": "<span class='seperator'>  </span>" + $.i18n.prop("ngict-log-iui-table-sInfo"),
            "sInfoEmpty": $.i18n.prop("ngict-log-iui-table-sInfoEmpty"),
            "sGroupActions": $.i18n.prop("ngict-log-iui-table-sGroupActions"),
            "sAjaxRequestGeneralError":$.i18n.prop("ngict-log-iui-table-sAjaxRequestGeneralError"),
            "sEmptyTable": $.i18n.prop("ngict-log-iui-table-sEmptyTable"),
            "oPaginate": {
                "sPrevious": $.i18n.prop("ngict-log-iui-table-sPrevious"),
                "sNext": $.i18n.prop("ngict-log-iui-table-sNext"),
                "sPage": $.i18n.prop("ngict-log-iui-table-sPage"),
                "sPageOf": $.i18n.prop("ngict-log-iui-table-sPageOf")
            }
        },

      var operLog = [
                {"mData": null, name: "", "sClass": 'details-control', "sWidth": '5%'},
                {"mData": "id", name: "ID", "bVisible": false},
                {"mData": "description", name: $.i18n.prop('ngict-log-iui-oper-field-description')},
                {"mData": "userName", name: $.i18n.prop('ngict-log-iui-oper-field-userName')},
                {"mData": "logRank", name: $.i18n.prop('ngict-log-iui-oper-field-logRank'), "sWidth": '12%', "fnRender": logUtil.cmdRankRender},
                {"mData": "operateSet", name: $.i18n.prop('ngict-log-iui-oper-field-operateSet'), "sWidth": '12%'},
                {"mData": "logDate", name: $.i18n.prop('ngict-log-iui-oper-field-logDate'), "fnRender": logUtil.timeRender},
                {"mData": "logEndDate", name: $.i18n.prop('ngict-log-iui-oper-field-logEndDate'), "fnRender": logUtil.timeRender},
                {"mData": "isSucceed", name: $.i18n.prop('ngict-log-iui-oper-field-isSucceed'), "sWidth": '9%', "fnRender": logUtil.cmdResultRender},
                {"mData": "failReason", name: $.i18n.prop('ngict-log-iui-oper-field-failReason'), "bVisible": false},
                {"mData": "host", name: $.i18n.prop('ngict-log-iui-oper-field-host')},
                {"mData": "resourceDn", name: $.i18n.prop('ngict-log-iui-oper-field-resourceDn'), "bVisible": false},
                {"mData": "detail", name: $.i18n.prop('ngict-log-iui-oper-field-detail'), "bVisible": false}
            ]
     var queryLogInfoUrl = '/ngict/rest/log/info/cmdlog',

     var getCond = function () {
            var cond = {};
            //通用的时间条件
            cond.startTime = new date();
            return cond;
        },


     initTable = function () {
            var setting = {};
            setting.language = language ;
            setting.columns = operLog;
            setting.restUrl = queryLogInfoUrl ;
            setting.tableId = "ict_log_table";
            serverPageTable.initDataTable(setting, getCond(), 'ict_log_table_div');
     }
  
      