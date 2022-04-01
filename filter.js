/*
* 过滤器
*/
import Vue from 'vue';
Vue.filter('testFilter',(val)=>{
	return val + '过滤成功'
})

/**
 * 	过滤蓝牙设备ID
 * 		判断Android还是iOS
 */ 
Vue.filter('filterBleMP',(data)=>{
	if(!data){
		return;
	}
	let newAata;
	uni.getSystemInfo({
		success:function(res){
			if(res.platform == 'android') {
				newAata = data.slice(data.lastIndexOf(":")+1);
			} else {
				newAata = data.slice(data.lastIndexOf("-")+1);
			}
		}
	})
	return newAata;
})

// 单选状态
Vue.filter('filterCk',(data)=>{
	let ck = data.filter(item=>item.ck);
	return ck.length
})