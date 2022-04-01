<template>
	<view class="goods-info">
		<view class="goods-wraper">
			<view class="row" @tap="showPopup('wpxx')">
				<view class="name">物品信息:</view>
				<view class="content">
					<view class="text uni-ellipsis">
							{{packageinfo}}
					</view>
					<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
				</view>
			</view>
			<view class="row" >
					<view class="name">付款方式:</view>
					<view class="content">
						<picker :disabled="noPaymentType"  @change="bindPickerChange" style="font-size: 28rpx;" mode = selector :range="mockList" range-key="name">
								<view class="text">
										{{payment_type||'请选择'}}
								</view>
						</picker>
						<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
					</view>
			</view>
			<view class="row">
					<view class="name">预约时间:</view>
					<view class="content" @click="selectExpectTime">
						<view class="text">
								{{expectTime||'请选择'}}
						</view>
						<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
					</view>
			</view>
			<view class="row" @tap="showPopup('zzfw')">
				<view class="name">增值服务:</view>
				<view class="content">
					<view class="text">
							{{addedservices}}
					</view>
					<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payment_type:'现金',
				billCode:'',
				init_services:'请选择',
				expectTime:'',
				mockList:this.$Mock.payment_type,
				noPaymentType:false
			}
		},
		props:{
			goodsInfo:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			isEdit:{
				type:Boolean,
				default:()=>{
					return false
				}
			}
		},
		watch:{
		     payment_type(val, oldVal){//普通的watch监听
				 console.log('val',val)
						if(val == '月结'){
							this.noPaymentType = true
						}
		     },
		 },
		computed:{
			packageinfo(){
				return this.goodsInfo.goodsName?`${this.goodsInfo.goodsName} ${this.goodsInfo.goodsWeight}KG ${this.goodsInfo.packingPiece}件 ${this.goodsInfo.remark||''}`:'请选择'
			},
			addedservices(){
				let addedservices = this.init_services
				if(this.goodsInfo.goodsPayment||this.goodsInfo.insuredValue){
					addedservices = `${this.goodsInfo.goodsPayment?'代收货款: '+this.goodsInfo.goodsPayment:''} ${this.goodsInfo.insuredValue?'保价金额: ' + this.goodsInfo.insuredValue:''}`
				}
				return addedservices
			}
		},
		methods: {
			showPopup(type){
					let self = this
					self.$emit('showPopup',type)
				},
				bindPickerChange(e){
					let val = e.detail.value;
					this.payment_type = this.$Mock.payment_type[val].name;
					this.$emit("getPaymentType",this.payment_type)
				},
				selectExpectTime(){
					let self = this
					self.$emit('selectExpectTime')
				},
				focusBillCode(){
					
				},
				// 监听
				inputValueReg(e){
					let self = this;
					self.billCode = e.detail.value;
				},
				getBillCode(){
					let self = this
					self.$emit('getBillCode')
				}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-info{
		width: 100%;
		height: auto;
		padding:0 20rpx;
		.goods-wraper{
			background-color:$ztd-color-white;
			width: 100%;
			height: auto;
			border-radius: 16rpx;
			padding: 0 20rpx;
		}
		.placeholderStyle{
			text-align: right;
		}
		.row{
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:16rpx 0;
			border-bottom: 2rpx solid $ztd-color-line;
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
</style>
