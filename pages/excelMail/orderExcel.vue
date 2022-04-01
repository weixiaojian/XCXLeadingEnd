<template>
	<view class="orderExcel">
		<TabLists>
			<view class="user-info">
				<view class="user-info-row" @tap.stop.prevent="getNewAddress('jjr', index)">
					<view class="oiconbox">
						<text class="oicon jj">寄</text>
					</view>
					<view class="botline">
						<view class="send infobox" v-if="listMail.provice">
							<view class="instructions">
								<view class="name boxWe">
									{{ listMail.name }} <text class="boxions"> {{ listMail.phone }} </text>
								</view>
							</view>
							<view class="instructions">
								<view class="name">
									{{ listMail.provice }}{{ listMail.city }}
									{{ listMail.country }}{{ listMail.townName||'' }}{{ listMail.detailAddress }}
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
			<!-- <view class="">
				{{ batchList }}
			</view> -->
			<block v-if="currentId == 'excel'">
				<view class="orderRec" v-for="(item, index) in orderList" :key="index">
					<!-- 收件信息 -->
					<view class="orderRec-message">
						<view class="orderRec-message-detail">
							<view class="orderRec-message-detail-shou">收</view>
							<view class="orderRec-message-detail-meg">
								<view class="orderRec-message-detail-meg-title">
									<view class="XP">{{ item.name }}<text>{{ item.phone }}</text></view>
									<image src="/static/img/detele.png" class="icon" @click.stop="detele(item, index)"></image>
								</view>
								<view class="orderRec-message-detail-meg-address" @click.stop="getNewAddress('sjr', index)">
									{{ item.province }}{{ item.city }}{{ item.county }}{{ item.town||'' }}{{ item.address }}
								</view>
							</view>
						</view>
					</view>
					<!-- 物品信息 -->
					<view class="orderRec-shop" @click.stop="changeShop('wpxx', index)">
						<view style="flex: 2;">
							<text v-if="item.goodsName">{{ item.goodsName }},</text>
							<text v-if="item.weight">{{ item.weight }}公斤,</text>
							<text v-if="item.packingPiece">{{item.packingPiece}}件,</text>
							<text v-if="item.remark">{{ item.remark }}</text>
						</view>
						<view class="orderRec-shop-forward">
							<image src="/static/img/you.png"></image>
						</view>
						<view class="errorTips uni-ellipsis-2" v-if="item.errMsg">
							{{item.errMsg||''}}
						</view>
					</view>
				</view>
			</block>
			
			<block v-else>
				<view class="orderRec" v-for="(item, index) in batchList" :key="index">
					<!-- 收件信息 -->
					<view class="orderRec-message">
						<view class="orderRec-message-detail">
							<view class="orderRec-message-detail-shou">收</view>
							<view class="orderRec-message-detail-meg">
								<view class="orderRec-message-detail-meg-title">
									<view class="XP">{{ item.name }}<text>{{ item.phone }}</text></view>
									<image class="icon" src="/static/img/detele.png" @click.stop="detele(item, index)"></image>
								</view>
								<view class="orderRec-message-detail-meg-address" @click.stop="getNewAddress('sjr', index)">
									{{ item.province }}{{ item.cityName }}{{ item.countyName }}{{ item.townName||'' }}{{ item.formatAddress }}
								</view>
							</view>
						</view>
					</view>
					<!-- 物品信息 -->
					<view class="orderRec-shop" @click.stop="changeShop('wpxx', index)">
						<view style="flex: 2;">
							<text v-if="item.goodsName">{{ item.goodsName }},</text>
							<text v-if="item.weight">{{ item.weight }}公斤,</text>
							<text v-if="item.packingPiece">{{item.packingPiece}}件,</text>
							<text v-if="item.remark">{{ item.remark }}</text>
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
		<view class="orderExcel-button">
			<view class="wraper-cks">
				<checkbox-group @change="checkboxChange" class="checkbox-group">
					<checkbox value="agree" :checked="agree" style="transform:scale(0.7)" color="#FDD605" />
					<view class="text">
						我已同意接受 <text class="booking" @click="goRead">《运单寄件承诺》</text>
					</view>
				</checkbox-group>
			</view>
			<view class="ButtonBox">
				<ButtonBox :title="'下单'" :buttonBgColor="disable?'#ddd':''" :radius="'35rpx'" height="70rpx" width="700rpx" @hanldChange="ChangeBtn">
				</ButtonBox>
			</view>
		</view>
		<uni-popup ref="showpopup1" :type="'center'">
			<Agreement @Cancel="cancel" @confirmAgreement="confirmAgreement" ref="agreement"></Agreement>
		</uni-popup>
	</view>
