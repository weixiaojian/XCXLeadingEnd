/**
 *  * @author 313671494@qq.com
 * 打印机命令
 * <!> {offset} <200> <200> {height} {qty}
 * <!>: 使用“ !”作为控制会话的起始字符。 {offset}:整个标签的横向偏置。此值可以使所有域以指定的单位数量进行横向偏置。
 * <200>: 横向分辨率 (以点/英寸为单位)。
 * <200>: 纵向分辨率 (以点/英寸为单位)。
 * @param: max_height: 标签的最大高度。1mm = 8点像
 * @param: page_count: 要打印的标签数量。最大值 = 1024。
 * @return: string
 */
function INIT(max_height, page_count) {
	page_count = page_count ? page_count : 1;
	let cmd = "! 0 200 200 " + max_height + " " + page_count + "\r\n";
	return cmd;
}

/**
 * 打印一条直线
 * 命令 {command} {x0} {y0} {x1} {y1} {width}
 * @param x0 左上角的 X 坐标。
 * @param y0 左上角的 y 坐标。
 * @param x1 左上角的 X 坐标。
 * @param y1 以下项的 X 坐标:。
 * @param line_width 线条的大小（线条粗细）。
 * @return string 字符串
 */
function LINE(x0, y0, x1, y1, line_width) {
	x0 = parseInt(x0), y0 = parseInt(y0), x1 = parseInt(x1), y1 = parseInt(y1), line_width = line_width ? parseInt(
		line_width) : 2;
	return "LINE " + x0 + " " + y0 + " " + x1 + " " + y1 + " " + line_width + "\r\n";
}

/**
 * 打印一行文字 
 * 命令 {command} {font} {size} {x} {y} {data}
 * @param: font     字体选择
 * @param: size     字体大小 1~7
 * @param: x        x轴开始位置
 * @param: y        y轴开始位置
 * @param: data     打印的文字
 * @param: next_h   下一行的高度
 * @param: str_len  设定多少个字换行
 * @return: string  字符串
 */
function TEXT(font, size, x, y, data, next_h, str_len, data_type) {
	str_len = parseInt(str_len);
	data_type = parseInt(data_type);
	str_len = str_len ? str_len : 10; //
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

		// 遍历每一行
		for (let j = 0; j < strArr.length; j++) {
			y = parseInt(y) + parseInt(j > 0 ? next_h : 0);
			// 不是空字符串则生成一行打印指令
			if (strArr[j].trim().length > 1) {
				let c = "T " + font + " " + size + " " + x + " " + y + " " + strArr[j] + (j + 1 === strArr.length ? "" : '\r\n');
				//console.log(c)
				cmds.push(c)
			}

		}
	} else {
		let cmd = "T " + font + " " + size + " " + x + " " + y + " " + data + "\r\n";
		cmds.push(cmd);
	}
	return data_type ? cmds : cmds.join('');
}



/**
 * 用户可以使用 BOX 命令生成具有指定线条宽度的矩形
 * 命令 {command} {x0} {y0} {x1} {y1} {width}
 * @param: x0 左上角的 X 坐标。
 * @param: y0 左上角的 Y 坐标。
 * @param: x1 右下角的 X 坐标。
 * @param: y1 右下角的 Y 坐标。
 * @param: width 形成矩形框的线条的单位宽度。
 * @return: string 
 */
function BOX(x0, y0, x1, y1, width) {
	console.log("BOX " + x0 + " " + y0 + " " + x1 + " " + y1 + " " + width + "\r\n")
	return "BOX " + x0 + " " + y0 + " " + x1 + " " + y1 + " " + width + "\r\n"; //"BOX 0 0 576 800 2\r\n" +
}

/**
 * SETMAG 命令可将常驻字体放大指定的放大倍数。 格式:
 * {command} {w} {h}
 * @param: {w}: 字体的宽度放大倍数。有效放大倍数为 1 到 16。
 * @param: {h}: 字体的高度放大倍数。有效放大倍数为 1 到 16。
 * @remark: 备注:SETMAG 命令在标签打印后仍保持有效。这意味着要打印的下一标签将使用最近设置的 SETMAG 值。要取消 SETMAG 值并使打印 机可以使用默认字体大小，请使用 SETMAG 命令，且放大倍数为 0,0。
 * @return: string
 */
function SETMAG(w, h) {
	let cmd = "SETMAG " + w + " " + h + "\r\n";
	if (!w || !h) {
		cmd = "SETMAG 1 1\r\n"; // 调用 SETMAG() 即取消放大
	}
	return cmd;
}

/**
 * SETBOLD 命令可使文本加粗并稍微加宽。SETBOLD 命令会采用一个操作数来设置文本变黑的程度
 * ! U1 SETBOLD {value}
 * @param: {w}: 字体的宽度放大倍数。有效放大倍数为 1 到 16。
 * @param: {h}: 字体的高度放大倍数。有效放大倍数为 1 到 16。
 * @remark: 备注:SETMAG 命令在标签打印后仍保持有效。这意味着要打印的下一标签将使用最近设置的 SETMAG 值。要取消 SETMAG 值并使打印 机可以使用默认字体大小，请使用 SETMAG 命令，且放大倍数为 0,0。
 * @return: string
 */
function SETBOLD(n) {
	let cmd = "SETBOLD " + n + "\r\n";
	if (!n) {
		cmd = "SETBOLD 0\r\n"; // 调用 SETBOLD() 即取消
	}
	return cmd;
}

/**
 * TEXT_YSZ 验视章

 * @param: {x}: x轴坐标
 * @param: {y}: y轴坐标
 * @line_w: 备注:矩形线粗
 * @return: string
 */
function TEXT_YSZ(x, y, line_w) {
	x = parseInt(x);
	y = parseInt(y);
	line_w = line_w ? line_w : 2;
	let box = "BOX " + x + " " + y + " " + (x + 99) + " " + (y + 40) + " " + line_w + "\r\n";
	let text = "T 8 0 " + (x + 10) + " " + (y + 10) + " 已验视\r\n";
	//let box  = "BOX 475 760 576 800 2\r\n";
	//let text = "T 8 0 485 770 已验视\r\n",

	return box + text;
}


module.exports = {
	INIT: INIT,
	TEXT: TEXT,
	LINE: LINE,
	BOX: BOX,
	SETMAG: SETMAG,
	SETBOLD: SETBOLD,
	TEXT_YSZ: TEXT_YSZ,
}
