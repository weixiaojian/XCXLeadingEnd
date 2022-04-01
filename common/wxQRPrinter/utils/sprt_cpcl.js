
const density = 8;  //打印密度 - 8点/毫米
// const platform = plus.os.name !== "Android" ? true : false;
/********************************************************************
 函数名：pageSetup
 功能:设置打印纸张大小（打印区域）的大小
 参数:
	pageWidth:打印区域宽度
	pageHeight:打印区域高度
 返回：
 @"! 0 200 200 %d 1\r\nPW %d\r\nAUTO-BACK\r\n",pageHeight,pageWidth"
	无
********************************************************************/
function INIT(page_height,page_width){
	// let itn;
	// platform ? itn = "! 0 200 200 " + page_height + " 1\r\nPW " + page_width + "\r\n"  //设置打印机
	//          : itn = "! 0 200 200 " + page_height + " 1\r\nPW " + page_width + "\r\nAUTO-BACK\r\n";
	return "! 0 200 200 " + page_height + " 1\r\nPW " + page_width + "\r\n";
}
/********************************************************************
 函数名：drawText
 功能:打印文本框
 参数:
	text_x 起始横坐标
	text_y 起始纵坐标
	text  打印的文本内容
	fontSize 字体大小 :
 1：16点阵；
 2：24点阵；
 3：32点阵；
 4：24点阵放大一倍；
 5：32点阵放大一倍
 6：24点阵放大两倍；
 7：32点阵放大两倍；
 其他：24点阵
	rotate 旋转角度:
 0：不旋转；	1：90度；	2：180°；	3:270°
	bold 是否粗体
 0：否； 1：是
	underline 是否下划线
 false：不下划线；true：下划线
	reverse 是否反白
 false：不反白；true：反白
 返回：
	无
@"UT %d\r\nSETBOLD %d\r\nIT %d\r\n%@ %d %d %d %d %@\r\n",munderline,bold,mreverse,pStr2,font,size,text_x,text_y,text
"INVERSE-LINE " + area_start_x + " " + area_start_y + " " + area_end_x + " " + area_start_y + " " + (area_end_y - area_start_y) + "\r\n"
 ********************************************************************/
function TEXT(font, size, x, y, data, next_h, str_len, data_type) {
	str_len = parseInt(str_len);
	data_type = parseInt(data_type);
	str_len = str_len ? str_len : 10; 
	let cmds = [];

	// 是否设置换行高度
	if (next_h > 0) {
		//console.log(data + ' ' + data.length + ' 设置换行字数' + next_h)
		var strArr = [];
		var n = str_len; // 设定多少个字换行
		for (var i = 0, l = data.length; i < l / n; i++) {
			var a = data.slice(n * i, n * (i + 1));
			strArr.push(a);
		}
        // console.log(strArr);
		// 遍历每一行
		for (let j = 0; j < strArr.length; j++) {
			// console.log(strArr[j]);
			y = parseInt(y) + parseInt(j > 0 ? next_h : 0);
			// 不是空字符串则生成一行打印指令
			if (strArr[j].trim().length >= 1) {
				let c = "T " + font + " " + size + " " + x + " " + y + " " + strArr[j] + (j + 1 === strArr.length ? "" : '\r\n');
				// console.log(c)
				cmds.push(c)
			}
		}
	} else {
		let cmd = "TEXT " + font + " " + size + " " + x + " " + y + " " + data + "\r\n";
		cmds.push(cmd);
	}
	return data_type ? cmds : cmds.join('');
}
function CT_TEXT(font, size, x, y, data, l, t,b,str_len){
	// console.log(font);
	// console.log(size);
	// console.log(x);
	// console.log(y);
	// console.log(data);
	// console.log(l);
	// console.log(t);
	// console.log(str_len);
	let left = l;
	l = parseInt(l);   //x轴移动距离
	t = parseInt(t);   //y轴移动距离
	let ct_text = [];
	let ct_cmd;
	// console.log(data);
	// console.log(Number(data.length));
	// console.log(str_len);
	if(Number(data.trim().length) > str_len){
		// console.log('大于str_len');
		//长度大于6换行
		var strArr = [];
		var n = str_len; // 设定多少个字换行
		for (var i = 0, l = data.length; i < l / n; i++) {
			var a = data.slice(n * i, n * (i + 1));
			strArr.push(a);
		}
		// console.log(strArr);  //["测试一级网点","-A\r\n"]
		for (let j = 0; j < strArr.length; j++) {
			
			// console.log(strArr[j]);
			// y = parseInt(y) + parseInt(j > 0 ? y : 0);
			y = parseInt(j > 0 ? (y + b) : (y - t));
			// console.log(x);
			// console.log(str_len);
			// console.log(l);
			// console.log(strArr[j].length);
			// console.log(str_len - Number(strArr[j].length));
			// console.log(left);
			// console.log(parseInt((str_len - Number(strArr[j].length)) * left));
			if(Number(strArr[j].length) < str_len){
				x =x + parseInt((str_len - Number(strArr[j].trim().length)) * left);
				// console.log(x)
			}
			// console.log(y);
			// 不是空字符串则生成一行打印指令
			if (strArr[j].trim().length >= 1) {
				let c = "T " + font + " " + size + " " + x + " " + y + " " + strArr[j] + (j + 1 === strArr.length ? "" : '\r\n');
				// console.log(c)
				ct_text.push(c)
			}
		}
		// console.log(ct_text);
	}else{
		// console.log('小于str_len')
		if(Number(data.trim().length) < str_len){
			x = x + parseInt((str_len - Number(data.trim().length)) * left);
		}
		ct_cmd = "TEXT " + font + " " + size + " " + x + " " + y + " " + data + "\r\n";
		ct_text.push(ct_cmd);
	}
	return ct_text.join('');
}
/********************************************************************
 函数名：drawLine
 功能:打印线条
 参数:
	line_width: 线条宽度
	x0: 线条起始点x坐标
	y0: 线条起始点y坐标
	x1: 线条结束点x坐标
	x2: 线条结束点y坐标
	fullline:  true:实线  false: 虚线
 返回：
	无
 @"LINE %d %d %d %d %d\r\n",start_x,start_y,end_x,end_y,lineWidth   //实线
 @"DL %d %d %d %d %d 1 1\r\n",start_x,start_y,end_x,end_y,lineWidth   //虚线
 ********************************************************************/
