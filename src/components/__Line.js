var Mouse = require('./__Mouse');
var Config = require('../__Config');

var LINE_NAME = '_POINT';

class Line extends Mouse {

    setData(arr){
		Config.GLOBAL_SCENE.children.map(function(obj){
			if(obj.name == LINE_NAME){
				Config.GLOBAL_SCENE.remove(obj);
			}
		})
		var self = this;
		if (arr.length <= 0) {
			return;
		}
		var numPoints = 150;
		var lineGroup = new THREE.Object3D();
		lineGroup.name = LINE_NAME;
		arr.map(function (line) {
			var form = Config.GLOBAL_BUILDER.getPoint(line.form);
			var to = Config.GLOBAL_BUILDER.getPoint(line.to);
			var geometry = new THREE.Geometry();
			new THREE.CatmullRomCurve3([
				new THREE.Vector3(form[0], form[1], Config.AREA.ThicknessMin + 1),
				new THREE.Vector3(((form[0] + to[0]) / 2), (form[1] + to[1]) / 2, _.random(30, 150)),
				new THREE.Vector3(to[0], to[1], Config.AREA.ThicknessMin + 1)
			]).getPoints(numPoints).map(function (point) {
				geometry.vertices.push(point);
			});

			var material = new THREE.LineBasicMaterial({
				color: 0xff5500,
				transparent: true,
				opacity: 0.8,
				linewidth: 1,
				visible: true
			});

			var line = new THREE.Line(geometry, material);
			lineGroup.add(line);
			var particlesize = Math.floor(_.random(0, 30) + 20);

			var spriteMaterialGlass = new THREE.SpriteMaterial({
				map: new THREE.TextureLoader().load("/data/point.png"),
				transparent: true,
				opacity: 0.7
			});
			var spriteGlass = new THREE.Sprite(spriteMaterialGlass);
			spriteGlass.scale.set(particlesize, particlesize, particlesize);
			spriteGlass.position.set(geometry.vertices[0].x, geometry.vertices[0].y, geometry.vertices[0].z);

			var ani = {
				count: 0
			};
			new TWEEN.Tween(ani)
				.to({
					count: geometry.vertices.length - 1
				}, _.random(800, 2000))
				.easing(TWEEN.Easing.Linear.None)
				.onUpdate(function () {
					spriteGlass.position.set(
						geometry.vertices[Math.floor(ani.count)].x,
						geometry.vertices[Math.floor(ani.count)].y,
						geometry.vertices[Math.floor(ani.count)].z
					);
				})
				.repeat(Infinity)
				.start();
			lineGroup.add(spriteGlass);
		});
		Config.GLOBAL_SCENE.add(lineGroup);
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

    click(mesh){
		if(_.isFunction(Config.STACK.Click)){
			Config.STACK.Click.call(null,mesh.userData.data);
		}
    }


}
module.exports = Line;