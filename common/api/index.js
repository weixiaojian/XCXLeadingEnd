import http from './interface'
import Vue from 'vue';
const _this = this;
// const update_url = "http://192.168.3.215:7189"; //寄件,收件图片上传
// const update_url = "http://117.48.233.11:17779"; //寄件,收件图片上传
const update_url = "http://117.48.233.11:17779";
const recharge_url = "http://113.105.152.134:8601"; //费用充值
let isSaveOrderUrl = ''//是否为下单接口替换提示框
// http.config.baseUrl = "http://localhost:8080/api/"
//设置请求拦截器
http.interceptor.request = (config) => {
	isSaveOrderUrl = config.url;
	//是否添加token
	// console.log(config);
	// if(config.isToken){
	// console.log(Vue.prototype.$getStorageSync('token'))
	// if (Vue.prototype.$getStorageSync('token')) {
	// 	config.header['WxAuthorization'] = 'opJak5jxJL5M3I9k92jKdGLYDJ1k';
	// }
	config.header['WxAuthorization'] = Vue.prototype.$getStorageSync('token');

	//是否显示请求提示
	if (config.isShow) {
		uni.showLoading({
			title: "请求中...",
			mask: true
		})
	}
	/**
	 * 检测不到token或者token过期则跳转到登录页面
	 */
	// Vue.prototype.$checkLogin();
	// console.log(JSON.stringify(config));
}

//设置请求结束后拦截器
http.interceptor.response = (response) => {
	// console.log(response);
	if (response.errMsg == 'request:ok' || response.errMsg == 'uploadFile:ok') {
		let {
			message,
			code
		} = response.errMsg == 'request:ok' ? response.data : JSON.parse(response.data)
		if (code == 400) {
			if(isSaveOrderUrl.indexOf("saveOrder") == -1){
				setTimeout(() => {
					uni.showToast({
						icon: "none",
						title: message,
						duration: 2500
					});
				}, 0)
			}
		} else if (code == 401) {
			// 访问受限，授权过期
			// plus.runtime.restart();
			uni.reLaunch({
				url: "/pages/login/index.vue"
			});
			
			if (message !== '用户未登陆！') {
				uni.showToast({
					icon: "none",
					title: message,
					duration: 2500
				});
			}
			Vue.prototype.$removeStorageSync('token');
			Vue.prototype.$removeStorageSync('userData');
		} else if (code == 500) {
			if (message) {
				setTimeout(() => {
					uni.showToast({
						icon: "none",
						title: message,
						duration: 2500
					});
				}, 0)
			} else {
				uni.showToast({
					icon: "none",
					title: '网络不给力,请重新操作~',
					duration: 2500
				});
			}
		}
	} else {
		uni.showToast({
			icon: "none",
			title: "请求超时!",
			duration: 2500
		});
	}
	uni.hideLoading();
	setTimeout(() => {
		uni.hideToast();
	}, 3000);
	//判断返回状态 执行相应操作
	return response;
}
// export const downloadApp = (data) => {
//     return http.uploadFile('/index/download/1600337388159Radmin.exe')
// }
// export const login = (data)=>{
// 	return http.get('/users/test')
// }
// export const test = (data)=>{
// 	return http.request({
// 		// baseUrl:"",    //修改请求ip
// 		url:"/index/",
// 		method:"GET"
// 	})
// }
// export const testPic = (data)=>{
// 	console.log(data);
// 	return http.uploadFile({
// 		url:"/index/file",
// 		filePath:data.filePath
// 	})
// }

