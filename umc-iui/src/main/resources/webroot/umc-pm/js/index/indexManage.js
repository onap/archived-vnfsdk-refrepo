var index={};
newIndexWizard = function (idx,action) {
          //获取资源类型
		getResTypeArray();
		var resourceTypeId;
		var moTypeId;
         if(idx){
		    index=idx;
		    pm.index.vm.selectedResourceType=index.resourceType.name;
			resourceTypeId=index.resourceType.id;
			
			pm.index.vm.selectedMoType=index.moType.name;
			moTypeId=index.moType.id;
			
			pm.index.vm.indexName=index.name;
			pm.index.vm.indexDescription=index.indexDes;
			pm.index.vm.strExpresstion=index.strExpression;
			pm.index.vm.selectedDataType=getNameFromId(index.dataType,pm.index.vm.dataTypeArray);
		 }else{
			//默认取资源第一个的测量类型
			pm.index.vm.selectedResourceType=pm.index.vm.resTypeArray[0].name;
			resourceTypeId=pm.index.vm.resTypeArray[0].id;
			pm.index.vm.selectedDataType=pm.index.vm.dataTypeArray[0].name;
			}
			getMoTypeArray( pm.index.vm.resTypeArray[0].id);
			getCounterArray(resourceTypeId,moTypeId);
			
			 $(function () {
	      setTimeout(function(){
		    var height = $(".creat-index").height();
		  $(".fixed_side").height(height);
	       $('input[name=moType]').attr("checked", moTypeId); 
	        if(action=="query"){
			  $("input").attr("disabled", true);
              $("select").attr("disabled", true);	
             $('input[name=moType]').attr("disabled", true);
             	$('#counterDiv').hide();
                $('.countTable').hide();				
			}
		//侧栏跟随浏览器
		if ($(".fixed_side").length > 0) {
			var offset = $(".fixed_side").offset();
			var width = $(".fixed_side").width();
			$(window).scroll(function () {
				var scrollTop = $(window).scrollTop();
				//如果距离顶部的距离小于浏览器滚动的距离，则添加fixed属性。
				if (offset.top < scrollTop) {
					$(".fixed_side").addClass("fixed");
					$(".fixed_side").width(width);
				} else { //否则清除fixed属性
					$(".fixed_side").removeClass("fixed");
				}
			});
		}
	}, 100);	
	
});

     
}
      function  getResTypeArray(){
			var url="/api/umcpm/v1/resourcetypes";
			$.ajax({
                "type": 'get',
                "url": url,
                "dataType": "json",
				 "async": false,
                "success": function (resp) {
				    pm.index.vm.resTypeArray= resp.content;
                },
				"error":function(resp){
				  // pm.index.vm.ResTypeArray=resp; 
				}
            });
			}
			function  getMoTypeArray(resourceTypeId){
			 if(resourceTypeId){
			//获取测量类型
			var url="/api/umcpm/v1/moTypes";
			var data={};
			data.resourceTypeId=resourceTypeId;
			$.ajax({
                "type": 'get',
                "url": url,
				data:data,
                "dataType": "json",
				 "async": false,
                "success": function (resp) {
				    pm.index.vm.moTypeArray= resp.content;
                },
				"error":function(resp){
				  // pm.index.vm.ResTypeArray=resp; 
				}
            }); 
			}
			}
			function  getCounterArray(resourceTypeId,MoTypeId){
			if(resourceTypeId&&MoTypeId){
			var url="/api/umcpm/v1/motype/"+MoTypeId+"/counters";
			var data={};
			data.resourceTypeId=resourceTypeId;
			data.moTypeId=MoTypeId;
			$.ajax({
                "type": 'get',
                "url": url,
                "dataType": "json",
				data:data,
				 "async": false,
                "success": function (resp) {
				    pm.index.vm.counterArray= resp.content;
                },
				"error":function(resp){
				  // pm.index.vm.ResTypeArray=resp; 
				}
            }); 
			}
			}
			function getIdFromName(name,array){
			   for(var i=0;i<array.length;i++){
			      if(array[i].name==name){
				     return array[i].id;
				  }
			   }
			}
			function getNameFromId(id,array){
			   for(var i=0;i<array.length;i++){
			      if(array[i].id==id){
				     return array[i].name;
				  }
			   }
			}
			function getObjFromId(id,array){
			   for(var i=0;i<array.length;i++){
			      if(array[i].id==id){
				     return array[i];
				  }
			   }
			   return "";
			}
			function getObjFromName(name,array){
			   for(var i=0;i<array.length;i++){
			      if(array[i].name==name){
				     return array[i];
				  }
			   }
			}
		function submitIndex(){
		//获取计数器
		var selectedResourceType=getObjFromName(pm.index.vm.selectedResourceType,pm.index.vm.resTypeArray);
		var resourceType={};
		resourceType.id=selectedResourceType.id;
		resourceType.name=selectedResourceType.name;
		var selectedMoType=getObjFromId(pm.index.vm.selectedMoType,pm.index.vm.moTypeArray);
		var moType={};
		moType.id=selectedMoType.id;
		moType.name=selectedMoType.name;
		var id;
		var type="post";
		if(index){
		  id=index.id;
		  type="put";
		}
		var data = {
		    id:id,
			name: pm.index.vm.indexName,
			indexDes: pm.index.vm.indexDescription,
			strExpresstion: pm.index.vm.strExpresstion,
			dataType: getIdFromName(pm.index.vm.selectedDataType,pm.index.vm.dataTypeArray),
			resourceType: resourceType,
			moTypes: moType	
		}
		
		$.ajax({
            "dataType": 'json',
            "type": type,
            "url": "/api/umcpm/v1/motype/"+moType.id+"/indexes",
            "data": JSON.stringify(data),
            "contentType": 'application/json; charset=utf-8',
            "success": function (result, textStatus, jqXHR) {
                
            },
            "error": function () {
				
            }
        });
		}
			