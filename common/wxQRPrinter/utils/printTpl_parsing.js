const cmd = require('./sprt_cpcl.js');

/**
 * @param {Object} num 参入参数包含非法字符
 */
function RegLagelTrim(num) {
	num = num.replace(/[^a-zA-Z0-9\_\u4e00-\u9fa5]/g,"");	// 清除所有的非法字符
	return num;
}
function RegHandlePhone(num) {
 num = num.substr(0,3)+"****"+num.substr(7);
 return num;
}

/**
 * 设置打印数据到模板
 * @param tpl   模板
 * @param order 订单数据、要打印的数据
 * RegLagelTrim 拦截非法字符
 */
let order;
function printTpl_handler(tpl, orderData) {
	order =JSON.parse(JSON.stringify(orderData));
	
	console.log('console.log(order);', order);
		
	// 订单录入日期
	if(!order.registerDate || order.registerDate == '') {
		order.registerDate = ''
	}
	// 一段码
	if(!order.oneCode || order.oneCode == '') {
		order.oneCode = ''
	}
	// 二段码
	if(!order.twoCode || order.twoCode == '') {
		order.twoCode = ''
	}
	// 三段码 
	if(!order.threeCode || order.threeCode == '') {
		order.threeCode = ''
	}
	// 四段码
	if(!order.fourCode || order.fourCode == '') {
		order.fourCode = ''
	}
	// 运单号
	if(!order.billCode || order.billCode == '') {
		order.billCode = ''
	}
	
	// 集 destinationCenter
	if(!order.destinationCenter || order.destinationCenter == '') {
		order.destinationCenter = ''
	}
	// 收：收件人
	if(!order.acceptMan || order.acceptMan == '') {
		order.acceptMan = ''
	}
	// 收件电话
	if(!order.acceptManPhone || order.acceptManPhone == '') {
		order.acceptManPhone = ''
	}
	if(order.acceptManPhone) {
	  // 收件电话
	  order.acceptManPhone = order.acceptManPhone
	 }
	// 寄： 寄件人
	if(!order.sendMan || order.sendMan == '') {
		order.sendMan = ''
	}
	if(!order.sendManPhone || order.sendManPhone == '') {
		order.sendManPhone = ''
	}
	// 寄件电话
	if(order.sendManPhone) {
	  // 寄件电话
	  order.sendManPhone = order.sendManPhone
	 }
	// 物品类型
	if(!order.goodsName || order.goodsName == '') {
		order.goodsName = ''
	}
	// 备注
	if(!order.remark || order.remark == ''|| order.remark == null) {
		order.remark = ''
	}
	// 订单号
	if(!order.orderBillCode || order.orderBillCode == '') {
		order.orderBillCode = ''
	}
	
	// 集上方的收件地址--省
	if(!order.acceptProvince || order.acceptProvince == '') {
		order.acceptProvince = ''
	}
	// 收件市级
	if(!order.acceptCity || order.acceptCity == '') {
		order.acceptCity = ''
	}
	// 收件区级
	if(!order.acceptCounty || order.acceptCounty == '') {
		order.acceptCounty = ''
	}
	// 收件街道级
	if(!order.acceptTown || order.acceptTown == '') {
		order.acceptTown = ''
	}
	// 收件详细地址
	if(!order.acceptManAddress || order.acceptManAddress == '') {
		order.acceptManAddress = ''
	}
	// 集上方的寄件地址--省
	if(!order.sendProvince || order.sendProvince == '') {
		order.sendProvince = ''
	}
	// 寄件市级
	if(!order.sendCity || order.sendCity == '') {
		order.sendCity == ''
	}
	// 寄件区级
	if(!order.sendCounty || order.sendCounty == '') {
		order.sendCounty = ''
	}
	// 寄件街道级
	if(!order.sendTown || order.sendTown == '') {
		order.sendTown = ''
	}
	// 寄件详细地址
	if(!order.sendManAddress || order.sendManAddress == '') {
		order.sendManAddress = ''
	}
	// 设置数据到模版上拦截非法字符
	 if(order.sendMan) {
	  // 寄件人姓名
	  let sdMan = RegLagelTrim(order.sendMan);
	  order.sendMan = sdMan
	 }
	 
	 if(order.sendManAddress) {
	  // 寄件地址
	  let sendAdd = RegLagelTrim(order.sendManAddress);
		order.sendManAddress = sendAdd.slice(0,30)
	 }
	 
	 if(order.acceptMan) {
	  // 收件姓名
	  let accMan = RegLagelTrim(order.acceptMan);
	  order.acceptMan = accMan
	 }
	 if(order.acceptManAddress) {
	  // 收件地址
	  let accAdd = RegLagelTrim(order.acceptManAddress);
	  order.acceptManAddress = accAdd.slice(0,33)
		let letter = order.acceptManAddress.match(/[0-9]/g)?order.acceptManAddress.match(/[0-9]/g).length:0;
		let num = order.acceptManAddress.match(/[a-zA-Z]/g)?order.acceptManAddress.match(/[a-zA-Z]/g).length:0;
		let isletter = /[0-9a-z]/i;
		isletter.test(order.acceptManAddress)
		order.recFontNum = '{{cut|35|13}}';
		if(isletter.test(order.acceptManAddress)){
			if(isletter.test(order.acceptManAddress.slice(0,13))){
				order.recFontNum = '{{cut|35|14}}'
				if(!isletter.test(order.acceptManAddress.slice(13,26))){
					order.recFontNum = '{{cut|35|13}}'
				}
			}
		}
	 }
	 if(order.goodsName) {
	  let goodsName = RegLagelTrim(order.goodsName);
	  order.goodsName = goodsName.slice(0,15)
	 }
	 if(order.remark) {
	  let remark = RegLagelTrim(order.remark);
	  let remarkSplit = remark.split(/[\s\n]/);
	  order.remark = remarkSplit[0].slice(0,42);
	 }
	
	/**
	 *  设置动态数据到模板上渲染
	 */
	let _tpl = JSON.stringify(tpl);
	Object.keys(order).forEach(function(k) {
		try {
			if (typeof order[k] === 'string') {
				order[k] = order[k].replace(/|/g, '');  //匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
			}
		} catch (err) {
			// console.log('err Object.keys(order).forEach(function (k) ')
			// console.log(err)
		}
		let req_val = '{{' + k + '}}';
		_tpl = _tpl.replace(new RegExp(req_val, 'gi'), order[k]);
	});
	// console.log(_tpl);
	return cut_str(_tpl);
}
// 设置模板数据 对模板中有 {{cut|10|25}} 的数据进行处理
// {{cut|换行字数|换行高度}}
/**
 * 1.做参数补充
 * 2.{{}} 替换
 * 3.处理字体换行
 */