//获取缓存用户信息
export const getUser = (data) => {
	return http.request({
		url: "/user/getUser",
		method: "GET",
		isShow: false,
	})
}
//登出
export const logout = (data) => {
	return http.request({
		url: "/user/logOut",
		method: "GET"
	})
}
//获取用户信息
export const login = (data) => {
	return http.request({
		url: "/user/searchUser",
		method: "GET",
		data
	})
}
//获取用户信息code
export const getOpenIdByCode = (data) => {
	return http.request({
		url: "/user/getOpenIdByCode",
		method: "GET",
		data
	})
}
//获取用户手机号
export const decryptPhone = (data) => {
	return http.request({
		url: "/user/decryptPhone",
		method: "GET",
		data
	})
}
//根据旧密码修改新密码
export const editPassword = (data) => {
	return http.request({
		url: "/app/login/editPassword",
		method: "POST",
		data
	})
}
//根据验证码找回密码
export const findPassword = (data) => {
	return http.request({
		url: "/app/login/findPassword",
		method: "POST",
		data
	})
}
// 获取所有的省市区
export const getProvinceAll = () => {
	return http.request({
		url: "/index/getProvinceList",
		method: "GET",
		isShow: false,
	});
}
// 根据区code获取街道
export const getTown = (data) => {
	return http.request({
		url: "/index/getTown",
		method: "GET",
		isShow: false,
		data
	});
}
// 校验省-市-区是否合法，并返回对应的code
export const checkProvince = (data) => {
	return http.request({
		url: "/index/checkProvince",
		method: "GET",
		data
	});
}

//添加地址薄
export const addAddress = (data) => {
	return http.request({
		url: "/index/addAddress",
		method: "POST",
		data
	})
}
//修改地址薄
export const editAddress = (data) => {
	return http.request({
		url: "/index/editAddress",
		method: "POST",
		data
	})
}
//分页获取地址薄
export const getAddress = (data) => {
	return http.request({
		url: "/index/getAddress",
		method: "GET",
		data,
		isShow: true,
	})
}
//查询默认地址
export const getAddressDefault = (data) => {
	return http.request({
		url: "/index/qryAddressByDefault",
		method: "GET",
		data
	})
}
//修改用户默认地址
export const editDefault = (data) => {
	return http.request({
		url: "/index/editDefault",
		method: "GET",
		data
	})
}
//删除地址簿数据
export const delAddress = (data) => {
	return http.request({
		url: "/index/delAddress",
		method: "GET",
		data
	})
}
//统计我寄的和我收的总数
export const getMyOrderCount = (data) => {
	return http.request({
		url: "/order/getMyOrderCount",
		method: "GET",
		data
	})
}
//下单寄件保存
export const saveBill = (data) => {
	return http.request({
		url: "/order/saveOrder",
		method: "POST",
		isShow: true,
		data
	})
}
//取消订单
export const cancelOrder = (data) => {
	return http.request({
		url: "/order/cancelOrder",
		method: "POST",
		isShow: true,
		data
	})
}
//计算运费/到付款
export const trackFreight = (data) => {
	return http.request({
		url: "/order/trackFreight",
		method: "POST",
		isShow: false,
		data
	})
}
//编辑下单寄件保存
export const editBill = (data) => {
	return http.request({
		url: "/order/updateOrder",
		method: "POST",
		data
	})
}
//根据订单号查询订单详情
export const getOrderData = (data) => {
	return http.request({
		url: "/order/getOrderByOrderBill",
		method: "GET",
		data
	})
}
//校验运单号是否被使用
export const checkBillCode = (data) => {
	return http.request({
		url: "/order/checkBillCode",
		method: "GET",
		data
	})
}
//实名认证
export const addAuth = (data) => {
	return http.request({
		url: "/user/addRealId",
		method: "POST",
		data
	})
}
//获取实名认证
export const getRealId = (data) => {
	return http.request({
		url: "/user/getRealId",
		method: "GET",
		data
	})
}
//修改实名认证
export const editRealId = (data) => {
	return http.request({
		url: "/user/editRealId",
		method: "POST",
		data
	})
}
//删除实名认证
export const delRealId = (data) => {
	return http.request({
		url: "/user/delRealId",
		method: "POST",
		data
	})
}
//分页订单查询
export const getMyOrders = (data) => {
	return http.request({
		url: "/order/getMyOrder",
		method: "GET",
		data
	})
}

//订单轨迹查询
export const getMapPath = (data) => {
	return http.request({
		url: "/order/getScanBillCode",
		method: "GET",
		data
	})
}
//订单轨迹查询
export const getTrajectory = (data) => {
	return http.request({
		url: "/order/getTrajectory",
		method: "GET",
		data
	})
}

