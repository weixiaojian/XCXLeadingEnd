<template>
<!-- 新增地址 -->
	<view class="newaddress">
			<view class="user-info">
				<view class="row">
					<view class="content name">
						<input maxlength="6" class="uni-input" v-model="name" type="text" value="" placeholder-class="placeholderStyle" placeholder="请输入姓名" />
					</view>
					<view class="content tel">
						<input  class="uni-input" maxlength="12" v-model="phone" type="text" value="" placeholder-class="placeholderStyle" placeholder="请输入电话或手机号" />
					</view> 
					<!-- <view class="content telnum">
						<text>-</text>
						<input maxlength="12" class="uni-input" v-model="fj" type="text" value="" placeholder-class="placeholderStyle" placeholder="分机号" />
					</view> -->
				</view>
				<view class="row" @tap="showMulLinkageThreePicker">
					<view class="content">
						<view class="text">{{provinces||'请选择省市区'}}</view>
						<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
					</view>
				</view>
				<view class="row">
					<view class="content">
						<input class="uni-input" v-model="address" maxlength="50" type="text" value="" placeholder-class="placeholderStyle" placeholder="请输入详细地址" />
					</view>
				</view>
				<view class="flex-r" >
					<view class="cks">
						<checkbox-group  v-if="pageId == 'jjr'" @change="checkboxChange" class="checkbox-group">
							<checkbox value="mr" :checked="blDefault" style="transform:scale(0.6)" />
							<text >设为默认地址</text>
						</checkbox-group>
					</view>
					<view class="clear" @click="clearData">
						清空
					</view>
				</view>
				<view class="discern">
					<textarea v-model="address_details" @blur="blurInput"  placeholder="请输入或粘贴整段姓名、电话、地址，自动识别如：张三，13800000000，广东省深圳市宝安区xx大道"/>
					<view class="button-wraper">
						<view class="button-wraper-left">
							<i class="iconfont " v-html="'&#xe64b;'" @click="choosImg"></i>
							<view class="line"></view>
							<i class="iconfont " v-html="'&#xe646;'" @click="soundRecoring"></i>
						</view>
						<view class="button-wraper-right">
							<text @tap.stop="analysis">智能识别</text>
							<!-- <text>地址薄</text> -->
						</view>
					</view>
				</view>
			</view>
			<!-- 语音识别  -->
			<uni-popup ref="showpopup" :type="'center'">
				<view class="alert-center-box speak-box">
					<i class="iconfont speak-close-btn" v-html="'&#xe66d;'"  @click='closeAlert'></i>
				  <view class="speak-title " :class="dotMove?'dotmove':''">{{recordState}}</view>
				  <view class="speak-tips">依次说出姓名、电话、地址信息</view>
				  <view class="button-box " :class="dottMove?'butboxmo':''" @click="shotPress" @touchstart="pressstart" @longpress="longPress" @touchend="pressEnd">
					<i class="iconfont " v-html="'&#xe646;'" :class="dottMove?'moveIcon':''"></i>
					</view>
				</view>
			</uni-popup>
			<!-- 授权弹窗 -->
			<uni-popup ref="showpopup1" :type="'center'">
				<view class="alert-center-box" @click.top='stopMaoPao'>
					<view class='alert-center-n'>
						<view>“韵达同城配”要使用你的“{{authTxt}}”，是否允许？</view>
					</view>
					<view class="tip-b-btns">
						<view @click="closeAlert">取消</view>
						<view @click='openSetting'>去授权</view>
					</view>
				</view>
			</uni-popup>
			<view class="submit">
				<view class="submit-button" @tap="confirm">确定</view>
			</view>
			<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
			   @onConfirm="onConfirm"></mpvue-city-picker>
			<view class="cropper" v-show="imgCropper">
				<image-cropper :src="tempFilePath"  @confirm="cropperSure" @cancel="cancel"></image-cropper>
			</view>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
	var plugin = requirePlugin("WechatSI");
	var manager = plugin.getRecordRecognitionManager();
	var temout = '';
	var inter = '';
	let self;
	export default {
		data() {
			return {
				title:'寄件人信息',
				name:'',
				phone:'',
				fj:'',
				cityPickerValueDefault: [0,0,0,0],
				provinces:'',
				provincesCode:'',
				address:'',
				address_details:'',
				custType:'',
				blDefault:false,
				blOpen:false,
				pageId:'',
				type:'',
				addressInfo:'',
				province_data:[],
				isEdit:false,
				record: false,//打开语音识别
				recordState: '按住说话',
				recordTxt:false,
				authTxt:'',
				isSetAuth:false,
				tempFilePath:'',
				cropFilePath:'',
				imgCropper:false,
				dotMove:false,
				dottMove:false
			}
		},
		onLoad(option){
			let self = this;
			this.pageId = option.pageId;
			if(option.data){
				let data = JSON.parse(option.data)
				this.type = data.type;
				if(this.type=='send'){
					this.isEdit = data.isEdit;
				}
				if(this.type =='send'|| this.type =='bj'||this.type=='sends'){
					this.echoData(data.item)
				}
			}
			this.setHeadTitle(this.pageId)
		},
		components:{
			mpvueCityPicker,
			ImageCropper
		},
		methods: {
			showMulLinkageThreePicker(){
				this.$refs.mpvueCityPicker.show();
			},
			setHeadTitle(pageId){
				console.log(pageId)
				if(pageId == 'jjr'){
					this.custType = 0
				}else if(pageId == 'sjr'){
					this.custType = 1
				}
				uni.setNavigationBarTitle({
					title:pageId == 'jjr'?'寄件人信息':'收件人信息'
				})
			},
			clearData(){
				let self = this;
				self.name='';
				self.phone='';
				self.fj='';
				self.cityPickerValueDefault=[0, 0, 0,0];
				self.provinces='';
				self.provincesCode='';
				self.address='';
				self.address_details='';
			},
			closeAlert: function () {
				let self = this;
				self.record=false,
				self.isSetAuth=false
				self.$refs['showpopup'].close();
				self.$refs['showpopup1'].close();
			},
			soundRecoring(){
				let  self = this;
				this.$getAuth('scope.record').then(res=>{
					if(res){
						self.clicktouse =true;
						// self.record = true;
						self.$refs['showpopup'].open();
					}else{
						self.authTxt='麦克风';
						self.$refs['showpopup1'].open();
					}
				});
			},
				stopMaoPao:function() {},
			  pressstart: function () {
			  },
			  shotPress: function () {
			    // console.log("开始按键")
					uni.showToast({
							title: '说话时间太短',
							mask: true,
							icon: 'none',
							duration: 1500,
						});
			  },
			  pressEnd: function () {
			    let self = this;
					self.recordState = '识别中...'
			    clearInterval(inter);
			    clearTimeout(temout);
			    manager.stop();
			    self.dotMove = false;
			    self.dottMove = false
			    setTimeout(function () { 
			     self.recordState = '按住说话';
			     self.recordTips = '依次说出姓名、电话、地址信息'
			    }, 1000)
			  },
			  longPress: function () {
			    let self = this;
			    self.needHand = true;
			    self.recordState='请说话';
			    self.dotMove=true;
			    self.dottMove=true;
			    console.log(self.dottMove)
			    temout = setTimeout(function () {
			      self.needHand= true;
			      self.recordState= 10;
			      self.dotMove= false;
			      self.dottMove= true;
			      self.recordTips='剩余时间'
			      inter = setInterval(function () {
			        self.recordState = self.recordState - 1;
			        // that.setData({
			        //   recordState: self.data.recordState - 1,
			        // });
			        if (self.recordState == 0) {
			          clearInterval(inter);
			          clearTimeout(temout);
			          self.recordState='按住说话';
			          self.recordTips='依次说出姓名、电话、地址信息';
			          that.pressEnd();
			        }
			      }, 1000);
			    }, 20000);
			    manager.onStart = function (res) {
			      console.log("成功开始录音识别", res)
			    }
			    manager.onRecognize = function (res) {
			      console.log("current result", res.result)
			    }
			    manager.onStop = function (res) {
						console.log(res)
			      console.log("record file path", res.tempFilePath);
			      self.recordState = '识别中...';
			     // console.log(res.result);
			      if (res.result == null || res.result == '' || res.result == undefined) {
							uni.showToast({
									title: '无法识别请重试',
									mask: true,
									icon: 'none',
									duration: 1500,
								});
			        self.recordState= '按住说话';
			        self.dotMove=false;
			        self.dottMove=false
							
			      } else {
			        //console.log("result", res.result);
							self.recordState= '按住说话';
							self.dotMove= false;
							self.dottMove= false;
							// self.copyVal= res.result;
			    //     self.smartBtn();
							console.log('res.data',res.result)
							self.address_details = res.result;
							self.analysis();
			        //调用第二弹窗隐藏第一弹窗  copyStatus
			      }
			    }
			    manager.onError = function (res) {
			      console.error("error msg", res.msg)
			      self.recordState='按住说话';
			      // that.recordTips = '依次说出姓名、电话、地址信息';
			    }
			    manager.start({ duration: 40000, lang: "zh_CN" });
			  },
			echoData(item){
				let self = this;
				this.addressInfo = item;
				this.name = item.name||'';
				this.phone = item.phone||'';
				this.fj = item.custPhone2||'';
				this.address = item.detailAddress||'';
				this.blDefault = item.defaultValue=='1'?true:false||false;
				this.provinces = this.addressInfo.provice?`${this.addressInfo.provice}/${this.addressInfo.city||''}/${this.addressInfo.country||''}/${this.addressInfo.townName||''}`:'请选择省市区' ;
				this.provincesCode = this.addressInfo.proviceId?`${this.addressInfo.proviceId}/${this.addressInfo.cityId}/${this.addressInfo.countryId||''}/${this.addressInfo.townId ||''}`:'' ;
					let province_data = JSON.parse(this.$getStorageSync('province'));
					if(province_data){
						province_data.forEach((items,index)=>{
							if(items.province == this.addressInfo.provice){
								this.cityPickerValueDefault[0] = index
							}
							if(items.cityList){
								items.cityList.forEach((citem,num)=>{
									if(citem.cityName == this.addressInfo.city){
										this.cityPickerValueDefault[1] = num
									}
									if(citem.countyList){
										citem.countyList.forEach((cotem,conum)=>{
											if(cotem.countyName == this.addressInfo.country){
												this.cityPickerValueDefault[2] = conum
											}
										})
									}
								})
							}
						})
					}
			},
			cropperSure(e){
				let self = this;
				this.cropFilePath = e.detail.tempFilePath
				console.log(this.cropFilePath)
				var FSM = uni.getFileSystemManager();
					FSM.readFile({
						filePath: this.cropFilePath,
						encoding: "base64",
						success: function (data) {
							let _data = data.data
							self.$api.imgAnalysis(_data).then(res =>{
								console.log(res)
								if(res.code ==200){
									self.address_details = res.data;
									self.analysis();
									self.clearImgData()
								}
							})
						}
					});
			},
			clearImgData(){
				let self = this;
				self.tempFilePath='';
				self.cropFilePath='';
				self.imgCropper=false;
			},
			cancel() {
				let self =this;
				self.clearImgData()
			},
		 //选择图片
			choosImg(e) {
				var self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],  //可选择原图或压缩后的图片
					sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
					success(res) {
						self.tempFilePath =  res.tempFilePaths[0];
						console.log(self.tempFilePath)
						self.imgCropper = true;
					},
					fail: function () {
						// uni.showLoading({
						// 	title: '图片上传失败，请重新选择',
						// });
						// setTimeout(function(){
						// 	uni.hideLoading();
						// },1500);
					},
				});
			},
			blurInput(){
				let self = this;
				self.analysis()
			},
			analysis(){
				let self = this;
				if(self.address_details == ''){uni.showToast({icon:"none",title:"请输入要识别信息"});return;};
				let Data_ = {
					address:self.$Reg.stripscript(self.$Reg.removeHTMLTag(self.address_details))
				}
				self.$api.addressAnalysis(Data_).then(res =>{
					if(res.code ==200){
						self.name = res.data.name;
						self.phone = res.data.phone;
						self.address = res.data.formatAddress
						let _data = {
							province:res.data.province||'',
							city:res.data.cityName||'',
							county:res.data.countyName||'',
							town:res.data.townName||'',
						}
						return self.$api.checkProvince(_data)
					}else{
						Promise.reject()
						uni.showToast({icon:"none",title:res.message,duration:2000});
					}
				}).then(res =>{
					if(res.code ==200){
						let townName = res.data.townName?('/'+res.data.townName):'';
						let townCode = res.data.townCode?('/'+res.data.townCode):'';
						this.provinces = res.data.province+'/'+res.data.cityName+'/'+res.data.countyName+townName;
						this.provincesCode = res.data.provinceCode+'/'+res.data.cityCode+'/'+res.data.countyCode+townCode;
					}else if(res.code == 400){
						uni.showToast({icon:"none",title:res.message,duration:2000});
					}
				})
			},
			checkboxChange(e){
				let _data = e.detail.value
				if(_data.length>0){
					_data.forEach((item,index)=>{
						this.blDefault = _data.includes('mr')?true:false;
					})
				}else{
					this.blDefault = false;
				}
			},
			onConfirm(e){
				console.log(e)
				this.provinces = e.label.replace(/-/ig,'/');
				this.provincesCode = e.code.replace(/-/ig,'/');
			},
			confirm(){
				let self = this
			  if(this.name == ''){uni.showToast({icon:"none",title:"请输入姓名"});return;};
				if(this.phone == ''){
					uni.showToast({icon:"none",title:"请输入电话"});return;
				}else{
					if(!this.$Reg.RegTel(this.phone)){uni.showToast({icon:"none",title:"电话输入有误"});return;};
				}
				if(this.provinces == ''||this.provinces =='请选择省市区'){uni.showToast({icon:"none",title:"请选择省市区"});return;};
				if(this.address == ''){uni.showToast({icon:"none",title:"请输入详细地址"});return;};
				let new_provinces = this.provinces
				let new_provincesCode = this.provincesCode
				let new_phone = (this.fj?this.fj+'-':'')+this.phone
				let data = {
					defaultValue:this.blDefault?'1':'0',
					blOpen:this.blOpen?'1':'0',
					detailAddress:this.address,
					provice:new_provinces.split('/')[0],
					city:new_provinces.split('/')[1],
					country:new_provinces.split('/')[2]||'',
					townName:new_provinces.split('/')[3]||'',
					proviceId:new_provincesCode.split('/')[0],
					cityId:new_provincesCode.split('/')[1],
					countryId:new_provincesCode.split('/')[2]||'',
					townId:new_provincesCode.split('/')[3]||'',
					name:this.name,
					phone:new_phone,
					blType:this.custType,
					guid:'',
				}
				console.log(data)
				if(this.type =='tj'){
					this.$api.addAddress(data).then(res =>{
						if(res.code ==200){
							uni.showToast({
								icon:"none",
								title:"添加成功",
								duration:1500,
								mask:true
							})
							let pages = getCurrentPages()
							let perpage = pages[pages.length - 2]
							perpage.$vm.guidArry.push(res.data) 
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},1000)
								
						}
					})
					
				}else if(this.type =='bj'){
					data.guid = this.addressInfo.guid
					this.$api.editAddress(data).then(res =>{
						if(res.code ==200){
							uni.showToast({
								icon:"none",
								title:"修改成功",
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
				}else if(this.type =='send'||this.type =='sends'){
					if(this.addressInfo==null) {
						data.guid = '';
					} else {
						data.guid = this.addressInfo.guid;
					}
					
					if(this.isEdit){
						setTimeout(()=>{uni.navigateBack({delta:1})},1000);
						console.log(data);
						uni.$emit('inputAddress',data);
					}else{
						if(data.guid){
							this.$api.editAddress(data).then(res =>{
								if(res.code ==200){
									uni.showToast({
										icon:"none",
										title:'修改成功~',
										duration:1000,
										mask:true
									})
									setTimeout(()=>{uni.navigateBack({delta:1})},1000);
									uni.$emit('inputAddress',data);
								}
							})
						}else{
							this.$api.addAddress(data).then(res =>{
								if(res.code ==200){
									uni.showToast({
										icon:"none",
										title:'添加成功~',
										duration:1000,
										mask:true
									})
									setTimeout(()=>{uni.navigateBack({delta:1})},1000);
									uni.$emit('inputAddress',data);
								}
							})
						}
					}
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.newaddress{
		height: 100%;
		width: 100%;
		padding-bottom:100rpx;
		.user-info{
			width: 100%;
			height: auto;
			padding:0 20rpx 20rpx;
			background-color:$ztd-color-white;
			border-radius: 10rpx;
		}
		.flex-r{
			width: 100%;
			padding: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.clear{
			font-size: 26rpx;
			color: #888;
		}
		.checkbox-group{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			text{
				font-size: 26rpx;
				color: #888;
			}
		}
		.discern{
			border:2rpx solid #efefef;
			padding: 20rpx;
			 textarea{
			  width: 100%;
			  height: 160rpx;
			}
			.button-wraper{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 60rpx;
				&-left{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.line{
						width: 2rpx;
						height: 40rpx;
						background-color:#999;
						margin: 0 26rpx 0 36rpx;
					}
					.iconfont{
						font-size: 38rpx;
					}
				}
				&-right{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					text{
						padding: 6rpx 20rpx;
						color:$ztd-color-primary;
						background-color:$ztd-color-white;
						border: 2rpx solid $ztd-color-primary;
						border-radius: 6rpx;
						margin-left:16rpx;
					}
				}
			}
		}
		.placeholderStyle{
			font-size: 26rpx;
			// color:$ztd-color-line;
		}
		.uni-input{
		 padding:12rpx 0;
		 height: 100%;
		}
		.row{
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:16rpx;
			border-bottom: 2rpx solid $ztd-color-line;
			
			.content{
				flex: 2;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.input-box,.text{
					flex: 1;
				}
				.gorealname{
					width: 200rpx;
				}
				.text{
					padding:24rpx 0;
					height: 100%;
				}
			}
			.content.telnum{
				flex: 1;
			}
			.iconfont{
				font-size: 32rpx;
			}
		}
		.common{
			margin-top: 20rpx;
			border-top: 10rpx solid $ztd-color-line;
			width: 100%;
			height: auto;
			padding:20rpx;
			.t{
				font-size: 26rpx;
				color: #000;
				font-weight: bold;
			}
			.wraper{
				display: flex;
				padding-top: 16rpx;
				.item{
					width: calc(50% - 10rpx);
					border: 2rpx solid $ztd-color-listfont;
					padding: 10rpx;
					border-radius: 8rpx;
					margin-bottom:20rpx;
				}
				.item:nth-child(2n){
					margin-left: 20rpx;
				}
			}
		}
		.submit{
			position: fixed;
			background-color: $ztd-color-white;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 20rpx;
			&-button{
				// width:500rpx;
				width: 80%;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius:35rpx;
				border: 2rpx solid $ztd-color-primary;
				color:$ztd-color-block ;
				background-color:$ztd-color-primary ;
			}
		}
		// 语音弹框
		.copy-close-btn,.speak-close-btn{
		  width: 35rpx;
		  height: 35rpx;
		  position: absolute;
		  right: 30rpx;
		  top: 30rpx;
		}
		/* 语音识别 */
		.speak-box{
		  /* padding-bottom: 30rpx; */
		  height: 550rpx;
		}
		.speak-title{
		  width: 100%;
		  text-align: center;
		  font-weight: bold;
		  font-size: 32rpx;
		  padding: 40rpx 0;
		}
		.speak-tips{
		  width: 100%;
		  text-align: center;
		  color: #888;
		}
		.button-box{
		  width: 152rpx;
		  height: 152rpx;
		  border-radius: 50%;
		  background: #FFD500;
		  margin:auto;
		  margin-top: 110rpx;
		  position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.button-box>i{
		  font-size: 60rpx;
		  background: transparent;
		}
		.button-box>i.moveIcon{
		  color: #fff;
		}
		.dotmove:after {
		  overflow: hidden;
		  display: inline-block;
		  vertical-align:bottom;
		  animation: ellipsis 2s infinite;
		  content: "\2026"; /* ascii code for the ellipsis character */
		}	
		@keyframes ellipsis {
		    from {
		        width: 4rpx;
		    }
		    to {
		        width: 35rpx;
		    }
		} 
		.butboxmo{
		  animation:myfirst 1.5s ease infinite normal;
		}
		.butboxmo>image{
		  width: 152rpx;
		  height: 152rpx;
		}
		@keyframes myfirst
		{
		  0% {width:152rpx;height:152rpx;background-color:rgba(244,202,68,1);margin-top: 100rpx;}
		  100% {width:300rpx;height:300rpx;background-color:rgba(244,202,68,0.1);margin-top:35rpx;}
		}
	}
	
</style>
