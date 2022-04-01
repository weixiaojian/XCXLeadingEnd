<template>
	<view class="freight">
			<view class="yfsx-contaner">
					<view class="yfsx-contaner-mk">
						<view class="address">寄件地址</view>
						<view class="img-2"><!-- 占位 --></view>
						<view class="address">收件地址</view>
					</view>
					<view class="yfsx-contaner-mk">
						<view  class="address" @click="selectCity(0)">
							<view class="textColor">{{sendCity||'请选择'}}</view>
							<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
						</view>
						<image src="../../static/img/qw.png" class="img-2"></image>
						<view class="address" @click="selectCity(1)">
							<view class="textColor">{{acceptCity||'请选择'}}</view>
							<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
						</view>
					</view>
					<!-- 线条 -->
					<view class="line"></view>
					<view class="add">
						<uni-number-box :value="weight" :type="'KG'" :min="0"  @change="bindChange" ></uni-number-box>
					</view>
					<view class="line"></view>
					<view class="pay">预计需要支付</view>
					<view class="pay">
						<text>{{money}}</text>元
					</view>
					<view class="line"></view>
					<view class="explain">
						<image src="../../static/img/warning.png" class="img-1"></image>
						<view>该运费为预估费用，具体收费请以业务员收件为准。</view>
					</view>
				</view>
				<view class="submit">
					<view class="submit-button" @click="goSend">去寄件</view>
				</view>
				<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
				   @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	export default {
		data() {
			return {
				money: '',
				weight:0,
				cityPickerValueDefault: [0,0,0,0],
				sendProvinces:'',
				acceptProvinces:'',
				selectType:0,
				sendCity:'',
				acceptCity:''
			}
		},
		components:{
			mpvueCityPicker
		},
		onLoad() {
			let self = this;
			// self.getOrderConstant()
		},
		methods: {
			getOrderConstant(){
				this.$api.getOrderConstant().then(res =>{
					console.log(res)
					if(res.code ==200){
							if(res.data.weight){
								this.weight = res.data.weight
							}else{
								this.weight = 0;
							}
					}
				})
			},
			goSend(){
				let self = this;
				uni.redirectTo({
					url:'/pages/order/send/index'
				})
			},
			onConfirm(e){
				if(this.selectType ==0){
					this.sendProvinces = e.label.replace(/-/ig,'/');
					this.sendCity = this.sendProvinces.split('/')[0]+' '+this.sendProvinces.split('/')[1]
				}else{
					this.acceptProvinces = e.label.replace(/-/ig,'/');
					this.acceptCity = this.acceptProvinces.split('/')[0]+' '+this.acceptProvinces.split('/')[1]
				}
				this.getTrackFreight()
			},
			bindChange(e){
				let self = this
				self.weight = e;
				this.getTrackFreight()
			},
			selectCity(num){
				this.selectType = num
				this.$refs.mpvueCityPicker.show();
			},
			// 查询运费
			getTrackFreight(){
				let self = this;
				let sendCity = self.sendProvinces?self.sendProvinces.split('/')[1]:''
				let acceptProvice = self.acceptProvinces?self.acceptProvinces.split('/')[0]:''
				let acceptCity = self.acceptProvinces?self.acceptProvinces.split('/')[1]:''
				let acceptCountry = self.acceptProvinces?self.acceptProvinces.split('/')[2]:''
				let weight = self.weight?self.weight:''
				if(sendCity&&acceptProvice&&acceptCity&&acceptCountry&&weight){
					let _data = {
						"sendCity":sendCity,
						"acceptProvince":acceptProvice,
						"acceptCity":acceptCity,
						"acceptCounty":acceptCountry,
						"goodsWeight":weight
					}
					self.$api.trackFreight(_data).then(res =>{
						self.money = res.data+'';
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.freight{
		width: 100%;
		height: 100%;
		background-color:#F8F8F8;
		padding-bottom: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.yfsx-contaner {
			width: 100%;
				margin:0 30rpx;
				// height: 650rpx;
				background-color: #FFFFFF;
				box-shadow: 0px 0px 5px #ccc;
				border-radius: 6rpx;
				&-mk {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 20rpx;
					padding-bottom: 20rpx;
					.address {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #666;
						font-size: 28rpx;
					}
					.textColor{
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
				.rightIcon{
					font-size: 26rpx;
					margin-left: 6rpx;
				}
				.img-1 {
					width: 30rpx;
					height: 30rpx;
				}
				.img-2 {
					width: 100rpx;
					height: 20rpx;
				}
				
				.textColor {
					color: #000;
				}
				.line {
					height: 2rpx;
					background-color: #fafafa;
					margin: 10rpx 30rpx 0;
				}
				
				.add {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100rpx;
				}
				
				.pay {
					text-align: center;
					margin: 30rpx 0;
					color: #88888c;
					font-size: 28rpx;
					
					text {
						color: #d5000d;
						font-size: 60rpx;
					}
				}
				
				.explain {
					color: #959795;
					font-size: 26rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 30rpx 0;
					
					view {
						margin-left: 15rpx;
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
					font-size: 28rpx;
					justify-content: center;
					align-items: center;
					border-radius:35rpx;
					border: 2rpx solid $ztd-color-primary;
					color:$ztd-color-block;
					background-color:$ztd-color-primary ;
				}
			}
	}
</style>
