/**
 * @author 313671494@qq.com
 */

const cmd = require('./cpcl_cmd.js');

/**
 * 设置打印数据到模板
 * @param tpl   模板
 * @param order 订单数据、要打印的数据
 */
function printTpl_handler(tpl, order) {
	console.log('------解析模板数据 order----',tpl, order)
	
	// 订单录入日期
	if(!order.registerDate || order.registerDate == '') {
		order.registerDate == ''
	}
	// 二段码
	if(!order.twoCode || order.twoCode == '') {
		order.twoCode == ''
	}
	// 三段码 
	if(!order.threeCode || order.threeCode == '') {
		order.threeCode == ''
	}
	// 四段码
	if(!order.fourCode || order.fourCode == '') {
		order.fourCode == ''
	}
	// 运单号
	if(!order.billCode || order.billCode == '') {
		order.billCode == ''
	}
	
	// 集 destinationCenter
	if(!order.destinationCenter || order.destinationCenter == '') {
		order.destinationCenter == ''
	}
	// 收：收件人
	if(!order.acceptMan || order.acceptMan == '') {
		order.acceptMan == ''
	}
	// 收件电话
	if(!order.acceptManMobile || order.acceptManMobile == '') {
		order.acceptManMobile == ''
	}
	// 寄： 寄件人
	if(!order.sendMan || order.sendMan == '') {
		order.sendMan == ''
	}
	// 寄件电话
	if(!order.sendManMobile || order.sendManMobile == '') {
		order.sendManMobile == ''
	}
	// 物品类型
	if(!order.goodsName || order.goodsName == '') {
		order.goodsName == ''
	}
	// 备注
	if(!order.remark || order.remark == '') {
		order.remark == ''
	}
	// 订单号
	if(!order.orderBill || order.orderBill == '') {
		order.orderBill == ''
	}
	
	// 集上方的收件地址--省
	if(!order.acceptProvince || order.acceptProvince == '') {
		order.acceptProvince == ''
	}
	// 收件市级
	if(!order.acceptCity || order.acceptCity == '') {
		order.acceptCity == ''
	}
	// 收件区级
	if(!order.acceptCounty || order.acceptCounty == '') {
		order.acceptCounty == ''
	}
	// 收件街道级
	if(!order.acceptTown || order.acceptTown == '') {
		order.acceptTown == ''
	}
	
	// 寄件地址及详细地址
	// if(!order.fourCode || order.fourCode == '') {
	// 	order.fourCode == ''
	// }
	// // 收件地址及详细地址
	// if(!order.fourCode || order.fourCode == '') {
	// 	order.fourCode == ''
	// }
	
	console.log('------解析模板数据 order----',tpl, order);
	
	try {
		parse_cmd(tpl);
	} catch (ex) {

	}
	let _tpl = JSON.stringify(tpl)
	Object.keys(order).forEach(function(k) {
		try {
			//console.log('Object.keys(order).forEach')
			if (typeof order[k] === 'string') {
				order[k] = order[k].replace(/"|\s/g, '');
			}
		} catch (err) {
			console.log('err Object.keys(order).forEach(function (k) ')
			console.log(err)
		}
		let req_val = '{{' + k + '}}';
		_tpl = _tpl.replace(new RegExp(req_val, 'gi'), order[k])
	})
	
	// console.log(_tpl)
	//let _tpl = JSON.parse(json);

	return cut_str(_tpl);
}

// 设置模板数据 对模板中有 {{cut|10|25}} 的数据进行处理
function cut_str(tpl) {

	let tpl_arr = JSON.parse(tpl);
	let len = tpl_arr.length;
	for (let i = 0; i < tpl_arr.length; i++) {

		// 换行操作
		if (tpl_arr[i].indexOf('{{cut|') !== -1) {
			let cut_str = tpl_arr[i].match(/{{cut.+}}/ig); // 取出自定义文本打印换行的设置参数 如：{{cut|25|10}} 代表下一行高度增加25，10个字符就要换一行
			let _cut = cut_str[0].replace(/{{|}}/ig, '').split('|'); // 数组第二个代表多少个字可以换行，第三个代表换行的高度  ["cut", "9", "25"]
			let item = tpl_arr[i].replace(/{{.+}}/ig, ''); // 该行打印打指令
			let _text = item.split(' '); // 取出打印指令的各参数
			let _data = _text.length > 6 ? item.split(' ').splice(5, _text.length).join('') : _text[5]; // 取出打印的字符串
			// 如果是长空内容，需要换行，生成多行打印
			let text = cmd.TEXT(parseInt(_text[1]), parseInt(_text[2]), parseInt(_text[3]), parseInt(_text[4]), _data, _cut[1],
				_cut[2]);
			tpl_arr.splice(i, 1, text); // 把原来的模板指令替换为解析好的打印指令
		}

		// 单号每4位空一格
		if (tpl_arr[i].indexOf('{{by4split|') !== -1) {
			let split_str = tpl_arr[i].match(/{{by4split.+}}/ig); // 取出自定义文本打印换行的设置参数 如：{{by4split|4}} 每4个字符分隔
			let _split = split_str[0].replace(/{{|}}/ig, '').split('|'); // 数组第二个代表隔多少个字符分隔 ["by4split", "4"]
			let item = tpl_arr[i].replace(/{{.+}}/ig, ''); // 该行打印打指令
			let _text = item.split(' '); // 取出打印指令的各参数
			let _data = _text.length > 6 ? item.split(' ').splice(5, _text.length).join('') : _text[5]; // 取出打印的字符串
			//console.log(_data)
			_data = util.by4split(_data, _split[1]);
			// 如果是长空内容，需要换行，生成多行打印
			let text = 'TEXT ' + parseInt(_text[1]) + ' ' + parseInt(_text[2]) + ' ' + parseInt(_text[3]) + ' ' + parseInt(_text[
				4]) + ' ' + _data + '\r\n';
			//console.log('----------------by4split-----------')
			//console.log(_split[1])
			//console.log(_data)
			tpl_arr.splice(i, 1, text); // 把原来的模板指令替换为解析好的打印指令
		}

		// 验视章 TEXT_YSZ(x,y,line_w)
		if (tpl_arr[i].indexOf('{{TEXT_YSZ|') !== -1) {
			let split_str = tpl_arr[i].match(/{{TEXT_YSZ.+}}/ig); // 取出自定义文本打印换行的设置参数 如：{{by4split|4}} 每4个字符分隔
			let _split = split_str[0].replace(/{{|}}/ig, '').split('|'); // 数组第二个代表隔多少个字符分隔 ["by4split", "4"]
			let item = tpl_arr[i].replace(/{{.+}}/ig, ''); // 该行打印打指令
			let _text = item.split(' '); // 取出打印指令的各参数
			let _data = _text.length > 6 ? item.split(' ').splice(5, _text.length).join('') : _text[5]; // 取出打印的字符串
			// console.log(_data)
			let text = cmd.TEXT_YSZ(parseInt(_split[1]), parseInt(_split[2]), _data, _split[3]); // 如果是长空内容，需要换行，生成多行打印
			// console.log('----------------TEXT_YSZ(x,y,line_w)-----------')
			// console.log(_split)
			// console.log(_data)
			tpl_arr.splice(i, 1, text); // 把原来的模板指令替换为解析好的打印指令
		}
		
		try{
			// 最后把未解析的标签去除
			let _itme = tpl_arr[i].replace(/{{(.+)}}/, '-');
			tpl_arr.splice(i, 1, _itme);
		}catch(e){
			//TODO handle the exception
		}
	}
	//console.log( JSON.stringify(tpl_arr) );
	
	return tpl_arr;
}

/**
 * 解析模板内的打印指令
 * "{{cmd|TEXT_YSZ|475,760}}",     // 模板中可以这样使用
 * "{{cmd|TEXT|12,800,12,600,1}}"  // 模板中可以这样使用
 */
function parse_cmd(tpl) {
	let cmd_obj = cmd;
	try {
		tpl.forEach(function(item, index) {
			if (item.indexOf('{{cmd|') !== -1) {
				let cmd_arr = item.match(/{{cmd.+}}/ig),
					_cmd = cmd_arr[0].replace(/{{|}}/ig, '').split('|'),
					cmd_name = _cmd[1],
					cmd_param = _cmd[2].split(',');
				//console.log(cmd_arr)
				let cmd_fun = cmd_obj[cmd_name];

				if (cmd_obj.hasOwnProperty(cmd_name)) {
					switch (cmd_name) {
						case 'TEXT_YSZ':
							tpl.splice(index, 1, cmd_fun(cmd_param[0], cmd_param[1])); // 把原来的模板指令替换为解析好的打印指令
							break;
						case 'TEXT':
							tpl.splice(index, 1, cmd_fun(cmd_param[0], cmd_param[1], cmd_param[2], cmd_param[3], cmd_param[4])); // 把原来的模板指令替换为解析好的打印指令
							break;
					}
				} else {
					// console.log('false')
				}
			}
		})
	} catch (err) {
		// TODO
	}
}


module.exports = printTpl_handler
