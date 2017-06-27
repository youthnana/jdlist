$(document).ready(function(){

	var sub = $('#sub');

	var activeRow,activeMenu;

	var timer;

	var mouseInSub = false;

	sub.on('mouseenter',function(){

		mouseInSub = true;

	}).on('mouseleave',function(){

		mouseInSub = false;
	})

	var mouseTrack = [];

	var moveHandler = function(e){

		mouseTrack.push({

			x: e.pageX,
			y: e.pageY,
		})

		if(mouseTrack.length > 3){

			mouseTrack.shift();
		}
	}

	$('#wrap')
	.on('mouseenter',function(){

		sub.removeClass('none');

		$(document).bind('mousemove',moveHandler);
	})

	.on('mouseleave',function(){

		sub.addClass('none');

		if(activeRow){

			activeRow.removeClass('active');

			activeRow = null;

		}

		if(activeMenu){

			activeMenu.addClass('none');

			activeMenu = null;
		}

		$(document).unbind('mousemove',moveHandler);
	})

	.on('mouseenter','li',function(e){

		if(!activeRow) {

			activeRow = $(e.target).addClass('active');

			activeMenu = $('#' + activeRow.data('id'));

			activeMenu.removeClass('none');

			return;

		}

		if(timer){

			clearTimeout(timer);
		}

		var currMousePos = mouseTrack[mouseTrack.length - 1];

		var leftCorner = mouseTrack[mouseTrack.length - 2];

		var delay = needDelay(sub,currMousePos,leftCorner);

		if(delay){

			timer = setTimeout(function(){

				if(mouseInSub){

					return;
				}

				if(activeRow){//由于延时操作的原因，有一种情况是：一级菜单向右移出超过二级菜单的范围，
					//此时触发了延时，但是因为鼠标移出一级菜单，已经对一级菜单进行了removeClass操作，
					//会报错：所以要判断一下activeRow是否存在

					activeRow.removeClass('active');

					activeMenu.addClass('none');

					activeRow = $(e.target);

					activeRow.addClass('active');

					activeMenu = $('#' + activeRow.data('id'));

					activeMenu.removeClass('none');

					timer = null;

					}
					
				},300);


		}else {

			var preActiveRow = activeRow;
			var preActiveMenu = activeMenu;

			activeRow = $(e.target);

			activeMenu = $('#' + activeRow.data('id'));

			preActiveRow.removeClass('active');
			preActiveMenu.addClass('none');

			activeRow.addClass('active');
			activeMenu.removeClass('none');


		}

		
		
	})
})

//计算向量
function vector(a, b) {

	return {

		x: b.x - a.x,
		y: b.y - a.y
	}
}

function vectorPro(v1, v2) {

	return v1.x * v2.y - v1.y * v2.x;
}

//判断符号是否相同
function sameSign(a, b) {

	return (a ^ b) >= 0;
}

function isPoint(p, a, b, c) {

	var pa = vector(p, a);
	var pb = vector(p, b);
	var pc = vector(p, c);

	var t1 = vectorPro(pa, pb);
	var t2 = vectorPro(pb, pc);
	var t3 = vectorPro(pc, pa);

	return sameSign(t1, t2) && sameSign(t2, t3);
}

// 判断是否需要延迟
function needDelay(ele, currMousePos, leftCorner) {

	if (!currMousePos || !leftCorner) {

		return
	}

	var offset = ele.offset();

	var topleft = {

		x: offset.left,
		y: offset.top
	};

	var leftbottom = {

		x: offset.left,
		y: offset.top + ele.height()
	};

	return isPoint(currMousePos, leftCorner, topleft, leftbottom);
}