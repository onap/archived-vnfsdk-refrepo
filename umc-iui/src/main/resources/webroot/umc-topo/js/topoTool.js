/**openo tools**/
// generate a random graph
var imgOn =
[
    // node image resource
	'./images/on/InternetServer.gif', //NS
	'./images/on/Multiplexer.gif', // VNFC
	'./images/on/Hub.gif', // VDU
	'./images/on/Bridge.gif', // VNF
	'./images/on/Computer.png', // HOST
	'./images/on/vim.png' //VIM
], imgOff =
[
    // node image resource
	'./images/off/InternetServer.gif', //NS
	'./images/off/Multiplexer.gif', // VNFC
	'./images/off/Hub.gif', // VDU
	'./images/off/Bridge.gif', // VNF
	'./images/off/Computer.gif', // HOST
	'./images/off/vim.png' //VIM
], colors =
[
    // node background color
	'#617db4', 
	'#668f3c', 
	'#c6583e', 
	'#b956af'
],
step = 0;


/**
 * <Data generated topology node based on rest interface >
 * @param nodeType node type
 * @param jsonData json from rest
 * @param customPara user data
 * @param index node index
 * @see []
 */
function creatNodeByJSON(nodeType,jsonData,customPara,index)
{
	var node = {};
	
	console.log("creatNodeByJSON nodeType:"+nodeType);
	console.log("creatNodeByJSON customPara:"+customPara.length);
	console.log("creatNodeByJSON customPara:"+customPara.image);
	
	// created node 
    if('NS' == nodeType)
	{
		// Generate a random graph, going through the different shapes
		node =
		{
			id : jsonData.nsd,
			label : jsonData.name,
			// note the ShapeLibrary.enumerate() returns the names of all
			// supported renderers
			type : "square",
			x : (undefined != customPara.x)?customPara.x:jsonData.positionX,//1*index,
			y : (undefined != customPara.y)?customPara.y:jsonData.positionY,//1,
			size : (undefined != customPara.size)?customPara.size:8,
			color : (undefined != customPara.color)?customPara.color:"transparent",
			
			// custom parameter
			nodeType: nodeType,
			nsd: jsonData.nsd,
			autoScalePolicy: jsonData.autoScalePolicy,
			monitoringParameter: jsonData.monitoringParameter,
			flavour: jsonData.flavour,
			status: jsonData.status,
			customPara: jsonData.customPara,
			oid: jsonData.oid,
			moc: jsonData.moc,
			mocName: jsonData.mocName,
			name: jsonData.name,
			vendor: jsonData.vendor,
			version: jsonData.version,
			nstype: jsonData.type,
			relations: jsonData.relations,
			clickOpen: false,
			childrens: []
		};
		
		node.image =
		{
			url : (undefined != customPara.image)?customPara.image:imgOn[0],
			// scale/clip are ratio values applied on top of 'size'
			scale : 1,
			clip : 0,
		};
	}
	else if('VNFC' == nodeType)
	{
		// Generate a random graph, going through the different shapes
		node =
		{
			id : jsonData.oid,
			label : jsonData.name,
			// note the ShapeLibrary.enumerate() returns the names of all
			// supported renderers
			type : "square",
			x : (undefined != customPara.x)?customPara.x:jsonData.positionX,//1*index,
			y : (undefined != customPara.y)?customPara.y:jsonData.positionY,//2,
			size : (undefined != customPara.size)?customPara.size:8,
			color : (undefined != customPara.color)?customPara.color:"transparent",
			
			// custom parameter
			nodeType: nodeType,
			vduId: jsonData.vduId,
			vnfId: jsonData.vnfId,
			status: "active",
			createTime: jsonData.createTime,
			oid: jsonData.oid,
			moc: jsonData.moc,
			name: jsonData.name,
			ipAddress: jsonData.ipAddress,
			vendor: jsonData.vendor,
			version: jsonData.version,
			vnfctype: jsonData.type,
			relations: jsonData.relations,
			clickOpen: false, 
			childrens: []
		};
		
		node.image =
		{
			url : (undefined != customPara.image)?customPara.image:imgOn[1],
			// scale/clip are ratio values applied on top of 'size'
			scale : 1,
			clip : 0,
		};
	}
	else if('VDU' == nodeType)
	{
		// Generate a random graph, going through the different shapes
		node =
		{
			id : jsonData.oid,
			label : jsonData.name,
			// note the ShapeLibrary.enumerate() returns the names of all
			// supported renderers
			type : "square",
			x : (undefined != customPara.x)?customPara.x:jsonData.positionX,//1*index,
			y : (undefined != customPara.y)?customPara.y:jsonData.positionY,//3,
			size : (undefined != customPara.size)?customPara.size:8,
			color : (undefined != customPara.color)?customPara.color:"transparent",
			
			// custom parameter
			nodeType: nodeType,
		    vduImage: jsonData.vduImage,
		    vnfId: jsonData.vnfId,
		    vimId: jsonData.vimId,
		    hostId: jsonData.hostId,
		    createTime: jsonData.createTime,
		    customPara: jsonData.customPara,
		    status: "active",//jsonData.status,
		    lanInfo: jsonData.lanInfo,
		    flavourId: jsonData.flavourId,
		    floatIpInfo: jsonData.floatIpInfo,
		    oid: jsonData.oid,
		    moc: jsonData.moc,
		    mocName: jsonData.mocName,
		    name: jsonData.name,
		    ipAddress: jsonData.ipAddress,
		    vendor: jsonData.vendor,
		    version: jsonData.version,
			vdutype: jsonData.type,
			relations: jsonData.relations,
			clickOpen: false, 
			childrens: []
		};
		
		node.image =
		{
			url : (undefined != customPara.image)?customPara.image:imgOn[2],
			// scale/clip are ratio values applied on top of 'size'
			scale : 1,
			clip : 0,
		};
	}
	else if('VNF' == nodeType)
	{
		// Generate a random graph, going through the different shapes
		node =
		{
			id : jsonData.vnfd,
			label : jsonData.name,
			// note the ShapeLibrary.enumerate() returns the names of all
			// supported renderers
			type : "square",
			x : (undefined != customPara.x)?customPara.x:jsonData.positionX,//1*index,
			y : (undefined != customPara.y)?customPara.y:jsonData.positionY,//4,
			size : (undefined != customPara.size)?customPara.size:8,
			color : (undefined != customPara.color)?customPara.color:"transparent",
			
			// custom parameter
			nodeType: nodeType,
			vnfd: jsonData.vnfd,
			autoScalePolicy: jsonData.autoScalePolicy,
			flavourId: jsonData.flavourId,
			localization: jsonData.localization,
			monitoringParameter: jsonData.monitoringParameter,
		    status: jsonData.status,
		    customPara: jsonData.customPara,
		    createTime: jsonData.createTime,
		    vimId: jsonData.vimId,
		    oid: jsonData.oid,
		    moc: jsonData.moc,
		    name: jsonData.name,
		    ipAddress: jsonData.ipAddress,
		    vendor: jsonData.vendor,
		    version: jsonData.version,
		    vnftype: jsonData.type,
		    relations: jsonData.relations,
			clickOpen: false, 
			childrens: []
		};
		
		node.image =
		{
			url : (undefined != customPara.image)?customPara.image:imgOn[3],
			// scale/clip are ratio values applied on top of 'size'
			scale : 1,
			clip : 0,
		};
	}
	else if('HOST' == nodeType)
	{
		// Generate a random graph, going through the different shapes
		node =
		{
			id : jsonData.oid,
			label : jsonData.name,
			// note the ShapeLibrary.enumerate() returns the names of all
			// supported renderers
			type : "square",
			x : (undefined != customPara.x)?customPara.x:jsonData.positionX,//1*index,
			y : (undefined != customPara.y)?customPara.y:jsonData.positionY,//2,
			size : (undefined != customPara.size)?customPara.size:8,
			color : (undefined != customPara.color)?customPara.color:"transparent",
			
			// custom parameter
			nodeType: nodeType,
			vimId: jsonData.vimId,
		    port: jsonData.port,
		    customPara: jsonData.customPara,
		    cpuNum: jsonData.cpuNum,
		    memorySize: jsonData.memorySize,
		    storageSize: jsonData.storageSize,
		    status: "active",//jsonData.status,
		    oid: jsonData.oid,
		    moc: jsonData.moc,
		    mocName: jsonData.mocName,
		    name: jsonData.name,
		    ipAddress: jsonData.ipAddress,
			relations: jsonData.relations,
			clickOpen: false,
			childrens: []
		};
		
		node.image =
		{
			url : (undefined != customPara.image)?customPara.image:imgOn[4],
			// scale/clip are ratio values applied on top of 'size'
			scale : 1,
			clip : 0,
		};
	}
	else if('VIM' == nodeType)
	{
		// Generate a random graph, going through the different shapes
		node =
		{
			id : jsonData.oid,
			label : jsonData.name,
			// note the ShapeLibrary.enumerate() returns the names of all
			// supported renderers
			type : "square",
			x : (undefined != customPara.x)?customPara.x:1*index,
			y : (undefined != customPara.y)?customPara.y:1,
			size : (undefined != customPara.size)?customPara.size:8,
			color : (undefined != customPara.color)?customPara.color:"transparent",
			
			// custom parameter
			nodeType: nodeType,
			user: jsonData.user,
	        url: jsonData.url,
	        hostName: jsonData.hostName,
	        status: jsonData.status,
	        errorInfo: jsonData.errorInfo,
	        userName: jsonData.userName,
	        password: jsonData.password,
	        checkTime: jsonData.checkTime,
	        createTime: jsonData.createTime,
	        oid: jsonData.oid,
	        moc: jsonData.moc,
	        mocName: jsonData.mocName,
	        name: jsonData.name,
	        ipAddress: jsonData.ipAddress,
	        vendor: jsonData.vendor,
	        vimtype: jsonData.type,
	        relations: jsonData.relations,
			clickOpen: false,
			childrens: []
		};
		
		node.image =
		{
			url : (undefined != customPara.image)?customPara.image:imgOn[5],
			// scale/clip are ratio values applied on top of 'size'
			scale : 1,
			clip : 0,
		};
	}
	//console.log(node.id);
	//console.log(node.label);
	//console.log(node.image);
	
	return node;
}


/**
 * <Data generated link based on rest interface>
 * @param noteSource
 * @param noteTarget
 * @see []
 */
function creatEdge(noteSource,noteTarget)
{
	//console.log("creatEdge noteSource:"+noteSource+",noteTarget:"+noteTarget);
	var edge=
	{
		id : 'RT' + Math.random(),
		source : noteSource, 
		target : noteTarget,
		size : 1,
		color: '#1C86EE'
	};
	
	edgeID ++;
	
	return edge;
}
