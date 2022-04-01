<template>
	<view class="setting">
		<view class="myView">
			<TabLists>
				<view class="header">
					<view class="portrait">
						<button @click="getUserInfo" v-if="JSON.stringify(nameImg)=='{}'?true:false" class="getUer">
							<view class="user_icon">
								<image :src="nameImg.avatarUrl" mode="" v-if="nameImg.avatarUrl"></image>
							</view>
						</button>
						<view class="getUer" v-else>
							<view class="user_icon">
								<image :src="nameImg.avatarUrl" mode="" v-if="nameImg.avatarUrl || nameImg.avatarUrl.length>0"></image>
							</view>
						</view>
					</view>
					<view class="userInfo">
						<view class="islogin" v-if="userData">
							<view class="name">
								{{nameImg.name||'点击头像获取'}}
							</view>
							<view class="phone">
								{{userData.phone||'绑定手机号'}}
							</view>
						</view>
						<button class="nologin" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" v-else>登录/授权
						</button>
					</view>
					<view class="set" v-if="userData" @click="logout">
						退出登录
					</view>
					<view class="" v-if="teamModel=='1'">
						<view class="teamInfo" v-if="teamInfo.status==2||teamInfo.status==3">
							客户编码: {{teamInfo.customerCode}}
						</view>
						<view class="teamInfo" v-if="teamInfo.status==1">
							网点编码: {{teamInfo.siteCode}}
						</view>
					</view>
					<view class="" v-else>
						<view class="teamInfo" v-if="userData.customerCode">
							客户编码: {{userData.customerCode}}
						</view>
					</view>
				</view>
			</TabLists>
			<!-- 列表 -->
			<view class="panelList">
				<view class="panel-wraper">
					<view class="panel-title">
						我的服务
					</view>
					<view class="panel-cont">
						<view class="item" v-for="(item,index) in panelListsData" :key="index"
							@click="selectItem(item)">
							<i class="iconfont hicon" v-html="item.icon"></i>
							<view class="text">
								{{item.name}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 背景 -->
		<view class="bgpage">
			<!-- <image src="/static/img/mybg.png" mode=""></image> -->
		</view>
		<!-- tab -->
		<!-- <InfoTab></InfoTab> -->
	</view>
</template>

<script>
	// import InfoHeader from "@/component/info-header.vue";
	import {
		SET_CLEAR_STATE
	} from "@/store/actionsType.js";
	import {
		mapActions
	} from 'vuex';
	let self;

	export default {
		data() {
			return {
				panelListsData: [{
						name: "地址簿",
						icon: "&#xe65a;",
						path: "/pages/myaddress/index",
						id: "dzb",
					},
					{
						name: "专属快递员",
						icon: "&#xe640;",
						path: "/pages/mycourier/index",
						id: "zskdy",
					},
					{
						name: "实名认证",
						icon: "&#xe642;",
						path: "/pages/myrealname/index",
						id: "smrz",
					},
					{
						name: "月结账户",
						icon: "&#xe64c;",
						path: "/pages/bind-monthly/index",
						id: "yjzh",
					},
					// {
					// 	name: "运费查询",
					// 	icon: "&#xe617;",
					// 	path: "/pages/freight-query/index",
					// 	id: "dzb",
					// },
					{
						name: "客服电话",
						icon: "&#xe618;",
						path: "",
						id: "kfdh",
					},
					{
						name: "公司简介",
						icon: "&#xe65c;",
						path: "/pages/aboutUs/index",
						id: "gsjj",
					},
					{
						name: "消息设置",
						icon: "&#xe65b;",
						path: "/pages/message-notify/index",
						id: "xxtzsz",
					}
				],
				userData: false,
				nameImg: {},
				sendRec: {},
				teamInfo:{},
				teamModel:''
			};
		},
		onShow() {
			// !global.offline && this.getMyMoney();
			let self = this;
			let token = self.$getStorageSync('token')
			if (!token) {
				self.getToken()
			}
			let teamInfo = self.$getStorageSync('teamInfo')
			if(teamInfo){
				self.teamInfo = teamInfo;
			}
			self.getUserInfoEcho()
			let teamModel = self.$getStorageSync('teamModel')
			self.teamModel = teamModel
			let oldPanelLists = self.panelListsData;
			if(teamModel=='1'){
				self.panelListsData = [{
						name: "地址簿",
						icon: "&#xe65a;",
						path: "/pages/myaddress/index",
						id: "dzb",
					},
					{
						name: "实名认证",
						icon: "&#xe642;",
						path: "/pages/myrealname/index",
						id: "smrz",
					},
					{
						name: "客服电话",
						icon: "&#xe618;",
						path: "",
						id: "kfdh",
					},
					{
						name: "公司简介",
						icon: "&#xe65c;",
						path: "/pages/aboutUs/index",
						id: "gsjj",
					},
					{
						name: "消息设置",
						icon: "&#xe65b;",
						path: "/pages/message-notify/index",
						id: "xxtzsz",
					}]
			}else{
				console.log(self.panelListsData);
				self.panelListsData = [{
						name: "地址簿",
						icon: "&#xe65a;",
						path: "/pages/myaddress/index",
						id: "dzb",
					},
					{
						name: "专属快递员",
						icon: "&#xe640;",
						path: "/pages/mycourier/index",
						id: "zskdy",
					},
					{
						name: "实名认证",
						icon: "&#xe642;",
						path: "/pages/myrealname/index",
						id: "smrz",
					},
					{
						name: "月结账户",
						icon: "&#xe64c;",
						path: "/pages/bind-monthly/index",
						id: "yjzh",
					},
					// {
					// 	name: "运费查询",
					// 	icon: "&#xe617;",
					// 	path: "/pages/freight-query/index",
					// 	id: "dzb",
					// },
					{
						name: "客服电话",
						icon: "&#xe618;",
						path: "",
						id: "kfdh",
					},
					{
						name: "公司简介",
						icon: "&#xe65c;",
						path: "/pages/aboutUs/index",
						id: "gsjj",
					},
					{
						name: "消息设置",
						icon: "&#xe65b;",
						path: "/pages/message-notify/index",
						id: "xxtzsz",
					}
				]
			}
		},

		computed: {
			// userData(){
			// 	let self = this;
			// 	let userData = self.$getStorageSync('userData');
			// 	let _data; 
			// 	if(userData){
			// 		_data = JSON.parse(userData)
			// 	}else{
			// 		_data = false
			// 	}
			// 	return _data
			// }
		},
		onLoad() {
			self = this;
			// self.getUserInfoEcho()
			
		},
		methods: {
			...mapActions([SET_CLEAR_STATE]),
			//列表选择
			selectItem(item) {
				if (item.id == 'kfdh') {
					uni.makePhoneCall({
						phoneNumber: '021-39209005'
					})
				} else {
					let data = {
						tabIndex: 0
					}
					let userData = self.$getStorageSync('userData');
					if (userData) {
						uni.navigateTo({
							url: item.path + '?pageId=' + item.id + '&data=' + JSON.stringify(data)
						})
					} else {
						uni.showToast({
							title: "请先进行登录操作~",
							icon: "none",
							duration: 1500
						})
					}
				}
			},
			goSearch(type) {
				let self = this;
				getApp().globalData.tabIndex = type
				uni.switchTab({
					url: '/pages/tabbar/inquire/index'
				})
			},
			getToken() {
				let self = this;
				uni.login({
					provider: 'weixin',
					success: function(userRes) {
						// 发送 res.code 到后台换取 openId, sessionKey, unionId
						let _data = {
							code: userRes.code
						}
						self.$api.getOpenIdByCode(_data).then(res => {
							console.log(res)
							if (res.code == 200) {
								self.$setStorageSync('token', res.data.openid); //用户token
								self.$setStorageSync('login', res.data); //用户token
							} else {
								uni.showToast({
									title: "请退出页面重进~",
									icon: "none",
									duration: 1500
								})
							}
						})
					}
				})
			},
			getUserInfoEcho() {
				let self = this;
				this.$checkToken()
				let userData = self.$getStorageSync('userData');
				let nameImg = this.$getStorageSync('userNameImg');
				if (userData) {
					self.userData = JSON.parse(userData);
					// self.getMyOrderCount(self.userData.phone)
				}
				if (nameImg) {
					self.nameImg = JSON.parse(nameImg)
				}
			},
			getUserInfo() {
				let self = this;
				let token = self.$getStorageSync('token');
				if (!token) {
					self.getToken()
				}else{
					uni.getUserProfile({
						desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
						success: (res) => {
							let _data = {}
							_data.name = res.userInfo.nickName;
							_data.avatarUrl = res.userInfo.avatarUrl;
							self.nameImg = _data;
							let updateData = {
								openId:token,
								headImgUrl:res.userInfo.avatarUrl,
								nickName:res.userInfo.nickName
							}
							console.log(updateData)
							self.$api.updateUser(updateData).then(res =>{
								console.log(res)
								if(res.code ==200&&res.data!=null){
									this.$setStorageSync('userData',JSON.stringify(res.data));  //用户信息
								}
							})
							self.$setStorageSync('userNameImg', JSON.stringify(_data));
						}
					})
				}
			
			},
			// getMyOrderCount(phone) {
			// 	let self = this;
			// 	let _data = {
			// 		phone: phone
			// 	}
			// 	self.$api.getMyOrderCount(_data).then(res => {
			// 		console.log(res)
			// 		if (res.code == 200) {
			// 			self.sendRec = res.data
			// 		}
			// 	})
			// },
			logout() {
				let self = this;
				uni.showModal({
					title: "提示",
					content: "确定退出登录吗?",
					success(res) {
						if (res.confirm) {
							self.$api.logout().then(res => {
								if (res.code == 200) {
									self.SET_CLEAR_STATE();
									// plus.storage.clear();
									self.$removeStorageSync('token');
									self.$removeStorageSync('login');
									self.$removeStorageSync('userData');
									self.$removeStorageSync('province');
									self.$removeStorageSync('accountData');
									self.$removeStorageSync('userNameImg');
									self.userData = false
									self.nameImg = {}
									self.teamInfo = {}
									uni.showToast({
										icon: "success",
										title: res.message
									});
									self.getToken()
								}
							});
						}
					}
				})
				// self.logout().then(res =>{
				// 	 if(res.code ==200){
				// 		 // self.userData =={}
				// 		 // self.$removeStorageSync('')
				// 		 // this.$setStorageSync('token','');   //用户token
				// 		 // this.$setStorageSync('userData',{});  //用户信息
				// 		 // this.$setStorageSync('accountData',{});  //用户登录信息
				// 		 // self.$store.dispatch(SET_USERINFO,{});
				// 		 // self.$store.dispatch(SET_TOKEN,'');
				// 	 }

				// })
			},
			//手机号绑定
			savePhone(tel) {
				let self = this;
				if (tel) {
					if (!self.$Reg.RegPhone(tel)) {
						uni.showToast({
							icon: "none",
							title: "请填写正确手机号"
						});
						return;
					};
					self.setPhoneBind(tel)
				} else {

				}
			},
			setPhoneBind(tel) {
				let self = this;
				let _data = {
					phone: tel
				}
				self.$api.savePhone(_data).then(res => {
					console.log(res)
					if (res.code == 200) {
						uni.showToast({
							title: "手机号绑定成功~",
							icon: "none",
						})
					}
				})
			},
			getWxGroupByOpenId(){
				let self = this;
				self.$api.getWxGroupByOpenId().then(res =>{
					console.log('res',res)
					if(res.code ==200){
						if(res.data!=null){
							self.$setStorageSync('teamInfo',res.data);
							self.teamInfo = res.data;
						}else{
							self.$setStorageSync('teamInfo','');
							self.$setStorageSync('teamModel','2');
							self.teamInfo = {};
						}
					}
				})
			},
			getPhoneNumber(e) {
				console.log(e)
				let self = this;
				let login = self.$getStorageSync('login')
				console.log(login)
				//微信，用户登陆
				uni.checkSession({
					success() {
						//session_key 未过期，并且在本生命周期一直有效
						let _data = {
							openId: login.openid,
							unionId: login.unionid || '',
							sessionKey: login.session_key,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						}
						self.$login(_data, false, false).then(res => {
							console.log(res)
							if (res.code == 200) {
								let userData = self.$getStorageSync('userData');
								console.log(userData)
								if (userData) {
									self.userData = JSON.parse(userData)
									console.log(userData)
									// self.getMyOrderCount(self.userData.phone)
									self.$getProvinceAll();
									self.getWxGroupByOpenId()
								}
							} else {
								uni.showToast({
									title: "授权失败,请重试~",
									icon: "none",
									duration: 1500
								})
							}
						})
					},
					fail() {
						// session_key 已经失效，需要重新执行登录流程
						// uni.login()//重新登录
						uni.login({
							provider: 'weixin',
							success: function(userRes) {
								// 发送 res.code 到后台换取 openId, sessionKey, unionId
								let _data = {
									code: userRes.code
								}
								self.$api.getOpenIdByCode(_data).then(res => {
									console.log(res)
									if (res.code == 200) {
										self.$setStorageSync('token', res.data
										.openid); //用户token
										self.$setStorageSync('login', res.data); //用户token
									} else {
										uni.showToast({
											title: "请重新授权~",
											icon: "none",
											duration: 1500
										})
									}
								})
							}
						})
					}
				})
				// #ifdef MP-WEIXIN
				console.log('微信小程序')
				// #endif
			},
			hanldList(item) {
				if (global.offline) {
					uni.showToast({
						icon: "none",
						title: "离线操作,无法进入",
						duration: 1000
					});
					return;
				}
				if (item.path) {
					uni.navigateTo({
						url: item.path + '?pageId=' + item.id
					})

				}
			},
			// 退出登录
			// logout(){
			// 	if(global.offline){
			// 		// 离线退出
			// 		uni.reLaunch({url:"/pages/login/index"});
			// 	}else{
			// 		uni.showModal({
			// 			title:"提示",
			// 		    content:"确定退出登录吗?",
			// 			success(res) {
			// 				if (res.confirm) {
			// 				   self.$api.logout().then(res=>{
			// 						if(res.code == 200){
			// 							self.SET_CLEAR_STATE();
			// 							// plus.storage.clear();
			// 							plus.storage.removeItem('token');
			// 							plus.storage.removeItem('userData');
			// 							plus.storage.removeItem('bycode');
			// 							plus.storage.removeItem('keeptype');
			// 							plus.storage.removeItem('site');
			// 							plus.storage.removeItem('province');
			// 							plus.storage.removeItem('destination');
			// 							plus.storage.removeItem('customer');
			// 							plus.storage.removeItem('problemtype');
			// 							plus.storage.removeItem('feetype');
			// 							plus.storage.removeItem('canceltype');
			// 							uni.showToast({icon:"success",title:res.msg});
			// 							uni.reLaunch({url:"/pages/login/index"});
			// 						}
			// 				   });
			// 				}
			// 			}
			// 		})
			// 	}
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.setting {
		height: 100%;
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		position: relative;
		background: $ztd-color-bgcolor;
		
		.myView {
			height: 100%;
			width: 100%;
			overflow: hidden;
			box-sizing: border-box;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
			padding-top: 40rpx;
		}
		
		.header {
			position: relative;
			width: 100%;
			height: 180rpx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0 40rpx;
			flex-wrap: wrap;
			.portrait {
				width: 90rpx;
				height: 90rpx;
				margin-right: 20rpx;
				border-radius: 50%;
				overflow: hidden;
				// background-color:$ztd-color-block;
				border: 2rpx solid $ztd-color-block;

				.getUer {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					width: 100%;
					height: 100%;
					background-color: transparent;
					color: $ztd-color-block;
					font-size: 32rpx;
					padding: 0;

					.user_icon {
						width: 100%;
						height: 100%;
					}
				}

				.getUer::after {
					border: none;
				}
			}

			.userInfo {
				flex: 1;

				.islogin {
					width: 100%;
					height: 100%;

					.name,
					.phone,
					.ID {
						color: $ztd-color-block;
						margin-bottom: 4rpx;
					}
				}

				.nologin {
					font-size: 30rpx;
					color: $ztd-color-block;
					padding: 20rpx 0;
					background-color: transparent;
					text-align: left;
				}

				.nologin::after {
					border: none;
				}
			}

			.set {
				width: 150rpx;
				height: 50rpx;
				color: $ztd-color-block;
				border: 2rpx solid $ztd-color-block;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 8rpx;
			}
			.teamInfo{
				position: absolute;
				left: 150rpx;
				bottom: 16rpx;
			}
		}

		.bgpage {
			width: 100%;
			height: 320rpx;
			background-color: $ztd-color-primary;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			border-bottom-right-radius: 50%;
			border-bottom-left-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.panelList {
			width: 100%;
			height: calc(100% - 370rpx);
			z-index: 999;
			padding: 20rpx 40rpx 60rpx;

			.panel-wraper {
				width: 100%;
				height: auto;
				background-color: $ztd-color-white;
				border-radius: 14rpx;
				padding: 20rpx;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

				.panel-title {
					height: 60rpx;
					line-height: 60rpx;
					border-bottom: 2rpx solid $ztd-color-line;
					font-size: 30rpx;
					margin: 0 20rpx;
					color: #777;
				}

				.panel-cont {
					height: auto;
					width: 100%;
					padding: 20rpx 0 0;
					display: flex;
					justify-content: flex-start;
					flex-wrap: wrap;

					.item {
						width: 33%;
						height: 120rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						flex-direction: column;
						margin-bottom: 20rpx;

						.iconfont {
							font-size: 50rpx;
						}

						.text {
							height: 50rpx;
							line-height: 50rpx;
							font-size: 26rpx;
							font-weight: bold;
							color: #777;
						}
					}

				}
			}

		}

		.rficon {
			font-size: 24rpx;
			padding-left: 10rpx;
		}

		.infotab-box {
			width: 100%;
			display: flex;
			height: 120rpx;
			padding: 20rpx 0;
			font-size: 38rpx;
			color: $ztd-color-titlefont;

			&-l,
			&-r {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.image-box-l {
					width: 60rpx;
					height: 60rpx;
					margin: 0 20rpx;
				}

				.content {
					flex: 1;

					&-t {
						font-size: 28rpx;
						margin-bottom: 6rpx;
					}

					&-num {
						font-size: 30rpx;
						font-weight: bold;
					}
				}

				.tips {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
					margin-bottom: 30rpx;
				}

				.image-box-r {
					width: 40rpx;
					height: 40rpx;
				}
			}

			&-r {
				.infotab-box-l {
					border-left: 2rpx solid $ztd-color-listfont;
				}

				.micon,
				.name {
					color: $ztd-color-topup;
				}
			}

			.name {
				// padding-left: 10rpx;
			}
		}
	}
</style>
