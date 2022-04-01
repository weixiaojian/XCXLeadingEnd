import Vue from 'vue';
import {
	CHANGE_IPHONE_DATA
} from '@/store/actionsType.js';

/*
 * 获取手机设备信息
 *  uuid:"",
	version:"",
	statusHeight:0,  //状态拦高度
	platform:"",   //客户端类型  如: android , ios , 小程序(devtools运行在开发工具上 , not devtools运行在手机中)
	screenWidth:0,  //手机宽度
	screenHeight:0,   // 手机高度
	windowWidth:0,  //可使用窗口宽度
	windowHeight:0,  //可使用窗口高度
 */
Vue.prototype.$getPhoneDevices = function() {
	let _this = this;
	let obj = new Object();
	// #ifdef APP-PLUS
	obj.uuid = plus.device.uuid; //获取app唯一id
	obj.version = plus.runtime.version; //应用版本号
	obj.APPVersion = (plus.runtime.version).split('.').join(''); //应用版本号
	obj.appid = plus.runtime.appid;
	// #endif
	//状态栏高度,应用平台,屏幕宽度,屏幕高度
	uni.getSystemInfo({
		success: function(res) {
			obj.statusHeight = res.statusBarHeight;
			obj.platform = res.platform; //android / ios
			obj.screenWidth = res.screenWidth;
			obj.screenHeight = res.screenHeight;
			obj.windowWidth = res.windowWidth;
			obj.windowHeight = res.windowHeight;
			obj.brand = res.brand; //根据厂商判断广播
			obj.model = res.model;
			obj.system = res.system; //手机安卓版本号
			// obj.version = res.version;  //手机系统版本
			obj.statusBarHeight = res.statusBarHeight; //状态栏高度
			// #ifdef MP-WEIXIN
			// obj.version = res.version.split('.').join(''); //小程序引擎版本号
			// obj.version = res.version; //小程序引擎版本号
			// #endif
			// console.log(obj)
			// 存入vuex
			_this.$store.dispatch(CHANGE_IPHONE_DATA, obj);
		},
		fail: function(err) {
			console.log('获取设备信息失败!')
		}
	})

}

/*
 * 获取定位位置
 */
Vue.prototype.$getLocation = function() {
	return new Promise((resolve, reject) => {
		let _this = this;
		let platform = this.$store.state.Equipment.iPhone.platform || ''; //获取平台类型
		let obj = new Object();
		uni.getLocation({
			type: 'gcj02', //默认wgs84, 高德sdk 仅指出 gcj02
			geocode: true,
			success: function(res) {
				console.log(res);
				let {
					address,
					longitude,
					latitude
				} = res;
				obj.province = address.province || '';
				// obj.city = (address.city !== address.province) && (address.city != undefined) ? address.city : '';
				obj.city = address.city || '';
				obj.district = address.district || '';
				obj.street = address.street || ''; //街道信息
				obj.streetNum = address.streetNum || ''; //获取街道门牌号信息
				obj.latitude = latitude;
				obj.longitude = longitude;
				obj.formatted_address = obj.province + obj.city + obj.district + obj.street +
					obj.streetNum; //完整地址信息
				resolve(true);
			},
			fail: function(err) {
				console.log('地址错误:' + JSON.stringify(err));
				reject(false);
			}
		})
	});
}


/**
 * 获取网络类型
 */
Vue.prototype.$getNetworkType = function(success) {
	let _this = this;
	uni.getNetworkType({
		success: function(res) {
			let obj = {};
			let {
				networkType
			} = res;
			if (networkType != 'unknown' && networkType != 'none') {
				obj.state = true;
			} else {
				obj.state = false;
			}
			obj.data = res;
			success && success(obj);
		}
	});
}
/**
 * 手机网络监听
 */
