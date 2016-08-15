// generate a random graph
var images = [
  './images/NS.png',
  './images/NS1.png',
  './images/VNF.png',
  './images/VNF1.png',
  './images/VDU.png',
  './images/VDU1.png',
  './images/VNFC.png',
  './images/VNFC1.png'
];

// definition node data global variable
var NSData , VNFCData, VDUData, VNFData;

// all link count
var edgeID = 0;

// ready 
$(document).ready(function()
{
	// definition resource interface url
	var nsUrl = "../../api/roc/v1/resource/nsrs";
	var vnfUrl = "../../api/roc/v1/resource/vnfs";
	var vduUrl = "../../api/roc/v1/resource/vdus";
	var vnfcUrl = "../../api/roc/v1/resource/vnfcs";
	
	// get JSON data
	$.ajaxSettings.async = false; // set ajax get json was synchronization
	
	// get ns
	$.ajax({
        "type": 'get',
        "url": nsUrl,   
        "dataType": "json",
        "success": function (resp) {
            if(resp.operationResult == "SUCCESS")
            {
            	NSData = resp;
            }
            else{
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      
    });
	
	// get vnf
	$.ajax({
        "type": 'get',
        "url": vnfUrl,   
        "dataType": "json",
        "success": function (resp) {
            if(resp.operationResult == "SUCCESS")
            {
            	VNFData = resp;
            }
            else{
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      
    });
	
	// get vdu
	$.ajax({
        "type": 'get',
        "url": vduUrl,   
        "dataType": "json",
        "success": function (resp) {
            if(resp.operationResult == "SUCCESS")
            {
            	VDUData = resp;
            }
            else{
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      
    });
	
	// get vnfc
	$.ajax({
        "type": 'get',
        "url": vnfcUrl,   
        "dataType": "json",
        "success": function (resp) {
            if(resp.operationResult == "SUCCESS")
            {
            	VNFCData = resp;
            }
            else{
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      
    });
	
	
	/*$.getJSON('../data/ns.json', function(data){ 
		NSData = data; 
	}); 
	
	$.getJSON('../data/vnfc.json', function(data){ 
		VNFCData = data; 
	});
	
	$.getJSON('../data/vdu.json', function(data){ 
		VDUData = data; 
	});
	
	$.getJSON('../data/vnf.json', function(data){ 
		VNFData = data; 
	});
	
	$.getJSON('../data/host.json', function(data){ 
		HOSTData = data; 
	});*/
	
	
    var Topo = new oTopo();
	var settings=
	{
		minNodeSize : 30,
		maxNodeSize : 40,
	    minEdgeSize: 1,
	    maxEdgeSize: 1,
		doubleClickZoomingRatio : 0,
		mouseZoomDuration : 1000,
	};
	Topo.canvas('NS', settings);
	
	// set the nodes can be drag and drop
	Topo.setDrag(true);
	
	// Disable the right mouse button for browser
	Topo.noright(document.body);
	
	
	// created NS node
	var NSSize = NSData.data.length;
	var VNFSize = VNFData.data.length;
	var vnfNum = 0;
	if(0 < NSSize)
	{
		for ( var i = 0; i < NSSize; i++)
		{
			var userPara = new Array();
			userPara.x = 0;
			userPara.y = 1;
			
			for (var j = 0; j < VNFSize; j++) {
				var relation = VNFData.data[j].relations;
				
				for (var k = 0; k < relation.length; k++) {
					if('belongTo' == relation[k].relationType && NSData.data[i].oid == relation[k].relatedId)
					{
						vnfNum ++;
					}
				}
				
			}
			if(0 < vnfNum)
			{
				userPara.image = images[1];
			}
			else
			{
				userPara.image = images[0];
			}
			Topo.addNode(creatNodeByJSON("NS", NSData.data[i], userPara, i + 1));
		}
	}
	else
	{
		var VDUSize = VDUData.data.length;
		var vduNum = 0;
		for ( var i = 0; i < VNFSize; i++)
		{
			var userPara = new Array();
			userPara.x = 0;
			userPara.y = 1;
			
			for (var j = 0; j < VDUSize; j++) {
				var relation = VDUData.data[j].relations;
				
				for (var k = 0; k < relation.length; k++) {
					if('belongTo' == relation[k].relationType && VNFData.data[i].oid == relation[k].relatedId)
					{
						vduNum ++;
					}
				}
				
			}
			if(0 < vduNum)
			{
				userPara.image = images[3];
			}
			else
			{
				userPara.image = images[2];
			}
			Topo.addNode(creatNodeByJSON("VNF", VNFData.data[i], userPara, i + 1));
		}
	}
	
	
	// When a node is clicked, we check for each node
	// if it is a neighbor of the clicked one. If not,
	// we set its color as grey, and else, it takes its
	// original color.
	// We do the same for the edges, and we only keep
	// edges that have both extremities colored.
	Topo.mouseBind('doubleClickNode', function(e)
	{
		var n = e.data.node;
		var userPara = new Array();
		
		if ('NS' == n.nodeType)
		{
			if(false == n.clickOpen)
			{
				// created VNF node
				var VNFSize = VNFData.data.length;
				
				if(0 < VNFSize)
				{
					for (var i = 0; i < VNFSize; i++) 
					{
						var relation = VNFData.data[i].relations;
						
						for (var j = 0; j < relation.length; j++) {
							if('belongTo' == relation[j].relationType && n.oid == relation[j].relatedId)
							{
								userPara.x = i;
								userPara.y = n.y+0.5;
								
								// get vdu node count
								var vduNum = VDUData.data.length;
								var puls = false;
								for ( var k = 0; k < vduNum; k++)
								{
									var vduRelation = VDUData.data[k].relations;
									for (var l = 0; l < vduRelation.length; l++) {
										if('belongTo' == vduRelation[l].relationType && VNFData.data[i].oid == vduRelation[l].relatedId)
										{
											puls = true;
										}
									}
								}
								
								if(puls)
								{
									userPara.image = images[3];
								}
								else
								{
									userPara.image = images[2];
								}
								
								Topo.addNode(creatNodeByJSON("VNF", VNFData.data[i], userPara, i + 1));
								n.childrens.push(VNFData.data[i].vnfd);
								
							    // add link
								Topo.addLink(creatEdge(n.id,VNFData.data[i].vnfd));
							}
						}
					}
				}
				
				n.image.url = images[0];
				n.clickOpen = true;
			}
			else
			{
				// deleted children nodes
				var childSize = n.childrens.length;
				for ( var i = 0; i < childSize; i++)
				{
					delNode(n.childrens[i]);
				}
				
				edgeID = 0;
				if (0 < childSize) {
					n.image.url = images[1];
				}
				
				n.clickOpen = false;
			}
		}
		
		if('VNF' == n.nodeType)
		{
			if(false == n.clickOpen)
			{
				// created VDU node
				var VDUSize = VDUData.data.length;
				
				if(0 < VDUSize)
				{
					for (var i = 0; i < VDUSize; i++) 
					{
						var relation = VDUData.data[i].relations;
						
						for (var j = 0; j < relation.length; j++) {
							if('belongTo' == relation[j].relationType && n.oid == relation[j].relatedId)
							{
								userPara.x = i;
								userPara.y = n.y+0.5;
								
								// get vnfc node count
								var vnfcNum = VNFCData.data.length;
								var puls = false;
								for ( var k = 0; k < vnfcNum; k++)
								{
									var vnfcRelation = VNFCData.data[k].relations;
									for (var l = 0; l < vnfcRelation.length; l++) {
										if('deployedOn' == vnfcRelation[l].relationType && VDUData.data[i].oid == vnfcRelation[l].relatedId)
										{
											puls = true;
										}
									}
								}
								
								if(puls)
								{
									userPara.image = images[5];
								}
								else
								{
									userPara.image = images[4];
								}
								
								Topo.addNode(creatNodeByJSON("VDU", VDUData.data[i], userPara, i + 1));
								n.childrens.push(VDUData.data[i].oid);
								
							    // add link
								Topo.addLink(creatEdge(n.id,VDUData.data[i].oid));
							}
						}
					}
				}
				
				n.image.url = images[2];
				n.clickOpen = true;
			}
			else
			{
				// delete children node
				var childSize = n.childrens.length;
				for ( var i = 0; i < childSize; i++)
				{
					delNode(n.childrens[i]);
				}
				
				if (0 < childSize) {
					n.image.url = images[3];
				}
				
				n.clickOpen = false;
			}
		}
		
		
		if('VDU' == n.nodeType)
		{
			if(false == n.clickOpen)
			{
				// created VNFC node
				var VNFCSize = VNFCData.data.length;
				if(0 < VNFCSize)
				{
					for ( var i = 0; i < VNFCSize; i++)
					{
						var relation = VNFCData.data[i].relations;
						for (var j = 0; j < relation.length; j++) {
							if('deployedOn' == relation[j].relationType && n.oid == relation[j].relatedId)
							{
								userPara.x = i;
								userPara.y = n.y+0.5;
								userPara.image = images[6];
								
								Topo.addNode(creatNodeByJSON("VNFC", VNFCData.data[i], userPara, i + 1));
								n.childrens.push(VNFCData.data[i].oid);
								
							    // add link
								Topo.addLink(creatEdge(n.id,VNFCData.data[i].oid));
							}
						}
					}
				}
				
				n.image.url = images[4];
				n.clickOpen = true;
			}
			else
			{
				// deleted children node
				var childSize = n.childrens.length;
				for ( var i = 0; i < childSize; i++)
				{
					delNode(n.childrens[i]);
				}
				
				if (0 < childSize) {
					n.image.url = images[5];
				}
				
				n.clickOpen = false;
			}
		}
		
		
		if('VNFC' == n.nodeType)
		{
			return;
			if(false == n.clickOpen)
			{
				var VDUSize = VDUData.data.length;
				//console.log("VDUSize:"+VDUSize);
				if(0 < VDUSize)
				{
					for ( var i = 0; i < VDUSize; i++)
					{
						Topo.addNode(creatNodeByJSON("VDU", VDUData.data[i], i + 1));
						n.childrens.push(VDUData.data[i].oid);
						
						Topo.addLink(creatEdge(n.id,VDUData.data[i].oid));
					}
				}
				
				n.clickOpen = true;
			}
			else
			{
				for ( var i = 0; i < n.childrens.length; i++)
				{
					delNode(n.childrens[i]);
				}
				
				n.clickOpen = false;
			}
		}
					
		Topo.refresh();
	});
	
	// Binding the event of mouse overNode 
	Topo.mouseBind('overNode', function(e) {
		infoDialogAddview(createNodeinfo(e.data.node));
		infoDialogshow();
	});
	
	// Binding the event of mouse outNode
	Topo.mouseBind('outNode', function(e) {
		infoDialoghide();
	});
	
	// When the stage is clicked, we just color each
	// node and edge with its original color.
	Topo.mouseBind('clickStage', function(e)
	{
		// Same as in the previous event:
		Topo.refresh();
		
		// close infoDialog
		infoDialoghide();
	});
	
	Topo.refresh();
	
	
	/**
	 * <Delete the specified node>
	 * @param type
	 * @param id
	 * @see []
	 */
	function delNode(nodeId)
	{
		Topo.allNodes().forEach(function(n)
		{
			if (nodeId == n.id)
			{
				var chlidSize = n.childrens.length;
				if (0 < chlidSize)
				{
					for ( var i = 0; i < chlidSize; i++)
					{
						delNode(n.childrens[i]);
					}
				}
				Topo.dropNode(n.id);
			}
				
		});
	}
});

