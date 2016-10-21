var serverPageTable = {};
var queryCacheId = null;
var alarmCount;
/* Bootstrap style full number pagination control */
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings) {
    return {
        "iEnd": oSettings.fnDisplayEnd(),
        "iLength": oSettings._iDisplayLength,
        "iTotal": oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
        "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
};

$.extend($.fn.dataTableExt.oPagination, {
    "bootstrap_extended": {
        "fnInit": function (oSettings, nPaging, fnDraw) {
            var oLang = oSettings.oLanguage.oPaginate;
            var oPaging = oSettings.oInstance.fnPagingInfo();

            var fnClickHandler = function (e) {
                e.preventDefault();
                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                    fnDraw(oSettings);
                }
            };

            $(nPaging).append(
                '<div class="pagination-panel"> ' + oLang.sPage + ' ' +
                '<a href="#" class="btn btn-sm default prev disabled" title="' + oLang.sPrevious + '"><i class="fa fa-angle-left"></i></a>' +
                '<input type="text" class="pagination-panel-input input-mini input-inline input-sm" maxlenght="5" style="text-align:center; margin: 0 4px; border: 1px solid rgb(169, 169, 169);height: 28px;">' +
                '<a href="#" class="btn btn-sm default next disabled" title="' + oLang.sNext + '"><i class="fa fa-angle-right"></i></a> ' +
                oLang.sPageOf + ' <span class="pagination-panel-total"></span>' +
                '</div>'
            );

            var els = $('a', nPaging);

            $(els[0]).bind('click.DT', {action: "previous"}, fnClickHandler);
            $(els[1]).bind('click.DT', {action: "next"}, fnClickHandler);

            $('.pagination-panel-input', nPaging).bind('change.DT', function (e) {
                var oPaging = oSettings.oInstance.fnPagingInfo();
                e.preventDefault();
                var page = parseInt($(this).val());
                if (page > 0 && page < oPaging.iTotalPages) {
                    if (oSettings.oApi._fnPageChange(oSettings, page - 1)) {
                        fnDraw(oSettings);
                    }
                } else {
                    $(this).val(oPaging.iPage + 1);
                }
            });

            $('.pagination-panel-input', nPaging).bind('keypress.DT', function (e) {
                var oPaging = oSettings.oInstance.fnPagingInfo();
                if (e.which == 13) {
                    var page = parseInt($(this).val());
                    if (page > 0 && page < oSettings.oInstance.fnPagingInfo().iTotalPages) {
                        if (oSettings.oApi._fnPageChange(oSettings, page - 1)) {
                            fnDraw(oSettings);
                        }
                    } else {
                        $(this).val(oPaging.iPage + 1);
                    }
                    e.preventDefault();
                }
            });
        },

        "fnUpdate": function (oSettings, fnDraw) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

            if (oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if (oPaging.iPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }


            for (i = 0, iLen = an.length; i < iLen; i++) {
                var wrapper = $(an[i]).parents(".dataTables_wrapper");

                if (oPaging.iTotalPages <= 0) {
                    $('.pagination-panel, .dataTables_length', wrapper).hide();
                } else {
                    $('.pagination-panel, .dataTables_length', wrapper).show();
                }

                $('.pagination-panel-total', an[i]).html(oPaging.iTotalPages);
                $('.pagination-panel-input', an[i]).val(oPaging.iPage + 1);

                // Remove the middle elements
                $('li:gt(1)', an[i]).filter(':not(.next)').remove();

                // Add the new list items and their event handlers
                for (j = iStart; j <= iEnd; j++) {
                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                        .insertBefore($('li.next:first', an[i])[0])
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                            fnDraw(oSettings);
                        });
                }

                // Add / remove disabled classes from the static elements
                if (oPaging.iPage === 0) {
                    $('a.prev', an[i]).addClass('disabled');
                } else {
                    $('a.prev', an[i]).removeClass('disabled');
                }

                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                    $('a.next', an[i]).addClass('disabled');
                } else {
                    $('a.next', an[i]).removeClass('disabled');
                }
            }
        }
    }
});

