/* 正则校验 */

/*订单号匹配(汉字匹配)*/
const RegOrder = /[\u4E00-\u9FA5]/gi;

/*匹配双字节字符(汉字符号)*/
const RegFont = /[^x00-xff]/gi;

/*手机号码验证*/
function RegPhone(data){
	return /^1(3|4|5|6|7|8|9)\d{9}$/.test(data);
}
function RegTel(data){
	if(data.substring(0,1)==1){
		return /^((1)[0-9]{10})$/.test(data);
	}else{
		return /^([0-9]{3,4}[-]{0,1}[0-9]{7,8})$/.test(data)
	}
}
//验证是否为url
function IsURL(str_url) {
    return (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm).test(str_url);
}
// 身份证验证
function RegCard(idCard){
	// idCard = idCard.trim();
	//15位和18位身份证号码的正则表达式
	var regex = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	if (!regex.test(idCard)) return false;
	if (idCard.length != 18) return true;
	//校验18位数的身份证信息
	var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
	var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
	var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
	for (var i = 0; i < 17; i++) {
		idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
	}
	var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
	var idCardLast = idCard.substring(17);//得到最后一位身份证号码
	//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
	if (idCardMod == 2) {
		if (idCardLast == "X" || idCardLast == "x") return true;
		return false;
	} else {
		//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
		if (idCardLast == idCardY[idCardMod]) return true;
		return false;
	}
}
//纯数字验证
function RegDigital(num){
	return /^[0-9]*$/.test(num);
}
//小数点后两位
function RegDecimalTwo(num){
	num = num.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    num = num.replace(/^\./g,""); //验证第一个字符是数字
    num = num.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
    num = num.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //控制可输入的小数
	return num
}

function RegInteger(num) {
	num = num.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	num = num.replace(/^\./g,""); //验证第一个字符是数字
	num = num.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
	return num;
}
function removeHTMLTag(str){
  str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
  str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
  str = str.replace(/(^\s*)|(\s*$)/g, "");
  str = str.replace(/&nbsp;/g, '');//去掉
  str = str.replace(/ /g, '');//去掉
  str=str.replace(/\n/g, '');//去掉
  str=str.replace(new RegExp("&nbsp;", "gm"), "");
  str=str.replace(new RegExp("&amp;", "gm"), "");
  str=str.replace(new RegExp("&gt;", "gm"), "");
  str=str.replace(new RegExp("&lt;", "gm"), "");
  str=str.replace(new RegExp("{", "gm"), "");
  return str;
}
function stripscript(s) {
		let regEx=/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g
    var pattern = s.replace(regEx,'')
		return pattern
}
//验证正整数(不已0开头和包含小数点)
function RegPositiveInteger(num){
	num = num.replace(/\.|^0*/ig,"");
	return num;
}
//验证正整数或正小数
function RegNumber(num){
	return /^(([^0][0-9]*|0)\.([0-9]{1,2})$)|^([^0][0-9]*|0)$/.test(num);
}
//4个数字分隔(-)
// function by4split(data,type){
//    // let reg = new RegExp(`/(\d{${num}})/g`);
//    type = '$1'+type;
//    // console.log(data.replace(/\D+/g,'').replace(/(\d{4})/g,type).trim());
//    return data.replace(/\D+/g,'').replace(/(\d{4})/g,type).trim()
// }

module.exports = {
	RegOrder,
	RegFont,
	RegPhone,
	RegCard,
	RegDigital,
	RegDecimalTwo,
	RegPositiveInteger,
	RegNumber,
	IsURL,
	RegTel,
	RegInteger,
	removeHTMLTag,
	stripscript
	// by4split
}