//-消息通知-修改消息通知
export const subscribeMsg = (data) => {
	return http.request({
		url: "/index/subscribeMsg",
		method: "GET",
		data
	})
}
//获取用户消息设置信息
export const getMessagesSet = (data) => {
	return http.request({
		url: "/user/getMessagesSet",
		method: "GET",
		data
	})
}
//-保存/更新消息设置信息
export const saveMsgSet = (data) => {
	return http.request({
		url: "/user/saveMsgSet",
		method: "POST",
		data
	})
}
//专属业务员-解绑专属快递员
export const unbindEmp = (data) => {
	return http.request({
		url: "/user/unbindEmp",
		method: "GET",
		data
	})
}
//扫码绑定专属快递员
export const scanbindEmp = (data) => {
	return http.request({
		url: "/user/scanBinDingEmp",
		method: "GET",
		data
	})
}
//模糊查询员工数据
export const getEmpBylike = (data) => {
	return http.request({
		url: "/user/getEmpBylike",
		method: "POST",
		data
	})
}
//绑定专属
export const binDingEmp = (data) => {
	return http.request({
		url: "/user/binDingEmp",
		method: "POST",
		data
	})
}
//我的-账单查询
export const queryMonthlyAccount = (data) => {
	return http.request({
		url: "/wx/monthlyAccount/queryMonthlyAccount",
		method: "GET",
		data
	})
}

//首页-网点查询
export const searchSite = (data) => {
	return http.request({
		url: "/index/getSiteByAddress",
		method: "GET",
		data
	})
}
//
//首页-我的-绑定手机号
export const savePhone = (data) => {
	return http.request({
		url: "/wx/home/savePhone",
		method: "GET",
		data
	})
}
//获取下单常量字典配置
export const getOrderConstant = () => {
	return http.request({
		url: "/order/getOrderConstant",
		method: "GET",
	})
}
//地址解析接口
export const addressAnalysis = (data) => {
	return http.request({
		url: "/index/addressAnalysis",
		method: "GET",
		data
	})
}

//运单列表
export const getMyWyBill = (data) => {
	return http.request({
		url: "/order/getMyWaybill",
		method: "GET",
		data
	})
}

// 批量下单
export const saveOrderList = (data) => {
	return http.request({
		url: "/order/saveOrderList",
		method: "POST",
		data
	})
}

