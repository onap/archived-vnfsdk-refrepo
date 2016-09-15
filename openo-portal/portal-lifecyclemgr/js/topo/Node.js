var icon = {
	type1 : "js/topo/img/NEUP.png",
	type2 : "js/topo/img/NETWORK.png",
	type3 : "js/topo/img/site.png"
}
function Node(id, label, size, type, x, y) {
	this.id = id;
	this.label = label;
	this.type = "square";
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = "white";
	this.borderColor = "white";
	this.image = {
		url : icon[type],
		scale : 1.0,
		clip : 1.0
	};
}