//构造查询条件
serverPageTable.getRestPara = function (cond, tableSetting) {

	var conditions =  {};
	//告警级别
	if (cond.severity != null && cond.severity != "undefined" && cond.severity.length > 0) {
		var severity = '['+cond.severity+']';
        var severityObj = window.JSON.parse(severity);
		conditions.severities=severityObj;
    }
	
	//确认状态
	if (cond.ackState != null && cond.ackState != "undefined" && cond.ackState.length > 0) {
        var ackState = '[' + cond.ackState + ']';
        var ackStateObj = window.JSON.parse(ackState)
        conditions.ackStates=ackStateObj;
    }
	
	//可见性
	if (cond.filterState != null && cond.filterState != "undefined" && cond.filterState.length > 0) {
        var filterState = '[' + cond.filterState + ']';
        var filterStateObj = window.JSON.parse(filterState);
        conditions.isVisibles=filterStateObj;
    }
	
	//告警确认时间
	if (cond.ackTimeMode != null && cond.ackTimeMode != "undefined") {
		var ackTime;
		if(cond.ackTimeMode === 1){
			ackTime = '{"timeMode": '+cond.ackTimeMode+',"relativeTime": '+cond.ackRelativeTime+'}';
		}else{
			ackTime = '{"beginTime": '+cond.ackTimeStarTime+',"endTime": '+cond.ackTimeEndTime+',"timeMode": '+cond.ackTimeMode+'}';
		}
        var ackTimeObj = window.JSON.parse(ackTime);
        conditions.ackTime = ackTimeObj;
    }

	//告警发生时间
    if (cond.alarmRaisedTimeMode != null && cond.alarmRaisedTimeMode != "undefined") {
		var alarmRaisedTime;
		if(cond.alarmRaisedTimeMode === 1){
			alarmRaisedTime = '{"timeMode": '+cond.alarmRaisedTimeMode+',"relativeTime": '+cond.alarmRaisedRelativeTime+'}';
		}else{
			alarmRaisedTime = '{"beginTime": '+cond.alarmRaisedStartTime+',"endTime": '+cond.alarmRaisedEndTime+',"timeMode": '+cond.alarmRaisedTimeMode+'}';
		}
        var alarmRaisedTimeObj = window.JSON.parse(alarmRaisedTime);
        conditions.alarmRaisedTime = alarmRaisedTimeObj;
    }
	
	//告警清除时间
	if (cond.clearedTimeMode != null && cond.clearedTimeMode != "undefined") {
		var clearedTime;
		if(cond.clearedTimeMode === 1){
			clearedTime = '{"timeMode": '+cond.clearedTimeMode+',"relativeTime": '+cond.clearedTimeRelativeTime+'}';
		}else{
			clearedTime = '{"beginTime": '+cond.clearedTimeStartTime+',"endTime": '+cond.clearedTimeEndTime+',"timeMode": '+cond.clearedTimeMode+'}';
		}
        var clearedTimeTimeObj = window.JSON.parse(clearedTime);
        conditions.alarmClearedTime = clearedTimeTimeObj;
    }

	//告警码
	if (cond.probableCause != null && cond.probableCause != "undefined") {
        //var probableCauseArr = cond.probableCause.split(',');
        var str = "";
		var arr="[";
        for (var i = 0; i < cond.probableCause.length; i++) {
			if(i === 0){
				if(cond.probableCause[i].type === "1"){
					arr+='{"systemType":'+cond.probableCause[i].codeid+',"codes":[]}';
				}else{
					arr+='{"systemType":'+cond.probableCause[i].parentid+',"codes":['+cond.probableCause[i].codeid+']}';
				}
			}else{
				if(cond.probableCause[i].type === "1"){
					arr+=',{"systemType":'+cond.probableCause[i].codeid+',"codes":[]}';
				}else{
					arr+=',{"systemType":'+cond.probableCause[i].parentid+',"codes":['+cond.probableCause[i].codeid+']}';
				}
			}		
        }
		arr+="]";
		var probableCausesObj = window.JSON.parse(arr);
        conditions.probableCauses = probableCausesObj;      
    }
	
	var requests={};
	requests.condition=conditions;
	requests.pageSize=tableSetting._iDisplayLength;
	requests.pageNumber=tableSetting._iDisplayStart / tableSetting._iDisplayLength + 1;
	if(cond.alarmType===2 && requests.pageNumber === 1){
		requests.queryCacheId="";
	}else if(cond.alarmType===2 && requests.pageNumber != 1){
		requests.queryCacheId=queryCacheId;
	}
	
	var resStr = window.JSON.stringify(requests);
	result={
		request:resStr
	};
	return result;
};


