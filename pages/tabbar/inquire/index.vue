<template>
	<view class="inquire" @click="bindBody">
		<view class="top-search">
			<view class="search-box">
				<InputSearch :isLeft="false" :isRight="true" :itype="'text'" :placeholder="'亲,可输入单号、收件人手机号、姓名查询哟'"
					:boxStyle="boxStyle" v-model="expressSearch" @input="inputVal" @touchRight="search"
					@confirm="confirm_search">
				</InputSearch>
			</view>
		</view>
		<view class="main">
			<view class="main-tabs">
				<view class="tabs-nav">
					<scroll-view-tab class="tabs-title" :tabItemWidth="'25%'" :tabItemLeft="'48rpx'" :tabBars="tab"
						:pageId="'order'" :tabIndexInit="tabIndex" @onTabTap="onTabTap"></scroll-view-tab>
					<view class="screen" @click.stop="getFilterData">
						<text :class="isFilter?'isScreen':''">筛选</text>
						<i class="iconfont hicon" v-html="'&#xe659;'"></i>
					</view>
					<view class="screen-c" v-if="isScreen" @click="onScreen" :class="timeIndex==3?'customize':''">
						<view class="con" @click.stop="">
							<view class="ti" v-if="teamModel=='1'&&(teamInfo.status==1||teamInfo.status==2)">
								成员筛选
							</view>
							<view class="box" v-if="teamModel=='1'&&(teamInfo.status==1||teamInfo.status==2)">
								<input class="screen-input" v-model="memberSearch" type="text" placeholder="请输入成员名称" />
								<view class="" style="margin-left: 20rpx;">
									<text class="member-btn" @click="searchMember"> 搜索</text>
								</view>
								<view class="text-info">
									{{memberInfo.nickName||'暂无信息~'}}
									<i class="iconfont hicon" v-html="'&#xe66d;'" v-if="memberInfo.nickName" @click="clearMember"></i>
								</view>
							</view>
							<view class="ti">
								时间筛选
							</view>
							<view class="box">
								<text class="item " :class="item.id==timeIndex? 'is':''"
									v-for="(item,index) in timeScreen" :key="index"
									@click.stop="clickTime(index,'time')">{{item.name}}</text>
							</view>
							<view class="timeSelection" @click="editTime" v-if="timeIndex==3">
								<text>{{before}}</text>至<text>{{after}}</text>
							</view>
							<view class="submit">
								<view class="submit-button refresh" @click="refreshFilter">
									重置
								</view>
								<view class="submit-button" @click="confirmFilter">
									确定
								</view>
							</view>
						</view>
					</view>
				</view>
				<mescroll-uni :top="220" :bottom="tabIndex!=2?80:0" @down="downCallback" :up="upOption" @up="upCallback"
					@init="mescrollInit" :down="downOption">
					<view class="tabs-content">
						<view class="item" @click="goOrderDetails(item)"
							v-for="(item,index) in tabList[tabIndex].getMyOrdersList" :key="index">

							<view class="item-radio" @click.stop="" >
								<!-- 选中框 -->
								<RadioCheck :oncheck="item.ck" @selectRadio="selectRadioCheck" :list="item"
									:index="index">
									<view class="billCode" v-if="item.billCode">
										运单号：{{item.billCode||'无'}}
									</view>
									<view class="billCode" v-if="!item.billCode">
										订单号：{{item.orderBill}}
									</view>
									<image @click.stop="copy(item.billCode||item.orderBill)" class="copy" src="../../../static/img/copy.png" mode=""></image>
								</RadioCheck>
							</view>
							<view class="item-info">
								<view class="info-l">
									<view class="oiconbox">
										<text class="oicon jj">寄</text>
									</view>
									<view class="text-c">
										<view class="city uni-ellipsis">
											{{item.sendCity||item.sendProvince}}
										</view>
										<view class="name">
											{{item.sendMan}}
										</view>
									</view>
								</view>
								<view class="info-c">
									<view class="line"></view>
									<view class="decs">{{item.billStatus}}</view>
								</view>
								<view class="info-r">
									<view class="oiconbox">
										<text class="oicon sj">收</text>
									</view>
									<view class="text-c">
										<view class="city uni-ellipsis">
											{{item.acceptCity||''}}
										</view>
										<view class="name">
											{{item.acceptMan}}
										</view>
									</view>
								</view>
							</view>
							<view class="item-trail" v-if="item.remark!=null">{{item.remark}}</view>
							<view class="item-trail">订单录入时间: <text>{{item.registerDate}}</text></view>
							<view class="botBtn">
								<view class="billTime" @click.stop="moreMenu(item)">
									<image class="operate" src="../../../static/img/operate.png" mode=""></image>
								</view>
								<view class="btn_list"
									v-if="item.billStatus=='待处理'||item.billStatus=='已分网点'||item.billStatus=='已分业务员'||item.billStatus=='已接单'">
									<text class="editBtn" @click.stop="editOrders(item)">修改</text>
									<text class="delBtn" @click.stop="delOrders(item)">取消</text>
								</view>
							</view>
						</view>
					</view>
				</mescroll-uni>
				<view class="bottom" v-if="tabIndex!=2">
					<view class="all" >
						<RadioCheck :oncheck="tabList[tabIndex].all_ck" @selectRadio="allRadio"></RadioCheck>
						全选
					</view>
					<view class="selected" >
						<view class="name">已选:</view>
						<view class="val">{{tabList[tabIndex].getMyOrdersList | filterCk}}</view>
					</view>
					<view class="btns">
						<view class="btns-list cancel" @tap="cancelList">一键取消</view>
					</view>
					<view class="btns" >
						<view class="btns-list" @tap="ChangePrint">一键打印</view>
					</view>
				</view>
				<!-- 打印要连接蓝牙 -->
				<uni-popup :type="'bottom'" ref="showpopup">
					<BlePop></BlePop>
				</uni-popup>
				<uni-popup :type="'bottom'" ref="showpopup1">
					<AlertMenu :menuList='menuList' @selectOperat="selectOperat" @cancel='cancelMenu'></AlertMenu>
				</uni-popup>
			</view>
		</view>
		<!-- 日期 -->
		<NavDate :isShow="isShowDate" :startDate="startDate" :endDate='endDate' :before="before" :after="after"
			@confirm="confirmTime" ref="NavDate"></NavDate>
	</view>
