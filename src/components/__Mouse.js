//鼠标移动，点击控制器
class Mouse{
	constructor(ctrls){
		this.CTRLS = ctrls||[];
	}

	addCtrl(ctrl){
		ctrl.userData.caller = this;
		this.CTRLS.push(ctrl);
	}
	getCtrls(){
		return this.CTRLS;
	}
	//子类实现，鼠标移入后的操作
	mouseOver(mesh){
		
	}
	//子类实现，鼠标移出后的操作
	mouseOut(mesh){

	}
	//子类实现，鼠标点击后的操作
	click(mesh){

	}
}

module.exports = Mouse;