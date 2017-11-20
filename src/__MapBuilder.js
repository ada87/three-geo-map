var Config = require('./__Config');
var CoordMap = {};
var WIDTH = 0, HEIGHT = 0, WidthScale, HeightScale, ZOOM;

class MapBuilder {

	constructor(json, container) {
		[WIDTH, HEIGHT] = [container.clientWidth, container.clientHeight];
		var features = _.isArray(json) ? json[0].features : json.features;
		[[this.left, this.top], [this.right, this.bottom]] = d3.geoBounds(json);
		features.map(function (item) {
			CoordMap[item.properties.name] = {};
			if (item.properties.center) {
				CoordMap[item.properties.name]['center'] = [item.properties.center.lng, item.properties.center.lat];
			} else {
				CoordMap[item.properties.name]['center'] = d3.geoCentroid(item);
			}
		});
		ZOOM = HEIGHT / (this.bottom - this.top);
		this.center = [(this.right - this.left) * ZOOM / 2, (this.bottom - this.top) * ZOOM / 2];
		WidthScale = d3.scaleLinear().domain([this.left, this.right]).range([this.center[0] - this.center[0] * Config.Scale, this.center[0] + this.center[0] * Config.Scale]);
		HeightScale = d3.scaleLinear().domain([this.top, this.bottom]).range([this.center[1] - this.center[1] * Config.Scale, this.center[1] + this.center[1] * Config.Scale]);
	}

	getCenter(){
		return this.center;
	}


	getPoint(areaName) {
		if (CoordMap.hasOwnProperty(areaName)) {
			var center = CoordMap[areaName].center;
			return [WidthScale(center[0]), HeightScale(center[1])];
		}
	}

	//HTML页面点转换成坐标系的点
	tranCanvasPoint(x, y) {
		return [(x / WIDTH) * 2 - 1, -(y / HEIGHT) * 2 + 1];
	}


	genPoint(item) {
		return new THREE.Vector2(
			WidthScale(item[0]),
			HeightScale(item[1])
		);
	}

}
module.exports = MapBuilder;