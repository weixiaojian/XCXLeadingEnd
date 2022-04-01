<template>
	<view class="waybill" @click="bindBody">
		<!-- 搜索加列表切换 -->
		<view class="waybill-header">
			<view class="waybill-header-search">
				<InputSearch :isLeft="false" :isRight="true" :itype="'text'" :placeholder="'搜索运单号、收件人手机号、姓名'" :boxStyle="boxStyle"
					v-model="expressSearch" @input="inputVal" @touchRight="search" @confirm ="confirm_search"></InputSearch>
			</view>		
		</view>
		<view class="main-view">
			<view class="tab-wraper">
				<!-- tab切换 -->
				<scroll-view-tab 
					class="tabs-title" 
					:tabItemLeft="'35rpx'" 
					:tabItemWidth="'20%'" 
					:tabBars="statusScreen" 
					@onTabTap="onTabTap" 
					:tabIndexInit="tabIndex" 
					:pageId="'yundan'"></scroll-view-tab>
				<view class="screen" @click.stop="getFilterData">
					<text>筛选</text>
					<i class="iconfont hicon" v-html="'&#xe659;'"></i>
				</view>
				<view class="screen-c" v-if="isScreen" @click="onScreen">
					<view class="con" @click.stop="">
						<!-- <view class="ti">
							状态筛选
						</view>
						<view class="box">
							<text class="item " :class="item.id==statusIndex? 'is':''" v-for="(item,index) in statusScreen"  :key="index"  @click.stop="clickTime(index,'status')">{{item.name}}</text>
						</view> -->
						<view class="ti">
							时间筛选
						</view>
						<view class="box">
							<text class="item " :class="item.id==timeIndex? 'is':''" v-for="(item,index) in timeScreen"  :key="index"  @click.stop="clickTime(index,'time')">{{item.name}}</text>
						</view>
			<!-- 			<view class="customize" v-if="timeIndex==3">
							自定义时间:{{before}}至{{after}}
						</view> -->
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
			<!-- 列表 -->
			<mescroll-uni :top="220" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit" :down="downOption">
				<view class="tabs-content">
					<view class="item" @click="goOrderDetails(item)"
						v-for="(item,index) in tabList[tabIndex].getMyOrdersList" :key="index">
						<view class="billCode">
							运单号：{{item.billCode||'无'}}
							<image @click.stop="copy(item.billCode)" class="copy" src="../../../static/img/copy.png" mode=""></image>
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
						<view class="item-trail" v-if="item.settlementWeight!=null">称重重量:{{item.settlementWeight}}</view>
						<view class="botBtn">
							<view class="billTime">订单录入时间: <text>{{item.registerDate}}</text></view>
							<view class="btn_list"
								v-if="item.billStatus=='已分网点'||item.billStatus=='已分业务员'">
								<!-- <text class="editBtn" v-if="tabIndex==0" @click.stop="editOrders(item)">修改</text> -->
								<!-- <text class="delBtn" v-if="tabIndex==0" @click.stop="delOrders(item)">取消</text> -->
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
	<!-- 日期 -->
	<NavDate 
	   :startDate="startDate" 
	   :endDate='endDate' 
	   :before="before" 
	   :after="after" 
	   @confirm="confirm"
	   ref="NavDate"
	></NavDate>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 列表数据
				tab: [{
						name: '我寄的',
						id: 0,
						total:0
					},
					{
						name: '我收的',
						id: 1,
						total:0
					},
				],
				
				// 列表数据渲染
				tabList: [
					{
						name: '全部',
						id: 0,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck:false,
						total: 0,
						isSelectTime:false
					},
					{
						name: '已揽收',
						id: 1,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck:false,
						total: 0,
						isSelectTime:false
					},
					{
						name: '在途',
						id: 1,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck:false,
						total: 0,
						isSelectTime:false
					},
					{
						name: '已派件',
						id: 1,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck:false,
						total: 0,
						isSelectTime:false
					},
					{
						name: '已签收',
						id: 1,
						pageNum: 1,
						pageSize: 15,
						getMyOrdersList: [],
						endSuccess: false,
						all_ck:false,
						total: 0,
						isSelectTime:false
					}
				],
				tabIndex: 0,
				expressSearch: '',
				boxStyle: {
					"border-radius": "50rpx",
				},
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
						tip: '~ 暂无运单 ~' // 提示
					}
				},
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, 
				},
				timeIndex:3,
				timeScreen:[{
					name:'全部',
					id:0,
					time:''
				},{
					name:'今天',
					id:1,
					time:''
				},{
					name:'近7天',
					id:2,
					time:''
				},{
					name:'近30天',
					id:3,
					time:''
				}
				// ,{
				// 	name:'自定义',
				// 	id:3,
				// 	time:''
				// }
				],
				statusIndex:0,
				statusScreen:[{
					name:'全部',
					id:0,
					status:''
				},{
					name:'已揽收',
					id:1,
					status:'已揽收'
				},{
					name:'在途',
					id:2,
					status:'在途'
				},{
					name:'已派件',
					id:3,
					status:'已派件'
				},{
					name:'已签收',
					id:4,
					status:'已签收'
				}],
				isScreen:false,
				endDate:'',
				startDate:'',
				before:'',
				after:'',
				statusVue:'',
				teamInfo: {},
				teamModel:'',
			}
		},
		onShow() {
			let self = this;
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
			let token = this.$getStorageSync('token')
			if(token){
				self.getWxGroupByOpenId()
			}
			let teamInfo = self.$getStorageSync('teamInfo')
			if(teamInfo){
				self.teamInfo = teamInfo
			}
			self.teamModel = self.$getStorageSync('teamModel')=='1'?'1':'2';
			wx.setNavigationBarTitle({
				title: `我的运单${self.$getStorageSync('teamModel')==='1'?'（团队）':''}`,
			})
			this.mescroll.triggerDownScroll();
		},
		onLoad(){
			
			this.initDate()
		},
		
		methods: {
			confirm_search(){
					let self = this;
					self.mescroll.triggerDownScroll()
			},
			// 列表切换
			onTabTap(item) {
				console.log(item);
				let self = this;
				this.tabIndex = item.id
				this.statusIndex = item.id
				self.statusVue = item.status;
				if(self.tabList[self.tabIndex].isSelectTime){
					self.tabList[self.tabIndex].pageNum = 1;
					self.tabList[self.tabIndex].endSuccess = false;
					self.mescroll.endByPage(15,self.tabList[self.tabIndex].total);
					self.mescroll.triggerDownScroll();
				}
				this.mescroll.triggerDownScroll();
			},
			bindBody(){
				let self = this;
				if(self.isScreen){
					self.confirmFilter()
					self.isScreen = false;
				}
			},
			// 自定义时间确认
			confirm(data){
				let self = this;
				self.tabList[self.tabIndex].endSuccess = true;
				this.before = data.before;
				this.after = data.after;
				self.setSelectTime();
				self.isScreen = true
			},
			onScreen(){
				let self = this;
			},
			confirmFilter(){
				let self = this;
				self.tabList[self.tabIndex].pageNum = 1;
				self.tabList[self.tabIndex].getMyOrdersList = [];
				switch(self.timeIndex) {
				  case 0:
						this.before = '';
						this.after = '';
						break;
					case 1:
					  this.before = this.$momm.getdate();
					  this.after = this.$momm.getdate();
						break;
					case 2:
						this.before = this.$momm.getdate(-7);
						this.after = this.$momm.getdate();
						break;
					case 3:
						 this.before = this.$momm.getdate(-30);
						 this.after = this.$momm.getdate();
						 break;
				 default:
						this.before = this.$momm.getdate(-30);
						this.after = this.$momm.getdate();
				}
				self.statusVue = self.statusScreen[self.statusIndex].status;
				console.log('status',self.statusScreen[self.statusIndex].status)
				self.isScreen = false;
				self.mescroll.triggerDownScroll();
			},
			refreshFilter(){
				let self = this;
				self.statusVue = '';
				self.statusIndex =0;
				self.timeIndex = 3;
				self.before = this.$momm.getdate(-30);
				self.after = this.$momm.getdate();
			},
			getWxGroupByOpenId(){
				let self = this;
				self.$api.getWxGroupByOpenId().then(res =>{
					console.log('res',res)
					if(res.code ==200&&res.data!=null){
						self.$setStorageSync('teamInfo',res.data)
						self.teamInfo = res.data
					}else{
						self.$setStorageSync('teamInfo','')
					}
				})
			},
			setSelectTime(){
				let self = this;
				self.tabList.forEach(item=>{
					item.isSelectTime = true
				})
			},
			copy(text) {
				let self = this;
				uni.setClipboardData({
					data: text,
					success: function() {
						console.log('success');
					}
				});
			},
			// 时间选择
			selectTime(){
			},
			//筛选
			getFilterData(){
				this.isScreen = true
			},
			initDate(){
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
			// 跳转轨迹 
			goOrderDetails(item) {
				let _data = {
					type: this.tabIndex,
					billCode: item.billCode,
					item: item
				}
				uni.navigateTo({
					url: '/pages/order-details/index?pageId=ddcx&data=' + JSON.stringify(_data)
				})
			},
			clickTime(index,type){
				let self = this;
				console.log(type)
				if(type == 'time'){
					this.timeIndex = index;
			 
					// if(index ==3){
					// 	self.$refs['NavDate'].opencalendar();
					// 	self.isScreen = false
					// }
				}else{
					this.statusIndex = index;
				}
			},
			// 修改
			editOrders(item) {
				console.log(item)
				let _data = {
					orderBill: item.orderBillCode
				}
				uni.navigateTo({
					url: '/pages/order/send/index?pageId=ddcx&data=' + JSON.stringify(_data)
				})
			},
			
			// 取消	
			// delOrders(item) {
			// 	let self = this;
			// 	console.log(item)
			// 	let _data = {
			// 		CancelReason: '用户取消',
			// 		orderBill: item.orderBillCode
			// 	}
			// 	uni.showModal({
			// 		title: "提示",
			// 		content: "是否确定取消~",
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				self.$api.cancelOrder(_data).then(res => {
			// 					if (res.code == 200) {
			// 						wx.showToast({
			// 							title: '取消成功~',
			// 							icon: 'none',
			// 							duration: 2000
			// 						})
			// 						setTimeout(() => {
			// 							self.mescroll.triggerDownScroll()
			// 						}, 2000);
			// 					}
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			
			inputVal(val) {
				this.$nextTick(function() {
					this.expressSearch = val
				})
			},
			
			//运单搜索
			search() {
				let self = this;
				self.mescroll.triggerDownScroll()
			},
			
			// 列表
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			
			// 上拉加载
			downCallback(mescroll) {
				this.tabList[this.tabIndex].pageNum = 1;
				this.tabList[this.tabIndex].endSuccess = false;
				mescroll.resetUpScroll();
			},
			
			upCallback(mescroll) {
				let self = this;
				let userData = JSON.parse(this.$getStorageSync('userData'))
				console.log(this.before)
				console.log(this.after)
				
				let obj = {
					pageNum: this.tabList[this.tabIndex].pageNum,
					pageSize: this.tabList[this.tabIndex].pageSize,
					billCode: this.expressSearch,
					billStatus: this.statusVue,
					// openId:this.tabIndex==0?userData.openId:userData.phone,
					openId:this.$getStorageSync('token'),
					startDate:this.before!=''? this.before +' 00:00:00':'',
					endDate:this.after!=''? this.after +' 23:59:59':''
				}
				if(self.teamModel =='1'){
					if(self.teamInfo.status !='3'){
						// 管理员
						obj.groupId = self.teamInfo.groupId;
						obj.openId = ''
					}else{
						// 普通用户
						obj.groupId = self.teamInfo.groupId;
						obj.openId = self.teamInfo.openId;
					}
				}
				this.$api.getMyWyBill(obj).then(res => {
					if(res.code == 200) {
						let {
							data
						} = res;
						console.log(data);
						// 成功隐藏下拉加载状态
						if (this.tabList[this.tabIndex].pageNum == 1) {
							this.tabList[this.tabIndex].getMyOrdersList = [];
							this.tabList[this.tabIndex].pageNum = 1;
						}
						this.tabList[this.tabIndex].total = data.total;	// 总条数
						// this.tab[this.tabIndex].total = data.total;
						// 数据拼接
						this.tabList[this.tabIndex].getMyOrdersList = this.tabList[this.tabIndex].getMyOrdersList
							.concat(...data.data);
							
							console.log(111, this.tabList[this.tabIndex].getMyOrdersList);
							
						this.tabList[this.tabIndex].pageNum++;
						if (data.data.length < this.tabList[this.tabIndex].pageSize) {
							this.tabList[this.tabIndex].endSuccess = true;
						}
						self.mescroll.endByPage(data.data.length,data.total);
					} else {
						this.mescroll.endErr();
					}
				}).catch(() => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.waybill {
		height: 100%;
		width: 100%;
		background-color: $ztd-color-bgcolor;
		.copy {
			width: 36rpx;
			height: 36rpx;
			margin-left: 10rpx;
		}
		&-header {
			width: 100%;
			height: 100rpx;
			background-color: $ztd-bg-bg;
			&-search {
				height: 90rpx;
				margin: 20rpx;
			}
		}
		.main-view{
			position: relative;
			width: 100%;
			height: calc(100% - 100rpx);
			.tab-wraper{
				display: flex;
				width: 100%;
				justify-content: space-between;
				align-items: center;
				background-color: #fff;
				.tabs-title{
					flex: 1;
				}
				.screen{
					width: 140rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					text{
						font-size: 26rpx;
						color: #999;
						margin-right: 10rpx;
					}
					.iconfont{
						font-size: 26rpx;
					}
				}
				
			}
			.screen-c{
				position: absolute;
				top: 80rpx;
				left: 0;
				width: 100%;
				height: calc(100% - 100rpx);
				background-color:rgba(0,0,0,.2);
				z-index: 9999;
				.con{
					padding: 20rpx 30rpx;
					background-color:$ztd-color-white;
					.ti{
						color: #000;
						font-size: 26rpx;
						font-weight: bold;
					}
					.box{
						width: 100%;
						padding: 16rpx 0 0 0;
						display: flex;
						align-items: center;
						justify-content:flex-start;
						flex-wrap: wrap;
						.item{
							width: 22%;
							margin-right: 20rpx;
							height:56rpx;
							border: 2rpx solid $ztd-color-line;
							line-height: 56rpx;
							border-radius: 28rpx;
							text-align: center;
							font-size: 28rpx;
							margin-bottom: 20rpx;
						}
						.item:nth-child(4n){
							margin-right:0;
						}
						.item.is{
							background-color:$ztd-color-primary;
							color:$ztd-color-white;
							border: 2rpx solid $ztd-color-primary;
						}
						.item:last-child{
							margin-right: 0;
						}
					}
					.submit{
						background-color: $ztd-color-white;
						width: 100%;
						height: 100rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 10rpx 20rpx 0;
						
						&-button{
							// width:500rpx;
							width: 48%;
							height: 80rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-radius:40rpx;
							border: 2rpx solid $ztd-color-primary;
							color:$ztd-color-white ;
							background-color:$ztd-color-primary ;
							font-size:28rpx;
						}
						&-button.refresh{
							border: 2rpx solid $ztd-color-primary;
							color:$ztd-color-primary;
							background-color:$ztd-color-white;
						}
					}
				}
			}
		}
		
		// 切换更改
		.tabs-content {
			height: calc(100% - 100rpx);
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
				.billCode{
					display: flex;
					align-items: center;
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
	}
</style>
