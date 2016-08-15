var pm = {};
pm.index = {};
pm.index.vm = avalon.define({
        $id: "indexController",
		viewVisible: true,
        indexVisible: false,
		rtnVisible: false,
		title:$.i18n.prop('com_zte_ums_ict_pm_index_indexManagement'),
		resTypeArray : [],
		selectedResourceType : "",
		
		moTypeArray:[],
		selectedMoType:"",
		
		counterArray:[],
		selectedCounter:"",
		
		indexName:"",
		
		dataTypeArray:[
		{id:"STRING",name:"字符串"},
		{id:"INT",name:"整型"},
		{id:"FLOAT",name:"浮点数"},
		{id:"LONG",name:"长整型"},
		{id:"DATE",name:"时间类型"},
		{id:"PERSENT",name:"百分比"}
		],
		selectedDataType:"",
		
		strExpresstion:"",
		indexDescription:"",
		
		countArray:[
		{count:[7,8,9,"+"]},
		{count:[4,5,6,"-"]},
		{count:[1,2,3,"*"]},
		{count:[0,"00",".","/"]},
		],
		
        $indexTableFields: [
            {"mData": "id", name: "ID", "bVisible": false},
            {"mData": "name", sWidth: "15%", name: $.i18n.prop('com_zte_ums_ict_pm_index_indexName'),"fnRender": pmUtil.indexNameLink},
            {
                "mData": "dataType",
                sWidth: "10%",
                name: $.i18n.prop('com_zte_ums_ict_pm_index_dataType'),
				"fnRender":pmUtil.dataTypeRender
            },
            {
                "mData": "moType.name",
                sWidth: "20%",
                name: $.i18n.prop('com_zte_ums_ict_pm_index_moType')
            },
            {
                "mData": "resourceType.name",
                sWidth: "17%",
                name: $.i18n.prop('com_zte_ums_ict_pm_index_resourceType')
            },
			
			{
                "mData": "strExpression",
                sWidth: "17%",
                name: $.i18n.prop('com_zte_ums_ict_pm_index_strExpresstion')
            },
			{
                "mData": "operate",
                sWidth: "17%",
                name: $.i18n.prop('com_zte_ums_ict_pm_index_operate'),
                "fnRender": pmUtil.indexOperate
            }
        ] ,
        $language: {
            "sProcessing": "<img src='/web/newict/framework/thirdparty/data-tables/images/loading-spinner-grey.gif'/><span>&nbsp;&nbsp;处理中...</span>",
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
        $initTable: function () {
		    viewVisible=true;
			indexVisible=false;
            var setting = {};
            setting.language = pm.index.vm.$language;
            setting.columns = pm.index.vm.$indexTableFields;
			setting.pageHtml="<<'col-md-6 col-sm-6 addBtn'><r><'table-scrollable't><'row page-info-bottom'<'col-md-12 col-sm-12'lip>>>";
			setting.restUrl ="/api/umcpm/v1/motype/indexes";
            setting.tableId = "ict_index_table";
            serverPageTable.initDataTable(setting, 'ict_index_table_div' );
			$addBtn = $("<button id='addIndex' class='btn white radius_l' onclick=\"pmUtil.addIndex()\"><i class=\"ict-new \"></i>"+$.i18n.prop("com_zte_ums_ict_pm_action_add")+"</button>");
            $('.addBtn').append($addBtn);
        },
		 resTypeSelectAction:function(){
			  getMoTypeArray(getIdFromName(pm.index.vm.selectedResourceType,pm.index.vm.resTypeArray));
			  pm.index.vm.counterArray=[];
		},
		moTypeSelectAction:function(obj){
			 var resourceTypeId=getIdFromName(pm.index.vm.selectedResourceType,pm.index.vm.resTypeArray);
			 var moTypeId=$(obj).val();
             pm.index.vm.selectedMoType=moTypeId;			 
			 getCounterArray(resourceTypeId,moTypeId);
		},
		counterSelectAction:function(obj){
		     var counterId=$(obj).val();
			 pm.index.vm.selectedCounter=counterId;		
			 pm.index.vm.indexDescription+=pm.index.vm.selectedCounter;
		},
		countClick:function(obj){
		    pm.index.vm.indexDescription+=obj.value;
		},
		countDel:function(){
		    pm.index.vm.indexDescription=pm.index.vm.indexDescription.substring(0,(pm.index.vm.indexDescription.length-1));
		},
		returnListPage : function(){
		   window.location.href="./indexView.html";
	    },
		submit:function(){
	        submitIndex();
		}
    });
    //avalon.scan();
   

   
            
   pm.index.vm.$watch("indexDescription", function(newValue, oldValue){
         var bitArray=["+","-","*","/"];
		 var intArray=["0","1","2","3","4","5","6","7","8","9","00"];
       //第一个输入参数若非计数器，就给出提示
	    if(!oldValue){
	     if(newValue.substring(0,1)!='C'){
	      pm.index.vm.strExpresstion="公式解析错:公式中必须包含符合如下格式的计数器：计数器以'C'开头，'C'后面为取值范围在[1,4294967294]之间且为整数的计数器标识。";
	     }
		 else{
		   pm.index.vm.strExpresstion=newValue;
		 }
	   }
	   //如果公式text为空，那也清空“公式描述”列
	   if(!newValue){
	      pm.index.vm.strExpresstion="";
	   }
	   if(oldValue&&newValue){
	       var newLength=newValue.length;
		   var oldLength=oldValue.length;
		   //若长度相差大于一，说明添加的是计数器id
		   if(newLength-oldLength>1){
		      if(bitArray.indexOf(oldValue.substring(oldLength-1,oldLength))<0){
			    pm.index.vm.strExpresstion="公式解析错:字符'C'后面必须为取值范围在[1,999999999]之间且为整数的计数器标识";
		      }
			  else{
			    pm.index.vm.strExpresstion=newValue; 
			  }
		   }
		   else{
		     var oldValueArray=oldValue.split(/[+-/*]/);
		     //若最后两个字符均为运算符
	         if(bitArray.indexOf(newValue.substring(newLength-1,newLength))>=0
			 &&bitArray.indexOf(newValue.substring(newLength-2,newLength-1))>=0){
		       pm.index.vm.strExpresstion="公式解析错:两个运算符不能相连。";
		    }
			//若最后一个字符为数字，且前面是计数器的情况
		   else if(intArray.indexOf(newValue.substring(newLength-1,newLength))>=0){
			  if(getObjFromId(oldValueArray[oldValueArray.length-1],pm.index.vm.counterArray)){
			     pm.index.vm.strExpresstion="公式解析错:该测量类型下不存在此ID的计数器。";
			  }
		  }
		  else{
		     pm.index.vm.strExpresstion=newValue;
		  }
	   }
	   }
	   
	   
   })

    
            //初始化table
            pm.index.vm.$initTable();
			
			
		
        function  fnServerData(sSource, aoData, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                "type": 'get',
                "url": sSource,
                "dataType": "json",
                "success": function (resp) {
				     oSettings.iDraw = oSettings.iDraw + 1;
			         var data = {};
			         data.aaData = resp.content;
			        data.iTotalRecords = resp.content.length;
                    data.iTotalDisplayRecords = resp.content.length;
			        data.sEcho = oSettings;	
                    for(var i=0;i<data.aaData.length;i++){
					   //data.aaData[i].indexName=data.aaData[i].name;
					 }
			       fnCallback(data);	
                    
                },
				"error":function(resp){
				var data = {};
				     fnCallback(data);
				}
            });
        }
    














