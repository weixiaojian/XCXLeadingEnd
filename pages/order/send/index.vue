<template>
	<view class="send">
		<view class="realTips" v-if="hasTips" @click="realnameMethod">
		  <text>此寄件人未实名认证哦~</text>
		  <!-- <image src="../../../static/img/closeTips.png"  @click="closeTips"></image> -->
			 <text>立即实名</text>
		</view>
		<view class="courier" v-if="teamModel!='1'">
			<view class="l">
				<view class="imgBox">
					<image src="../../../static/img/headImg.png" mode=""></image>
				</view>
				<view class="text uni-ellipsis" >
					<text>{{specEmployee||'无'}}</text>
					<text>{{ownerSite}}</text>
				</view>
			</view>
			<view class="r" @click="editMycourier" v-if="!isEdit">
				<view class="rimgBox" >
					<image src="../../../static/img/jiechu.png" mode=""></image>
				</view>
				<view class="text">
					{{specEmployee?'更改':'去绑定'}}
				</view>
			</view>
		</view>
		<!--收寄件信息  -->
			<SendReceive
			   :addressDataJJ="addressDataJJ"
			   :addressDataSJ="addressDataSJ"
			   @myaddress="myaddress"
			   @newaddress="newaddress"
			   ref="SendReceive"
			></SendReceive>
			<!-- 物品信息 -->
			<GoodsInfo
			  @showPopup="showPopup"
				ref="GoodsInfo"
				:goodsInfo="goodsInfo"
				:isEdit="isEdit"
				@getBillCode="getBillCode"
				@getPaymentType ="getPaymentType"
				@selectExpectTime ="selectExpectTime"
			></GoodsInfo>
			<view class="wraper-cks">
				<checkbox-group @change="checkboxChange" class="checkbox-group">
					<checkbox value="agree" :checked="agree" style="transform:scale(0.7)" color="#FDD605" />
					<view class="text">
						我已同意接受	 <text class="booking" @click="goRead">《运单寄件承诺》</text>
					</view>
				</checkbox-group>
			</view>
		<!-- 	<view class="editTips" v-if="isEdit">
				寄件人省份不能修改!
			</view> -->
			<view class="bot-wraper">
				<view class="bot-l">
					<view class="bot-money">
							<text class="l">预估费用 </text>
							<text class="r" v-if="isCash">运费:￥{{freight}}</text> 
							<text class="r" v-if="!isCash">到付:￥{{topayment}}</text>
					</view>
					<view class="bot-tips">
						最终费用以快递员核实为准
					</view>
				</view>
				<view class="bot-r">
					<view class="submit-change" @tap="changeSub" v-if="!isEdit">更改偏好</view>
				</view>
				<view class="bot-r">
					<view class="submit-button" :class="disable?'disable':''"  @tap="submit">{{isEdit?'修改': titleX}}</view>
				</view>
			</view>
			<uni-popup ref="showpopup" :type="'bottom'">
				<ExpectTime
					@timeCancel="timeCancel"
					@getExpectTime="getExpectTime"
					ref="ExpectTime"
				></ExpectTime>
			</uni-popup>
			<uni-popup ref="showpopup1" :type="'center'">
				<Agreement
					@Cancel="cancel"
					@confirmAgreement="confirmAgreement"
					ref="agreement"
				></Agreement>
			</uni-popup>
			<uni-popup ref="showpopup2" :type="'bottom'">
				<view class="send-auto">
					<view class="send-modal" v-for="(item, index) in changeList" :key="index" @click="showModalChange(item)">
						<image class="send-modal-img" :src="item.icon" mode=""></image>
						<view class="send-modal-name">{{item.name}}</view>
					</view>
				</view>
			</uni-popup>
			<!-- 打印要连接蓝牙 -->
			<uni-popup :type="'bottom'" ref="showpopup3">
				<BlePop></BlePop>
			</uni-popup>
			<!-- 剪切板 -->
			<uni-popup :type="'center'" ref="showpopup4">
				<view class='alert-center-box copy-box'>
					<view class='copy-title'>剪切板的信息</view>
					<view class='border-out'>
						<view class='copy-info-box'>
							<view class='c-name'><text>收件人：</text>{{smartObj.name||''}}</view>
							<view class='c-tel'><text>电<text class='w20'></text>话：</text>{{smartObj.phone||''}}</view>
							<view class='c-city'><text>省市区：</text>{{smartObj.provice}} {{smartObj.city}}
								{{smartObj.country}}{{smartObj.townName||''}}</view>
							<view class='c-address'><text>地<text class='w20'></text>址：</text>{{smartObj.detailAddress}}</view>
						</view>
					</view>
					<view class='copy-btns'>
						<view class='to-improve' @click="editAddr('jjr')">寄件地址</view>
						<view class='to-use' @click="editAddr('sjr')">收件地址</view>
					</view>
				</view>
			</uni-popup>
			<YDTOAST ref="ydToast">
				
			</YDTOAST>
	</view>
</template>

