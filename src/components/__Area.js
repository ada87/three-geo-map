var Mouse = require('./__Mouse');
var Config = require('../__Config');
var Shaders = require('../__Shaders');
var ToolTip = require('../__Tip');


class Area extends Mouse {

	constructor(json) {
		super();
		var self = this;
		var features = _.isArray(json) ? json[0].features : json.features;
		var i = 1;
		features.map(function (item) {
			var points = [];
			item.geometry.coordinates.map(function (area) {
				//这里可以做个收缩算法收一下
				area.map(function (areaCoord) {
					if (_.isNumber(areaCoord[0])) {
						points.push(
							Config.GLOBAL_BUILDER.genPoint(areaCoord)
						);
					} else if (_.isArray(areaCoord[0])) {
						areaCoord.map(function (coord) {
							points.push(Config.GLOBAL_BUILDER.genPoint(coord));
						});
					}
				});
			});
			self.__addShape(new THREE.Shape(points), item.properties.name);
		});
	}
	


	__addShape(shape, name) {
		var setting = {
			curveSegments :50,
			amount: 1,
			steps: 4,
			bevelEnabled: false,
		};
		var geometry = new THREE.ExtrudeGeometry(shape, setting);
		var bkgMaterial = new THREE.MeshPhongMaterial({
			transparent: false,
			opacity: 1,
			color: Config.AREA.COLOR_DEFAULT,
		});
		// var borMaterial = new THREE.MeshPhongMaterial( {
		// 	color: Config.AREA.COLOR_BORDER,
		// 	emissive: 0x072534,
		// } );

		var borMaterial = new THREE.LineBasicMaterial( {
			color: 0xffffff,
			linewidth: 1,
			linecap: 'round', //ignored by WebGLRenderer
			linejoin:  'round' //ignored by WebGLRenderer
		} )
		var mesh = new THREE.Mesh(geometry, [bkgMaterial,borMaterial]);
		mesh.scale.set(1, 1, Config.AREA.ThickMin);
		mesh.castShadow = false;
		mesh.receiveShadow = true;
		mesh.name = name;
		mesh.userData.orginColor = Config.AREA.COLOR_DEFAULT;
		Config.GLOBAL_SCENE.add(mesh);
		this.addCtrl(mesh);
	}

	mouseOver(mesh, evt) {
		mesh.material[0].color = Config.AREA.COLOR_HOVER;
		mesh.material[1].color = Config.AREA.COLOR_HOVER_BORDER;
		if(_.isFunction(Config.AREA.MouseOver)){
			var str = Config.AREA.MouseOver.call(null,mesh);
			ToolTip.showTip(evt,str);
		}
	}
	mouseOut(mesh) {
		mesh.material[0].color = mesh.userData.orginColor;
		mesh.material[1].color = Config.AREA.COLOR_BORDER;
	}


	//设置地区颜色
	setColors(arr) {
		arr.map(function (item) {
			var area = Config.GLOBAL_SCENE.getObjectByName(item.area);
			if (area) {
				area.material[0].color = item.color;
				area.userData.orginColor = item.color;
			}
		});
	}


	//设置地区高度
	setHeight(arr) {
		if (arr.length <= 0) {
			return;
		}
		var min = _.minBy(arr, 'amount').amount;
		var max = _.maxBy(arr, 'amount').amount;
		var heightScala = d3.scaleLinear().domain([min, max]).range([Config.AREA.ThickMin, Config.AREA.ThickMax]);
		arr.map(function (item) {
			var area = Config.GLOBAL_SCENE.getObjectByName(item.area);
			if (area) {
				var scale = {
					z: Config.AREA.ThickMin
				};
				new TWEEN.Tween(scale)
					.to({
						z: heightScala(item.amount)
					}, 1000)
					.easing(TWEEN.Easing.Quadratic.Out)
					.onUpdate(function () {
						area.scale.set(1, 1, scale.z);
					})
					.start();
			}
		});
	}
}
module.exports = Area;