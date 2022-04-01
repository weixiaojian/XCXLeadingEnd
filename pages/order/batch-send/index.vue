<template>
	<view class="batch-send">
				<TabLists>
				<view class="user-info">
					<view class="user-info-row" @tap.stop.prevent="newaddress('jjr', index)">
						<view class="oiconbox">
							<text class="oicon jj">寄</text>
						</view>
						<view class="botline">
							<view class="send infobox"  v-if="addressDataJJ.name">
								<view class="instructions">
									<view class="name boxWe">
										{{ addressDataJJ.name }} <text class="boxions"> {{ addressDataJJ.phone}} </text>
									</view>
								</view>
								<view class="instructions">
									<view class="name">
										{{ addressDataJJ.provice }}{{ addressDataJJ.city }}
										{{ addressDataJJ.country }}{{ addressDataJJ.townName||'' }}{{ addressDataJJ.detailAddress }}
									</view>
								</view>
							</view>
							<view class="send infobox" v-else>
								<view class="instructions">
									<view class="name boxWe">从哪里寄</view>
								</view>
								<view class="instructions">
									<view class="name">请选择寄件地址</view>
								</view>
							</view>
							<view class="addreIcon" @tap.stop="myaddress(0)">
								<i class="iconfont" v-html="'&#xe65a;'"></i>
								<view class="text">
									地址簿
								</view>
							</view>
						</view>
					</view>
				</view>
				</TabLists>
				<!-- 收件地址 - 多条 -->
				<scroll-view scroll-y="true">
					<block>
						<view class="orderRec" v-for="(item, index) in addressDataSJ" :key="index">
							<!-- 收件信息 -->
							<view class="orderRec-message">
								<view class="orderRec-message-detail">
									<view class="orderRec-message-detail-shou">收</view>
									<view class="orderRec-message-detail-meg" @click="newaddress('sjr', index)">
										<view class="orderRec-message-detail-meg-title">
											<view class="XP">{{item.address.name }}<text>{{item.address.phone}}</text></view>
											<image class="icon" src="/static/img/detele.png" @click.stop="detele(item, index)"></image>
										</view>
										<view class="orderRec-message-detail-meg-address" >
											{{item.address.provice}}{{item.address.city||''}}{{item.address.country||''}}{{item.address.detailAddress}}
										</view>
									</view>
								</view>
							</view>
							<!-- 物品信息 -->
							<view class="orderRec-shop" @click.stop="getGoodsInfo(index,'wpxx')">
								<view style="flex: 2;">
									<text v-if="item.goodsInfo.goodsName">{{item.goodsInfo.goodsName }},</text>
									<text v-if="item.goodsInfo.goodsWeight">{{item.goodsInfo.goodsWeight }}公斤,</text>
									<text v-if="item.goodsInfo.packingPiece">{{item.goodsInfo.packingPiece}}件,</text>
									<text v-if="item.goodsInfo.remark">{{ item.goodsInfo.remark }}</text>
								</view>
								<view class="orderRec-shop-forward">
									<image src="/static/img/you.png"></image>
								</view>
								<view class="errorTips uni-ellipsis-2"  v-if="item.errMsg">
									{{item.errMsg||''}}
								</view>
							</view>
						</view>
					</block>
					<!-- 新增收件人 -->
					<view class="addRecives">
						<i class="iconfont hicon" v-html="'&#xe643;'" ></i>
						<text class="add" @tap.stop="myaddress(1)">增加收件人</text>
					</view>
					<!-- 支付方式 -->
					<view class="orderRec-row" >
						<view class="name">付款方式:</view>
						<view class="content">
							<picker  @change="bindPickerChange" :disabled="payment_type=='月结'" style="font-size: 28rpx;" mode = selector :range="mockList" range-key="name">
								<view class="text">
									{{payment_type||'请选择'}}
								</view>
							</picker>
							<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
						</view>
					</view>
				</scroll-view>
			<!-- 下单按钮 -->
			<view class="batch-send-button">
				<view class="wraper-cks">
					<checkbox-group @change="checkboxChange" class="checkbox-group">
						<checkbox value="agree" :checked="agree" style="transform:scale(0.7)" color="#FDD605" />
						<view class="text">
							我已同意接受 <text class="booking" @click="goRead">《运单寄件承诺》</text>
						</view>
					</checkbox-group>
				</view>
				<view class="ButtonBox">
					<ButtonBox :title="'下单'" :buttonBgColor="disable?'#ddd':''"  :radius="'35rpx'" height="70rpx" width="700rpx" @hanldChange="submit">
					</ButtonBox>
				</view>
			</view>
			<uni-popup ref="showpopup1" :type="'center'">
				<Agreement @Cancel="cancel" @confirmAgreement="confirmAgreement" ref="agreement"></Agreement>
			</uni-popup>
	</view>
