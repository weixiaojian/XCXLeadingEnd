<template>
	<!-- 增值服务&代收货款 -->
	<view class="packageinfo">
		<view class="goodsbox">
			<view class="row flexsb" v-if="pageId=='sends'">
				<view class="name">
					是否用于所有批量收件人
				</view>
				<view class="content">
					<switch  style="transform:scale(0.8)" color="#FDD605"  @change="switchChange" />
				</view>
			</view>
		<!-- 	<view class="row">
				<view class="flexsb switch" >
					<view class="name">
						是否代收货款
					</view>
					<view class="content">
						<switch  style="transform:scale(0.8)"  :checked="isGoodsPayment"   @change="goodsPaymentSwitch" />
					</view>
				</view>
				<view class="flexfs " v-if="isGoodsPayment">
					<text>代收货款:</text>
					<view class="content">
						<view class="text">
							<input
								 class="uni-input" 
								 type="text" 
								 v-model="goodsPayment" 
								 placeholder-class="placeholderStyle"
								 @input="goodsPaymentMethod"
								 @focus="goodsPaymentMethod"
									maxlength="20"
								 data-name="hdh"
								 placeholder="请输入货款金额~"
							/>
						</view>
					</view>
				</view>
			</view> -->
			<view class="row">
				<view class="flexsb switch" >
					<view class="name">
						是否保价金额
					</view>
					<view class="content">
						<switch  style="transform:scale(0.8)" color="#FDD605" :checked="isInsuredValue"  @change="isInsuredValueSwitch" />
					</view>
				</view>
				<view class="flexfs " v-if="isInsuredValue">
					<text>保价金额:</text>
					<view class="content">
						<view class="text">
							<input
								 class="uni-input" 
								 type="text" 
								 v-model="insuredValue" 
								 placeholder-class="placeholderStyle"
								 @input="insuredValueMethod"
								 @focus="insuredValueMethod"
									maxlength="20"
								 data-name="hdh"
								 placeholder="请输入货款金额~"
							/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="submit">
			<view class="submit-button" @tap="confirm">确定</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default {
		data() {
			return {
				isGoodsPayment:false,
				isInsuredValue:false,
				insuredValue:'',
				optionType:'',
				goodsPayment:'',
				pageId:'',
				allSelect:false,
				maxInsuredValue:'',
				specialValue:'',
				blSpecial:0
			}
		},
		onLoad(option) {
			let data = JSON.parse(option.data)
			this.optionType = data.type
			this.pageId = option.pageId
			this.echoData(data.item);
			// this.getOrderConstant()
			
		},
		watch:{
		     isGoodsPayment(val, oldVal){//普通的watch监听
				 console.log(val)
					this.goodsPayment = val?this.goodsPayment:''
		     },
				 isInsuredValue(val, oldVal){//普通的watch监听
				 console.log(val)
				 		this.insuredValue = val?this.insuredValue:''
				 },
		 },
		components: {
				uniNumberBox
			 },
		methods: {
			getOrderConstant(){
				this.$api.getOrderConstant().then(res =>{
					console.log(res)
					if(res.code ==200){
							this.maxInsuredValue = res.data.insuredValue;
							this.specialValue = res.data.specialValue;
					}
					
				})
			},
			
			switchChange(e){
				let self = this
				self.allSelect = e.detail.value
			},
			goodsPaymentSwitch(e){
				let self = this
				self.isGoodsPayment = e.detail.value
			},
			isInsuredValueSwitch(e){
				let self = this
				self.isInsuredValue = e.detail.value
			},
			insuredValueMethod(val) {
				let valNum = this.$Reg.RegDecimalTwo(val.detail.value);
				this.$nextTick(()=>{
					this.insuredValue = valNum
				})
			},
			goodsPaymentMethod(){
				
			},
			focusRbillcode(){
				
			},
			focusWeight(){
				
			},
			inputValueReg(){
				
			},
			echoData(item){
				let self = this;
				self.goodsPayment = item.goodsPayment||'';
				self.insuredValue = item.insuredValue||'';
				self.isGoodsPayment = item.goodsPayment?true:false;
				self.isInsuredValue = item.insuredValue?true:false;
			},
			confirm(){
				let self = this
				if(self.maxInsuredValue){
					if (parseInt(self.insuredValue) > parseInt(self.maxInsuredValue)) {
					 wx.showToast({
						 title: '保价金额不得大于'+self.maxInsuredValue,
						 icon: 'none',
						 duration: 2000
					 })
					 return false;
					}
				}
				if(self.specialValue){
					if (parseInt(self.insuredValue) > parseInt(self.specialValue)) {
					 self.blSpecial =1
					}
				}
				let data = {
					goodsPayment:self.goodsPayment,
					insuredValue:self.insuredValue,
					blSpecial:self.blSpecial
				}
				data.type = self.optionType
				if(self.pageId =='sends'){
					data.allSelect = self.allSelect
				}
				uni.$emit('addedservices',data)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.packageinfo{
		width: 100%;
		height: 100%;
		background-color: $ztd-color-bgcolor;
		overflow-y: auto;
		padding: 0 20rpx 100rpx;
		.switch{
			width: 100%;
			padding:10rpx 0;
		}
		.borderB{
			border-bottom: 2rpx solid $ztd-color-line;
			padding-bottom: 10rpx;
		}
		.row{
			background-color: $ztd-color-white;
			height: auto;
			padding:20rpx 36rpx;
			margin:16rpx 0;
			border-radius: 10rpx;
			border: 2rpx solid $ztd-color-line;
			.name{
				color: #000;
				font-weight: bold;
				font-size: 28rpx;
			}
			.option{
				display: flex;
				justify-content: flex-start;
				align-items:flex-start;
				flex-wrap: wrap;
				width: 100%;
				padding-top:26rpx;
				.item{
					display: inline-block;
					width: 180rpx;
					height: 56rpx;
					line-height: 56rpx;
					border-radius: 28rpx;
					text-align: center;
					border: 2rpx solid $ztd-color-line;
					color:#222;
					margin-bottom: 20rpx;
					font-size: 26rpx;
					margin-right: 20rpx;
				}
				text.ischoice{
					color:$ztd-color-primary;
					border:2rpx solid $ztd-color-primary;
				}
			}
		}
		.row.flexsb,.switch.flexsb{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.content{
				.text{
					border-bottom: none;
				}
			}
		}
		// .switch.flexsb{
		// 	.name{
		// 		color: #000;
		// 		font-weight: normal;
		// 		font-size: 26rpx;
		// 	}
		// }
		.flexfs,.flexsb{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			text{
				font-size: 28rpx;
			}
			.content{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 50rpx;
				.text{
					color: #999;
					margin:0 20rpx;
					height: 100%;
					.uni-input{
						text-align: left;
						height: 100%;
					}
					border-bottom: 2rpx solid #999;
				}
				.scanIcon{
					color: $ztd-color-primary;
					font-size: 30rpx;
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
