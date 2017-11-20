//配置项模型
var Config = {
	//是否透明
	Transparent: false,
	// Transparent: true,
	//显示在画布上的比例
	Scale: 0.9,
	//视线角度
	Fov: 50,
	//向上倾斜
	AngleTop: 0,
	//向左倾斜
	AngleLeft: 0,
	//通用级别颜色，语义上由低到高
	Colors: [0x54FF36, 0x31D4FF, 0xFFF130, 0xFB1843, 0xE814FF],

	// ToolTip:{
	// 	ShowTime:1000,
	// 	ShowDelay:5,
	// },
	//地区配置
	AREA: {
		Style: 1,
		// 基础颜色，移动后颜色
		COLOR_DEFAULT: new THREE.Color(0x3F526E),
		COLOR_BORDER: new THREE.Color(0XAAAAAA),
		COLOR_HOVER: new THREE.Color(0xB36758),
		COLOR_HOVER_BORDER: new THREE.Color(0xE0816E),
		// 厚度变化范围
		ThickMin: 4,
		ThickMax: 40,
		// MoverOver: null,
		MouseOver:function(data){
			return '<h2>' + data.name + '</h2>'; 
		},
		Click:null,
		// Click: function (data) {
		// 	return alert(data.name);
		// },
	},

	//柱状图配置
	STACK: {
		Size: 5,

		// MoverOver: null,
		MouseOver:function(data){
			// console.log(data);
			return '<h4>' + data.area + ' : ' + data.count + '</h4>'; 
		},
		Click:null,
		// Click: function (data) {
		// 	return alert(data.name);
		// },
	},

	//飞线配置
	LINE: {

	},

	//光点配置
	POINT: {
		Colors: [0x54FF36, 0x31D4FF, 0xFFF130, 0xFB1843, 0xE814FF],

	},
    extend:function(data){
        _.merge(Config,data);
    }
};

module.exports = Config;