// 批量地址智能解析
export const getAddressAnalyList = (data) => {
	return http.request({
		url: "/index/addressAnalysisList",
		method: "GET",
		data
	})
}
// 获取打印数据
export const getOrderPrint = (data) => {
	return http.request({
		url: "/order/getOrderPrint",
		method: "GET",
		data
	})
}
// 更改订单的打印状态
export const updateBlPrint = (data) => {
	return http.request({
		url: "/order/updateBlPrint",
		method: "GET",
		data
	})
}
// 创建团队
export const createWxGroup = (data) => {
	return http.request({
		url: "/index/createWxGroup",
		method: "POST",
		data
	})
}
// 根据团队ID获取团队成员列表
export const getWxGroupList = (data) => {
	return http.request({
		url: "/index/getWxGroupList",
		method: "GET",
		data
	})
}
// 根据团队ID获取团队成员列表
export const getWxGroupByIdOrName = (data) => {
	return http.request({
		url: "/index/getWxGroupByIdOrName",
		method: "GET",
		data,
		isShow:true
	})
}
// 加入团队
export const addWxGroup = (data) => {
	return http.request({
		url: "/index/addWxGroup",
		method: "POST",
		data,
		isShow:true
	})
}
// 审核团队成员
export const auditWxGroup = (data) => {
	return http.request({
		url: "/index/auditWxGroup",
		method: "GET",
		data
	})
}
// 修改自己或团队成员的昵称
export const updateNickName = (data) => {
	return http.request({
		url: "/index/updateNickName",
		method: "GET",
		data
	})
}
// 修改团队成员的权限状态
export const updateSatus = (data) => {
	return http.request({
		url: "/index/updateSatus",
		method: "GET",
		data
	})
}
// 解散团队
export const emptyWxGroup = (data) => {
	return http.request({
		url: "/index/emptyWxGroup",
		method: "GET",
		data
	})
}
// 修改团队名称
export const editGroupName = (data) => {
	return http.request({
		url: "/index/editGroupName",
		method: "GET",
		data
	})
}
// 更改共享电子面单开关
export const editGroupBlShare = (data) => {
	return http.request({
		url: "/index/editGroupBlShare",
		method: "GET",
		data
	})
}
// 移除团队成员/退出团队
export const deleteWxGroup = (data) => {
	return http.request({
		url: "/index/deleteWxGroup",
		method: "GET",
		data,
		isShow:true
	})
}
//更新用户的头像 昵称
export const updateUser = (data) => {
	return http.request({
		url: "/user/updateUser",
		method: "GET",
		data
	})
}
//获取个人团队
export const getWxGroupByOpenId = (data) => {
	return http.request({
		url: "/index/getWxGroupByOpenId",
		method: "GET",
		data
	})
}
//生成二维码
export const generateGroupQrCode = (data) => {
	return http.request({
		url: "/index/generateGroupQrCode",
		method: "GET",
		data
	})
}
//查询当前待审核的总数
export const getAuditCount = (data) => {
	return http.request({
		url: "/index/getAuditCount",
		method: "GET",
		data
	})
}
//查询当前待审核的总数
export const getWxGroupByName = (data) => {
	return http.request({
		url: "/index/getWxGroupByName",
		method: "GET",
		data
	})
}
//查询当前待审核的总数
export const copyOrder = (data) => {
	return http.request({
		url: "/order/copyOrder",
		method: "GET",
		data
	})
}
//查询当前待审核的总数
export const turnDownWxGroup = (data) => {
	return http.request({
		url: "/index/turnDownWxGroup",
		method: "GET",
		data
	})
}
//图片解析文字
export const imgAnalysis = (data) => {
	return http.request({
		url: "/index/imgAnalysis",
		method: "POST",
		data,
		isShow:true
	})
}
// 更改是否需要入团审批开关 1不需要
export const editGroupBlAudit = (data) => {
 return http.request({
  url: "/index/editGroupBlAudit",
  method: "GET",
  data
 })
}
//  绑定月结账户
export const bindCustomer = (data) => {
 return http.request({
  url: "/user/bindCustomer",
  method: "POST",
  data
 })
}
//  解绑月结账户
export const unBindCustomer = (data) => {
 return http.request({
  url: "/user/unBindCustomer",
  method: "GET",
  data
 })
}
//添加备注
export const addWxRemark = (data) => {
 return http.request({
  url: "/order/addWxRemark",
  method: "GET",
  data
 })
}
//添加备注
export const getWxRemarks = (data) => {
 return http.request({
  url: "/order/getWxRemarks",
  method: "GET",
  data
 })
}
// 删除快捷备注
export const deleteRemarks = (data) => {
	return http.request({
		url: "/order/delWxRemark",
		method: "GET",
		data
	})
}
// 投诉建议
export const addWxAdvices = (data) => {
	return http.request({
		url: '/user/addWxAdvice',
		method: "POST",
		data
	})
}
// 默认全部导出
export default {
	login,
	logout,
	getUser,
	editPassword,
	findPassword,
	getProvinceAll,
	getTown,
	addAddress,
	editAddress,
	getAddress,
	getAddressDefault,
	editDefault,
	delAddress,
	saveBill,
	editBill,
	cancelOrder,
	getOrderData,
	checkBillCode,
	unbindEmp,
	scanbindEmp,
	addAuth,
	getRealId,
	delRealId,
	editRealId,
	getMyOrders,
	getMapPath,
	searchSite,
	checkProvince,
	getMyOrderCount,
	getEmpBylike,
	binDingEmp,
	getOpenIdByCode,
	decryptPhone,
	getOrderConstant,
	trackFreight,
	subscribeMsg,
	saveMsgSet,
	getMessagesSet,
	addressAnalysis,
	getMyWyBill,
	saveOrderList,
	getAddressAnalyList,
	getOrderPrint,
	updateBlPrint,
	getTrajectory,
	createWxGroup,
	getWxGroupList,
	getWxGroupByIdOrName,
	addWxGroup,
	updateNickName,
	updateSatus,
	emptyWxGroup,
	deleteWxGroup,
	updateUser,
	getWxGroupByOpenId,
	auditWxGroup,
	editGroupName,
	editGroupBlShare,
	generateGroupQrCode,
	getAuditCount,
	copyOrder,
	turnDownWxGroup,
	getWxGroupByName,
	imgAnalysis,
	editGroupBlAudit,
	bindCustomer,
	unBindCustomer,
	addWxRemark,
	getWxRemarks,
	deleteRemarks,
	addWxAdvices
}
