/*
 * Copyright 2016, CMCC Technologies Co., Ltd.
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
var serverPageTable = {};
/* Bootstrap style full number pagination control */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
    return {
        "iStart":         oSettings._iDisplayStart,
        "iEnd":           oSettings.fnDisplayEnd(),
        "iLength":        oSettings._iDisplayLength,
        "iTotal":         oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
        "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
    };
};

$.extend( $.fn.dataTableExt.oPagination, {
    "bootstrap_extended": {
        "fnInit": function( oSettings, nPaging, fnDraw ) {
            var oLang = oSettings.oLanguage.oPaginate;
            var oPaging = oSettings.oInstance.fnPagingInfo();

            var fnClickHandler = function ( e ) {
                e.preventDefault();
                if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                    fnDraw( oSettings );
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

            $(els[0]).bind('click.DT', { action: "previous" }, fnClickHandler );
            $(els[1]).bind('click.DT', { action: "next" }, fnClickHandler);

            $('.pagination-panel-input', nPaging).bind('change.DT', function(e) {
                var oPaging = oSettings.oInstance.fnPagingInfo();
                e.preventDefault();
                var page = parseInt($(this).val());
                if (page > 0 && page < oPaging.iTotalPages) {
                    if ( oSettings.oApi._fnPageChange(oSettings, page-1) ) {
                        fnDraw( oSettings );
                    }
                } else {
                    $(this).val(oPaging.iPage + 1);
                }
            });

            $('.pagination-panel-input', nPaging).bind('keypress.DT', function(e) {
                var oPaging = oSettings.oInstance.fnPagingInfo();
                if (e.which == 13) {
                    var page = parseInt($(this).val());
                    if (page > 0 && page < oSettings.oInstance.fnPagingInfo().iTotalPages) {
                        if ( oSettings.oApi._fnPageChange(oSettings, page-1) ) {
                            fnDraw( oSettings );
                        }
                    } else {
                        $(this).val(oPaging.iPage + 1);
                    }
                    e.preventDefault();
                }
            });
        },

        "fnUpdate": function ( oSettings, fnDraw ) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

            if ( oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if ( oPaging.iPage <= iHalf ) {
                iStart = 1;
                iEnd = iListLength;
            } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }


            for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
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
                for ( j=iStart ; j<=iEnd ; j++ ) {
                    sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                    $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                        .insertBefore( $('li.next:first', an[i])[0] )
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                            fnDraw( oSettings );
                        } );
                }

                // Add / remove disabled classes from the static elements
                if ( oPaging.iPage === 0 ) {
                    $('a.prev', an[i]).addClass('disabled');
                } else {
                    $('a.prev', an[i]).removeClass('disabled');
                }

                if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                    $('a.next', an[i]).addClass('disabled');
                } else {
                    $('a.next', an[i]).removeClass('disabled');
                }
            }
        }
    }
} );
serverPageTable.initDataTable = function( setting , divId ,pageInfos) {
    serverPageTable.pageInfo = pageInfos;
    //转换colomn

    var column = setting.columns;
    //先把原来的表格清空
    $('#'+ divId).children().remove();
    var tableId = setting.tableId;
    var tableEleStr = '<table class="table table-striped table-bordered table-hover" id= '+ tableId + '>'
        + '<thead>'
        +'<tr role="row" class="heading" >'
        + '</tr>'
        + '</thead>'
        +'<tbody>'
        +'</tbody>'
        +'</table>';
    $('#'+ divId).append(tableEleStr);
    //$('#'+ tableId).append(' <thead><tr role="row" class="heading" ></tr></thead><tbody></tbody>');
    var trEle = $('#'+ tableId  + ' > thead >tr');
    //var dataTableColumn = [];
    for ( var one in column){
        var th = '<th>' + column[one].name + '</th>';
        trEle.append(th);
    }
	 serverPageTable.pageInfo = pageInfos;
	if(!setting.pageHtml){
	   pageHtml="<'row'<'col-md-12 col-sm-12'lip>r><'table-scrollable't>>";
	}else{
	  pageHtml=setting.pageHtml;
	}
    var table = $("#" + tableId).dataTable({
        //"sDom" : "tr<'row'<'col-md-6 col-sm-12'><'col-md-6 col-sm-12'pli>>", // datatable layout
        "sDom" : pageHtml,
        "oLanguage": setting.language,//汉化
        "bJQueryUI": true,
        "bPaginate": true,// 分页按钮
        "bFilter": false,// 搜索栏
        "bAutoWidth":true,//自动设置列宽
        "bLengthChange": true,// 每行显示记录数
        "iDisplayLength": 10,// 每页显示行数
        "bSort": false,// 排序
        "bInfo": true,// Showing 1 to 10 of 23 entries 总记录数没也显示多少等信息
        "bWidth": true,
        "bScrollCollapse": true,
        "sPaginationType": "bootstrap_extended", // 分页，一共两种样式 另一种为two_button // 是datatables默认
        "bProcessing": true,
        "bServerSide": true,
        "bDestroy": true,
        "bSortCellsTop": true,
        "sAjaxSource": setting.restUrl,
        "aoColumns": setting.columns,
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {
           fnServerData(sSource, aoData, fnCallback, oSettings);
        }
    });
    $('#'+ tableId + '>tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        //var nTr = $(this).parents('tr')[0];
        //var row = table.row( tr );
        if ( table.fnIsOpen(tr[0]) ){
            table.fnClose( tr[0] );
        //if ( row.child.isShown() ) {
            // This row is already open - close it
            //row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            table.fnOpen( tr[0], format_Detail(table, tr[0],column) );
            //row.child( format_Detail(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
    return table; 


};




