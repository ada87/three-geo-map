var Mouse = require('./__Mouse');
var Config = require('../__Config');

var POINT_NAME = '_POINT';

class Points extends Mouse {

    setData(arr){

		var self = this;
		var min = _.minBy(arr, 'amount').amount;
		var max = _.maxBy(arr, 'amount').amount;
		var colorScala = d3.scaleOrdinal().domain([min, max]).range(Config.Colors);
		Config.GLOBAL_SCENE.children.map(function(obj){
			if(obj.name == POINT_NAME){
				Config.GLOBAL_SCENE.remove(obj);
			}
		})

		arr.map(function (area) {
			var color = colorScala(area.amount);

			var coord = Config.GLOBAL_BUILDER.getPoint(area.area);
			var particleLight = new THREE.Mesh( new THREE.SphereBufferGeometry( 4, 4, 4 ), new THREE.MeshBasicMaterial( { color: color } ) );
			particleLight.name = POINT_NAME;
			particleLight.position.x = coord[0];
			particleLight.position.y = coord[1];
			particleLight.position.z = Config.AREA.ThickMin + 2;

			Config.GLOBAL_SCENE.add( particleLight );
	
	
			var pointLight = new THREE.PointLight( color, 5, 40 );
			particleLight.add( pointLight );

			var effectNut = {
				intensity: 1
			};
			//忽明忽暗无限循环
			var tween1 = new TWEEN.Tween(effectNut).to({ intensity: 20 }, _.random(500, 2000));
			var tween2 = new TWEEN.Tween(effectNut).to({ intensity: 5 }, _.random(500, 2000));
			tween1.chain(tween2);
			tween2.chain(tween1);
			tween1.onUpdate(function (eff) {
				pointLight.intensity = eff.intensity;
			});
			tween2.onUpdate(function (eff) {
				pointLight.intensity = eff.intensity;
			});
			tween1.start();
		});
	}
    
    
    

	//在地图上加上亮点
	setPoints2(arr) {
		if (arr.length <= 0) {
			return;
		}
		var min = _.minBy(arr, 'amount').amount;
		var max = _.maxBy(arr, 'amount').amount;
		var colorScala = d3.scaleOrdinal().domain([min, max]).range(Config.Colors);
		arr.map(function (area) {
			var color = colorScala(area.amount);
			var coord = Config.GLOBAL_BUILDER.getPoint(area.area);
			var light = new THREE.PointLight(color, 1, 10);
			light.position.set(coord[0], coord[1], 10);
			var effectNut = {
				intensity: 1
			};
			var tween1 = new TWEEN.Tween(effectNut).to({ intensity: 1 }, _.random(500, 2000));
			var tween2 = new TWEEN.Tween(effectNut).to({ intensity: 50 }, _.random(500, 2000));
			tween1.chain(tween2);
			tween2.chain(tween1);

			tween1.onUpdate(function (eff) {
				light.intensity = eff.intensity;
			});
			tween2.onUpdate(function (eff) {
				light.intensity = eff.intensity;
			});
			tween1.start();
			Config.GLOBAL_SCENE.add(light);
		});
	}
	
	// mouseOver(mesh, evt) {
	// 	mesh.material.color = Config.AREA.COLOR_HOVER;
	// 	if(_.isFunction(Config.STACK.MoverOver)){
	// 		var str = Config.STACK.MoverOver.call(null,mesh.userData.data);
	// 		ToolTip.showTip(evt,str);
	// 	}
	// }
	// mouseOut(mesh) {
	// 	mesh.material.color = mesh.userData.orginColor;
	// }


}
module.exports = Points;