</template>

<script>
	let self;
	let timer = null;
	let printTimer = null;
	let cancelTimer = null;
	import BlePop from '@/components/ble-pop/ble-pop.vue'
	import AlertMenu from '@/components/alert-menu/alert-menu.vue'
	// 配置蓝牙
	import QRPrinter from '@/common/wxQRPrinter/QRPrinterAndTest.js';
	import tpl from '@/common/wxQRPrinter/utils/printTpl.js';
	import tpl_handler from '@/common/wxQRPrinter/utils/printTpl_parsing.js';
	export default {
		components: {
			BlePop,
			AlertMenu
		},
		data() {
			return {
				menuList: [{
						name: '再来一单',
						id: 'zlyd'
					},
					{
						name: '复制订单',
						id: 'fzdd'
					},
				],
				tab: [{
						name: '未打印',
						id: 0,
						total: 0
					},
					{
						name: '已打印',
						id: 1,
						total: 0
					},
					{
						name: '已取消',
						id: 2,
						total: 0
					},
					{
						name: '全部',
						id: 3,
						total: 0
					},
				],
				tabIndex: 0,
				tabList: [{
						id: 0,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						total: 0,
						all_ck: false
					},
					{
						id: 1,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck: false,
						total: 0
					},
					{
						id: 2,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck: false,
						total: 0
					},
					{
						id: 3,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck: false,
						total: 0
					},
				],
				billCodeSearch: '',
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: false,
				},
				timeIndex: 2,
				timeScreen: [{
					name: '今天',
					id: 0,
					time: ''
				}, {
					name: '近7天',
					id: 1,
					time: ''
				}, {
					name: '近30天',
					id: 2,
					time: ''
				}, {
					name: '自定义',
					id: 3,
					time: ''
				}],
				isScreen: false,
				isShowDate: false,
				expressSearch: '',
				mescroll: null,
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 15 // 每页数据的数量
					},
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						use: true,
						tip: '~ 暂无订单 ~' // 提示
					}
				},
				isData: false,
				teamInfo: {},
				memberSearch: '',
				memberInfo: {},
				memberToken: '',
				endDate: '',
				startDate: '',
				before: '',
				after: '',
				teamModel: '',
				isFilter: false,
				operatItem: {},
				timeShow: true,
				filter_old:[]
			};
		},
		onLoad() {
			self = this;
			this.initDate()

		},
		onShow() {
			self = this;
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
						}
					}
				})
				return false;
			}
			// 从下单页面进来
			let currentIndex = getApp().globalData.currentIndex
			if (currentIndex !== '' && currentIndex !== null && currentIndex !== undefined && currentIndex == 0) {
				self.tabIndex = currentIndex
				getApp().globalData.currentIndex = ''
				self.tabList[this.tabIndex].getMyOrdersList = [];
				self.tabList[self.tabIndex].pageNum = 1;
				self.$nextTick(function() {
					self.mescroll.triggerDownScroll();
				})
			} else if (currentIndex == 1) {
				getApp().globalData.currentIndex = '';
			} else {
				self.$nextTick(function() {
					self.mescroll.triggerDownScroll();
				})
			}
			let token = this.$getStorageSync('token')
			if (token) {
				self.getWxGroupByOpenId()
			}
			let teamInfo = self.$getStorageSync('teamInfo')
			if (teamInfo) {
				self.teamInfo = teamInfo
			}
			self.teamModel = self.$getStorageSync('teamModel') == '1' ? '1' : '2';
			wx.setNavigationBarTitle({
				title: `订单查询${self.$getStorageSync('teamModel')==='1'?'（团队）':''}`,
			})
		},
		mounted() {
			let self = this;
			// 监听蓝牙连接成功
			uni.$on('bleOk', data => {
				// console.log(data);
				if (data) {
					this.$refs.showpopup.close();
					setTimeout(() => {
						// self.ChangePrint()
					}, 500)
				}
			})
			uni.$emit('bleConnectHome') //调用首页的蓝牙连接
		},
		watch: {
			// memberSearch(newTxt){
			// 	this.throttle(this.searchMember, null, 500, newTxt);
			// }
		},
		computed: {
			// ...mapGetters([GET_THEREPORT])
		},
		onUnload() {
			timer && clearTimeout(timer);
			uni.$off('bleOk')
		},
		methods: {
			// throttle(fn,context,delay,text){
			// 		clearTimeout(fn.timer);
			// 		fn.timer=setTimeout(() => {
			// 				fn.call(context,text);
			// 		},delay);
			// },
			confirm_search() {
				let self = this;
				self.mescroll.triggerDownScroll()
			},
			searchMember() {
				let self = this;
				let _data = {
					groupId: self.teamInfo.groupId,
					nickName: self.memberSearch
				}
				self.$api.getWxGroupByName(_data).then(res => {
					if (res.code == 200 && res.data != null) {
						self.memberInfo = res.data;
						self.memberToken = res.data.openId
					} else {
						uni.showToast({
							icon: 'none',
							duration: 1500,
							title: '未搜索到团员信息~'
						})
						self.memberInfo = {};
					}
				})
			},
			confirmFilter() {
				let self = this;
				self.tabList[self.tabIndex].pageNum = 1;
				self.tabList[self.tabIndex].getMyOrdersList = [];
				self.isScreen = false;
				self.isFilter = true;
				self.mescroll.triggerDownScroll();
			},
			editTime() {
				let self = this;
				self.timeShow = false;
				self.$refs['NavDate'].opencalendar();
			},
			refreshFilter() {
				let self = this;
				self.timeIndex = 2;
				self.isFilter = false;
				self.memberSearch = '';
				self.memberToken = '';
				self.memberInfo = {};
				self.before = this.$momm.getdate(-30);
				self.after = this.$momm.getdate();
			},
			clearMember(){
				let self = this;
				self.memberInfo = {};
				self.memberToken = '';
				self.memberSearch = '';
			},
			getWxGroupByOpenId() {
				let self = this;
				self.$api.getWxGroupByOpenId().then(res => {
					// console.log('res', res)
					if (res.code == 200 && res.data != null) {
						self.$setStorageSync('teamInfo', res.data)
						self.teamInfo = res.data
					} else {
						self.$setStorageSync('teamInfo', '')
					}
				})
			},
			onScreen() {

			},
			initDate() {
				// 先获取到当前的日期，再进行当前日期与2017做比较的月份数
				// const month = this.$momm.doHandleMonth();
				// const monthArr = this.$momm.getMonths(new Date("2017-01-01"),new Date(month));
				// const monthArrLenght = monthArr.length
				// //初始化月份
				// this.startDate = this.$momm.getdate(0, -monthArrLenght);
				// this.endDate = this.$momm.getdate();
				this.before = this.$momm.getdate(-30);
				this.after = this.$momm.getdate();
			},
			//订单更多操作
			moreMenu(item) {
				let self = this;
				self.operatItem = item;
				self.$refs['showpopup1'].open();
			},
			cancelMenu() {
				let self = this;
				self.$refs['showpopup1'].close();
			},
			bindBody() {
				let self = this;
				if (self.isScreen && self.timeShow) {
					self.confirmFilter()
					self.isScreen = false;
				}
			},
			//筛选
			getFilterData() {
				this.isScreen = true
			},
			selectOperat(data) {
				let self = this;
				switch (data.item.id) {
					case 'zlyd':
						let _data = {
							orderBill: self.operatItem.orderBill,
							operatType: 'again'
						}
						uni.navigateTo({
							url: '/pages/order/send/index?pageId=ddcx&data=' + JSON.stringify(_data)
						});
						break;
					case 'fzdd':
						self.operate = 'szqx';
						let copy = {
							orderBill: self.operatItem.orderBill
						}
						self.$api.copyOrder(copy).then(res => {
							// console.log(res)
							if (res.code == 200) {
								wx.showToast({
									title: '复制订单成功',
									icon: 'none',
									duration: 1500
								})
							} else {
								wx.showToast({
									title: '复制订单失败',
									icon: 'none',
									duration: 1500
								})
							}
						})
						break;
					default:

				}
				self.$refs['showpopup1'].close();
			},
			// 单选
			selectRadioCheck(item) {
				let {
					list,
					index
				} = item
				if (list.ck) {
					// list.ck = false
					this.tabList[this.tabIndex].getMyOrdersList[index].ck = false
				} else {
					// list.ck = true
					this.tabList[this.tabIndex].getMyOrdersList[index].ck = true
				}
				this.isAllCheck()
			},
			// 检查是否全选
			isAllCheck() {
				if (this.tabList[this.tabIndex].getMyOrdersList.length) {
					this.tabList[this.tabIndex].all_ck = !this.tabList[this.tabIndex].getMyOrdersList.some(item => {
						return JSON.stringify(item.ck) == 'false'
					});
				} else {
					this.tabList[this.tabIndex].all_ck = false;
				}
			},
			// 全选
			allRadio() {
				// 用来存放不是已取消的数据
				let orderList = []
				this.tabList[this.tabIndex].getMyOrdersList.forEach((item, index) => {
					if (item.billStatus != "已取消") {
						orderList.push(item)
					}
				})
				if (this.tabList[this.tabIndex].all_ck) {
					this.tabList[this.tabIndex].all_ck = false;
					orderList.forEach(item => {
						item.ck = false;
					})
				} else {
					this.tabList[this.tabIndex].all_ck = true;
					orderList.forEach(item => {
						item.ck = true;
					})
				}
			},
			// 一键打印功能
			ChangePrint() {
				if (printTimer != null) {
					clearTimeout(printTimer);
				}
				printTimer = setTimeout(() => {
					QRPrinter.getConnectState((ress) => {
						if (ress.state && ress.code == 200) {
							// 连接成功直接打印
							// 先要获取蓝牙的连接状态
							let orderList = ''
							let isCheck = this.tabList[this.tabIndex].getMyOrdersList;
							let cIndex = 0;
							isCheck.forEach((item, index) => {
								if (item.ck == true) {
									if (cIndex == 0) {
										orderList = item.orderBill
									} else {
										orderList += ',' + item.orderBill
									}
									cIndex++
									item.ck = false;
								}
							})
							let _data = {
								orderBill: orderList
							}
							// console.log('_data', _data);
							self.$api.getOrderPrint(_data).then(res => {
								if (res.code == 200 && res.data.length > 0) {
									// 先要获取蓝牙的连接状态
									res.data.forEach((item, index) => {
										let sublist = [];
										sublist.push(item.billCode)
										if (item.pieceNumber > 1 && item.billCodeSub1) {
											let arr = item.billCodeSub1.split(';').filter((
												item) => {
												return item != ''
											})
											sublist = sublist.concat(arr)
										}
										sublist.forEach((subItem, index) => {
											item.billCode = subItem;
											let buffs = tpl_handler(tpl['韵达同城联'],
												item)
											let prints = buffs.join('')
											QRPrinter.sendCmd(prints)
										})
									})
									_data.blPrint = 1
									return this.$api.updateBlPrint(_data)
									this.orderBill = '';
								} else {
									Promise.reject()
								}
							}).then(res => {
								if (res.code == 200) {
									// console.log(res.message)
									self.mescroll.triggerDownScroll();
								} else {
									wx.showToast({
										title: res.message,
										icon: 'none',
										duration: 2000
									})
								}
							})
						}
					}, (err) => {
						console.log(err)
						// 否则进入蓝牙连接的弹窗
						// this.$refs.showpopup.open()
						let _data = {
							printlist: this.tabList[this.tabIndex],
							tabIndex: this.tabIndex
						}
						uni.navigateTo({
							url: '/pages/myPrinter/myPrinter?pageId=ddcx&data=' + JSON.stringify(
								_data)
						})
					})

				}, 500)
			},
			swiperChange(event) {
				let detail = event.detail;
				this.tabIndex = detail.current;
				this.mescroll.triggerDownScroll();
			},
			delOrders(item) {
				let self = this;
				// console.log(item)
				let _data = {
					CancelReason: '用户取消',
					orderBill: item.orderBill
				}
				uni.showModal({
					title: "提示",
					content: "是否确定取消~",
					success: function(res) {
						if (res.confirm) {
							self.$api.cancelOrder(_data).then(res => {
								if (res.code == 200) {
									wx.showToast({
										title: '取消成功~',
										icon: 'none',
										duration: 2000
									})
									self.mescroll.triggerDownScroll()
								}
							})
						}
					}
				})
			},
			cancelList() {
				let self = this;
				if (cancelTimer != null) {
					clearTimeout(cancelTimer);
				}
				cancelTimer = setTimeout(() => {
					let isCheck = this.tabList[this.tabIndex].getMyOrdersList;
					isCheck.forEach((item, index) => {
						if (item.ck == true&&(item.billStatus=='待处理'||item.billStatus=='已分网点'||item.billStatus=='已分业务员'||item.billStatus=='已接单')) {
							let _data = {
								CancelReason: '用户取消',
								orderBill: item.orderBill
							}
							self.$api.cancelOrder(_data).then(res => {
								if (res.code == 200) {
									// wx.showToast({
									// 	title: '取消成功~',
									// 	icon: 'none',
									// 	duration: 2000
									// })
									item.ck = false;
									self.mescroll.triggerDownScroll()
								}else{
									wx.showToast({
										title:'订单号:'+ item.orderBill+',取消失败~',
										icon: 'none',
										duration: 1500
									})
								}
							})
						}
					})
				},500)
				
			},
			// tabsChange(index) {

			// },
			onTabTap(item) {
				this.tabIndex = item.id;
				this.mescroll.triggerDownScroll();
			},
			clickTime(index) {
				this.timeIndex = index;
				switch (index) {
					case 0:
						this.before = this.$momm.getdate();
						this.after = this.$momm.getdate();
						break;
					case 1:
						this.before = this.$momm.getdate(-7);
						this.after = this.$momm.getdate();
						break;
					case 2:
						this.before = this.$momm.getdate(-30);
						this.after = this.$momm.getdate();
						break;
					case 3:
						self.$refs['NavDate'].opencalendar();
						self.timeShow = false;
						break;
					default:
						this.before = this.$momm.getdate(-30);
						this.after = this.$momm.getdate();
				}
			},
			copy(text) {
				let self = this;
				uni.setClipboardData({
					data: text,
					success: function() {
						// console.log('success');
					}
				});
			},
			confirmTime(data) {
				let self = this;
				this.before = data.before;
				this.after = data.after;
				self.isScreen = true;
				self.timeShow = true;
			},
			editOrders(item) {
				// console.log(item)
				let _data = {
					orderBill: item.orderBill,
					operatType: 'edit'
				}
				uni.navigateTo({
					url: '/pages/order/send/index?pageId=ddcx&data=' + JSON.stringify(_data)
				})
			},
			goOrderDetails(item) {
				let _data = {
					type: this.tabIndex == '0' ? 0 : 1,
					billCode: item.billCode,
					item: item,
					isclick: 1
				}
				getApp().globalData.currentIndex = 1;
				uni.navigateTo({
					url: '/pages/order-details/index?pageId=ddcx&data=' + JSON.stringify(_data)
				})
			},
			inputVal(val) {
				let self = this;
				self.expressSearch = val
			},
			//运单搜索
			search() {
				let self = this;
				self.mescroll.triggerDownScroll()
				// self.getMyOrders(obj);
			},
			// getMyOrders(obj){
			// 	let self = this;
			// 	self.$api.getMyOrders(obj).then(res=>{
			// 		console.log(res)
			// 		if(res.code == 200){
			// 			if(self.tabIndex == '0'){
			// 				self.getMyOrdersJJ = res.data.data;
			// 			}else if(self.tabIndex == '1'){
			// 				self.getMyOrdersSJ = res.data.data;
			// 			}
			// 		}
			// 	})
			// },
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				let self = this;
				self.tabList[self.tabIndex].pageNum = 1;
				self.tabList[self.tabIndex].endSuccess = false;
				mescroll.resetUpScroll();
			},
			upCallback(mescroll) {
				let self = this;
				let userData;
				try {
					userData = JSON.parse(self.$getStorageSync('userData'));
				} catch (err) {
					console.log(err)
				}
				let blType;
				if (this.tabIndex == '3') {
					blType = ''
				}else if(this.tabIndex == '2'){
					blType = 2
				} else {
					blType = this.tabIndex == '0' ? 0 : 1
				}
				let obj = {
					billCode: self.expressSearch,
					blType: blType,
					pageNum: self.tabList[this.tabIndex].pageNum,
					pageSize: self.tabList[this.tabIndex].pageSize,
					phone: '',
					openId: this.$getStorageSync('token'),
					startDate: this.before != '' ? this.before + ' 00:00:00' : '',
					endDate: this.after != '' ? this.after + ' 23:59:59' : ''
				};
				if (self.teamModel == '1') {
					if (self.teamInfo.status != '3') {
						obj.groupId = self.teamInfo.groupId;
						obj.openId = self.memberToken;
					} else {
						obj.groupId = self.teamInfo.groupId;
						obj.openId = self.teamInfo.openId;
					}
				}
				// let filter_old = self.tabList[self.tabIndex].getMyOrdersList.filter(item => item.ck)
				this.$api.getMyOrders(obj).then(res => {
					if (res.code == 200) {
						let {
							data
						} = res;
						// console.log(data);
						// 成功隐藏下拉加载状态
						if (self.tabList[self.tabIndex].pageNum == 1) {
							self.tabList[this.tabIndex].getMyOrdersList = [];
							self.tabList[self.tabIndex].pageNum = 1;
						}
						// 从新数组中添加单选状态
						data.data.forEach(item => {
							if (self.tabList[self.tabIndex].all_ck && item.billStatus != "已取消") {
								item.ck = true;
							}else{
								item.ck = false;
							}
						})
						self.tabList[self.tabIndex].total = data.total;
						self.tab[self.tabIndex].total = data.total;
						self.tabList[this.tabIndex].getMyOrdersList = self.tabList[this.tabIndex].getMyOrdersList
							.concat(...data.data);
						self.tabList[self.tabIndex].pageNum++;
						if (data.data.length < self.tabList[self.tabIndex].pageSize) {
							self.tabList[self.tabIndex].endSuccess = true;
						}
						self.mescroll.endByPage(data.data.length, data.total);
					} else {
						self.mescroll.endErr();
					}
					self.isAllCheck();
				}).catch(() => {
					//联网失败, 结束加载
					self.mescroll.endErr();
				});
			},
			getOrderData() {
				let self = this;
				let obj = {
					billCode: '',
					blType: this.tabIndex == '0' ? 0 : 1,
					pageNum: self.tabList[this.tabIndex].pageNum,
					pageSize: self.tabList[this.tabIndex].pageSize,
				};
				// self.getMyOrders(obj);
				//   this.$api.getMyOrders(obj).then(res=>{
				// 		console.log(res)
				// 	if(res.code == 200){
				// 		if(self.tabIndex == '0'){
				// 			self.getMyOrdersJJ = res.data.rows;
				// 		}else if(self.tabIndex == '1'){
				// 			self.getMyOrdersSJ = res.data.rows;
				// 		}
				// 	}
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.inquire {
		width: 100%;
		height: 100%;
		overflow: hidden;
		box-sizing: border-box;
		background-color: $ztd-color-bgcolor;

		.top-search {
			width: 100%;
			background-color: $ztd-bg-bg;
			padding: 20rpx;

			.search-box {
				height: 90rpx;
			}
		}

		.main {
			height: calc(100% - 160rpx);
			width: 100%;

			.main-nav {
				height: 180rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;

				.nav-item {
					width: calc(50% - 10rpx);
					height: 100%;
					background-color: $ztd-color-white;
					border-radius: 6rpx;
					display: flex;
					align-items: center;

					.imgBox {
						width: 100rpx;
						height: 100rpx;
						padding: 25rpx;
						margin: 20rpx;
						border-radius: 50%;
						background-color: $ztd-color-primary;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						font-size: 30rpx;
						font-weight: bold;
						color: #666;
					}
				}
			}

			.main-tabs {
				position: relative;
				height: 100%;
				width: 100%;

				.tabs-nav {
					display: flex;
					width: 100%;
					justify-content: space-between;
					align-items: center;
					background-color: #fff;

					.tabs-title {
						flex: 1;
						// height: 100%;
						// display: flex;
						// align-items: center;
						// justify-content: center;
						// font-size: 28rpx;
					}

					// .tabs-title.linesel {
					// 	border-bottom: 2rpx solid $ztd-color-primary;
					// 	color: $ztd-color-primary;
					// }
					.screen {
						width: 140rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						text {
							font-size: 26rpx;
							color: #999;
							margin-right: 10rpx;
						}

						text.isScreen {
							color: #FDD605;
						}

						.iconfont {
							font-size: 26rpx;
						}
					}

				}

				.screen-c {
					position: absolute;
					top: 80rpx;
					left: 0;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, .2);
					z-index: 9999;

					.screen-input {
						padding-left: 5rpx;
						width: 60%;
						height: 60rpx;
						border: 2rpx solid #eaebed;
						margin-bottom: 8rpx;
					}

					.con {
						padding: 20rpx 30rpx;
						background-color: $ztd-color-white;

						.ti {
							color: #000;
							font-size: 26rpx;
							font-weight: bold;
						}

						.box {
							width: 100%;
							padding: 16rpx 0 0 0;
							display: flex;
							align-items: center;
							justify-content: flex-start;
							flex-wrap: wrap;

							.item {
								width: 22%;
								margin-right: 20rpx;
								height: 56rpx;
								border: 2rpx solid $ztd-color-line;
								line-height: 56rpx;
								border-radius: 28rpx;
								text-align: center;
								font-size: 28rpx;
								margin-bottom: 20rpx;
							}

							.item:nth-child(4n) {
								margin-right: 0;
							}

							.item.is {
								background-color: $ztd-color-primary;
								color: $ztd-color-white;
								border: 2rpx solid $ztd-color-primary;
							}

							.item:last-child {
								margin-right: 0;
							}
							.text-info {
								width: 60%;
								padding: 6rpx 0;
								display: flex;
								justify-content: space-between;
								align-items: center;
								.iconfont{
									font-size: 28rpx;
								}
							}
							.member-btn {
								background-color: #FDD605;
								color: #fff;
								display: inline-block;
								width: 130rpx;
								height: 50rpx;
								line-height: 50rpx;
								text-align: center;
								font-size: 28rpx;
								border-radius: 25rpx;
							}
						}

						.timeSelection {
							text-align: center;
							font-size: 30rpx;
							padding: 10rpx 0;

							text {
								margin: 0 6rpx;
								font-size: 30rpx;
							}
						}

						.submit {
							background-color: $ztd-color-white;
							width: 100%;
							height: 100rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding: 10rpx 20rpx 0;

							&-button {
								// width:500rpx;
								width: 48%;
								height: 80rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border-radius: 40rpx;
								border: 2rpx solid $ztd-color-primary;
								color: $ztd-color-white;
								background-color: $ztd-color-primary;
								font-size: 28rpx;
							}

							&-button.refresh {
								border: 2rpx solid $ztd-color-primary;
								color: $ztd-color-primary;
								background-color: $ztd-color-white;
							}
						}
					}
				}

				.customize {
					z-index: 99;
				}

				.tabs-content {
					height: calc(100% - 190rpx);
					width: 100%;
					padding: 20rpx;

					.item {
						background-color: $ztd-color-white;
						width: 100%;
						height: auto;
						padding: 20rpx 20rpx 8rpx;
						color: #666;
						margin-bottom: 20rpx;
						border-radius: 8rpx;

						.item-radio {
							display: flex;
							align-items: center;

							.copy {
								width: 36rpx;
								height: 36rpx;
								margin-left: 10rpx;
							}
						}

						.item-info {
							width: 100%;
							display: flex;
							align-items: center;
							padding: 10rpx 0;

							.info-l,
							.info-r,
							.info-c {
								flex: 1;
								height: 100rpx;
								display: flex;
								align-items: center;
								flex-wrap: wrap;
							}

							.info-l,
							.info-r {
								.oiconbox {
									margin-right: 20rpx;

									.jj {
										background-color: $ztd-color-primary;
									}

									.sj {
										background-color: $ztd-color-block;
									}
								}

								.text-c {
									flex: 1;
									text-align: center;
								}

								.city {
									font-size: 30rpx;
									color: #000;
									font-weight: bold;
									margin-bottom: 10rpx;
								}

								.name {
									font-size: 24rpx;
									color: #666;
								}
							}

							.info-c {
								justify-content: center;
								flex-direction: column;
								padding: 0 20rpx;

								.line {
									background-color: $ztd-color-primary;
									width: 100%;
									height: 2rpx;
									margin: 10rpx 0;
								}
							}
						}

						.item-trail {
							margin-top: 5rpx;
							font-size: 24rpx;
							color: #666;
							line-height: 1.6;
						}

						.botBtn {
							display: flex;
							justify-content: space-between;
							align-items: center;
							border-top: 2rpx solid #efefef;
							height: 60rpx;
							font-size: 26rpx;

							.billTime {
								color: #666;

								.operate {
									width: 50rpx;
									height: 50rpx;
								}

								>text {
									color: #999;
								}
							}

							.btn_list {
								text {
									padding: 0 18rpx;
									color: #999;
									border: 2rpx solid $ztd-color-line;
									border-radius: 20rpx;
								}

								text.courierBtn {
									margin-right: 6rpx;
									border-color: #00ACEE;
									color: #00ACEE;
								}

								text.editBtn {
									margin-right: 6rpx;
									border-color: $ztd-color-primary;
									color: $ztd-color-primary;
								}
							}
						}

					}
				}

				.bottom {
					position: fixed;
					bottom: 0;
					left: 0;
					z-index: 99;
					width: 100%;
					height: 90rpx;
					display: flex;
					align-items: center;
					background-color: $ztd-color-white;
					padding: 0 20rpx;

					.all {
						display: flex;
						align-items: center;
					}

					.selected {
						display: flex;
						flex: 1;
						justify-content: center;
						align-items: center;
					}
					.btns-list{
						height: 60rpx;
						width: 160rpx;
						line-height: 60rpx;
						border-radius: 30rpx;
						background-color: $ztd-color-primary;
						color: $ztd-color-block;
						text-align: center;
						font-size: 28rpx;
						margin-left: 20rpx;
					}
					.btns-list.cancel{
						background-color:$ztd-color-block;
						color: #fff;
					}
				}
			}
		}

	}
</style>
