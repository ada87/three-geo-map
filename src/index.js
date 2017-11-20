/**
 * 基于Threejs的3d地图
 * 缺点很多：包含但不限于以下，建议仅作为DEMO参考不要硬套，根据需求修改代码。
 * 1. 暂时只计算了宽度大于高度的场景，高度大于宽度没有适配
 * 2. 柱状图和高度没有同时进行适配，不要两种同时使用
 * 3. 目前下载的GEOJSON文件，很多由多段形状组成的地图有空口，不好修复
 * 4. 为方便各尺度计算。经过自己不太严谨的算法做过地图转换，计算不是很精确，误差在10%左右
 * 5. 定义各种模型时，需要按地图放大倍数计算，放大倍数为：容器高度/地图纬度差,可以通过 mapBuider.getZoom获得
 */

var OrbitControls = require('three-orbit-controls')(THREE);
var Config = require('./__Config');
var Shaders = require('./__Shaders');
var MapBuilder = require('./__MapBuilder');
//组件
var Area = require('./components/__Area');
var Bar = require('./components/__Bar');
var Point = require('./components/__Point');
var Line = require('./components/__Line');

/**
 * 全局变量：
 * Config.GLOBAL_BUILDER: 地图构造器
 * Config.GLOBAL_SCENE : 场景
 **/
Config.GLOBAL_SCENE = new THREE.Scene();
Config.GLOBAL_BUILDER = null;

/**
 * camera : 相机
 * renderer : 绑定对象
 * controls : Orbit控制器对象
 * effect:  （扩展，绘制前加入特效渲染）
 */

var camera, renderer, controls, effect;

var clock = new THREE.Clock();
var Ctrls = [];
var mouse = new THREE.Vector2(),ray = new THREE.Raycaster(),intersects = [];
var posX = 0,posY = 0;

var area = null,
	bar = new Bar(),
	point = new Point(),
	line = new Line();

function onMouseMove(event) {
	[mouse.x, mouse.y] = Config.GLOBAL_BUILDER.tranCanvasPoint(event.pageX - posX, event.pageY - posY);
	ray.setFromCamera(mouse, camera);
	intersects = ray.intersectObjects(Ctrls);
	if (intersects.length > 0) {
		var obj = intersects[0].object;
		Ctrls.map(function (ctrl) {
			if (ctrl == obj) {
				ctrl.userData.caller.mouseOver.call(ctrl.userData.caller, ctrl, event);
			} else {
				ctrl.userData.caller.mouseOut.call(ctrl.userData.caller, ctrl);
			}
		});
	}
}

// 这三行可以注释掉
var stats = new Stats();
document.body.appendChild(stats.dom);
//持续绘制
function animate() {
	stats.update();
	requestAnimationFrame(animate);
	var time = Date.now() * 0.0005;
	TWEEN.update();
	effect.render(Config.GLOBAL_SCENE, camera);
	controls.update(clock.getDelta());
}


class ThreeGeoMap {

	/**
	 * 地图说明 
	 * @param  {Array} josn       	地图数据GEOJSON
	 * @param  {Element} container    地图容器
	 * @param  {Number} config 		地图配置
	 */
	constructor(json, container, config) {
		Config.extend(config);
		Config.GLOBAL_BUILDER = new MapBuilder(json, container);
		[posX, posY] = [container.offsetLeft, container.offsetTop];
		area = new Area(json);
		var [width, height] = [container.offsetWidth, container.offsetHeight]
		var center = Config.GLOBAL_BUILDER.getCenter();
		var far = center[1] / (Math.PI * (Config.Fov / 180));

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			preserveDrawingBuffer: true,
			alpha: Config.Transparent,
		});
		effect = renderer;
		camera = new THREE.PerspectiveCamera(Config.Fov, width / height, 0.0001, 10000);
		camera.position.set(center[0] * (1 - Config.AngleLeft), center[1] * (1 - Config.AngleTop), far * 2);

		renderer.setSize(width, height);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.setViewport(0, 0, width, height);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;
		controls.target.set(center[0], center[1], 0);
		container.appendChild(renderer.domElement);

		// 场景加亮
		Config.GLOBAL_SCENE.add(new THREE.AmbientLight(0xffffff));
		container.addEventListener('mousemove', onMouseMove, false);
		this._updateCtrl();
		animate();
	}

	//将可控制的元素合并到数组内
	_updateCtrl() {
		Ctrls = [];
		if (area && (Config.AREA.MouseOver || Config.AREA.Click)) {
			Ctrls = _.concat(Ctrls, area.getCtrls());
		}
		if (bar && (Config.STACK.MouseOver || Config.STACK.Click)) {
			Ctrls = _.concat(Ctrls, bar.getCtrls());
		}
	}


	//设置地区颜色
	setColors(arr) {
		area.setColors(arr);
	}

	//设置地区高度
	setHeight(arr) {
		area.setHeight(arr);
	}


	//在地区上设置柱形图
	setBars(arr) {
		bar.setData(arr);
		this._updateCtrl();
	}

	setPoints(arr) {
		point.setData(arr);
	}


	//在地区上设置连线
	setLines(arr) {
		line.setData(arr);
		this._updateCtrl();
	}
}


module.exports = ThreeGeoMap;