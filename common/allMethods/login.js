import Vue from 'vue';
import {SET_USERINFO,SET_TOKEN,SET_CLEAR_STATE} from '@/store/actionsType.js';
/**
 * 登录检测
 */
Vue.prototype.$checkToken = function(calback){
	let self = this;
	/**
	 * 1.从缓存中获取token
	 * 2.如果有token则请求获取数据
	 * 3.如果没有token则从新登录
	 */
	let token = this.$getStorageSync('token');
	console.log(token);
	if(token){
	   this.$api.getUser().then(res=>{
			 console.log(res)
		  if(res.code == 200){
			  let {data} = res;
			  this.$setStorageSync('userData',JSON.stringify(data));
			  self.$store.dispatch(SET_USERINFO,data);
				// calback()
		  }
	   })
		 
	}
}

/**
 * 用户登录
 */
Vue.prototype.$login = function(obj,isJump,isBack){
	let self = this;
	return new Promise((resolve,reject)=>{
		self.$api.decryptPhone(obj).then(res=>{
			console.log(res);
			let {msg,code,data} = res;
			if(code == 200){
				this.$setStorageSync('userData',JSON.stringify(data));  //用户信息
				this.$setStorageSync('token',data.openId);  //用户信息
				this.$setStorageSync('accountData',JSON.stringify(obj));  //用户登录信息
				self.$store.dispatch(SET_USERINFO,data);
				self.$store.dispatch(SET_TOKEN,data.openId);
				// self.SET_USERINFO(data);
				// self.SET_TOKEN(token);
				if(isJump){
					uni.reLaunch({url:"/pages/tabbar/home/index"});
				}
				if(isBack){
					uni.navigateBack({delta:1});
				}
				// resolve(res);
			}
			resolve(res);
		}).catch(err=>{
			reject(err);
		})
	})
}