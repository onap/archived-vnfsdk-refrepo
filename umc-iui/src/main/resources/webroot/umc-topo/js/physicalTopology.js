
// definition node image resource
var imgPlus =
[
    
	'./images/on/vdu.png', // VDU
	'./images/on/hostPlus.png', // HOST
	'./images/on/vimPlus.png' //VIM
],
imgMinus =
[
	'./images/on/vdu.png', // VDU
	'./images/on/hostMinus.png', // HOST
	'./images/on/vimMinus.png' //VIM
];


// definition node data global variable
var VIMData, HOSTData, VDUData;

// link count
var edgeID = 0;

function jumpToService()
{
	//window.navigate("html/serviceTopology.html"); 
	self.location='./serviceTopology.html'; 
}


// ready
$(document).ready(function()
{
	// definition resource interface url
	var vimUrl = "../../api/roc/v1/resource/vims";
	var hostUrl = "../../api/roc/v1/resource/hosts";
	var vduUrl = "../../api/roc/v1/resource/vdus";
	
	$.ajaxSettings.async = false; // set ajax get json was synchronization
	
	// get vim
	$.ajax({
        "type": 'get',
        "url": vimUrl,   
        "dataType": "json",
        "success": function (resp) {
            if(resp.operationResult == "SUCCESS")
            {
            	VIMData = resp;
            }
            else{
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
        }
      
    });
	
	// get host
	$.ajax({
        "type": 'get',
        "url": hostUrl,   
        "dataType": "json",
        "success": function (resp) {
            if(resp.operationResult == "SUCCESS")
            {
            	HOSTData = resp;
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
		maxNodeSize : 60,
	    minEdgeSize: 2,
	    maxEdgeSize: 6,
	    nodesPowRatio: 1,
	    edgesPowRatio: 1,
		doubleClickZoomingRatio : 0,
		mouseZoomDuration : 1000,
	};
	Topo.canvas('VIM', settings);
	
	// set the nodes can be drag and drop
	Topo.setDrag(true);
	
	// Disable the right mouse button for browser
	Topo.noright(document.body);
	
	// custom parameter
	var custData = new Array();
	var VIMSize = VIMData.data.length;
	
	if(0 < VIMSize)
	{
		for ( var i = 0; i < VIMSize; i++)
		{
			custData.image = imgPlus[2];
			Topo.addNode(creatNodeByJSON("VIM", VIMData.data[i], custData, i + 1));
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
		var custdata = new Array();
		
		if ('VIM' == n.nodeType)
		{
			if(false == n.clickOpen)
			{
				// get hostNode count
				var HOSTSize = HOSTData.data.length;
				
				if(0 < HOSTSize)
				{
					for ( var i = 0; i < HOSTSize; i++)
					{
						// created host node
						if (n.id == HOSTData.data[i].vimId)
						{
							custdata.x = i;
							custdata.y = n.y + 0.5; 
							
							var VDUSize = VDUData.data.length;
							if(0 < VDUSize)
							{
								var puls = false;
								for ( var j = 0; j < VDUSize; j++)
								{
									// Whether contains VDU node
									if(HOSTData.data[i].oid == VDUData.data[j].hostId)
									{
										puls = true;
									}
								}
								
								if(puls)
								{
									custdata.image = imgPlus[1];
								}
								else
								{
									custdata.image = undefined;
								}
							}
							
							Topo.addNode(creatNodeByJSON("HOST", HOSTData.data[i], custdata, i + 1));
							n.childrens.push(HOSTData.data[i].oid);
							n.image.url = imgMinus[2];
							
						    // created link
							Topo.addLink(creatEdge(n.id,HOSTData.data[i].oid));
						}
					}
				}
				
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
				
				// reset link count
				edgeID = 0;
				
				if (0 < childSize) 
				{
					n.image.url = imgPlus[2];
				}
				n.clickOpen = false;
			}
		}
		
		
		if ('HOST' == n.nodeType)
		{
			if(false == n.clickOpen)
			{
				var VDUSize = VDUData.data.length;
				if(0 < VDUSize)
				{
					for ( var i = 0; i < VDUSize; i++)
					{
						// created vdu node
						if(n.id == VDUData.data[i].hostId)
						{
							custdata.x = i;
							custdata.y = n.y + 1; 
							custdata.image = imgPlus[0];
							Topo.addNode(creatNodeByJSON("VDU", VDUData.data[i], custdata, i + 1));
							n.childrens.push(VDUData.data[i].oid);
							n.image.url = imgMinus[1];
							
						    // created link 
							Topo.addLink(creatEdge(n.id,VDUData.data[i].oid));
						}
					}
				}
				
				n.clickOpen = true;
			}
			else
			{
				// delete VNFC node
				var childSize = n.childrens.length;
				for ( var i = 0; i < childSize; i++)
				{
					delNode(n.childrens[i]);
				}
				
				if(0 < childSize)
				{
					n.image.url = imgPlus[1];
				}
				n.clickOpen = false;
			}
		}
		
		// Since the data has been modified, we need to
		// call the refresh method to make the colors
		// update effective.
		Topo.refresh();
	});
	
	
	
	// Binding the event of mouse rightClickNode
	Topo.mouseBind('rightClickNode', function(e)
	{
		/*if('VIM' == e.data.node.nodeType)
		{
			var menu = '<ul>';
			menu += '<li><a style="cursor:pointer;" onclick="jumpToService();">业务拓扑</a></li>';
			menu += '</ul>';
			infoDialogAddview(menu,'menu');
			infoDialogshow();
			return;
		}*/
	});
	
	
	// Binding the event of mouse overNode 
	Topo.mouseBind('overNode', function(e)
	{
		infoDialogAddview(createNodeinfo(e.data.node));
		infoDialogshow();
	});
	
	// Binding the event of mouse outNode
	Topo.mouseBind('outNode', function(e)
	{
		//e.data.node.borderColor = "";
		//Topo.refresh();
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