function LINE(x0, y0, x1, y1,line_width) {
	x0 = parseInt(x0), 
	y0 = parseInt(y0), 
	x1 = parseInt(x1), 
	y1 = parseInt(y1), 
	line_width = line_width ? parseInt(line_width) : 2;
	return "LINE " + x0 + " " + y0 + " " + x1 + " " + y1 + " " + line_width + "\r\n";
}
/********************************************************************
 函数名：drawBox
 功能:打印的边框
 参数:
	lineWidth: 边框线条宽度
	top_left_x: 矩形框左上角x坐标
	top_left_y: 矩形框左上角y坐标
	bottom_right_x: 矩形框右下角x坐标
	bottom_right_y: 矩形框右下角y坐标
 
 返回：
	无
 "BOX %d %d %d %d %d\r\n",top_left_x,top_left_y,brX,bottom_right_y,lw"
 ********************************************************************/
function BOX(x0,y0,x1,y1,line_width){
	x0 = parseInt(x0), 
	y0 = parseInt(y0), 
	x1 = parseInt(x1), 
	y1 = parseInt(y1), 
	line_width = line_width ? parseInt(
		line_width) : 2;
	return "BOX " + x0 + " " + y0 + " " + x1 + " " + y1 + " " + line_width + "\r\n"; 
}

/********************************************************************
 函数名：drawBarCode
 功能:打印一维条码
 参数:
	start_x 一维码起始横坐标
	start_y 一维码起始纵坐标
	text    内容
	type 条码类型：
 0：CODE39；	1：CODE128；
 2：CODE93；	3：CODEBAR；
 4：EAN8；  	5：EAN13；
 6：UPCA;   	7:UPC-E;
 8:ITF
	linewidth 条码宽度
	height 条码高度
 
 返回：
	无
 "B 128 1 1 104 12 520 DF12345678900010292001\n",
 ********************************************************************/
 // function BARCODE(x,y,text,line_width,type,height,rotate){
	//  let cmd;
	//  x = parseInt(x),
	//  y = parseInt(y);
	//  line_width = parseInt(line_width);
	 
	//  if(!rotate){
	// 	 cmd = "B " + type + " 1 " + line_width + " " + height + " " + x + " " + y + " " + text + "\r\n";
	//  }else {
	// 	 cmd = "VB " + type + " 1 " + line_width + " " + height + " " + x + " " + y + " " + text + "\r\n";
	//  }
	//  return cmd;
 // }
 
 /********************************************************************
  函数名：drawQrCode
  功能:打印二维条码
  参数:
 	start_x 二维码起始横坐标
 	start_y 二维码起始纵坐标
 	text    二维码内容
 	rotate 旋转角度：
  0：不旋转；	1：90度；	2：180°；	3:270°
 	ver  QrCode宽度(2-6)
 	lel  QrCode纠错等级(0-20)
  返回：
 	无
"B QR 80 80 M 2 U 6\r\nMA,我是二维码说明\r\nENDQR\r\n", //打印二维码
  ********************************************************************/
 // function QRCODE(x,y,text,rotate,l){
	//  let cmd;
	//  x = parseInt(x) * density,
	//  x = parseInt(y) * density;
	//  if(l == 0){
	// 	 l = "M";
	//  }else if(l == 1){
	// 	 l = "L";
	//  }else if(l == 2){
	// 	 l = "Q";
	//  }else if(l == 3){
	// 	 l = "H";
	//  }
	 
	//  if(!rotate){
	// 	 cmd = "B QR " + x + " " + y + " M 2 U 6\r\n" + l + "A," + text + "\r\nENDQR\r\n";
	//  }else {
	// 	 cmd = "VB QR " + x + " " + y + " M 2 U 6\r\n" + l + "A," + text + "\r\nENDQR\r\n";
	//  }
	//  return cmd;
 // }
 
 function PRINT(){
	 return "PR 0\r\nFORM\r\nPRINT\r\n"
 }
module.exports = {
	INIT: INIT,
	TEXT: TEXT,
	LINE: LINE,
	BOX: BOX,
	PRINT:PRINT,
	CT_TEXT:CT_TEXT
}