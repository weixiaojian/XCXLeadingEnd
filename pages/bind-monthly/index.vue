<template>
	<view class="bind-monthly">
		<!-- 添加网点帐号 -->
		<view class="add-account">
		  <view class="add-account-tip">
		    <text >新增月结账户</text>
		  </view>
		  <view class="add-account-box">
		      <view>
				    <view class='account-prompt'>账号</view>
		        <input class="account-input" placeholder-style="color:#ccc" type="text" maxlength="20" v-model="accountStr"   placeholder="输入月结账号"/>
		      </view>
		      <view class="t-b" v-if="isHadList">
				    <view class='account-prompt'>客户名称</view>
		        <input class="account-input"  placeholder-style="color:#ccc" v-model="passStr" maxlength="30" type="text" disabled="true"  placeholder="输入月结账户密码"/>
		      </view>
					<view class="t-b" v-if="!isHadList">
					  <view class='account-prompt'>密码</view>
					  <input class="account-input"  placeholder-style="color:#ccc" v-model="passStr" maxlength="30" type="password"  placeholder="输入月结账户密码"/>
					</view>
		  </view>
			<view class="tips" v-if="isHadList">
				该账户已绑定~
			</view>
		  <view class="account-btn" @click="bindAccount">{{isHadList?'解绑':'提交'}} </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isHadList:false,//是否有帐号
				isTeamMode:false,
				accountStr:'',
				passStr:'',
				userData:{},
				pageId:''
			}
		},
		onLoad(options) {
			let self = this;
			self.pageId = options.pageId
			let userData = self.$getStorageSync('userData')
			if (typeof(userData) == "undefined") {
				uni.showModal({
					title: "提示",
					content: "请先登录授权~",
					success: function(res) {
						if (res.confirm) {
							uni.switchTab({
								url: "/pages/tabbar/my/index"
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
			console.log('userData',this.userData)
			this.isHadList = this.userData.customerName?true:false;
			if(this.userData.customerCode){
				this.isHadList = true;
				this.accountStr = this.userData.customerCode
			}else{
				this.isHadList = false
			}
		},
		methods: {
			bindAccount(){
				let self = this;
				if(self.isHadList){
				let _data ={
					"customerCode":this.accountStr,
				}
				self.$api.unBindCustomer(_data).then(res =>{
					console.log(res)
					if(res.code == 200){
						uni.showToast({
							icon:"none",
							title:"解除绑定成功",
							duration:1500,
							mask:true
						})
						this.accountStr = '';
						this.isHadList = false;
						this.userData = {};
						this.passStr = '';
					}
				})
				}else{
						if(this.customerCode == ''){uni.showToast({icon:"none",title:"请输入客户编码"});return;};
					  if(this.passStr == ''){uni.showToast({icon:"none",title:"请输入密码"});return;};
						let _data = {
					    "customerCode":this.accountStr,
					    "balancePassword":this.passStr
						}
						self.$api.bindCustomer(_data).then(res =>{
							console.log(res)
							if(res.code == 200){
								uni.showToast({
									icon:"none",
									title:"绑定成功",
									duration:1000,
									mask:true
								})
								setTimeout(()=>{
									uni.navigateBack({
										delta:1
									})
								},1000)
							}
						})
				}
			  
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bind-monthly{
		width: 100%;
		height: 100%;
		background-color: #F0F5F5;
		color: #444;
		position: relative;
		font-size: 26rpx;
		.tips{
			color: red;
			margin-left: 30rpx;
		}
		.no-order-tip{
		  width: 100%;
		  padding-top: 230rpx;
		  color: #888;
		  text-align: center;
		}
		.no-order-tip>image{
		  width: 260rpx;
		  height: 260rpx;
		}
		.electronic-list{
			
		}
		.add-account{
			/* 添加网点帐号 */
			.add-account-tip{
			  line-height: 120rpx;
			  text-align: center;
				text{
					font-size: 32rpx;
					color: #222;
				}
			}
			.add-account-box{
				width: 93%;
				height: 220rpx;
				background: #fff;
				box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.08);
				border-radius: 16rpx;
				padding: 0 20rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
				position: relative;
				margin-left: 30rpx;
				>view{
				  width: 100%;
				  height: 110rpx;
				  line-height: 110rpx;
				  overflow: hidden;
				}
				.t-b{
				  border-top: 1rpx solid #ededed;
				}
				.account-prompt,.account-input{
				  height: 110rpx;
				  line-height: 110rpx;
				  float: left;
				}
				.account-prompt{
				  color: #888;
				  margin-right: 60rpx;
					font-size: 30rpx;
				}
				.account-input{
				  width: 80%;
					font-size: 30rpx;
				}
			}
			.account-btn{
			  width: 93%;
			  text-align: center;
			  height: 80rpx;
			  line-height: 80rpx;
			  background: #FFD500;
			  border-radius: 40rpx;
			  font-weight: bold;
			  margin-top: 50rpx;
			  margin-left: 30rpx;
				font-size: 30rpx;
			}
		}
	
	}
</style>