Vue.prototype.$watchNetworkStatusChange = function() {
	let _this = this;
	uni.onNetworkStatusChange(function(res) {
		console.log(res.isConnected); //是否有网络连接
		console.log(res.networkType); //网络连接类型
		if (!res.isConnected) {
			if (res.networkType == 'none' || res.networkType == 'unknown') {
				// uni.showToast({
				// 	title: "网络不给力",
				// 	icon: "none",
				// 	mask: true,
				// 	duration: 2000
				// })
				// _this.$store.dispatch(CHANGE_CHECKWORK_TYPE, res.networkType);
			}
		} else {
			if (res.networkType == "3g" || res.networkType == "2g") {
				// uni.showToast({
				// 	title: "网络不稳定",
				// 	icon: "none",
				// 	mask: true,
				// 	duration: 3000
				// })
				// _this.$store.dispatch(CHANGE_CHECKWORK_TYPE, res.networkType);
			}
		}
	});
}
/**
 * 登录页面跳转
 */
Vue.prototype.$checkLogin = function() {
	uni.navigateTo({
		url: '/pages/login/index'
	})
}


//获取元素节点
Vue.prototype.$getElementNode = function(node, storeName, _this) {
	return new Promise((resolve, reject) => {
		const query = uni.createSelectorQuery().in(_this);
		query.select(node).boundingClientRect(data => {
			// console.log("得到布局位置信息" + JSON.stringify(data));
			// console.log("节点离页面顶部的距离为" + data.height);
			// console.log(storeName);
			if (data) {
				resolve(data);
			}
			// if(!data) {
			//  // console.log("节点离页面顶部的距离为" + data.height);
			//  // _this.$store.dispatch(storeName,0);
			// }else{
			//  // console.log("节点离页面顶部的距离为" + data.height);
			//  // _this.$store.dispatch(storeName,data.height);
			// }
		}).exec();
	})

}

//throttle节流
let timer = null;
Vue.prototype.$throttle = (fn, delay = 500) => {
	clearTimeout(timer);
	timer = setTimeout(function() {
		fn();
	}, delay)
};



/**
 * @内容模糊查询
 * @array  查询的集合
 * @keyWord 查询的关键字
 * @attribute 匹配的属性值
 */
Vue.prototype.$fuzzyQuery = (array, keyWord, attribute) => {
	var arr = [],
		list;
	for (var i = 0; i < array.length; i++) {
		array[i]['mynum'] = '0';
		for (var j = 0; j < attribute.length; j++) {
			list = array[i][attribute[j]];
			if (list.indexOf(keyWord) >= 0 && array[i]['mynum'] != '1') {
				array[i].mynum = '1';
				console.log(array[i]);
				arr.push(array[i]);
			}
		}
	}
	return arr;
}

//获取省市区
Vue.prototype.$getProvinceAll = function() {
	let _this = this;
	return new Promise((resolve, reject) => {
		Vue.prototype.$api.getProvinceAll().then(res => {
			console.log(res);
			if (res.code == 200) {
				Vue.prototype.$setStorageSync('province', JSON.stringify(res.data));
				resolve(res);
			}
		}).catch(err => {
			console.log(err)
			reject([]);
		})
	})
}
/*
获取微信相关功能授权
p:scope.record、scope.userLocation、scope.address ....
*/
Vue.prototype.$getAuth = function (p) {
  return new Promise(function(resolve, reject) {
    uni.getSetting({
      success(res) {
       // console.log(res);
        if (res.authSetting[p]){
         resolve(true);
        }else{
          if(res.authSetting[p] == undefined){
            uni.authorize({
              scope: p,
              success (res) {
                // console.log(res);
                resolve(true);
              }
            })
          }else{
            resolve(false);
          }
        }
      }
    });
  });
}

//验证手机号是否实名
Vue.prototype.$getByPhone = function(data) {
	console.log(data);
	let _this = this;
	return new Promise((resolve, reject) => {
		this.$api.getRealId(data).then(res => {
			console.log(res);
			if (res.code == 200) {
				if (res.data != null) {
					// self.realName = true;
					resolve(true);
				} else {
					// self.realName = false;
					resolve(false);
				}
			}
		})
	})
}

