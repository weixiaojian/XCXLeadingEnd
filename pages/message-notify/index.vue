<template>
	<view class="message">
		<view class="itembtitle">
			我是寄件人
		</view>
		<view class="uni-form-item">
			<view class="title">揽收成功通知</view>
			 <view class="uni-input">
				<radio-group @change="blSendOrderChange">
				<label class="radio" ><radio style="transform:scale(0.8)" color="#FDD605" value="1"  :checked="blSendOrder==1" />开启</label>
				<label class="radio"><radio style="transform:scale(0.8)"  color="#FDD605"  value="0" :checked="blSendOrder==0" />关闭</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item">
			<view class="title">快递派送通知</view>
			 <view class="uni-input">
				<radio-group @change="blSendDispChange">
				<label class="radio" ><radio style="transform:scale(0.8)" color="#FDD605" value="1"  :checked="blSendDisp==1" />开启</label>
				<label class="radio"><radio style="transform:scale(0.8)"  color="#FDD605"  value="0" :checked="blSendDisp==0" />关闭</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item">
			<view class="title">签收成功通知</view>
			 <view class="uni-input">
				<radio-group @change="blSendSignChange">
				<label class="radio" ><radio style="transform:scale(0.8)" color="#FDD605" value="1"  :checked="blSendSign==1" />开启</label>
				<label class="radio"><radio style="transform:scale(0.8)"  color="#FDD605"  value="0" :checked="blSendSign==0" />关闭</label>
				</radio-group>
			</view>
		</view>
		<view class="line">
		</view>
		<view class="itembtitle ">
			我是收件人
		</view>
		<view class="uni-form-item">
			<view class="title">揽收成功通知</view>
			 <view class="uni-input">
				<radio-group @change="blRecOutChange">
				<label class="radio" ><radio style="transform:scale(0.8)" color="#FDD605" value="1"  :checked="blRecOut==1" />开启</label>
				<label class="radio"><radio style="transform:scale(0.8)"  color="#FDD605"  value="0" :checked="blRecOut==0" />关闭</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item">
			<view class="title">快递派送通知</view>
			 <view class="uni-input">
				<radio-group @change="blRecDispChange">
				<label class="radio" ><radio style="transform:scale(0.8)" color="#FDD605" value="1"  :checked="blRecDisp==1" />开启</label>
				<label class="radio"><radio style="transform:scale(0.8)"  color="#FDD605"  value="0" :checked="blRecDisp==0" />关闭</label>
				</radio-group>
			</view>
		</view>
		<view class="uni-form-item">
			<view class="title">签收成功通知</view>
			 <view class="uni-input">
				<radio-group @change="blRecSignChange">
				<label class="radio" ><radio style="transform:scale(0.8)" color="#FDD605" value="1"  :checked="blRecSign==1" />开启</label>
				<label class="radio"><radio style="transform:scale(0.8)"  color="#FDD605"  value="0" :checked="blRecSign==0" />关闭</label>
				</radio-group>
			</view>
		</view>
		<view class="mdes">
			<view class="titls">
				温馨提示 :
			</view>
			<view class="des">
				开启通知后，当前登陆账号如果有对其操作，会推送消息!
			</view>
		</view>
		<view class="submit">
			<view class="submit-button" @tap="confirm">确定</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				blSendOrder:1,
				blSendDisp:1,
				blSendSign:1,
				blRecOut:1,
				blRecDisp:1,
				blRecSign:1,
			}
		},
		onLoad() {
			let self =this;
			self.$api.getMessagesSet().then(res=>{
				console.log(res)
				if(res.data ==null){
					this.blSendOrder = 1;
					this.blSendDisp = 1;
					this.blSendSign = 1;
					this.blRecOut = 1;
					this.blRecDisp = 1;
					this.blRecSign = 1;
				}else{
					this.blSendOrder = res.data.blSendOrder;
					this.blSendDisp = res.data.blSendDisp;
					this.blSendSign = res.data.blSendSign;
					this.blRecOut = res.data.blRecOut;
					this.blRecDisp = res.data.blRecDisp;
					this.blRecSign = res.data.blRecSign;
				}
			})
		},
		methods: {
			blSendOrderChange(e){
				this.blSendOrder = e.detail.value
			},
			blSendDispChange(e){
				this.blSendDisp = e.detail.value
			},
			blSendSignChange (e){
				this.blSendSign = e.detail.value
			},
			blRecOutChange(e){
				this.blRecOut = e.detail.value
			},
			blRecDispChange(e){
				this.blRecDisp = e.detail.value
			},
			blRecSignChange(e){
				this.blRecSign = e.detail.value
			},
			confirm(){
				let self = this;
				let _data = {
					openId:this.$getStorageSync('token'),
					blSendOrder:self.blSendOrder,
					blSendDisp:self.blSendDisp,
					blSendSign:self.blSendSign,
					blRecOut:self.blRecOut,
					blRecDisp:self.blRecDisp,
					blRecSign:self.blRecSign,
				}
				self.$api.saveMsgSet(_data).then(res =>{
					if(res.code ==200){
						uni.navigateBack({
							data:1
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message{
		width: 100%;
		height:100%;
		overflow: hidden;
		padding-bottom: 100rpx;
		.line{
			height: 20rpx;
			width: 100%;
			background-color:$ztd-color-line;
		}
		.itembtitle{
			height: 80rpx;
			line-height: 80rpx;
			 font-size:30rpx;
			 color:#000;
			 padding: 0 20rpx;
			 border-bottom: $ztd-color-line solid 2rpx;
			 }
		.uni-form-item{
			width: 100%;
			padding:20rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom:$ztd-color-line solid 2rpx;
			radio-group{
				display: flex;
				align-items: center;
			}
			.title{
				height: 60rpx;
				line-height: 60rpx;
				font-size: 28rpx;
				}
			.uni-input{text-align: right;}
			}
		.labitem {
				button{
					width: 300rpx;
					background-color:#269DE6;
					border-radius: 50rpx;
				}
			}	
		.mdes{
			padding:20rpx;
			.titls{
				font-size:30rpx;
				color: #2C405A;
				}
			.des{
				padding: 6rpx 0;
				font-size: 24rpx;
				color: #999999;
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
	}
</style>