<script>
	import SendReceive from '../components/send-receive/index.vue';   //收寄件信息
	import GoodsInfo from '../components/goods-info/index.vue';   //物品信息
	import ExpectTime from "../components/expectTime/index.vue";  //预约时间
	import Agreement from "../components/agreement/index.vue";  //快递服务协议
	import QRPrinter from '@/common/wxQRPrinter/QRPrinterAndTest.js';
	import tpl from '@/common/wxQRPrinter/utils/printTpl.js';
	import tpl_handler from '@/common/wxQRPrinter/utils/printTpl_parsing.js';
	import BlePop from '@/components/ble-pop/ble-pop.vue'
	import YDTOAST from "@/components/yd-toast/yd-toast.vue";  //提示框
	let self,timer=null;
	export default {
		data() {
			return {
				addressDataJJ:{},
				addressDataSJ:{},
				realName:false,
				hasTips:false,
				optionType:'',
				newaddressId:'',//新增地址收寄件人
				tabIndex:0,
				goodsInfo:{ //物品&增值信息
					goodsWeight :1,
					goodsName : '',
					goodsType:'',
					packingPiece :'',
					remark : '',
					goodsPayment : 0,
					insuredValue: '',
					blSpecial:0
				},
				freight:'0',//运费
				topayment:'0',//到付
				agree:true,//同意协议
				pageId:'',//页面标识
				specEmployee:'',
				specEmployeeCode:'',
				ownerSite:'',
				ownerSiteCode:'',
				isEdit:false,
				isAgain:false,
				editData:{},
				isCash:true,
				customerDeliveryBeginTime:'',
				customerDeliveryEndTime:'',
				prePageData:null,
				titleX: '下单',
				changeList: [
					{
						icon: require("@/static/img/zaitu.png"),
						name: '下单',
						currentIndex: 0
					},{
						icon: require("@/static/img/dayinji.png"),
						name: '下单并打印',
						currentIndex: 1
					}
				],
				currentKey: 0,
				orderBill:'',
				teamModel:'',
				editTeamInfo:{
					groupId:'',
					groupMember:'',
					sendSite:'',
					sendSiteCode:'',
					customerCode:'',
					customerName:''
				},
				userData:{},
				monthly:{
					customerCode:'',
					customerName:''
				},
				smartObj:{
					name:'',
					phone:'',
					company:'',
					provice:'',
					city:'',
					country:'',
					townName:'',
					detailAddress :''
				},//剪切板数据回写
				isCopyText:'',
				disable:false,
			}
		},
		components:{
			SendReceive,
			GoodsInfo,
			ExpectTime,
			Agreement,
			BlePop,
			YDTOAST
		},
		onShow(){
			let self = this;
			// 如果寄件电话存在则调用
			if(this.addressDataJJ.phone){
				console.log('realName')
				self.blurValue();
			}
			let sendOrder;
			 try{
				sendOrder =JSON.parse(self.$getStorageSync('sendOrder'));
			}catch(err){
				console.log(err)
			}
			let tempFlog;
			tempFlog=sendOrder?Object.keys(sendOrder.addressDataJJ).length==0:true;
			if(Object.keys(self.addressDataJJ).length==0&&!self.isEdit&&!self.isAgain&&tempFlog){
				self.getAddressDefault()
			}
		},
		onLoad(options) {
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
						}else if(res.cancel){
							uni.switchTab({
								url:"/pages/tabbar/home/index?pageId=send"
							})
						}
					}
				})
				return false;
			}
			try{
				self.userData = JSON.parse(userData)
			}catch(err){
				console.log(err)
			}
			if(options.q){
				let ewmDataStr = decodeURIComponent(options.q);
				console.log('ewmDataStrD',ewmDataStr)
				let index = ewmDataStr.indexOf("scanOrder/");
				ewmDataStr = ewmDataStr.substring(index + 10, ewmDataStr.length);
				console.log(ewmDataStr)
				self.checkBillCode(ewmDataStr)
			}
			// let _data = JSON.parse(options.data)
			let _data;
			 try{
				_data = JSON.parse(options.data);
			}catch(err){
				console.log(err)
			}
			if(options.data!='{}'&&options.data!=undefined&&options.data!=''){
				self.prePageData = _data
				// 有订单号为修改订单
				let isBill = _data.orderBill?_data.orderBill:false;
				if(isBill){
					console.log(_data)
					if(_data.operatType=='edit'){
						self.isEdit = true;
						self.getOrderData(_data.orderBill)
					}else{
						self.isAgain = true;
						self.getOrderData(_data.orderBill)
					}
					
				}else{ 
					self.$nextTick(function(){
						self.specEmployee = _data.specEmployeeName;
						self.specEmployeeCode = _data.specEmployeeCode;
						self.ownerSite = _data.ownerSite;
						self.ownerSiteCode =  _data.ownerSiteCode;;
					})
				}
			}
			self.teamModel = self.$getStorageSync('teamModel')=='1'?'1':'2';
			wx.setNavigationBarTitle({
				title: `下单寄件${self.$getStorageSync('teamModel')==='1'?'（团队）':''}`,
			})
			let teamInfo = self.$getStorageSync('teamInfo');
			console.log('teamInfo',teamInfo)
			let isTeam = teamInfo?teamInfo.groupId:false;
			if(self.teamModel!='1'&&!self.userData.customerCode&&!self.isEdit&&!self.isAgain){
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
			if(!self.isEdit&&!self.isAgain){
				self.getClipboard()
			}
		}, 
		beforeDestroy() {
			//缓存页面数
			this.setStorageData();
		},
		onHide(){
			//缓存页面数
			this.setStorageData();
		},
		mounted(){
			let self = this
			uni.$on('selectAddress',address =>{
				console.log(address)
				if(self.tabIndex == '0'){
					self.addressDataJJ = address;
					self.blurValue();
				}else if(self.tabIndex =='1'){
					self.addressDataSJ = address
				}
			});
			uni.$on('packageinfo',info =>{
				console.log(info)
				self.goodsInfo.goodsWeight = info.goodsWeight
				self.goodsInfo.goodsName = info.goodsName
				self.goodsInfo.goodsType = info.goodsType
				self.goodsInfo.packingPiece = info.packingPiece
				self.goodsInfo.remark = info.remark
				// self.getTrackFreight()
			});
			uni.$on('addedservices',info =>{
				self.goodsInfo.goodsPayment = info.goodsPayment
				self.goodsInfo.insuredValue  = info.insuredValue
				self.goodsInfo.blSpecial  = info.blSpecial
			});
			uni.$on('inputAddress',address =>{
				if(self.newaddressId == 'jjr'){
					self.addressDataJJ = address;
				}else if(self.newaddressId =='sjr'){
					self.addressDataSJ = address
				}
			});
			// uni.$on('bleOk',bleOk =>{
			// 	if(bleOk){
			// 		this.$refs.showpopup3.close();
			// 		setTimeout(()=>{
			// 			this.getOrderPrint(self.orderBill)
			// 		},500)
			// 	}
			// });
			self.echoOrderData()
			self.$nextTick(function(){
				// self.getTrackFreight()
				let billFlog =self.prePageData? self.prePageData.billCode:false;
				if(billFlog){
					self.$refs.GoodsInfo.billCode = self.prePageData.billCode;
				}
				if(self.teamModel!='1'&&self.userData.customerCode){
					self.$refs.GoodsInfo.payment_type = '月结'
				}
			})
			self.blurValue();
		},
		
		onUnload(){
			uni.$off('selectAddress');  //关闭监听
			uni.$off('packageinfo');  //关闭监听
			uni.$off('addedservices');  //关闭监听
			uni.$off('inputAddress');  //关闭监听
			// uni.$off('bleOk');
		},
		watch:{
		     dayItem(val, oldVal){//普通的watch监听
				 this.hourList = []
				 val==1?this.hourList = this.hourMould:this.computerToday()
		     },
		 },
		methods: {
			//选项信息页面
			showPopup(type){
				console.log(type)
				let data = {}
				data.type = type
				if(type =='wpxx'){
					data.item = {
						goodsName: this.goodsInfo.goodsName,
						remark: this.goodsInfo.remark,
						goodsWeight:this.goodsInfo.goodsWeight,
						packingPiece:this.goodsInfo.packingPiece
					}
					uni.navigateTo({
						url:"/pages/order/packageinfo/index?pageId=send&data=" + JSON.stringify(data)
					})
				}else{
					data.item = {
						goodsPayment:this.goodsInfo.goodsPayment,
						insuredValue :this.goodsInfo.insuredValue,
						blSpecial :this.goodsInfo.blSpecial,
					}
					uni.navigateTo({
						url:"/pages/order/addedservices/index?pageId=send&data=" + JSON.stringify(data)
					})
				}
			},
			//快递服务协议
			goRead(){
				let self = this;
				self.$refs['showpopup1'].open();
			},
			confirmAgreement(){
				let self = this;
				self.$refs['showpopup1'].close();
				self.agree = true;
			},
			// 查询运费
			getTrackFreight(){
				let self = this;
				let sendCity = self.addressDataJJ?self.addressDataJJ.city:''
				let acceptProvice = self.addressDataSJ?self.addressDataSJ.provice:''
				let acceptCity = self.addressDataSJ?self.addressDataSJ.city:''
				let acceptCountry = self.addressDataSJ?self.addressDataSJ.country:''
				let goodsWeight = self.goodsInfo.goodsWeight?self.goodsInfo.goodsWeight:''
				if(sendCity&&acceptProvice&&acceptCity&&acceptCountry&&goodsWeight){
					let _data = {
						"sendCity":sendCity,
						"acceptProvince":acceptProvice,
						"acceptCity":acceptCity,
						"acceptCounty":acceptCountry,
						"goodsWeight":goodsWeight
					}
					self.$api.trackFreight(_data).then(res =>{
						if(self.$refs.GoodsInfo.payment_type =='现金'){
							self.freight = res.data+'';
							self.topayment ='0';
							isCash:true
						}else if(self.$refs.GoodsInfo.payment_type =='到付'){
							self.topayment = res.data+'';//到付
							self.freight ='0';
							isCash:false
						}else{
							self.freight = res.data+'';
							self.topayment ='0';
							isCash:true
						}
					})
				}
			},
			getPaymentType(e){
				let self = this;
				console.log(e)
				self.isCash = e=='现金'?true:false;
				// self.getTrackFreight()
			},
			//选择预约时间
			selectExpectTime(){
				let self = this;
				self.$refs['showpopup'].open();
			},
			getExpectTime(data){
				let self = this;
				self.$refs.GoodsInfo.expectTime = data.dayItem+' '+ data.hour;
				if(data.dayItem=='今天'){
					self.customerDeliveryBeginTime=self.$momm.getdate()+' '+data.hour.split('-')[0]+':00';
					self.customerDeliveryEndTime=self.$momm.getdate()+' '+data.hour.split('-')[1]+':00';
				}else if(data.dayItem=='明天'){
					self.customerDeliveryBeginTime=self.$momm.getdate(1)+' '+data.hour.split('-')[0]+':00';
					self.customerDeliveryEndTime=self.$momm.getdate(1)+' '+data.hour.split('-')[1]+':00'
				}
				self.$refs['showpopup'].close();
			},
			timeCancel(){
				let self = this;
				self.$refs['showpopup'].close();
			},
			// 更改专属员工
			editMycourier(){
				uni.navigateTo({
					url:"/pages/mycourier/index?pageId=send"
				})
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
			getAddressDefault(){
				let self = this;
				self.$api.getAddressDefault().then(res => {
					if(res.code ==200&&res.data!=null){
							self.addressDataJJ = res.data
							this.$forceUpdate()
							self.blurValue();
						}
				})
			}, 
			//实名认证
			realnameMethod(){
				let data = {phone:this.addressDataJJ.phone};
				uni.navigateTo({
					url:"/pages/myrealname/index?data="+ JSON.stringify(data)
				})
			},
			// 扫描获取运单号
			getBillCode(){
				let self = this;
				uni.scanCode({
				    success: function (res) {
							let ewmDataStr = res.result;
							// let ewmDataStr ='http://m23j177109.iok.la:34152/NZXCXServer/scanOrder/NZ0000123';
							let index = ewmDataStr.indexOf("scanOrder/");
							ewmDataStr = ewmDataStr.substring(index + 10, ewmDataStr.length);
							self.checkBillCode(ewmDataStr)
				    }
				});
			},
			checkBillCode(data){
				let self = this;
				let _data ={
					 billCode:data
				 }
				self.$api.checkBillCode(_data).then(res =>{
						if(res.code==200){
							// if(self.prePageData){
							// 	self.prePageData.billCode=res.data
							// }
							self.$refs.GoodsInfo.billCode = res.data;
						}else{
							uni.showToast({icon:"none",title:'该运单号已使用！',duration:2000});
						}
				})
			},
			// 获取运单数据
			getOrderData(orderCode){
				let self = this;
				let _data = {
					orderBill:orderCode
				}
				self.$api.getOrderData(_data).then(res =>{
					console.log(res)
					if(res.code ==200){
						self.editData = res.data;
						self.echoOrderData()
					}else{
						uni.showToast({
							icon:"none",
							title:"订单数据获取失败~",
							duration:1500,
							mask:true
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1000)
					}
				})
			},
			myaddress(obj){
				this.tabIndex = obj.tabIndex;
				uni.navigateTo({
					url:"/pages/myaddress/index?pageId=send&data="+JSON.stringify(obj)
				})
			},
			// 进入新增地址簿
			newaddress(pageId){
				let data = {type:'send'}
				this.newaddressId = pageId
				if(pageId == 'jjr'){
					data.item = this.addressDataJJ
				}else if(pageId == 'sjr'){
					data.item = this.addressDataSJ
				}
				data.isEdit = this.isEdit?this.isEdit:this.isAgain
				uni.navigateTo({
					url:"/pages/newaddress/index?pageId="+pageId+"&data=" + JSON.stringify(data)
				})
			},
			checkboxChange(e){
				this.agree = e.detail.value=='agree'?true:false;
			},
			
			// 更改偏好类型
			changeSub() {
				this.$refs['showpopup2'].open();
			},
			
			// 点击绘制
			showModalChange(item) {
				if(item.name == '下单并打印') {
					QRPrinter.getConnectState((res) => {
						this.xiaChange(item)
					}, (err) => {})
				} else {
					this.xiaChange(item);
				}
				this.$refs['showpopup2'].close();
			},
			
			xiaChange(item) {
				this.titleX = item.name
				this.currentKey = item.currentIndex
			},
			editAddr(type){
				let self = this;
				if(type == 'jjr'){
					self.addressDataJJ = self.smartObj;
				}else{
					self.addressDataSJ = self.smartObj;
				}
				console.log(self.addressDataSJ)
				self.$refs.showpopup4.close();
			},
			//获取剪切板内容
			getClipboard(){
				let self = this;
				uni.getClipboardData({
					success: function (res) {
						// console.log(res);
						if (res.data != null && res.data != undefined && self.$Reg.removeHTMLTag(res.data) != '' && res.data.trim() != '') {
							if(self.$getStorageSync('clipboardData')){
								if(res.data == self.$getStorageSync('clipboardData')){
									return;
								}
							}
							self.$setStorageSync('clipboardData',self.$Reg.removeHTMLTag(res.data));
							self.isCopyText = self.$Reg.stripscript(self.$Reg.removeHTMLTag(res.data));
							if(self.isCopyText){
								self.analysis();
							}
						}
					},
					complete:function(){
						uni.hideToast({});//隐藏默认
					}
				});
			},
			analysis(){
				let self = this;
				let Data_ = {
					address:self.isCopyText
				}
				self.$api.addressAnalysis(Data_).then(res =>{
					if(res.code ==200){
						self.smartObj.name = res.data.name||'';
						self.smartObj.phone = res.data.phone||'';
						self.smartObj.detailAddress = res.data.formatAddress||'';
						if(res.data.province||res.data.cityName||res.data.countyName){
							let _data = {
								province:res.data.province||'',
								city:res.data.cityName||'',
								county:res.data.countyName||'',
								town:res.data.townName||'',
							}
							return self.$api.checkProvince(_data)
						}else{
							return Promise.reject()
						}
					}else{
						Promise.reject()
						// uni.showToast({icon:"none",title:res.message,duration:2000});
					}
				}).then(res =>{
					if(res.code ==200){
						self.$refs.showpopup4.open();
						let townName = res.data.townName?('/'+res.data.townName):'';
						let townCode = res.data.townCode?('/'+res.data.townCode):'';
						self.smartObj.provice= res.data.province||'';
						self.smartObj.city=res.data.cityName||'';
						self.smartObj.country=res.data.countyName||'';
						self.smartObj.townName=townName||'';
						console.log(self.smartObj)
					}else if(res.code == 400){
						uni.showToast({icon:"none",title:res.message,duration:2000});
					}
				},(error) => {
					console.log(error)
				})
			},
			// 订单提交
			submit(){
				let self = this;
				if(self.disable){return;}
				let teamInfo = self.$getStorageSync('teamInfo')
				if (this.addressDataJJ.name == '' || this.addressDataJJ.name == undefined || this.addressDataJJ
					.name == null) {
					uni.showToast({
						icon: "none",
						title: "请填写寄件人信息"
					});
					return;
				};
				if (this.addressDataSJ.name == '' || this.addressDataSJ.name == undefined || this.addressDataSJ
					.name == null) {
					uni.showToast({
						icon: "none",
						title: "请填写收件人信息"
					});
					return;
				};
				if(self.addressDataJJ.name == ''){uni.showToast({icon:"none",title:"完善寄件人姓名"});return;};
				if(self.addressDataJJ.phone == ''){uni.showToast({icon:"none",title:"完善寄件人手机号"});return;};
				if(self.addressDataJJ.provice == ''||self.addressDataJJ.city == ''||self.addressDataJJ.country == ''){uni.showToast({icon:"none",title:"完善寄件人省市区"});return;};
				if(self.addressDataJJ.detailAddress == ''){uni.showToast({icon:"none",title:"完善寄件人详细地址"});return;};
				if(self.addressDataSJ.name == ''){uni.showToast({icon:"none",title:"完善收件人姓名"});return;};
				if(self.addressDataSJ.phone == ''){uni.showToast({icon:"none",title:"完善收件人手机号"});return;};
				if(self.addressDataSJ.provice == ''||self.addressDataSJ.city == ''||self.addressDataSJ.country == ''){uni.showToast({icon:"none",title:"完善收件人省市区"});return;};
				if(self.addressDataSJ.detailAddress == ''){uni.showToast({icon:"none",title:"完善收件人详细地址"});return;};
				if (!this.realName) {
					uni.showToast({
						icon: "none",
						title: "请先进行实名认证"
					});
					return ;
				};
				if (this.goodsInfo.goodsWeight == '') {
					uni.showToast({
						icon: "none",
						title: "请填写重量信息"
					});
					return;
				};
				if (this.goodsInfo.goodsName == '') {
					uni.showToast({
						icon: "none",
						title: "请填写物品名称"
					});
					return;
				};
				if (this.$refs.GoodsInfo.payment_type == '') {
					uni.showToast({
						icon: "none",
						title: "请填写付款方式"
					});
					return;
				};
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
				if(self.isEdit){
					if(self.addressDataJJ.provice != self.editData.sendProvince){uni.showToast({icon:"none",title:"寄件人省份无法修改"});return;}
					if(self.addressDataSJ.provice != self.editData.acceptProvince){uni.showToast({icon:"none",title:"收件人省份无法修改"});return;}
				}
				let data = {
					sendMan:this.addressDataJJ.name,
					sendManMobile:this.addressDataJJ.phone,
					sendCountry:'中国',
					sendProvince:this.addressDataJJ.provice,
					sendCity:this.addressDataJJ.city,
					sendCounty:this.addressDataJJ.country,
					sendTown:this.addressDataJJ.townName,
					sendManCompany:this.addressDataJJ.company,
					sendManAddress:this.addressDataJJ.detailAddress,
					acceptMan:this.addressDataSJ.name,
					acceptManMobile:this.addressDataSJ.phone,
					acceptCountry:'中国',
					acceptProvince:this.addressDataSJ.provice,
					acceptCity:this.addressDataSJ.city,
					acceptCounty:this.addressDataSJ.country,
					acceptTown:this.addressDataSJ.townName,
					acceptManCompany:this.addressDataSJ.company,
					acceptManAddress:this.addressDataSJ.detailAddress,
					billCode:this.$refs.GoodsInfo.billCode,
					freight:parseInt(this.freight),
					topayment:parseInt(this.topayment),
					goodsPayment:this.goodsInfo.goodsPayment,
					insuredValue :this.goodsInfo.insuredValue==''?0:this.goodsInfo.insuredValue,
					blSpecial :this.goodsInfo.blSpecial,
					goodsName:this.goodsInfo.goodsName,
					goodsType:this.goodsInfo.goodsType,
					paymentType:this.$refs.GoodsInfo.payment_type,
					packingPiece:this.goodsInfo.packingPiece,
					customerDeliveryBeginTime:this.customerDeliveryBeginTime,
					customerDeliveryEndTime:this.customerDeliveryEndTime,
					remark:this.goodsInfo.remark,
					recMan:this.specEmployee||'',
					recManCode:this.specEmployeeCode||'',
					sendSite:this.ownerSite||'',
					sendSiteCode:this.ownerSiteCode||'',
					goodsWeight:this.goodsInfo.goodsWeight,
					dataFrom:'微信',
				}
					if(self.isEdit){
							data.openId=self.editData.openId;
							data.orderBill = self.editData.orderBill
							data.groupId = self.editTeamInfo.groupId;
							data.groupMember = self.editTeamInfo.groupMember;
							data.sendSite = self.editTeamInfo.sendSite||teamInfo.siteName;
							data.sendSiteCode = self.editTeamInfo.sendSiteCode||teamInfo.siteCode;
							if(self.editTeamInfo.groupId){
								data.customerCode = self.editTeamInfo.customerCode;
								data.customerName = self.editTeamInfo.customerName;
							}else{
								data.customerCode = self.monthly.customerCode;
								data.customerName = self.monthly.customerName;
							}
						this.$api.editBill(data).then(res=>{
							if(res.code == 200){
								uni.showToast({
									icon:"success",
									title:res.message,
									duration:5000
								})
								self.reset_order();
								self.jumpSwitchTab(0)
							}
						});
					}else{
						data.openId=self.$getStorageSync('token');
						// this.currentKey
						if(self.teamModel =='1'){
							data.groupId = teamInfo.groupId;
							data.groupMember = teamInfo.nickName;
							data.sendSite = teamInfo.siteName;
							data.sendSiteCode = teamInfo.siteCode;
							data.customerCode = teamInfo.customerCode;
							data.customerName = teamInfo.customerName;
						}else{
							if(self.userData.customerCode){
								data.customerCode = self.userData.customerCode;
								data.customerName = self.userData.customerName;
							}
						}
						timer = setTimeout(() => {
							this.$api.saveBill(data).then(res=>{
								console.log(res)
								if(res.code == 200){
									let orderBill = res.data;
									self.orderBill = res.data;
									uni.showToast({
										icon:"none",
										title:res.message,
										duration:3000
									})
									self.reset_order();
									if(self.titleX=='下单'){
										self.jumpSwitchTab(0)
									}else{
										self.getOrderPrint(orderBill)
									}
								}else if(res.code == 400){
									 this.$refs.ydToast.show({title:res.message})
								}
							});
						}, 1000)
					}
			},
			getOrderPrint(obj){
				let self = this;
				let _data = {
					orderBill:obj
				}
				QRPrinter.getConnectState((ress) => {
					if(ress.state && ress.code == 200) {
						// 连接成功直接打印
						self.$api.getOrderPrint(_data).then(res =>{
							console.log(res)
							if(res.code == 200&&res.data.length>0){
								// 先要获取蓝牙的连接状态
								res.data.forEach((item,index)=>{
									let sublist = [];
									sublist.push(item.billCode)
									if(item.pieceNumber>1&&item.billCodeSub1){
										let arr = item.billCodeSub1.split(';').filter((item)=>{ return item!=''})
										sublist = sublist.concat(arr)
									}
									sublist.forEach((subItem,index)=>{
										item.billCode = subItem;
										let buffs = tpl_handler(tpl['韵达同城联'], item)
										let prints = buffs.join('')
										QRPrinter.sendCmd(prints)
									})
								})
								_data.blPrint = 1
								return this.$api.updateBlPrint(_data) 
								this.orderBill = '';
								self.reset_order();
							}else{
								self.reset_order();
								self.jumpSwitchTab(0)
								Promise.reject()
							}
						}).then(res =>{
							if(res.code ==200){
								console.log(res.message)
							}else{
								wx.showToast({
									title:res.message,
									icon: 'none',
									duration: 2000
								})
							}
						})
					}
				},(err) => {
					self.reset_order();
					// uni.navigateTo({ url: '/pages/myPrinter/myPrinter?pageId=xddy'})
					// 否则进入蓝牙连接的弹窗
					// this.$refs.showpopup3.open()
				})
				
			},
			// 跳转到订单页面
			jumpSwitchTab(num) {
				/**
				 *  num: 0 待打印  1 已打印
				 */
				getApp().globalData.currentIndex = num;
				uni.switchTab({
					url:'/pages/tabbar/inquire/index'  
				})
			},
			
			reset_order(){
				this.$refs.GoodsInfo.billCode = '';
				this.addressDataJJ = {};
				this.addressDataSJ = {};
				this.freight = '0';
				this.topayment = '0';
				this.goodsInfo.goodsPayment = 0;
				this.goodsInfo.insuredValue  = '';
				this.goodsInfo.blSpecial  = '';
				this.specEmployee = '';
				this.specEmployeeCode = '';
				this.ownerSiteCode = '';
				this.ownerSite = '';
				this.customerDeliveryBeginTime = '';
				this.customerDeliveryEndTime = '';
				// let _data = {};
				// this.goodsInfo.goodsName = '';
				// this.goodsInfo.goodsType = '';
				// this.$refs.GoodsInfo.payment_type = '现金';
				// this.goodsInfo.packingPiece = '';
				// this.goodsInfo.remark = '';
				// this.goodsInfo.goodsWeight = 0;
				this.$setStorageSync('sendOrder',{});
			},
			echoOrderData(){
				let self = this;
				let sendOrder;
				 try{
					sendOrder =JSON.parse(this.$getStorageSync('sendOrder'));
				}catch(err){
					console.log(err)
				}
				console.log(sendOrder)
				if(sendOrder||this.isEdit||this.isAgain){
					if(JSON.stringify(this.editData)!='{}'){
						let{
							sendMan,
							sendManMobile,
							sendProvince,
							sendCity,
							sendCounty,
							sendManCompany,
							sendManAddress,
							acceptMan,
							acceptManMobile,
							acceptProvince,
							acceptCity,
							acceptCounty,
							acceptManCompany,
							acceptManAddress,
							freight,
							topayment,
							sendSite,
							sendSiteCode,
							recMan,
							recManCode,
							goodsPayment,
							insuredValue,
							blSpecial,
							goodsName,
							goodsType,
							paymentType,
							packingPiece,
							remark,
							goodsWeight,
							customerDeliveryBeginTime,
							customerDeliveryEndTime,
							groupId,
							groupMember,
							customerCode,
							customerName,
						}=this.editData
						let billCode =this.editData.billCode?this.editData.billCode:'';
						self.addressDataJJ = {
							provice:sendProvince,
							city:sendCity,
							country:sendCounty,
							detailAddress:sendManAddress,
							name:sendMan,
							phone:sendManMobile,
							company:sendManCompany,
						};
						self.addressDataSJ = {
							provice:acceptProvince,
							city:acceptCity,
							country:acceptCounty, 
							detailAddress:acceptManAddress,
							name:acceptMan,
							phone:acceptManMobile,
							company:acceptManCompany,
						};
						self.$nextTick(function(){
							this.$refs.GoodsInfo.billCode = this.isEdit?billCode:'';
							// this.freight = freight||'';
							// this.topayment = topayment||'';
							this.goodsInfo.goodsPayment = goodsPayment||0;
							this.goodsInfo.insuredValue  = insuredValue ||'';
							this.goodsInfo.blSpecial  = blSpecial ||0;
							this.goodsInfo.goodsName = goodsName||'';
							this.goodsInfo.goodsType = goodsType||'';
							this.$refs.GoodsInfo.payment_type = paymentType||'';
							this.goodsInfo.packingPiece = packingPiece||'';
							this.goodsInfo.remark = remark||'';
							this.goodsInfo.goodsWeight = goodsWeight||0;
							this.specEmployee = recMan||'';
							this.specEmployeeCode= recManCode||'';
							this.ownerSite= sendSite||'';
							this.ownerSiteCode= sendSiteCode||'';
							this.freight = freight?freight+'':'0';
							this.topayment = topayment?topayment+'':'0';
							this.customerDeliveryBeginTime = customerDeliveryBeginTime||'';
							this.customerDeliveryEndTime = customerDeliveryEndTime||'';
							this.isCash = paymentType=='现金'?true:false;
							this.editTeamInfo.groupId = groupId||'';
							this.editTeamInfo.groupMember = groupMember||'';
							this.editTeamInfo.sendSite = sendSite||'';
							this.editTeamInfo.sendSiteCode = sendSiteCode||'';
							if(groupId){
								this.editTeamInfo.customerCode = customerCode||'';
								this.editTeamInfo.customerName = customerName||'';
							}else{
								this.monthly.customerCode=customerCode||'',
								this.monthly.customerName=customerName||''
							}
							console.log('echo',this.editTeamInfo)
							if(customerDeliveryBeginTime){
								let compareDate = self.$momm.compareDate(this.customerDeliveryBeginTime.replace(/\-/g, '/'),(self.$momm.getdate()+' '+'17:01:00').replace(/\-/g, '/'));
								let hour = this.customerDeliveryBeginTime.split(' ')[1].split(':')[0];
								console.log(hour)
								this.$refs.GoodsInfo.expectTime = compareDate?('明天 '+ hour+':00'+'-'+ (hour+1)+':00'):('今天 '+ hour+':00'+'-'+ (parseInt(hour)+1)+':00');
							}
							if(this.isEdit){
								uni.showToast({
									icon:"none",
									title:"地址省份不能修改~",
									duration:2000,
								})
							}
							self.agree = true;
							self.blurValue();
						})
					}else{
						let{
							billCode,
							addressDataJJ,
							addressDataSJ,
							// freight,
							// topayment,
							goodsPayment,
							insuredValue,
							blSpecial,
							goodsName,
							goodsType,
							paymentType,
							packingPiece,
							remark,
							goodsWeight,
						}=sendOrder
						if(Object.keys(addressDataJJ).length!=0){
							this.addressDataJJ = addressDataJJ
						}
						this.addressDataSJ = addressDataSJ
						self.$nextTick(function(){
							// this.$refs.GoodsInfo.billCode =billCode||'';
							// this.freight = freight||'';
							// this.topayment = topayment||'';
							this.goodsInfo.goodsPayment = goodsPayment||0;
							this.goodsInfo.insuredValue  = insuredValue ||'';
							this.goodsInfo.blSpecial  = blSpecial ||0;
							this.goodsInfo.goodsName = goodsName||'';
							this.goodsInfo.goodsType = goodsType||'';
							this.goodsInfo.packingPiece = packingPiece||'';
							this.goodsInfo.remark = remark||'';
							this.goodsInfo.goodsWeight = goodsWeight||0;
							this.isCash = paymentType=='现金'?true:false
						})
					}
				}
			},
			setStorageData(){
				// sendOrder  寄件下单
				if(!this.isEdit){
					let data = {
						// billCode:this.$refs.GoodsInfo.billCode,  //运单编号
						addressDataJJ:this.addressDataJJ,  //寄件地址
						addressDataSJ:this.addressDataSJ,  //收件地址
						// freight:this.freight,  //运费
						// topayment:this.topayment,
						goodsPayment:this.goodsInfo.goodsPayment,  //代收货款
						insuredValue:this.goodsInfo.insuredValue ,  //标识成特殊品
						blSpecial:this.goodsInfo.blSpecial ,  //代收货款
						goodsName:this.goodsInfo.goodsName, //物品名称
						goodsType:this.goodsInfo.goodsType, //物品名称
						paymentType:this.$refs.GoodsInfo.payment_type,  //支付方式
						packingPiece:this.goodsInfo.packingPiece,   //件数
						remark:this.goodsInfo.remark,   //备注
						// specEmployee:this.specEmployee,  //专属业务员
						// specEmployeeCode:this.specEmployeeCode,  //专属业务员编码
						goodsWeight:this.goodsInfo.goodsWeight,  //重量
						title: this.titleX
					}
					this.$setStorageSync('sendOrder',JSON.stringify(data));
				}
			}
			
		},
	
	}
</script>

<style lang="scss" scoped>
.send{
	height: 100%;
	width: 100%;
	overflow-y: auto;
	background-color:$ztd-color-bgcolor;
	padding-bottom: 120rpx;
	.editTips{
		color: red;
		padding: 0 30rpx;
	}
	.realTips{
	  position: relative;
	  background-color: #FFF0E1;
	  color: #FFB138;
	  font-size: 28rpx;
	  height:70rpx;
	  padding:0 20rpx;
	  display: flex;
	  justify-content:space-between;
	  align-items: center;
		text:nth-child(2){
		  color: #F4332E;
		  border: 2rpx solid #F4332E;
		  border-radius: 6rpx;
		  font-size: 26rpx;
		  padding: 0 10rpx;
		}
		image{
		  position: absolute;
		  right: 20rpx;
		  top: 13rpx;
		  width: 50rpx;
		  height:50rpx;
		}
	}
	.courier{
		width:calc(100% - 40rpx);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: $ztd-color-white;
		margin: 20rpx 20rpx 0;
		border-radius: 16rpx;
		.l,.r{
			display: flex;
			align-items: center;
			padding: 8rpx 20rpx;
			.imgBox{
				width: 60rpx;
				height: 60rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.text{
				margin-left: 20rpx;
				max-width: 400rpx;
				text{
					margin-right: 20rpx;
				}
			}
		}
		.r{
			flex: 1;
			justify-content: flex-end;
			.rimgBox{
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
	.wraper-cks{
		width: 100%;
		padding: 6rpx 20rpx;
		align-items: center;
		.checkbox-group{
			display: flex;
			align-items: center;
			.text{
				color: #999;
			}
			.booking{
				color: #000;
				font-weight: bold;
			}
		}
	}
	.bot-wraper{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		background-color:$ztd-color-white ;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		.bot-l{
			.bot-money{
				text{
					font-size:28rpx;
				}
				.r{
					color: red;
					font-size: 30rpx;
					margin-left: 10rpx;
				}
			}
			.bot-tips{
				color: #999;
				font-size: 24rpx;
				margin-top:5rpx;
			}
		}
		.bot-r{
			
			.submit-change {
				height: 70rpx;
				width:160rpx;
				line-height: 70rpx;
				border-radius: 35rpx;
				background-color: $ztd-color-block ;
				color: $ztd-color-white;
				text-align: center;
				font-size: 30rpx;
				margin-right: 10rpx;
			}
			
			.submit-button{
				height: 70rpx;
				width:220rpx;
				line-height: 70rpx;
				border-radius: 35rpx;
				background-color:$ztd-color-primary ;
				color: $ztd-color-block;
				text-align: center;
				font-size: 32rpx;
			}
			.submit-button.disable{
				background-color: #ddd;
			}
		}
	}
	.send-auto {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 18rpx 18rpx 0 0;
		background-color: $ztd-color-white;
		.send-modal {
			width: 50%;
			margin: 50rpx auto;
			text-align: center;
			&-img {
				width: 100rpx;
				height: 100rpx;
			}
			&-name {
				font-size: 30rpx;
			}
		}
	}
	
}
</style>