//图片选择
Vue.prototype.$chooseImage = function(count, sizeType, sourceType) {
	count = count || 1;
	sizeType = sizeType || ['original'];
	sourceType = sourceType || ['album', 'camera'];
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count, //默认9
			sizeType, //可以指定是原图还是压缩图，默认二者都有
			sourceType, //从相册选择
			success: function(res) {
				var tempFilePaths = res.tempFilePaths;
				uni.saveFile({
					tempFilePath: tempFilePaths[0],
					success: function(data) {
						console.log(data);
						var savedFilePath = data.savedFilePath;
						res.tempFilePaths[0] = savedFilePath;
						resolve(res);
					},
					fail: function(err) {
						uni.showToast({
							icon: "none",
							title: "图片选择错误"
						});
						reject(err);
					}
				});

				console.log(res);
				// let {path,size} = res.tempFiles[0];
			},
			fail: function(err) {
				// uni.showToast({icon:"none",title:"图片选择错误"});
				reject(err);
			}
		})
	})
}


//订单复制
Vue.prototype.$copyOrderNumber = function(order_number) {
	uni.setClipboardData({
		data: order_number,
		success(res) {
			uni.showToast({
				icon: "none",
				title: order_number + "复制成功"
			})
		},
		fail() {
			uni.showToast({
				icon: "none",
				title: order_number + "复制失败"
			})
		}
	})
}

// 数据同步缓存获取
Vue.prototype.$getStorageSync = function(key) {
	try {
		const value = uni.getStorageSync(key);
		if (value) {
			return value
		}
	} catch (e) {
		// error
	}
}
// 数据同步缓存设置
Vue.prototype.$setStorageSync = function(key, value) {
	try {
		uni.setStorageSync(key, value);
	} catch (e) {
		// error
	}
}
// 数据同步缓存清除指定key
Vue.prototype.$removeStorageSync = function(key) {
	try {
		uni.removeStorageSync(key);
	} catch (e) {
		// error
	}
}
// 数据同步缓存清除
Vue.prototype.$clearStorageSync = function() {
	try {
		uni.clearStorageSync();
	} catch (e) {
		// error
	}
}
//判断蓝牙是否连接
Vue.prototype.$isConnectBle = function() {
	return new Promise((resolve, reject) => {
		if (plus.os.name === "iOS") {
			if (
				this.ble.isConnectPrint &&
				this.ble.connectedDeviceId &&
				this.ble.connectedName
			) {
				resolve(true);
			} else {
				resolve(false);
			}
		} else {
			if (this.ble.setbleConnStatus) {
				resolve(true);
			} else {
				resolve(false);
			}
		}
	})
}
// 后台请求路径前台保存文件
Vue.prototype.$saveFile = function(url) {
	// #ifdef H5
	const a = document.createElement('a'); // 创建a标签
	a.setAttribute('download', ''); // download属性
	a.setAttribute('href', url); // href链接
	a.click();
	console.log(a)
	// #endif
	// #ifdef MP-WEIXIN
	uni.saveFile({
		tempFilePath: url,
		success: function(res) {
			var savedFilePath = res.savedFilePath;
		}
	});
	// #endif
}

Vue.prototype.$mapMatching = function(addressDataSJ) {
	let self = this;
	return new Promise((resolve, reject) => {
		if (JSON.stringify(addressDataSJ) == '{}') {
			uni.showToast({
				icon: "none",
				title: "请选择收件地址",
				duration: 1500
			});
			reject();
			return;
		}
		let address = (addressDataSJ.custProvince || '') + (addressDataSJ.custCity || '') + (addressDataSJ
			.custCounty || '') + (addressDataSJ.custAddress || '');
		let obj = {
			address
		};
		self.$api.mapMatching(obj).then(res => {
			console.log(res);
			if (res.code == 200) {
				let {
					data
				} = res;
				let {
					destinationName,
					destinationCode
				} = data;
				if (data) {
					if (destinationName == '' || destinationCode == '') {
						uni.showToast({
							icon: "none",
							title: "未匹配到",
							duration: 1500
						});
						reject();
					} else {
						resolve(data);
					}
				}
			} else {
				reject();
			}
		})
	})
}

Vue.prototype.$toast = (msg, icon, time, position) => {
	uni.showToast({
		title: msg,
		icon: icon ? icon : 'none',
		duration: time ? time : 1500,
		position: position ? position : 'bottom', // top center bottom,
	});
	setTimeout(() => {
		uni.hideLoading()
	}, 3000);
}
