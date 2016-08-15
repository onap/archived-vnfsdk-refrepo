/**
 * created node info dialog
 */
function createDiv()
{
    var Div=$('<div></div>'); // created parent DIV
    return Div;
}

// dialog div object
var infoDialog;

var infoDialogAddview = function(node,dialogClass)
{
	infoDialog = createDiv();
	//set div property  
	infoDialog.attr('id','infodialog');
	infoDialog.css('display','none');
	infoDialog.addClass((undefined == dialogClass)?'infoDialog':dialogClass);    // add CSS style
	infoDialog.css({'left':window.event.clientX + 2 + "px",'top':window.event.clientY + 2 + "px"});
	infoDialog.css('position','absolute');// must set this property，   
	infoDialog.css('width','auto');
	infoDialog.css('height','auto');
	
    // add a new node  
	infoDialog.append(node);
};

// display dialog  
var infoDialogshow = function()
{
	// if the dialog display,remove it
	if ( $("#infodialog").length > 0 ) { 
		infoDialoghide();
	} 
	
	$(document.body).append(infoDialog); 
	
/*	var wHeight = window.document.body.offsetHeight; 
	var wWidth = window.document.body.offsetWidth; 
	
	var top = infoDialog.css('left');
	var left = infoDialog.css('left');
	var dHeight = infoDialog.height();
	var dWidth = infoDialog.width();
	
	console.log("infoDialogshow wHeight:"+wHeight+",wWidth:"+wWidth);
	console.log("infoDialog top:"+top+",left:"+left);
	console.log("infoDialog Height:"+dHeight+",Width:"+dWidth);*/
	
	infoDialog.css('display','');
	
	// binding mouse leave event
	$("#infodialog").mouseleave(function(){
		//$(this).remove();
	});
};


// remove info dialog  
var infoDialoghide = function()
{
	$("#infodialog").remove();
};

/**
 * <display node info >
 * @param node
 * @returns
 * @see []
 */
var createNodeinfo = function(node)
{
	var  nsInfoHTMLStr = "";
	
	nsInfoHTMLStr += '<table style="width: 350px">';

	
	if('NS' == node.nodeType)
	{
		nsInfoHTMLStr += '<tr><td style="width: 21%"><a>nsd</a></td><td><a>'+node.nsd+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>status</a></td><td><a>'+node.status+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>name</a></td><td><a>'+node.name+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>vendor</a></td><td><a>'+node.vendor+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>version</a></td><td><a>'+node.version+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>type</a></td><td><a>'+node.nstype+'</a></td></tr>';
	}
	else if('VNFC' == node.nodeType)
	{
		nsInfoHTMLStr += '<tr><td style="width: 21%"><a>name</a></td><td><a>'+node.name+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>ipAddress</a></td><td><a>'+node.ipAddress+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>vendor</a></td><td><a>'+node.vendor+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>version</a></td><td><a>'+node.version+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>type</a></td><td><a>'+node.vnfctype+'</a></td></tr>';
	}
	else if('VDU' == node.nodeType)
	{
		nsInfoHTMLStr += '<tr><td style="width: 21%"><a>vduImage</a></td><td><a>'+node.vduImage+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>mocName</a></td><td><a>'+node.mocName+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>name</a></td><td><a>'+node.name+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>ipAddress</a></td><td><a>'+node.ipAddress+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>vendor</a></td><td><a>'+node.vendor+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>version</a></td><td><a>'+node.version+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>type</a></td><td><a>'+node.vdutype+'</a></td></tr>';
	}
	else if('VNF' == node.nodeType)
	{
		nsInfoHTMLStr += '<tr><td style="width: 21%"><a>status</a></td><td><a>'+node.status+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>name</a></td><td><a>'+node.name+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>ipAddress</a></td><td><a>'+node.ipAddress+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>vendor</a></td><td><a>'+node.vendor+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>version</a></td><td><a>'+node.version+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>type</a></td><td><a>'+node.vnftype+'</a></td></tr>';
	}
	else if('HOST' == node.nodeType)
	{
		nsInfoHTMLStr += '<tr><td style="width: 21%"><a>mocName</a></td><td><a>'+node.mocName+'</a></td></tr>';
		/*nsInfoHTMLStr += '<tr><td><a>protocol</a></td><td><a>'+node.protocol+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>port</a></td><td><a>'+node.port+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>cpuNum</a></td><td><a>'+node.cpuNum+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>cpuRate</a></td><td><a>'+node.cpuRate+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>memorySize</a></td><td><a>'+node.memorySize+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>storageSize</a></td><td><a>'+node.storageSize+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>moc</a></td><td><a>'+node.moc+'</a></td></tr>';*/
		nsInfoHTMLStr += '<tr><td><a>name</a></td><td><a>'+node.name+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>ipAddress</a></td><td><a>'+node.ipAddress+'</a></td></tr>';
	}
	else if('VIM' == node.nodeType)
	{
		nsInfoHTMLStr += '<tr><td style="width: 21%"><a>user</a></td><td><a>'+node.user+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>url</a></td><td><a>'+node.url+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>status</a></td><td><a>'+node.status+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>userName</a></td><td><a>'+node.userName+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>checkTime</a></td><td><a>'+node.checkTime+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>name</a></td><td><a>'+node.name+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>ipAddress</a></td><td><a>'+node.ipAddress+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>vendor</a></td><td><a>'+node.vendor+'</a></td></tr>';
		nsInfoHTMLStr += '<tr><td><a>type</a></td><td><a>'+node.vimtype+'</a></td></tr>';
	}
	
	nsInfoHTMLStr += '</table>';
	
	return nsInfoHTMLStr;
};

var createServiceNodeinfo = function(node)
{
	var  nsInfoHTMLStr = "";
	nsInfoHTMLStr += '<table style="width: 250px">';
	nsInfoHTMLStr += '<tr><td style="width: 21%"><a>Name</a></td><td><a>'+node.mocName+'</a></td></tr>';
	nsInfoHTMLStr += '<tr><td><a>status</a></td><td><a>'+node.status+'</a></td></tr>';
	nsInfoHTMLStr += '<tr><td><a>vendor</a></td><td><a>'+node.vendor+'</a></td></tr>';
	nsInfoHTMLStr += '<tr><td><a>version</a></td><td><a>'+node.version+'</a></td></tr>';
	nsInfoHTMLStr += '<tr><td><a>ipAddress</a></td><td><a>'+node.ipAddress+'</a></td></tr>';
	nsInfoHTMLStr += '</table>';
	
	return nsInfoHTMLStr;
};
   

// ready
$(document).ready(function()
{

});
