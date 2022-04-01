<template>
	<view class="home">
		<navigationBar :navigationBarStyle="navigationBarStyle" @navBar="navBar"></navigationBar>
		<!-- 背景图片 -->
		<view class="home-bgimg">
			<image src="../../../static/i-topimg.jpeg"></image>
		</view>
		<!-- 首页信息 -->
		<scroll-view scroll-y="true" class="scroll-view" v-if="homelist.length>0">
			<!-- <HomeList :homelist="homelist" @selectItem="selectItem"></HomeList> -->
			<view class="homelist_send">寄件</view>
			<view class="homelist">
				<view class="homeItem" v-for="(item,index) in homelist" :key="index" @click="selectItem(item, index)">
					<view class="iconImg">
						<image class="iconfont" :src="item.src"></image>
					</view>
					<view class="homeText">
						<uni-badge class="hadge" :text="item.badge" type="error" :inverted="false" size="small">
						</uni-badge>
						<view class="name">
							<text>{{item.name}}</text>
						</view>
						<view class="tips">
							{{item.tips}}
						</view>
					</view>
				</view>
			</view>
			<view class="homelist_other">其他工具</view>
			<view class="homelist pd20">
				<view class="homeItem" v-for="(item,index) in otherlist" :key="index" @click="selectItem(item, index)">
					<view class="iconImg">
						<image class="iconfont" :src="item.src"></image>
					</view>
					<view class="homeText">
						<uni-badge class="hadge" :text="item.badge" type="error" :inverted="false" size="small">
						</uni-badge>
						<view class="name">
							<text>{{item.name}}</text>
						</view>
						<view class="tips">
							{{item.tips}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 点击切换形态 -->
		<uni-popup ref="showpopup" type="center" :zIndex="99">
			<view class="showModal">
				<view class="showModal-title">设置权限</view>
				<view class="showModal-main" v-for="(item,index) in mockList" :key="index">
					<!-- checkBox -->
					<view class="checkbox">
						<radio-group @change="selectRadioCheck">
							<label class="radio">
								<radio :value="item.check" :checked="checked==item.check" style="transform:scale(0.7)"
									color="#433E3D" />
								<view class="showModal-main-title">
									<view class="showModal-main-title-name">{{item.name}}</view>
									<view class="showModal-main-title-content">{{item.content}}</view>
								</view>
							</label>
						</radio-group>
					</view>
				</view>
				<view class="showModal-btn">
					<view class="view" @click="selectCancel">取消</view>
					<view class="active" @click="selectConfirm">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		GET_USERINFO,
		GET_IPHONE_DATA,
		GET_BLE_DATA_PRINT,
		GET_BLE_DATA_PRINT_LIST
	} from "@/store/gettersType.js";
	import {
		SET_THEREPORT,
		SET_BLE_DATA,
		SET_BLE_DATA_PRINT,
		SET_CONNECT_DEVICEId,
		SET_BLE_DATA_PRINT_LIST
	} from "@/store/actionsType.js";
	import {
		mapGetters,
		mapActions
	} from 'vuex';
	import navigationBar from './components/navigation-bar.vue';
	import QRPrinter from '@/common/wxQRPrinter/QRPrinterAndTest.js';
	let self;
	export default {
		data() {
			return {
				navigationBarStyle: {
					background: '#FDD605',
					title: '', // 个人模式不显示标题，团队模式才显示
					icon: '/static/img/personal.png', // 团队模式下换形态：/static/img/character.png
					teamText: '个人模式'
				},
				homelist: [],
				otherlist: [],
				isShow: false,
				boxStyle: {
					'z-index': 999
				},
				mockList: [{
						check: '1',
						name: '团队模式',
						content: '团队共享订单'
					},
					{
						check: '2',
						name: '个人模式',
						content: '个人独立订单'
					}
				],
				checked: '2',
				hasTeam: false,
				teamInfo: {}
			};
		},
		components: {
			navigationBar
		},
		onPageScroll(e) {},
		onLoad() {
			self = this;
			this.$getPhoneDevices(); //获取手机信息
			// this.applog();  //版本校验
			this.download_data()
			// this.$getwxticket()
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage']
			})

		},
		onHide() {
			uni.hideToast();
		},
		onUnload(){
			uni.$off('bleConnectHome');  //关闭监听
			// uni.$off('bleOk');
		},
		mounted() {
			// console.log('GET_BLE_DATA_PRINT',this.GET_BLE_DATA_PRINT)
			// 蓝牙连接调用
			uni.$on('bleConnectHome', data => {
				// 蓝牙连接触发
				self.getBleConnectTo();
			})
		},
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onShow() {
			
			// this.download_data()
			let token = this.$getStorageSync('token')
			if (token) {
				self.getWxGroupByOpenId()
				self.bindUserImg()
			}
			let teamInfo = self.$getStorageSync('teamInfo')
			if (teamInfo) {
				self.teamInfo = teamInfo;
				this.hasTeam = true;
			}
			let teamModel = self.$getStorageSync('teamModel')
			if (teamModel) {
				self.checked = teamModel
			} else {
				self.checked = '2'
			}
			self.editTeamStatus()
			self.setMenuData(teamModel)
		},
		computed: {
			...mapGetters([GET_USERINFO, GET_IPHONE_DATA, GET_BLE_DATA_PRINT, GET_BLE_DATA_PRINT_LIST]),
			offline_C() {
				return global.offline ? false : true
			}
		},
		methods: {
			...mapActions([SET_THEREPORT, SET_BLE_DATA_PRINT_LIST, SET_CONNECT_DEVICEId, SET_BLE_DATA_PRINT,
			SET_BLE_DATA]),
			// 切换模式
			navBar() {
				if (this.hasTeam) {
					this.$nextTick(() => {
						this.$refs['showpopup'].open();
					})
				} else {
					uni.showToast({
						icon: "none",
						title: "您未加入任何团队，请先加入团队~",
						duration: 2000
					});
				}
			},
			setMenuData(teamModel) {
				self.homelist = [{
						icon: "&#xe61f;",
						name: "下单寄件",
						id: "xdjj",
						tips: '上门揽件',
						path: "/pages/order/send/index",
						badge: 0,
						src: require('@/static/img/renwu.png')
					},
					
					{
						icon: "&#xe61f;",
						name: "批量寄件",
						id: "pljj",
						tips: '同时多个收件人',
						path: "/pages/order/batch-send/index",
						badge: 0,
						src: require('@/static/img/team.png')
					},
					{
						icon: "&#xe61f;",
						name: "excel寄件",
						id: "excel",
						tips: '导入excel寄件',
						path: "/pages/excelMail/excelMail",
						badge: 0,
						src: require('@/static/img/excel.png')
					},
					{
						icon: "&#xe61f;",
						name: "扫码寄件",
						id: "smjj",
						tips: '扫码纸质二维码',
						path: "/pages/order/send/index",
						badge: 0,
						src: require('@/static/img/saoma.png')
					},
					{
						icon: "&#xe61f;",
						name: "批量解析",
						id: "yfsx",
						tips: '地址一键解析',
						path: "/pages/parsing-batch/parsing-batch",
						badge: 0,
						src: require('@/static/img/zaitu.png')
					},
					{
						icon: "&#xe61f;",
						name: "物流轨迹查询",
						id: "wlgjcx",
						tips: '运单轨迹查询',
						path: "/pages/all-order-details/index",
						badge: 0,
						src: require('@/static/img/undata.png')
					}
				]
				if (teamModel == '1') {
					self.otherlist = [
						{
							icon: "&#xe61f;",
							name: "打印机",
							id: "dyj",
							tips: '蓝牙一键打印',
							path: "/pages/myPrinter/myPrinter",
							badge: 0,
							src: require('@/static/img/dayinji.png')
						},
						
						{
							icon: "&#xe61f;",
							name: "团队",
							id: "td",
							tips: '团队模式',
							path: "/pages/team-model/team-model",
							badge: 0,
							src: require('@/static/img/team.png')
						},
						{
							icon: "&#xe61f;",
							name: "建议反馈",
							id: "zsxg",
							tips: '说说您的想法',
							path: "/pages/suggestion/suggestion",
							badge: 0,
							src: require('@/static/img/zuanshu.png')
						}
					]
				} else {
					self.otherlist = [
						{
							icon: "&#xe61f;",
							name: "打印机",
							id: "dyj",
							tips: '蓝牙一键打印',
							path: "/pages/myPrinter/myPrinter",
							badge: 0,
							src: require('@/static/img/dayinji.png')
						},
						
						{
							icon: "&#xe61f;",
							name: "团队",
							id: "td",
							tips: '团队模式',
							path: "/pages/team-model/team-model",
							badge: 0,
							src: require('@/static/img/team.png')
						},
						{
							icon: "&#xe61f;",
							name: "专属小哥",
							id: "zsxg",
							tips: '专属服务',
							path: "/pages/mycourier/index",
							badge: 0,
							src: require('@/static/img/zuanshu.png')
						},
						{
							icon: "&#xe61f;",
							name: "建议反馈",
							id: "zsxg",
							tips: '说说您的想法',
							path: "/pages/suggestion/suggestion",
							badge: 0,
							src: require('@/static/img/zuanshu.png')
						}
					]
				
				}
			},
			getBleConnectTo(){
				let self = this;
				let blePrint = self.$getStorageSync('blePrint')||[];
				let isPrint = blePrint.length>0?blePrint[blePrint.length-1]:null;
				console.log(isPrint)
				uni.openBluetoothAdapter({
				  success(res) {
				    console.log(res)
						//获取本机蓝牙适配器状态
						uni.getBluetoothAdapterState({
							success: function(res) {
								console.log(res)
							},
						})
				  }
				})
				if(isPrint){
						// 先判断蓝牙连接状态
						QRPrinter.getConnectState((resState)=>{
							if(resState.state && resState.code == 200) {
								// 打印数据 -- 设置数据传入动态的
							}
						},(err) => {
						console.log(err)
						QRPrinter.connect(isPrint, function(res) {
							console.log('我有自动重连了')
								console.log('item', res);
								// 自定义返回值
								if (res.code == 200) {
									// 存入已连接的设备ID与搜索的数组列表其中的设备ID
									self.SET_CONNECT_DEVICEId(res.device.deviceId);
									// 存入当前连接设备
									self.SET_BLE_DATA({
										name: res.device.name,
										deviceId: res.device.deviceId
									});
									// 存入已连接设备列表 -- 暂时不用
									self.SET_BLE_DATA_PRINT({
										name: res.device.name,
										deviceId: res.device.deviceId
									});
									// if(self.GET_BLE_DATA_PRINT_LIST.incl)
									let printAarry = []
									if(self.GET_BLE_DATA_PRINT_LIST.length>0){
										self.GET_BLE_DATA_PRINT_LIST.forEach(item =>{
											if(item.deviceId!=res.device.deviceId){
												printAarry.push({
													name: res.device.name,
													deviceId: res.device.deviceId
												})
												self.SET_BLE_DATA_PRINT_LIST(printAarry)
												self.$setStorageSync('blePrint',printAarry)
											}
										})
									}else{
										printAarry.push({
											name: res.device.name,
											deviceId: res.device.deviceId
										})
										self.SET_BLE_DATA_PRINT_LIST(printAarry)
										self.$setStorageSync('blePrint',printAarry)
										
									}
									console.log(self.GET_BLE_DATA_PRINT_LIST)
								}
							}, function(err) {
								console.log(err);
							})
					},false);
					}
			},
			getWxGroupByOpenId() {
				let self = this;
				let changeTeamModel;
				try {
					changeTeamModel = Boolean(this.$getStorageSync('team-mode-changed'))
				} catch (e) {
					changeTeamModel = false
				}
				self.$api.getWxGroupByOpenId().then(res => {
					if (res.code == 200) {
						if (!res.data) {
							self.$setStorageSync('teamInfo', '');
							self.hasTeam = false;
							self.$setStorageSync('teamModel', '2');
							this.checked = '2';
						} else if (!changeTeamModel) {
							if (res.data.status != 0) {
								self.$setStorageSync('teamInfo', res.data)
								self.$setStorageSync('teamModel', '1');
								this.checked = '1';
								self.teamInfo = res.data
								self.hasTeam = true
								if (self.teamInfo.status == 1) {
									self.getAuditCount()
								}
							} else {
								self.hasTeam = true;
								self.$setStorageSync('teamInfo', '');
								self.$setStorageSync('teamModel', '2');
								this.checked = '2';
							}
						}
						self.editTeamStatus()
					} else {
						// uni.showToast({
						// 	icon: "none",
						// 	title: "获取个人团队信息失败~",
						// 	duration: 1500
						// });
					}
				})
			},
			getAuditCount() {
				let self = this;
				let _data = {
					groupId: self.teamInfo.groupId,
				}
				self.$api.getAuditCount(_data).then(res => {
					if (res.code == 200) {
						self.homelist[1].badge = res.data
					}
				})
			},
			// 模式切换
			selectRadioCheck(event) {
				this.checked = event.detail.value;
			},

			// 取消
			selectCancel() {
				this.$refs['showpopup'].close();
			},
			// 蓝牙连接
			bleConnect() {
				// 先判断蓝牙连接状态
				QRPrinter.getConnectState((resState) => {
					if (resState.state && resState.code == 200) {} else {

					}
				});
			},
			// 确认更改
			selectConfirm() {
				let self = this;
				self.editTeamStatus()
				if (this.teamInfo.status == 0) {
					uni.showToast({
						icon: "none",
						title: "待审核状态，无法使用团队模式",
						duration: 2000
					});
					this.checked = '2'
				} else {
					this.$setStorageSync('team-mode-changed', true)
				}
			},
			editTeamStatus() {
				let name, title, icon;
				if (this.teamInfo.status != 0) {
					if (this.checked == '1') {
						name = '团队模式';
						icon = '/static/img/character.png'
						title = this.teamInfo.groupName || '';
					} else {
						name = '个人模式';
						icon = '/static/img/personal.png'
						title = '';
					}
					this.navigationBarStyle.teamText = name;
					this.navigationBarStyle.icon = icon
					this.navigationBarStyle.title = title
					this.$refs['showpopup'].close();
					this.$setStorageSync('teamModel', this.checked)
					this.setMenuData(this.checked)
				} else {
					this.navigationBarStyle.teamText = '个人模式';
					this.navigationBarStyle.icon = '/static/img/personal.png';
					this.navigationBarStyle.title = '';
					this.$refs['showpopup'].close();
					this.$setStorageSync('teamModel', '2');
				}
			},
			// applog(){
			// 	this.$checkApplog();  //版本校验
			// 	if(global.applog != null){
			// 		clearInterval(global.applog);
			// 	}
			// 	global.applog = setInterval(()=>{
			// 		this.$checkApplog();
			// 	},15000)
			// },
			// 下载选择项本地数据
			download_data() {
				// console.log(plus.storage.getItem('bycode'));
				// if(!uni.getStorageSync('bycode')){
				// 	// 获取业务员 
				// 	self.$getAllByCode();
				// }
				// if(!plus.storage.getItem('site')){
				// 	//获取网点
				// 	self.$getAllSite();
				// }
				let token = this.$getStorageSync('token');
				let province = this.$getStorageSync('province');
				if (token) {
					self.$getProvinceAll();
				}

				// if(!self.$getStorageSync('province')){
				// 	//获取省市区
				// 	self.$getProvinceAll();
				// }
				// if(!plus.storage.getItem('destination')){
				// 	//获取网点
				// 	self.$destination();
				// }
				// if(!plus.storage.getItem('customer')){
				// 	//获取网点
				// 	self.$customer();
				// }
				// self.$getAllByCode();   // 获取业务员    bycode
				// self.$tabProKeepType();  //获取留仓类型     keeptype
				// self.$getAllSite();   //获取网点     site
				// self.$getProvinceAll();   //获取省市区   province
				// self.$destination();   //目的地信息查询   destination
				// self.$customer();   //获取本人所以客户    customer
				// self.$getProblemType();  //查询所有问题类型    problemtype
			},
			inputVal(val) {
				this.$nextTick(function() {
					self.homeSearch = val.replace(this.$Reg.RegOrder, '');
				})
			},
			// 输入框聚焦
			focusInput() {

			},
			// 输入框失焦
			blurInput() {
				this.search_order();

			},
			message() {
				if (global.offline) {
					uni.showToast({
						icon: "none",
						title: "离线操作,无法进入",
						duration: 1000
					});
					return;
				}
				uni.navigateTo({
					url: "/pages/notice/index"
				})
			},
			touchPage(e) {
				// e.preventDefault();
				console.log('touchPage');
				this.isShow = false;
			},
			headerinfo(e) {
				// console.log(e);
				// e.stopPropagation();
				// e.preventDefault();
				this.isShow = !this.isShow;
			},
			checkBillCode(data, item) {
				let self = this;
				let _data = {
					billCode: data
				}
				self.$api.checkBillCode(_data).then(res => {
					if (res.code == 200) {
						let data_ = {
							billCode: data
						}
						uni.navigateTo({
							url: item.path + '?pageId=' + item.id + '&data=' + JSON.stringify(data_)
						})
					} else {
						uni.showToast({
							icon: "none",
							title: '该运单号已使用！'
						});
					}
				})
			},
			bindUserImg() {
				let self = this;
				let token = self.$getStorageSync('token');
				let userNameImg, userData;
				try {
					userNameImg = JSON.parse(self.$getStorageSync('userNameImg'));
					userData = JSON.parse(self.$getStorageSync('userData'))
				} catch (err) {
					console.log(err)
				}
				if (userNameImg) {
					let updateData = {
						openId: token,
						headImgUrl: userNameImg.avatarUrl,
						nickName: userNameImg.name
					}
					if (userNameImg.name && !userData.nickName) {
						self.$api.updateUser(updateData).then(res => {
							console.log(res)
						})
					}
				}
			},
			//列表选择
			selectItem(item, index) {
				let self = this;
				// console.log(list);
				let userData = self.$getStorageSync('userData')
				if (typeof(userData) == "undefined") {
					uni.showModal({
						title: "提示",
						content: "请先登录授权~",
						success: function(res) {
							if (res.confirm) {
								uni.switchTab({
									url: "/pages/tabbar/my/index?pageId=send"
								})
							} else if (res.cancel) {
								uni.switchTab({
									url: "/pages/tabbar/home/index?pageId=send"
								})
							}
						}
					})
					return false;
				}
				if (item.id == 'smjj') {
					uni.scanCode({
						success: function(res) {
							let ewmDataStr = res.result;
							// let ewmDataStr ='http://m23j177109.iok.la:34152/NZXCXServer/scanOrder/NZ0000123';
							let index = ewmDataStr.indexOf("scanOrder/");
							ewmDataStr = ewmDataStr.substring(index + 10, ewmDataStr.length);
							self.checkBillCode(ewmDataStr, item)
						}
					});
				} else if (item.id == 'td') {
					let userData = JSON.parse(self.$getStorageSync('userData'))
					console.log('userData', userData)
					if (userData.nickName) {
						let data = {}
						let teamInfo = self.$getStorageSync('teamInfo');
						if (teamInfo) {
							data.groupId = teamInfo.groupId
							uni.navigateTo({
								url: '/pages/team-model/create-team' + '?pageId=' + item.id + '&data=' + JSON
									.stringify(data)
							})
						} else {
							uni.navigateTo({
								url: item.path + '?pageId=' + item.id + '&data=' + JSON.stringify(data)
							})
						}
					} else {
						self.$removeStorageSync('token');
						self.$removeStorageSync('userData');
						self.$removeStorageSync('accountData');
						self.$removeStorageSync('userNameImg');
						uni.showToast({
							icon: "none",
							title: "未获取用户昵称,请重新登录~",
							duration: 1500,
							mask: true
						})
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/tabbar/my/index?pageId=home"
							})
						}, 1500)
					}
				} else {
					let data = {}
					uni.navigateTo({
						url: item.path + '?pageId=' + item.id + '&data=' + JSON.stringify(data)
					})
					// if(this.homelist[index].name == '团队') {
					// 	// 判断是创建团队还是加入团队还是暂无加入既无创建
					// 	uni.navigateTo({
					// 		url: '/pages/team-model/create-team?pageId=cjtd'
					// 	})
					// } else {

					// }
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	text {
		font-size: 32rpx;
	}

	.home {
		width: 100%;
		height: 100%;
		overflow: hidden;
		box-sizing: border-box;
		background-color: $ztd-color-bgcolor;

		&-bgimg {
			height: 320rpx;
			width: 100%;
			background-color: $ztd-color-primary;

			image {
				width: 100%;
				height: 100%;
			}
		}
		.scroll-view {
			height: calc(100% - 460rpx);
			width: 100%;
			.homelist_send{
				width: 100%;
				// height: 18rpx;
				font-size: 30rpx;
				padding: 20rpx 20rpx 0 20rpx;
				font-weight: bold;
			}
			.homelist_other{
				width: 100%;
				// height: 18rpx;
				font-size: 30rpx;
				padding: 0 20rpx 0 20rpx;
				font-weight: bold;
			}
			.homelist {
				width: 100%;
				padding: 20rpx 20rpx 0 20rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.homeItem {
					width: calc(50% - 10rpx);
					height: 160rpx;
					margin-bottom: 20rpx;
					background-color: $ztd-color-white;
					border-radius: 6rpx;
					display: flex;
					align-items: center;
					padding: 10rpx;
					.iconImg {
						width: 64rpx;
						height: 64rpx;
						margin: 10rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}

					.homeText {
						flex: 1;
						position: relative;

						.hadge {
							position: absolute;
							right: 0;
							top: -40rpx;
						}

						.name {
							margin-bottom: 10rpx;

							text {
								color: #000000;
								font-weight: bold;
								font-size: 30rpx;
							}
						}

						.tips {
							color: $ztd-color-listfont;
							font-size: 28rpx;
						}
					}
				}
			}
			.pd20{
				padding:20rpx 20rpx 70rpx 20rpx;
			}
		}

		.showModal {
			background-color: #FFFFFF;
			margin: 80rpx;
			padding: 20rpx 0;
			border-radius: 8rpx;

			&-title {
				text-align: center;
				color: $ztd-color-titlefont;
				font-size: 32rpx;
				margin-bottom: 50rpx;
			}

			&-main {
				display: flex;
				margin-left: 20rpx;

				.radio {
					display: flex;
					align-items: center;
				}

				&-title {
					padding-top: 40rpx;
					margin-left: 20rpx;

					&-name {
						margin-bottom: 10rpx;
						font-size: 28rpx;
					}

					&-content {
						font-size: 28rpx;
					}
				}
			}

			&-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 80rpx;
				margin-left: 40rpx;
				margin-right: 40rpx;
				padding-bottom: 20rpx;

				.view {
					flex: 1;
					font-size: 32rpx;
				}

				.active {
					flex: 1;
					font-size: 32rpx;
					color: $ztd-color-primary;
					text-align: right;
				}
			}
		}
	}
</style>
