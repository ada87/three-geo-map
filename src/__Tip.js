/**
 * 提示
 */
var ShowTime = 2000;
var FireTime = 0;
var FireTimes = 3;			//值越低，灵敏度越高
var FireMessage = '';
var SHOWING = false;
var PID = null;
var NowMessage = '';

var THEME = {
    BACKGROUND: 'rgba(40, 60, 125,0.75)',
    BORDER: "#2A3454",
    TEXT: '#C3D1DE'
};

var toolTip = d3.select('#__v_tip');
if(toolTip.size()==0){
	toolTip = d3.select('body').append('div').attr('id','__v_tip');
}
toolTip.style("position", 'fixed')
	.style("opacity", 0)
	.style('padding', '5px')
	.style('left', '0')
	.style('top', '0')
	.style('height', 'auto')
	.style('width', 'auto')
	.style('opacity', 0)
	.style('pointer-events', 'none')
	.style('display', 'block')
	.style('border', ('1px solid ' + THEME.BORDER))
	.style('background', THEME.BACKGROUND)
	.style('color', THEME.TEXT);

var hide = function(){
	toolTip.transition()
		.duration(200)
		.style("opacity", 0);
};

module.exports = {
	showTip:function(evt,message){
		if(FireMessage == message){
			FireTime++;
		}else{
			FireTime = 0;
			FireMessage = message;
			return;
		}
		if(FireTime < FireTimes){
			return;
		}
		if(SHOWING && NowMessage == FireMessage){	
			return;
		}
		NowMessage = FireMessage;
		let left = evt.clientX;
		let top = evt.clientY;
		toolTip.html(message)
			.style("opacity", 0.95)
			.style("left", left + 10 + 'px')
			.style("top", top+10 + 'px');
		toolTip.transition()
			.duration(200)
			.style("opacity", 0.8);
		window.clearTimeout(PID);
		PID = window.setTimeout(function(){
			hide();
		},2000);

	}

};