</template>

<script>
	import Agreement from "../components/agreement/index.vue";  //快递服务协议
	let timer = null;
	export default {
		data() {
			return {
				addressDataJJ:{},
				addressDataSJ:[],
				addressDataSJCopy:[],
				editRecIndex:0,
				freight:'',
				agree:true,
				pageId:'',
				realName:false,
				optionType:'',
				newaddressId:'',
				tabIndex:0,
				specEmployee:'',
				specEmployeeCode:'',
				payment_type:'现金',
				mockList:this.$Mock.payment_type,
				teamModel:'',
				userData:{},
				disable:false,
			}
		},
		mounted() {
			let self = this;
			// 地址蒲选择
			uni.$on('selectAddress',address =>{
				console.log(self.addressDataSJ)
				if(this.tabIndex == '0'){
					this.addressDataJJ = address;
					this.blurValue();
				}else if(this.tabIndex =='1'){
					 let _data = address
					 // self.addressDataSJ = [];
					 _data.forEach(item =>{
						 let obj = {}
						 obj.address = item
						 obj.goodsInfo = {
							goodsWeight :1,
							goodsName : '其他类型',
							goodsType:'',
							packingPiece :1,
							remark : '',
							goodsPayment :'现金',
						}
						self.addressDataSJ.push(obj)
					 })
				}
			});
			//包裹信息
			uni.$on('packageinfo',info =>{
				if(info.allSelect){
					console.log('info',info.allSelect)
					this.addressDataSJ.forEach(item =>{
						item.goodsInfo.goodsWeight = info.goodsWeight
						item.goodsInfo.goodsName = info.goodsName
						item.goodsInfo.goodsType = info.goodsType
						item.goodsInfo.packingPiece = info.packingPiece
						item.goodsInfo.remark = info.remark
					})
				}else{
					this.addressDataSJ[this.editRecIndex].goodsInfo.goodsWeight = info.goodsWeight
					this.addressDataSJ[this.editRecIndex].goodsInfo.goodsName = info.goodsName
					this.addressDataSJ[this.editRecIndex].goodsInfo.goodsType = info.goodsType
					this.addressDataSJ[this.editRecIndex].goodsInfo.packingPiece = info.packingPiece
					this.addressDataSJ[this.editRecIndex].goodsInfo.remark = info.remark
				}
			});
			uni.$on('inputAddress',address =>{
				if(this.newaddressId == 'jjr'){
					self.addressDataJJ = address;
				}else if(this.newaddressId =='sjr'){
					self.addressDataSJ[this.editRecIndex].address = address
				}
			});
			this.echoOrderData()
			this.$nextTick(function(){
				console.log(this.userData.customerCode)
				if(this.teamModel!='1'&&this.userData.customerCode){
					this.payment_type = '月结'
				}
			})
		},
		components:{
			Agreement,
		},
		beforeDestroy() {
			//缓存页面数
			this.setStorageData();
		},
		onShow(){
			let self = this;
			// 如果寄件电话存在则调用
			if(this.addressDataJJ.phone){
				self.blurValue();
			}
			
			let sendsOrder;
			 try{
				sendsOrder =JSON.parse(this.$getStorageSync('sendsOrder'));
			}catch(err){
				console.log(err)
			}
			let tempFlog;
			tempFlog=sendsOrder?Object.keys(sendsOrder.addressDataJJ).length==0:true;
			if(Object.keys(this.addressDataJJ).length==0&&tempFlog){
				self.getAddressDefault()
			}
		},
		onLoad(){
			let self = this;
			let userData = self.$getStorageSync('userData')
			if(typeof(userData) == "undefined"){
				uni.showModal({
					title:"提示",
					content:"请先登录授权~",
					success:function(res) {
						if(res.confirm) {
							uni.switchTab({
								url:"/pages/tabbar/my/index?pageId=send"
							})
						}
					}
				})
				return false;
			}
			try{
				this.userData = JSON.parse(userData)
			}catch(err){
				console.log(err)
			}
			self.teamModel = self.$getStorageSync('teamModel')=='1'?'1':'2';
			wx.setNavigationBarTitle({
				title: `下单寄件${self.$getStorageSync('teamModel')==='1'?'（团队）':''}`,
			})
			self.setTeamInfo()
		},
		onUnload(){
			uni.$off('selectAddress');  //关闭监听
			uni.$off('packageinfo');  //关闭监听
			uni.$off('addedservices');  //关闭监听
			uni.$off('inputAddress');  //关闭监听
		},
		onHide(){
			//缓存页面数
			this.setStorageData();
		},
		methods: {
			setTeamInfo(){
				let self = this;
				let teamInfo = self.$getStorageSync('teamInfo');
				console.log('teamInfo',teamInfo)
				let isTeam = teamInfo?teamInfo.groupId:false;
				if(self.teamModel!='1'&&!self.userData.customerCode){
					if(isTeam){
						uni.showModal({
							title:"提示",
							content:"请选择团队模式下单",
							success:function(res) {
								if(res.confirm) {
									uni.switchTab({
										url:"/pages/tabbar/home/index?pageId=send"
									})
								}else if(res.cancel){
									self.disable = true
								}
							}
						})
						return false
					}else{
						uni.showModal({
							title:"提示",
							content:"是否有合作网点，如有请绑定月结客户编码再下单。",
							success:function(res) {
								if(res.confirm) {
									uni.navigateTo({
										url:"/pages/bind-monthly/index?pageId=send"
									})
								}else if(res.cancel){
									
								}
							}
						})
						return false
					}
				}
			},
			// 批量寄件物品信息
			getGoodsInfo(index,type){
				this.editRecIndex = index;
				let data = {}
				data.type = type
				if(type =='wpxx'){
					data.item = {
						goodsName: this.addressDataSJ[this.editRecIndex].goodsInfo.goodsName,
						remark: this.addressDataSJ[this.editRecIndex].goodsInfo.remark,
						goodsWeight:this.addressDataSJ[this.editRecIndex].goodsInfo.goodsWeight,
						packingPiece:this.addressDataSJ[this.editRecIndex].goodsInfo.packingPiece,
						goodsType: this.addressDataSJ[this.editRecIndex].goodsInfo.goodsType,
					}
					uni.navigateTo({
						url:"/pages/order/packageinfo/index?pageId=sends&data=" + JSON.stringify(data)
					})
				}
			},
			// 移除每一项
			detele(item, index) {
				uni.showModal({
					title: '移除提示',
					content: '您确定要移除' + item.address.name + '的信息？',
					success: (res) => {
						if (res.confirm) {
							this.addressDataSJ.splice(index, 1);
						}
					}
				})
			},
			goRead() {
				this.$refs['showpopup1'].open();
			},
			confirmAgreement() {
				let self = this;
				self.$refs['showpopup1'].close();
				self.agree = true;
			},
			blurValue(){
				let self = this;
				let phone = this.addressDataJJ?this.addressDataJJ.phone:false
				if(phone){
					let data = {phone:this.addressDataJJ.phone};
					self.$getByPhone(data).then(res=>{
						console.log(res)
						self.realName = res;
						self.hasTips =!res;
					});
				}
			},
			// 付款方式
			bindPickerChange(e) {
				let val = e.detail.value;
				this.payment_type = this.$Mock.payment_type[val].name;
				console.log(this.payment_type);
			},
			//实名认证
			realnameMethod(){
				let data = {phone:this.addressDataJJ.phone};
				uni.navigateTo({
					url:"/pages/myrealname/index?data="+ JSON.stringify(data)
				})
			},
			getAddressDefault(){
				let self = this;
				self.$api.getAddressDefault().then(res => {
					if(res.code ==200&&res.data!=null){
						self.addressDataJJ =res.data
					}
				})
			},
			checkboxChange(e){
				this.agree = e.detail.value=='agree'?true:false;
				console.log(this.agree)
			},
			deleteRec(index){
				let self = this;
				self.addressDataSJ.splice(index, 1);
			},
			newaddress(obj){
				let data = {type:'sends'}
				this.newaddressId = obj.pageId
				if(obj.pageId == 'jjr'){
					data.item = this.addressDataJJ
				}else if(obj.pageId == 'sjr'){
					data.item = this.addressDataSJ[obj.index].address
					this.editRecIndex = obj.index
				}
				uni.navigateTo({
					url:"/pages/newaddress/index?pageId="+obj.pageId+"&data=" + JSON.stringify(data)
				})
			},
			submit(){
				let self = this;
				if(self.disable){return;}
				let teamInfo = this.$getStorageSync('teamInfo')
				if (JSON.stringify(this.addressDataJJ) == '{}') {
					uni.showToast({
						icon: "none",
						title: "请填写寄件人信息"
					});
					return;
				};
				if (!this.addressDataSJ.length) {
					uni.showToast({
						icon: 'none',
						title: '收件信息请补充',
						duration: 1500
					})
					return
				}
				if (!this.agree) {
					uni.showToast({
						icon: "none",
						title: "请勾选快递协议"
					});
					return;
				};
				if(timer != null){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					// 对象合并到另一个对象中
					let _data={};
					let list = [];
					for(let i=0;i<this.addressDataSJ.length;i++) {
						if (this.addressDataSJ[i].address.name == '' || this.addressDataSJ[i].address.name == undefined || this.addressDataSJ[i].address.name == null) {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个收件人信息",
								duration:2000
							});
							return;
						};
						if (this.addressDataSJ[i].goodsWeight == '') {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个重量信息",
								duration:2000
							});
							return;
						};
						if (this.addressDataSJ[i].goodsName == '') {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个物品名称",
								duration:2000
							});
							return;
						};
						if (this.addressDataSJ[i].packingPiece == '') {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个数量",
								duration:2000
							});
							return;
						};
						_data = {
							sendCountry: "中国", // 寄件国家
							sendProvince: this.addressDataJJ.provice, // 寄件省
							sendCity: this.addressDataJJ.city, // 寄件市
							sendCounty: this.addressDataJJ.country, // 寄件区
							sendTown: this.addressDataJJ.townName, // 寄件街道
							sendManAddress: this.addressDataJJ.detailAddress, // 寄件详细地址
							sendMan: this.addressDataJJ.name, // 寄件人
							sendManMobile: this.addressDataJJ.phone, // 寄件人手机号
							sendManCompany: this.addressDataJJ.company, // 寄件公司
							sendSite: "", // 寄件网点（批量不需要）
							sendSiteCode: "", // 寄件网点（批量不需要）
						
							acceptCountry: "中国", // 收件国家
							acceptProvince: this.addressDataSJ[i].address.provice, // 收件省
							acceptCity: this.addressDataSJ[i].address.city, // 收件市
							acceptCounty: this.addressDataSJ[i].address.country, // 收件区
							acceptTown: this.addressDataSJ[i].address.townName, // 收件街道
							acceptManAddress: this.addressDataSJ[i].address.detailAddress, // 收件详细地址
							acceptMan: this.addressDataSJ[i].address.name, // 收件人
							acceptManMobile: this.addressDataSJ[i].address.phone, // 收件电话
							acceptManCompany: this.addressDataSJ[i].address.company, // 收件公司
						
							packingPiece: this.addressDataSJ[i].goodsInfo.packingPiece, // 件数
							openId: this.$getStorageSync('token'), // openId
							freight: 0, // 运费
							remark: this.addressDataSJ[i].goodsInfo.remark, // 备注
							recManCode: "", // 收件员工编码（批量不需要）
							goodsWeight: this.addressDataSJ[i].goodsInfo.goodsWeight, // 重量
							paymentType: this.payment_type, // 支付方式
							originalBillCode: "",
							goodsName: this.addressDataSJ[i].goodsInfo.goodsName, // 物品名称
							goodsPayment: 0, // 代收货款（批量不需要）
							dataFrom: "微信", // 数据来源（默认微信）
							recMan: "", // 收件员工名称（批量不需要）
							goodsType: this.addressDataSJ[i].goodsInfo.goodsType, // 物品名称
						}
						if(this.teamModel =='1'){
							_data.groupId = teamInfo.groupId;
							_data.groupMember = teamInfo.nickName;
							_data.sendSite = teamInfo.siteName;
							_data.sendSiteCode = teamInfo.siteCode;
							_data.customerCode = teamInfo.customerCode;
							_data.customerName = teamInfo.customerName;
						}else{
							if(this.userData.customerCode){
								_data.customerCode = this.userData.customerCode;
								_data.customerName = this.userData.customerName;
							}
						}
						list.push(_data);
					}
					console.log('形成的批量订单',list);
					// 请求接口 - 批量上传订单
					if(list.length != 0) {
						uni.showLoading({
							title: '正在下单,请等待'
						})
						this.$api.saveOrderList(list).then(res => {
							setTimeout(()=>{
								uni.hideLoading()
							},2000)
							console.log('正在下单,请等待', res);
							if(res.code == 200) {
								uni.showToast({
									icon: "none",
									title: '成功了:'+res.data.successTotal+'条，失败了:'+res.data.errorTotal,
									duration: 2000
								});
								if(res.data.errorList.length>0){
									let order = res.data.errorList;
									 	// 智能解析模块
									 	order.forEach((item, index) => {
									 		item.goodsWeight = item.goodsWeight||""
											item.name = item.acceptMan||""
											item.phone = item.acceptManMobile||""
											item.provice = item.acceptProvince||""
											item.city = item.acceptCity||""
											item.country = item.acceptCounty||""
											item.townName = item.acceptTown||""
											item.detailAddress  = item.acceptManAddress||""
									 	})
									 	this.addressDataSJ = order
								}else{
									setTimeout(() => {
										self.reset_order()
										getApp().globalData.currentIndex = 0;
										uni.switchTab({
											url:'/pages/tabbar/inquire/index'  
										})
									}, 2000)
								}
							}
						})
					}
				},1500)
			},
			//地址蒲选择
			myaddress(index){
				let self = this;
				// let guidArry = []
				// self.addressDataSJ.forEach(item =>{
				// 		guidArry.push(item.address.guid)
				// })
				let obj = {tabIndex:index}
				this.tabIndex = index;
				uni.navigateTo({
					url:"/pages/myaddress/index?pageId=sends&data="+JSON.stringify(obj)
				})
			},
			// 缓存回显
			echoOrderData(){
				let sendsOrder;
				 try{
					sendsOrder =JSON.parse(this.$getStorageSync('sendsOrder'));
				}catch(err){
					console.log(err)
				}
				if(sendsOrder){
					let{
						addressDataJJ,
						addressDataSJ,
						freight,
						paymentType,
						specEmployee,
						specEmployeeCode,
					}=sendsOrder
					if(Object.keys(addressDataJJ).length!=0){
						this.addressDataJJ = addressDataJJ
					}
					this.addressDataSJ = addressDataSJ
					this.freight = freight
					this.payment_type = paymentType
					this.specEmployee = specEmployee
					this.specEmployeeCode = specEmployeeCode
				}
			},
			// 清空缓存
			reset_order(){
				this.addressDataJJ = {};
				this.addressDataSJ = [];
				this.freight = '';
				this.payment_type = '现金';
				this.specEmployee = '';
				this.specEmployeeCode = '';
				this.$setStorageSync('sendsOrder',{});
			},
			setStorageData(){
				// sendsOrder  批量寄件下单
				let data = {
					addressDataJJ:this.addressDataJJ,  //寄件地址
					addressDataSJ:this.addressDataSJ,  //收件地址
					paymentType:this.payment_type,  //支付方式
				}
				this.$setStorageSync('sendsOrder',JSON.stringify(data));
			}
		}
	}
