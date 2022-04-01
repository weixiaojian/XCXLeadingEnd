import {GET_IPHONE_DATA} from '@/store/gettersType.js';
import {CHANGE_IPHONE_DATA} from '@/store/actionsType.js';
/*
* 用户手机设备数据存储
* {
	"uuid": "bc0b4e822dc132e1",
	"version": "1.0.0",
	"APPVersion": "100",
	"appid": "__UNI__1B388FF",
	"statusHeight": 24,
	"platform": "android",
	"screenWidth": 411,
	"screenHeight": 731,
	"windowWidth": 411,
	"windowHeight": 731,
	"brand": "samsung",
	"model": "SM-G9350",
	"system": "8.0.0",
	"statusBarHeight": 24
}
*/
// 仓库
const state = {
	//手机设备信息
	iPhone:"",
	//手机位置定位
	locationInfo:{},
	network_type:""  //手机网络类型
};
const getters = {
	[GET_IPHONE_DATA]:state=>{
		return state.iPhone;
	}
};

const actions = {
	/*
	* Action不受约束！可以在 action 内部执行异步操作：
	*/
   CHANGE_IPHONE_DATA({commit},value){
	   commit('CHANGE_IPHONE_DATA',value);
   }
}
const mutations = {
	/*
	* mutation 必须同步执行
	* */
	CHANGE_IPHONE_DATA(state,value){
		state.iPhone = value;
	}
}

export default{
	state,
	getters,
	actions,
	mutations
}