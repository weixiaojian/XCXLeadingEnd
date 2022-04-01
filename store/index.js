import Vue from 'vue';
import Vuex from 'vuex';

//vuex模块引入
import User from './modules/user.js';  //存储用户信息
import Equipment from './modules/equipment.js';  //存储设备信息 
import Localdata from './modules/localdata.js'; //缓存数据
import Bluetooth from './modules/ble.js';  //存储蓝牙设备信息
//vue使用vuex;
Vue.use(Vuex);

export default new Vuex.Store({
	// 开启严格模式,仅开发模式下启用,发布环境下取消
	strict: true,
    modules:{
       User,
	   Equipment,
	   Localdata,
	   Bluetooth
    }
})