</script>
<style lang="scss" scoped>
.batch-send{
	height: 100%;
	width: 100%;
	overflow-y: auto;
	padding-bottom: 200rpx;
	background-color: $ztd-color-bgcolor;
	.user-info {
		background-color: $ztd-color-white;
		width: 100%;
		height: auto;
		border-radius: 16rpx;
		&-row {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: auto;
			.oiconbox {
				width: 80rpx;
				.jj {
					background-color: $ztd-color-block;
				}
				.sj {
					background-color: $ztd-color-primary;
				}
	
			}
			.botline {
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex: 1;
			}
	
			.infobox {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 100%;
				height: 130rpx;
				border-right: 2rpx solid $ztd-color-line;
				.instructions {
					display: flex;
					// justify-content: center;
					
					padding-left: 10rpx;
					align-items: center;
					width: 100%;
					height: 100%;
	
					.name {
						font-size: 30rpx;
						overflow:hidden; 
						text-overflow:ellipsis;
						display:-webkit-box; 
						-webkit-box-orient:vertical;
						-webkit-line-clamp:2; 
						color: $ztd-color-listfont;
	
						.boxions {
							margin-left: 10rpx;
						}
					}
	
					.boxWe {
						font-weight: bold;
					}
				}
	
				.address {
					margin-top: 6rpx;
					font-size: 24rpx;
					color: $ztd-color-listfont;
				}
			}
	
			.addreIcon {
				font-size: 56rpx;
				height: 130rpx;
				width: 120rpx;
				color: $ztd-color-primary;
				padding-left: 20rpx;
				padding-right: 10rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				flex-direction: column;
	
				.text {
					color: #6d6d6d;
				}
			}
		}
	}
	.addRecives{
		background-color: $ztd-color-white;
		padding: 20rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin:20rpx 40rpx 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		text{
			margin-left: 20rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #444;
		}
	}
	.orderRec {
		background: $ztd-color-white;
		border-radius: $ztd-border-radius;
		padding: 30rpx 20rpx;
		margin: 20rpx 40rpx;
		box-shadow: $ztd-shadow;
		&-message {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			&-detail {
				display: flex;
				align-items: center;
				&-shou {
					background-color: $ztd-color-primary;
					flex: 0 0 60rpx;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					border-radius: 50%;
					color: $ztd-color-back;
				}
				&-meg {
					margin-left: 30rpx;
					&-title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 15rpx;
						font-weight: bold;
						color: #474747;
						font-size: 34rpx !important;
	
						.XP {
							width: 500rpx !important;;
	
							text {
								margin-left: 20rpx;
							}
						}
						.icon {
							width: 40rpx;
							height: 40rpx;
						}
					}
					&-address {
						color: #CBCCCB;
					}
				}
			}
		}
		&-shop {
			padding-top: 30rpx;
			margin-left: 85rpx;
			border-top: 2rpx solid $ztd-color-line;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			&-forward {
				width: 30rpx;
				height: 30rpx;
	
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		&-row{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background: $ztd-color-white;
			border-radius: $ztd-border-radius;
			padding: 30rpx 20rpx;
			margin: 20rpx 40rpx;
			box-shadow: $ztd-shadow;
			
			
			picker{
				width: 100%;
				height: auto;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.name{
				font-size: 26rpx;
				height: 50rpx;
				line-height: 50rpx;
				margin-right: 10rpx;
			}
			.content{
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.text{
					color: #999;
					margin-right: 20rpx;
					max-width: 400rpx;
					input{
						text-align: right;
					}
				}
				.text-button{
					background-color:$ztd-btn-bgcolor;
					color: $ztd-color-primaryfont;
					padding: 6rpx 26rpx;
					border-radius: 10rpx;
					margin-left: 20rpx;
					font-size: 26rpx;
				}
			}
			.iconfont{
				font-size: 26rpx;
				color: #999;
			}
			.scanIcon{
				color: $ztd-color-primary;
				font-size: 30rpx;
			}
			.jicon{
				color: $ztd-color-primary;
			}
		}
		
	}
	
	&-button {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: $ztd-color-white;
		// background-color: $ztd-color-bgcolor;
		// display: flex;
		// align-items: center;
		// justify-content: center;
		border-radius: 18rpx 18rpx 0 0;
		font-weight: bold;
	
		.wraper-cks {
			width: 100%;
			padding: 6rpx 20rpx;
			align-items: center;
			margin-bottom: 30rpx;
	
			.checkbox-group {
				display: flex;
				align-items: center;
	
				.text {
					color: #999;
				}
	
				.booking {
					color: #000;
					font-weight: bold;
				}
			}
		}
	
		.ButtonBox {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 25rpx;
		}
	}
}
</style>