function cut_str(tpl) {
	let tpl_arr = JSON.parse(tpl);
	let copy_tpl_arr = JSON.parse(JSON.stringify(tpl_arr));
	// console.log(order);
	let len = tpl_arr.length;
	// console.log(tpl_arr);
	for (let i = 0; i < tpl_arr.length; i++) {
		// 换行操作
		if (tpl_arr[i].indexOf('{{cut|') !== -1) {
			let cut_str = tpl_arr[i].match(/{{cut.+}}/ig); // 取出自定义文本打印换行的设置参数 如：{{cut|25|10}} 代表下一行高度增加25，10个字符就要换一行
			// console.log(cut_str); //["{{cut|28|19}}"]
			let _cut = cut_str[0].replace(/{{|}}/ig, '').split('|'); // 数组第二个代表多少个字可以换行，第三个代表换行的高度  ["cut", "9", "25"]
			
			// console.log(_cut);  //["cut","28","19"]
			let item = tpl_arr[i].replace(/{{.+}}/ig, ''); // 该行打印打指令
			// console.log(item);  //T 24 0 24 454 广东省广州市花都区炭步镇新竹湖村四巷29号 
			let _text = item.split(' '); // 取出打印指令的各参数
			// console.log(_text);  //["T","24","0","24","454","广东省广州市花都区炭步镇新竹湖村四巷29号","\r\n"]
			let _data = _text.length > 6 ? item.split(' ').splice(5, _text.length).join('') : _text[5]; // 取出打印的字符串["T", "24", "0", "24", "454", "广东省广州市花都区炭步镇新竹湖村四巷29号", "\r\n"]
			// console.log(_data);  //广东省广州市花都区炭步镇新竹湖村四巷29号
			// 如果是长空内容，需要换行，生成多行打印
			let text = cmd.TEXT(parseInt(_text[1]), parseInt(_text[2]), parseInt(_text[3]), parseInt(_text[4]), _data, _cut[1],
				_cut[2]);
			// console.log(text);
			tpl_arr.splice(i, 1, text); // 把原来的模板指令替换为解析好的打印指令
			// console.log(tpl_arr);
		}
		
		
		// 单号每4位空一格
		if (tpl_arr[i].indexOf('{{by4split|') !== -1) {
			let split_str = tpl_arr[i].match(/{{by4split.+}}/ig); // 取出自定义文本打印换行的设置参数 如：{{by4split|4}} 每4个字符分隔
			let _split = split_str[0].replace(/{{|}}/ig, '').split('|'); // 数组第二个代表隔多少个字符分隔 ["by4split", "4"]
			let item = tpl_arr[i].replace(/{{.+}}/ig, ''); // 该行打印打指令
			let _text = item.split(' '); // 取出打印指令的各参数
			let _data = _text.length > 6 ? item.split(' ').splice(5, _text.length).join('') : _text[5]; // 取出打印的字符串
			// console.log(_data)
			// _data = util.by4split(_data, _split[1]);
			// _data = by4split(_data,_split[1],'-');
			_data = _data.replace(/\D+/g,'').replace(/(\d{4})/g,'$1-').trim();
			if(_data.length-1 == _data.lastIndexOf('-')){
				_data = _data.slice(0,_data.length-1);
			}
			// _data = _data.replace(/\D+/g,'').replace(/(?=(\d{4})+$)/g,'-').trim();
			
			// console.log(by4split(_data,_split[1],'-'));
			// console.log(_data);
			// 如果是长空内容，需要换行，生成多行打印
			let text = 'TEXT ' + parseInt(_text[1]) + ' ' + parseInt(_text[2]) + ' ' + parseInt(_text[3]) + ' ' + parseInt(_text[
				4]) + ' ' + _data + '\r\n';
			//console.log('----------------by4split-----------')
			//console.log(_split[1])
			//console.log(_data)
			tpl_arr.splice(i, 1, text); // 把原来的模板指令替换为解析好的打印指令
		}
		
		// // {{cantt|20|20}}
		if (tpl_arr[i].indexOf('{{cantt|') !== -1) {
			let cantt_str = tpl_arr[i].match(/{{cantt.+}}/ig); // 取出自定义文本打印换行的设置参数 如：{{cantt|20|20|20|6}} 20 x轴移动距离，20 t轴移动距离  20 b轴移动距离  6 几个字换行
			// console.log(cantt_str); //["{{cut|28|19|left}}"]
			let _cantt = cantt_str[0].replace(/{{|}}/ig, '').split('|'); // 数组第二个代表多少个字可以换行，第三个代表换行的高度  ["cantt", "20", "20","left"]
			// console.log(_cantt); ////["cut","28","19","6"]
			let list = tpl_arr[i].replace(/{{.+}}/ig, ''); // 该行打印打指令
			// console.log(list);   
			let ct_text = list.split(' ');  ///["T","24","0","24","454","测试一级网点A","\r\n"]
			// console.log(ct_text);
			// console.log(cmd);
			// let ct_data = ct_text.length > 6 ? list.split(' ').splice(5, ct_text.length).join('') : ct_text[5];  // 大于6换行抬升，小于6右移
			let ct_cpcl = cmd.CT_TEXT(parseInt(ct_text[1]), parseInt(ct_text[2]), parseInt(ct_text[3]), parseInt(ct_text[4]), ct_text[5],parseInt(_cantt[1]),
				parseInt(_cantt[2]),parseInt(_cantt[3]),parseInt(_cantt[4]));
			// console.log(ct_cpcl);
			tpl_arr.splice(i, 1, ct_cpcl); // 把原来的模板指令替换为解析好的打印指令
		}
		// console.log(tpl_arr[i].indexOf('{{hd|'));
	}
	console.log(tpl_arr);
	return tpl_arr;
	// return copy_tpl_arr;
}


module.exports = printTpl_handler