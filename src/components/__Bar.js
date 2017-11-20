var Mouse = require('./__Mouse');
var Config = require('../__Config');
var ToolTip = require('../__Tip');
var BAR_NAME = '_BAR';

class Bar extends Mouse {


    setData(arr){
		
		var self = this;

		Config.GLOBAL_SCENE.children.map(function(obj){
			if(obj.name == BAR_NAME){
				Config.GLOBAL_SCENE.remove(obj);
			}
		});


		var min = _.minBy(arr, 'count').count;
		var max = _.maxBy(arr, 'count').count;
		var stackScala = d3.scaleLinear().domain([min, max]).range([10, 100]);
		var colorScala = d3.scaleLinear().domain([min, max]).range([d3.color('#54FF36'), d3.color('#E814FF')]);
		arr.map(function (item) {
			var loc = Config.GLOBAL_BUILDER.getPoint(item.area);
			var color = new THREE.Color(colorScala(item.count).toString());
			var geometry = new THREE.BoxGeometry(Config.STACK.Size, Config.STACK.Size, Config.STACK.Size);
			var material = new THREE.MeshPhongMaterial({
				transparent: false,
				opacity: 0.8,
				color: color,
			});

			var stack = new THREE.Mesh(geometry, material);
			stack.castShadow = true;
			stack.position.x = loc[0];
			stack.position.y = loc[1];
			stack.position.z = Config.STACK.Size / 2  + Config.AREA.ThickMin;
			stack.userData.data = item;
			stack.userData.orginColor = color; 
			stack.name = BAR_NAME;
			Config.GLOBAL_SCENE.add(stack);
			self.addCtrl(stack);
			var tween = {
				scale: 1,
			};
			new TWEEN.Tween(tween)
				.to({
					scale: stackScala(item.count)
				}, 2000)
				.easing(TWEEN.Easing.Linear.None)
				.onUpdate(function () {
					stack.geometry = new THREE.BoxGeometry(Config.STACK.Size, Config.STACK.Size, tween.scale);
					stack.position.z = tween.scale / 2 + Config.AREA.ThickMin;
				})
				.start();
		});
	}
	
	
	mouseOver(mesh, evt) {
		mesh.material.color = Config.AREA.COLOR_HOVER;
		if(_.isFunction(Config.STACK.MoverOver)){
			var str = Config.STACK.MoverOver.call(null,mesh.userData.data);
			ToolTip.showTip(evt,str);
		}
	}
	mouseOut(mesh) {
		mesh.material.color = mesh.userData.orginColor;
	}


}
module.exports = Bar;