serverPageTable.initDataTable = function (setting, cond, divId) {
    //转换colomn
    var column = setting.columns;
	var setting;
    //先把原来的表格清空
    $('#' + divId).children().remove();
    var tableId = setting.tableId;
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= ' + tableId + '>'
        + '<thead>'
        + '<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        + '<tbody>'
        + '</tbody>'
        + '</table>';
    $('#' + divId).append(tableEleStr);
    //$('#'+ tableId).append(' <thead><tr role="row" class="heading" ></tr></thead><tbody></tbody>');
    var trEle = $('#' + tableId + ' > thead >tr');
    //var dataTableColumn = [];
    for (var one in column) {
        if (one != "contains") {
            var th = '<th>' + column[one].name + '</th>';
            trEle.append(th);
        }
    }
	
    var table = $("#" + tableId).dataTable({
        //"sDom" : "tr<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'pli>>", // datatable layout
        // "sDom" : "<'row'<'col-md-12 col-sm-12'lip>r><'table-scrollable't>>",
        "oLanguage": setting.language,//汉化
        "bJQueryUI": true,
        "bPaginate": true,// 分页按钮
        "bFilter": false,// 搜索栏
        "bAutoWidth": true,//自动设置列宽
        "bLengthChange": true,// 每行显示记录数
        "iDisplayLength": 10,// 每页显示行数
        "bSort": false,// 排序
        "bInfo": true,// Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
        "bWidth": true,
        "bScrollCollapse": false,
		"sScrollY": "400px",
        "sScrollX": "100%",
        "sPaginationType": "bootstrap_extended", // 分页，  bootstrap_extended  一共两种样式 另一种为two_button // 是datatables默认
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bSortCellsTop": true,
        "sDom": '<"top"rt><"bottom"lip>',
        "sAjaxSource": setting.restUrl,// ./js/testJson.json  setting.restUrl
        "aoColumns": setting.columns,
		"bRetrieve": true,
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                "type": 'get',
                "url": sSource,
                "dataType": "json",
                "data": serverPageTable.getRestPara(cond, oSettings),
                "success": function (resp) {
                    oSettings.iDraw = oSettings.iDraw + 1;
					
					var data = {};
					if(cond.ruleType===1){
						var logList = resp.alarms;
						data.iTotalRecords = resp.totalCount;
						data.iTotalDisplayRecords = resp.totalCount;
						
					}else if(cond.ruleType===2){
						var logList = resp.alarms;
						if(resp.queryCacheId === ""){
							data.iTotalRecords = alarmCount;
							data.iTotalDisplayRecords = alarmCount;
						}else{
							alarmCount = resp.totalCount;
							data.iTotalRecords = resp.totalCount;
							data.iTotalDisplayRecords = resp.totalCount;
							queryCacheId = resp.queryCacheId;
						}

					}
					
                    var pageInfo = null;
					setting=oSettings;
                    if (pageInfo != null) {
                        vm.logInfo[vm.logType].pageInfo = pageInfo;
                    }
                    
					//添加序号
					 for(var i=0;i<logList.length;i++){
						logList[i].order="<a>"+(i+1)+"</a>";	
					} 
					//组合告警码
					 for(var i=0;i<logList.length;i++){
						logList[i].probableCauseCodeNameAndCode=logList[i].probableCauseCodeName+"("+logList[i].probableCauseCode+")";	
					} 
							
                    data.aaData = logList;
                    data.sEcho = oSettings;
                    fnCallback(data);                   

                    $('#dataTableCheckBox').click(function () {
                        var checkArr = $('#' + divId + ' .details-check input[type="checkbox"]');//
                        for (var i = 0; i < checkArr.length; i++) {
                            if ($(checkArr).eq(i).attr('id') != 'dataTableCheckBox') {
                                if ($('#dataTableCheckBox').prop("checked")) {
                                    $(checkArr).eq(i).removeClass('checked');
									$(checkArr).eq(i).prop('checked',true);
                                } else {
                                    $(checkArr).eq(i).addClass('checked');
									$(checkArr).eq(i).prop('checked',false);
                                }
                            }
						}
                    });			
                }

            });
        },
		"fnDrawCallback": function( oSettings ) { // run some code on table redraw		
			
			var tableWrapper = $('div.dataTables_wrapper');
			//自适应对齐表头
			var $tableHead = $('div.dataTables_scrollHeadInner > table.dataTable', tableWrapper);
			var tbodyHead = $('tbody', $tableHead);
			if(tbodyHead && tbodyHead.length >0){
				$(tbodyHead).remove();
			}

			var $tableBody = $('table#' + tableId, tableWrapper);
			var trIn = $('thead > tr:nth-child(1)', $tableHead);
			var trBodyHead = $('thead > tr:nth-child(1)', $tableBody);
			var tds = $(trIn).children();
			var ths = $(trBodyHead).children();
			for(var k=0;k<tds.length;k++){
				$(ths.eq(k)).html('<div style="height: 0;overflow: hidden;">' + tds.eq(k).html() + '</div>');
			}
			var bodyRows = $('tbody > tr', $tableBody);
			for(var i=0;i<bodyRows.length;i++){
				var rowClone = $(bodyRows.eq(i)).clone();
				var tds = $(rowClone).children();
				for(var j=0;j<tds.length;j++){
					$(tds.eq(j)).html('<div style="height: 0;overflow: hidden;">' + tds.eq(j).html() + '</div>');
					$(tds.eq(j)).height('0px');
					$(tds.eq(j)).css('padding-top','0px');
					$(tds.eq(j)).css('padding-bottom','0px');
					$(tds.eq(j)).css('border-top-width','0px');
					$(tds.eq(j)).css('border-bottom-width','0px');
				}
				$(rowClone).height('0px');
				$tableHead.append($(rowClone).prop("outerHTML"));
			}

			$('div.dataTables_scrollBody', tableWrapper).css('width','100%');
			//$('div.dataTables_scrollHead', tableWrapper).css('width','98.5%');
			$('div.dataTables_scrollHeadInner', tableWrapper).css('padding-right', 0);
			
			//$("table.dataTable > thead > tr > th:nth-child(2)", $(".dataTables_scrollHeadInner")).click();
			
			//设置表格本体高度
			//$('div.dataTables_scrollBody', tableWrapper).css('height', "280px");
			//填充表头右边界
            /* $('div.dataTables_scrollHead', tableWrapper).css('display','inline-block');
            $("div.dataTables_scrollHead", tableWrapper).after("<div id='divRightPadding' style='overflow: hidden; background:#eee; position: relative; float:right; border: 1px solid #ddd; height:" + 42 + "px; width: 1.4%;'></div>"); */
            /* if($.browser.mozilla){
                $('div#divRightPadding', tableWrapper).css('height', '40');
            } */
		}
    });

	$(window).bind('resize', function () {
		//oTable.DataTable.models.oSettings.bAjaxDataGet = false;
		table.fnAdjustColumnSizing(setting);
	} );

    function format_Detail(oTable, nTr) {
        var aData = oTable.fnGetData(nTr);

		var sOut = '<table class = "detailTable" width="100%">';
        sOut += '<tr><td class = "detailTitleStyle" width = 160><span class = "label label-primary">' + column[3].name + '</span></td><td class = "detailCellStyle" width = 320>' + null2space(aData[column[3].mData]) + '</td>';
        sOut += '<td class = "detailTitleStyle" width = 160><span class = "label label-primary">' + column[8].name + '</span></td><td class = "detailCellStyle" width = 320>' + null2space(vm.alTypes[aData[column[8].mData]]) + '</td></tr>';
		
        sOut += '<tr><td class = "detailTitleStyle" width = 80><span class = "label label-primary">' + column[9].name + '</span></td><td class = "detailCellStyle" width = 160>' + null2space(aData[column[9].mData]) + '</td>';
        sOut += '<td class = "detailTitleStyle" width = 80><span class = "label label-primary">' + column[7].name + '</span></td><td class = "detailCellStyle" width = 160>' + null2space(aData[column[7].mData]) + '</td></tr>';

        sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[6].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[6].mData]) + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[11].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[11].mData]) + '</td></tr>';
		
        sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[10].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[10].mData]) + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[13].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[13].mData]) + '</td></tr>';

        sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[12].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[12].mData]) + '</td>';
        sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[5].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[5].mData]) + '</td></tr>';
		
        sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[23].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[23].mData]) + '</td>';
		sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[4].name + '</span></td><td class = "detailCellStyle">' + null2space(aData[column[4].mData]) + '</td></tr>';
   //     sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[5].name + '</span></td><td class = "detailCellStyle">' + aData[column[5].mData] + '</td></tr>';
		
     //   sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[4].name + '</span></td><td class = "detailCellStyle">' + aData[column[4].mData] + '</td>';
	//	sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[22].name + '</span></td><td class = "detailCellStyle">' + aData[column[22].mData] + '</td></tr>';
    //    sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[22].name + '</span></td><td class = "detailCellStyle">' + aData[column[22].mData] + '</td></tr>';
		
    //    sOut += '<tr><td class = "detailTitleStyle"><span class = "label label-primary">' + column[12].name + '</span></td><td class = "detailCellStyle">' + aData[column[12].mData] + '</td>';
     //   sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[17].name + '</span></td><td class = "detailCellStyle">' + aData[column[17].mData] + '</td></tr>';

        sOut += '<td class = "detailTitleStyle"><span class = "label label-primary">' + column[16].name + '</span></td><td class = "detailCellStyle" colspan = 3>' + null2space(aData.additionalText) + '</td></tr>';
		
        return sOut;
    }
	function null2space(nullStr){
		if(nullStr == null){
			return "";
		} else {
			return nullStr;
		}
	}
    $('#' + tableId + '>tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        //var nTr = $(this).parents('tr')[0];
        //var row = table.row( tr );
        if (table.fnIsOpen(tr[0])) {
            table.fnClose(tr[0]);
            //if ( row.child.isShown() ) {
            // This row is already open - close it
            //row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            table.fnOpen(tr[0], format_Detail(table, tr[0]), 'details');
            //row.child( format_Detail(row.data()) ).show();
            tr.addClass('shown');
        }
    });

    // mod by chenhao 2015-10-26 注释掉
    // // 所有td注册一个点击事件用来展示出详情。
    // $('#ict_alarms_table >tbody').on('click', 'td', function () {
           
    //         var className= $(this).eq(0).attr('class');
    //         //当点击的是如下的table页的时候
    //         if(className &&(className.indexOf('relInfo')>-1 || className.indexOf('details-check')>-1 || className.indexOf('ackState')>-1  || className.indexOf('details-control')>-1)){
    //             $('#right-menu').fadeOut();
    //         }else{
    //             //填充table的数据
    //             var tbody=$('#ict_table_general >tbody');
    //             tbody.children().remove();
    //             var trHtml="";
    //             var tr = $(this).closest('tr'); 
    //             var aData = table.fnGetData(tr[0]);
    //             for (var i = 0; i < column.length; i++) {
    //             if( column[i].bVisible == false ){//如果列可见就继续遍历下一个
    //                 trHtml += '<tr role="row"><td>'+column[i].name+':</td><td>' + aData[column[i].mData] + '</td></tr>';
    //                }
    //             }
    //             tbody.append(trHtml);
    //             if(!vm.alarmId ||vm.alarmId==aData.alarmId){
    //                 $('#right-menu').fadeToggle();
    //             }else{
    //                 $('#right-menu').fadeIn();
    //             } 
    //              vm.alarmId=aData.alarmId;  
    //         }  
    // });
	//重新调节列宽以适应window resize
    $(window).bind('resize', function () {
        //oTable.fnAdjustColumnSizing();
		$("table.dataTable > thead > tr > th:nth-child(2)", $(".dataTables_scrollHeadInner")).click();
    } );

};




