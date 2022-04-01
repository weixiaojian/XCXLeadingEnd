const _this = this;

//获取当前时间或指定时间的日期  --- 不传为当天时间 
 const getdate = (daymun = 0,monthmun = 0) => {
    var day1 = new Date();
    day1.setDate(day1.getDate() + daymun);
	day1.setMonth(day1.getMonth() + monthmun);
    var s1 = format("yyyy-MM-dd",day1);
    return s1;
}
//获取当前时间  --- 不传为当天时间
 const getdatetime = (daymun = 0) => {
    var day1 = new Date();
    day1.setDate(day1.getDate() + daymun);
    var s1 = format("yyyy-MM-dd hh:mm:ss",day1);
    return s1;
}
//获取当前时分秒  --- 不传为当天时分秒
 const getdatehour = (daymun = 0) => {
    var day1 = new Date();
    day1.setDate(day1.getDate() + daymun);
    var s1 = format("hh:mm:ss",day1);
    return s1;
}
// 获取当前时间戳
const getdatestamp = ()=>{
	return new Date().getTime()
}

//两个时间比大小
const compareDate = (date1,date2) => {
	var oDate1 = new Date(date1);
	var oDate2 = new Date(date2);
	if(oDate1.getTime() > oDate2.getTime()){
		return true; //第一个大
	} else {
		return false; //第二个大
	} 
}

//格式化	 
 const format = (fmt,datas) => {
   var o = {
           "M+": datas.getMonth() + 1, //月份
           "d+": datas.getDate(), //日
           "h+": datas.getHours(), //小时
           "m+": datas.getMinutes(), //分
           "s+": datas.getSeconds(), //秒
           "q+": Math.floor((datas.getMonth() + 3) / 3), //季度
           "S": datas.getMilliseconds() //毫秒
       };
       if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (datas.getFullYear() + "").substr(4 - RegExp.$1.length));
       for (var k in o)
           if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
       return fmt;
 
}

// const copy = (obj)=>{
// 	var newobj = obj.constructor === Array ? [] : {};
// 	if(typeof obj !== 'object'){
// 		return;
// 	}
// 	for(var i in obj){
// 	   newobj[i] = typeof obj[i] === 'object' ? copy(obj[i]) : obj[i];
// 	}
// 	return newobj
// }
//获取当前时间或指定时间的日期  --- 不传为当天时间--斜杠
 const getdateSlash = (daymun = 0,monthmun = 0) => {
    var day1 = new Date();
    day1.setDate(day1.getDate() + daymun);
	day1.setMonth(day1.getMonth() + monthmun);
    var s1 = format("yyyy/MM/dd",day1);
    return s1;
}
//获取当前时间-时分秒 --斜杠
 const getdatehhmmss = (daymun = 0,monthmun = 0) => {
    var day1 = new Date();
    day1.setDate(day1.getDate() + daymun);
	day1.setMonth(day1.getMonth() + monthmun);
    var s1 = format("hh:mm:ss",day1);
    return s1;
}
// 获取当前日期
const doHandleMonth = () => {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
	// 计算两个指定日期之间相差的月份
const getMonths = (startDate, endDate) => {
	let startYear = startDate.getFullYear();
	let startMonth = startDate.getMonth() + 1;
	let endYear = endDate.getFullYear();
	let endMonth = endDate.getMonth() + 1;
	const months = [];
	if (endYear > startYear) {
		for (let j = 0; j < (endYear - startYear); j++) {
			let monthCount = endMonth + (12 - startMonth);
			for (let i = 0; i < monthCount; i++) {
				let temp;
				if (i <= (12 - startMonth)) {
					temp = (startYear + j) + '' + ((startMonth + i) < 10 ? '0' + (startMonth + i) : (startMonth +
						i));
				} else if (i > (12 - startMonth) && (startYear + j + 1) === endYear) {
					const m = (i - (12 - startMonth));
					temp = endYear + '' + (m < 10 ? '0' + m : m);
				} else {
					continue;
				}
				months.push({
					'label': temp
				})
			}
		}
	} else if (endYear === startYear) {
		let monthCount = endMonth - startMonth;
		for (let i = 0; i < monthCount; i++) {
			const temp = endYear + '' + ((startMonth + i) < 10 ? '0' + (startMonth + i) : (startMonth + i));
			months.push({
				'label': temp
			})
		}
	} else {
		alert("时间错误")
	}
	return months;
}

// 默认全部导出
export default {
	getdate,
	format,
	compareDate,
	getdatetime,
	getdatestamp,
	getdateSlash,
	getdatehhmmss,
	getdatehour,
	doHandleMonth,
	getMonths
}