</template>

<script>
	import Agreement from "../order/components/agreement/index.vue"; //快递服务协议
	let timer = null;
	export default {
		components: {
			Agreement
		},
		data() {
			return {
				orderList: [],
				agree: true, //同意协议
				// 寄件人
				listMail: {},
				newaddressId: '',
				editRecIndex: 0,
				mockList:this.$Mock.payment_type,
				payment_type:'现金',
				currentId: '',
				batchList: [],
				batchIndex: 0,
				teamModel:'',
				userData:{},
				disable:false
			};
		},
		onLoad(options) {
			let self = this;
			// 成功的订单 - 从数组对象中添加
			let order = JSON.parse(options.order);
			this.currentId = options.pageId
			if(options.pageId == 'excel') {
				order.forEach((item, index) => {
					item.packingPiece = 1
					item.goodsType = ""
					item.acceptManCompany = ""
				})
				this.orderList = order;
			} else {
				// 智能解析模块
				order.forEach((item, index) => {
					item.packingPiece = 1
					item.acceptManCompany = ""
					item.weight = 1
					item.goodsName = "文件"
					item.goodsType = ""
				})
				this.batchList = order
			}
			let userData = this.$getStorageSync('userData')
			try{
				this.userData = JSON.parse(userData)
			}catch(err){
				console.log(err)
			}
			self.teamModel = self.$getStorageSync('teamModel')=='1'?'1':'2';
			wx.setNavigationBarTitle({
				title: `下单寄件${self.$getStorageSync('teamModel')==='1'?'（团队）':''}`,
			})
			this.setTeamInfo()
		},

		mounted() {
			// 监听寄件地址簿回值
			uni.$on('selectAddress', item => {
				if (item) {
					this.listMail = item
				}
			})
			// 跳转到详情回值
			uni.$on('inputAddress', address => {
				if (this.newaddressId == 'jjr') {
					this.listMail = address;
				} else if (this.newaddressId == 'sjr') {
					// 
					if(this.currentId == 'excel') {
						// 单独的修改原数组中的值
						this.orderList[this.editRecIndex].address = address.detailAddress
						this.orderList[this.editRecIndex].city = address.city
						this.orderList[this.editRecIndex].county = address.country
						this.orderList[this.editRecIndex].fromAddress = address.provice + address.city + address
							.country + address.townName + address.detailAddress
						this.orderList[this.editRecIndex].name = address.name
						this.orderList[this.editRecIndex].phone = address.phone
						this.orderList[this.editRecIndex].town = address.townName
						this.orderList[this.editRecIndex].province = address.provice
						this.orderList[this.editRecIndex].acceptManCompany = address.company
					} else {
						// 智能解析模块
						this.batchList[this.batchIndex].formatAddress = address.detailAddress
						this.batchList[this.batchIndex].cityName = address.city
						this.batchList[this.batchIndex].countyName = address.country
						this.batchList[this.batchIndex].reqAddress = `${address.name}，${address.phone}，${address.provice}${address.city}${address.country}${address.townName}${address.detailAddress}`
						this.batchList[this.batchIndex].name = address.name
						this.batchList[this.batchIndex].phone = address.phone
						this.batchList[this.batchIndex].townName = address.townName
						this.batchList[this.batchIndex].province = address.provice
						this.batchList[this.batchIndex].acceptManCompany = address.company
					}
				}
			})
			uni.$on('packageinfo', info => {
				console.log('info',info.packingPiece)
				if(this.currentId == 'excel') {
					if(info.allSelect){
						this.orderList.forEach(item =>{
						item.weight = info.goodsWeight
						item.goodsName = info.goodsName
						item.goodsType = info.goodsType
						item.packingPiece = info.packingPiece
						item.remark = info.remark
						})
					}else{
						this.orderList[this.editRecIndex].weight = info.goodsWeight
						this.orderList[this.editRecIndex].goodsName = info.goodsName
						this.orderList[this.editRecIndex].goodsType = info.goodsType
						this.orderList[this.editRecIndex].packingPiece = info.packingPiece
						this.orderList[this.editRecIndex].remark = info.remark
					}
					console.log(this.orderList)
				} else {
					if(info.allSelect){
						this.batchList.forEach(item =>{
						item.weight = info.goodsWeight
						item.goodsName = info.goodsName
						item.goodsType = info.goodsType
						item.packingPiece = info.packingPiece
						item.remark = info.remark
						})
					}else{
						// 智能解析物品
						this.batchList[this.batchIndex].weight = info.goodsWeight
						this.batchList[this.batchIndex].goodsName = info.goodsName
						this.batchList[this.batchIndex].goodsType = info.goodsType
						this.batchList[this.batchIndex].packingPiece = info.packingPiece
						this.batchList[this.batchIndex].remark = info.remark
					}
				}
			});
			this.$nextTick(function(){
				console.log(this.userData.customerCode)
				if(this.teamModel!='1'&&this.userData.customerCode){
					this.payment_type = '月结'
				}
			})
		},
		onShow() {
			let self = this;
			
		},
		onUnload() {
			uni.$off('selectAddress')
			uni.$off('inputAddress')
			uni.$off('packageinfo')
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
			// 地址详情
			getNewAddress(pageId, index) {
				let data = {
					type: 'send'
				}
				this.newaddressId = pageId
				if (pageId == 'jjr') {
					data.item = this.listMail
					data.isEdit = this.listMail.name ? true : false
				} else {
					// 收件信息
					if(this.currentId == 'excel') {
						data.item = {
							name: this.orderList[index].name,
							phone: this.orderList[index].phone,
							provice: this.orderList[index].province,
							city: this.orderList[index].city,
							country: this.orderList[index].county,
							detailAddress: this.orderList[index].address,
							townName: this.orderList[index].town,
							company: this.orderList[index].acceptManCompany
						}
						this.editRecIndex = index
						data.isEdit = this.orderList[index].name ? true : false
						
						
					} else if(this.currentId == 'batch') {
						// 智能解析
						data.item = {
							name: this.batchList[index].name,
							phone: this.batchList[index].phone,
							provice: this.batchList[index].province,
							city: this.batchList[index].cityName,
							country: this.batchList[index].countyName,
							detailAddress: this.batchList[index].formatAddress,
							townName: this.batchList[index].townName,
							company: this.batchList[index].acceptManCompany
						}
						this.batchIndex = index
						data.isEdit = this.batchList[index].name ? true : false
					}
				}
				uni.navigateTo({
					url: "/pages/newaddress/index?pageId=" + pageId + "&data=" + JSON.stringify(data)
				})
			},
			// 寄件地址簿
			myaddress(tabIndex) {
				let data = {
					tabIndex
				}
				uni.navigateTo({
					url: "/pages/myaddress/index?pageId=send&data=" + JSON.stringify(data)
				})
			},
			// 移除每一项
			detele(item, index) {
				uni.showModal({
					title: '移除提示',
					content: '您确定要移除' + item.name + '的信息？',
					success: (res) => {
						if (res.confirm) {
							if(this.currentId == 'excel') {
								this.orderList.splice(index, 1);
							} else {
								// 智能解析
								this.batchList.splice(index, 1);
							}
						}
					}
				})
			},
			// 跳转到物品信息
			changeShop(type, index) {
				let data = {}
				data.type = type
				if (type == 'wpxx') {
					if(this.currentId == 'excel') {
						this.editRecIndex = index
						data.item = {
							goodsName: this.orderList[index].goodsName,
							remark: this.orderList[index].remark,
							goodsWeight: this.orderList[index].weight,
							packingPiece:this.orderList[index].packingPiece,
						}
					} else {
						this.batchIndex = index
						data.item = {
							goodsName: this.batchList[index].goodsName,
							remark: this.batchList[index].remark,
							goodsWeight: this.batchList[index].weight,
							packingPiece:this.batchList[index].packingPiece,
						}
					}
					uni.navigateTo({
						url: "/pages/order/packageinfo/index?pageId=sends&data=" + JSON.stringify(data)
					})
				}
			},

			checkboxChange(e) {
				this.agree = e.detail.value == 'agree' ? true : false;
			},
			
			// 付款方式
			bindPickerChange(e) {
				let val = e.detail.value;
				this.payment_type = this.$Mock.payment_type[val].name;
				console.log(this.payment_type);
			},
			
			goRead() {
				this.$refs['showpopup1'].open();
			},
			confirmAgreement() {
				let self = this;
				self.$refs['showpopup1'].close();
				self.agree = true;
			},
			// 批量下单
			ChangeBtn() {
				let self = this;
				if(self.disable){return;}
				let teamInfo = this.$getStorageSync('teamInfo')
				if (JSON.stringify(this.listMail) == "{}") {
					uni.showToast({
						icon: 'none',
						title: '寄件信息请补充',
						duration: 3000
					})
					return
				}
			
				if (!this.agree) {
					uni.showToast({
						icon: 'none',
						title: '勾选运单寄件协议',
						duration: 3000
					})
					return
				}
				// 对象合并到另一个对象中
				let _data={};
				let list = [];
				if(this.currentId == 'excel') {
					if (!this.orderList.length) {
						uni.showToast({
							icon: 'none',
							title: '收件信息请补充',
							duration: 3000
						})
						return
					}
					for(let i=0;i<this.orderList.length;i++) {
					if (this.orderList[i].name == '' || this.orderList[i].name == undefined || this.orderList[i].name == null) {
						uni.showToast({
							icon: "none",
							title: "请填写第"+(i+1)+"个收件人信息",
							duration:2000
						});
						return;
					};
					if (this.orderList[i].weight == '') {
						uni.showToast({
							icon: "none",
							title: "请填写第"+(i+1)+"个重量信息",
							duration:2000
						});
						return;
					};
					if (this.orderList[i].goodsName == '') {
						uni.showToast({
							icon: "none",
							title: "请填写第"+(i+1)+"个物品名称",
							duration:2000
						});
						return;
					};
					if (this.orderList[i].weight == '') {
						uni.showToast({
							icon: "none",
							title: "请填写第"+(i+1)+"个数量",
							duration:2000
						});
						return;
					};
						_data = {
							sendCountry: "中国", // 寄件国家
							sendProvince: this.listMail.provice, // 寄件省
							sendCity: this.listMail.city, // 寄件市
							sendCounty: this.listMail.country, // 寄件区
							sendTown: this.listMail.townName, // 寄件街道
							sendManAddress: this.listMail.detailAddress, // 寄件详细地址
							sendMan: this.listMail.name, // 寄件人
							sendManMobile: this.listMail.phone, // 寄件人手机号
							sendManCompany: this.listMail.company, // 寄件公司
							sendSite: "", // 寄件网点（批量不需要）
							sendSiteCode: "", // 寄件网点（批量不需要）
						
							acceptCountry: "中国", // 收件国家
							acceptProvince: this.orderList[i].province, // 收件省
							acceptCity: this.orderList[i].city, // 收件市
							acceptCounty: this.orderList[i].county, // 收件区
							acceptTown: this.orderList[i].town, // 收件街道
							acceptManAddress: this.orderList[i].address, // 收件详细地址
							acceptMan: this.orderList[i].name, // 收件人
							acceptManMobile: this.orderList[i].phone, // 收件电话
							acceptManCompany: this.orderList[i].acceptManCompany, // 收件公司
						
							packingPiece: this.orderList[i].packingPiece, // 件数
							openId: this.$getStorageSync('token'), // openId
							freight: 0, // 运费
							remark: this.orderList[i].remark, // 备注
							recManCode: "", // 收件员工编码（批量不需要）
							goodsWeight: this.orderList[i].weight, // 重量
							paymentType: this.payment_type, // 支付方式
							originalBillCode: "",
							goodsName: this.orderList[i].goodsName, // 物品名称
							goodsPayment: 0, // 代收货款（批量不需要）
							dataFrom: "微信", // 数据来源（默认微信）
							recMan: "", // 收件员工名称（批量不需要）
							goodsType: this.orderList[i].goodsType, // 物品名称
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
				} else {
					if (!this.batchList.length) {
						uni.showToast({
							icon: 'none',
							title: '收件信息请补充',
							duration: 3000
						})
						return
					}
					for(let i=0;i<this.batchList.length;i++) {
						if (this.batchList[i].name == '' || this.batchList[i].name == undefined || this.batchList[i].name == null) {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个收件人信息",
								duration:2000
							});
							return;
						};
						if (this.batchList[i].weight == '') {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个重量信息",
								duration:2000
							});
							return;
						};
						if (this.batchList[i].goodsName == '') {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个物品名称",
								duration:2000
							});
							return;
						};
						if (this.batchList[i].packingPiece == '') {
							uni.showToast({
								icon: "none",
								title: "请填写第"+(i+1)+"个数量",
								duration:2000
							});
							return;
						};
						_data = {
							sendCountry: "中国", // 寄件国家
							sendProvince: this.listMail.provice, // 寄件省
							sendCity: this.listMail.city, // 寄件市
							sendCounty: this.listMail.country, // 寄件区
							sendTown: this.listMail.townName, // 寄件街道
							sendManAddress: this.listMail.detailAddress, // 寄件详细地址
							sendMan: this.listMail.name, // 寄件人
							sendManMobile: this.listMail.phone, // 寄件人手机号
							sendManCompany: this.listMail.company, // 寄件公司
							sendSite: "", // 寄件网点（批量不需要）
							sendSiteCode: "", // 寄件网点（批量不需要）
						
							acceptCountry: "中国", // 收件国家
							acceptProvince: this.batchList[i].province, // 收件省
							acceptCity: this.batchList[i].cityName, // 收件市
							acceptCounty: this.batchList[i].countyName, // 收件区
							acceptTown: this.batchList[i].townName, // 收件街道
							acceptManAddress: this.batchList[i].formatAddress, // 收件详细地址
							acceptMan: this.batchList[i].name, // 收件人
							acceptManMobile: this.batchList[i].phone, // 收件电话
							acceptManCompany: this.batchList[i].acceptManCompany, // 收件公司
						
							packingPiece: this.batchList[i].packingPiece, // 件数
							openId: this.$getStorageSync('token'), // openId
							freight: 0, // 运费
							remark: this.batchList[i].remark, // 备注
							recManCode: "", // 收件员工编码（批量不需要）
							goodsWeight: this.batchList[i].weight, // 重量
							paymentType: this.payment_type, // 支付方式
							originalBillCode: "",
							goodsName: this.batchList[i].goodsName, // 物品名称
							goodsPayment: 0, // 代收货款（批量不需要）
							dataFrom: "微信", // 数据来源（默认微信）
							recMan: "", // 收件员工名称（批量不需要）
							goodsType: this.batchList[i].goodsType, // 物品名称
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
				}
				
				console.log('形成的批量订单',list);
				// 请求接口 - 批量上传订单
				if(timer != null){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
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
									 if(this.currentId == 'excel') {
									 	order.forEach((item, index) => {
											item.weight = item.goodsWeight||""
											item.name = item.acceptMan||""
											item.phone = item.acceptManMobile||""
											item.province = item.acceptProvince||""
											item.city = item.acceptCity||""
											item.county = item.acceptCounty||""
											item.town = item.acceptTown||""
											item.address  = item.acceptManAddress||""
											item.packingPiece = item.packingPiece||""
									 	})
									 	this.orderList = order;
									 } else {
									 	// 智能解析模块
									 	order.forEach((item, index) => {
									 		item.weight = item.goodsWeight||""
											item.name = item.acceptMan||""
											item.phone = item.acceptManMobile||""
											item.province = item.acceptProvince||""
											item.cityName = item.acceptCity||""
											item.countyName = item.acceptCounty||""
											item.townName = item.acceptTown||""
											item.formatAddress  = item.acceptManAddress||""
											item.packingPiece = item.packingPiece||""
									 	})
									 	this.batchList = order
									 }
									 
								}else{
									setTimeout(() => {
										getApp().globalData.currentIndex = 0;
										uni.switchTab({
											url:'/pages/tabbar/inquire/index'  
										})
									}, 2000)
								}
							}
						})
					}
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.orderExcel {
		width: 100%;
		height: auto;
		padding-bottom: 200rpx;
		background-color: $ztd-color-bgcolor;
		.errorTips{
			width: 100%;
			color: red;
			padding-right:20rpx;
		}
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
