var edgeColors = {
	red : "#f00",
	green: "#0f0",
  blue: "#00f",
  yellow: "#ff0",
  grey: "#ddd",
  black: "#000"
}

function Edge(id, label, source, target, size, color) {
	this.id = id;
	this.label = label;
	this.source = source;
	this.target = target;
	this.type = 'line';
  this.size = size;
	this.color = edgeColors[color];
}
