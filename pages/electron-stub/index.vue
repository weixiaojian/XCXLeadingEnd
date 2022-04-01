<!-- 下单寄件 -->
<template>
	<view class="electronStub">
		<view class="boxli">
			<view class="jrt">
				<view  class="oiconbox">
					<text class="oicon jj">寄</text>
				</view>
				<view class="jrb">
					<view class="jrtitles">
						<view class="inouts">
							<label class="title">{{electronStub.sendMan}} {{electronStub.sendManMobile}}</label>
							<view class="text uni-ellipsis-2">
								{{electronStub.sendManCompany||''}}
							</view>
							<view class="text uni-ellipsis-3">
								{{electronStub.sendProvince}}{{electronStub.sendCity||''}}{{electronStub.sendCounty||''}}{{electronStub.sendTown||''}}{{electronStub.sendManAddress}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="jrt">
				<view  class="oiconbox">
					<text class="oicon sj">收</text>
				</view>
				<view class="jrb">
					<view class="jrtitles">
						<view class="inouts">
							<label class="title">{{electronStub.acceptMan}} {{electronStub.acceptManMobile}}</label>
							<view class="text uni-ellipsis-2">
								{{electronStub.acceptManCompany||''}}
							</view>
							<view class="text uni-ellipsis-3">
								{{electronStub.acceptProvince}}{{electronStub.acceptCity||''}}{{electronStub.acceptCounty||''}}{{electronStub.acceptTown||''}}{{electronStub.acceptManAddress}}
							</view>
						</view>
					</view>
					
				</view>
			</view>
			<view class="jrdes">
		<!-- 		<view class="downexcel" @click="downexcelclick">
					下载Excel
				</view> -->
			</view>
		</view>
	<view class="boxli">
		<view class="vitem">
			<view class="vitems">物品名称：<text>{{electronStub.goodsName}}</text></view>
			<view class="vitems">付款方式：<text>{{electronStub.paymentType}}</text></view>
		</view>
		<view class="vitem">
			<view class="vitems">数量：<text>{{electronStub.packingPiece||''}}</text></view>
			<view class="vitems">重量：<text>{{electronStub.goodsWeight}}</text></view>
		</view>
		<view class="vitem">
			<!-- <view class="vitems">代收货款：<text>{{electronStub.goodsPayment||''}}</text></view> -->
			<view class="vitems">保价金额：<text>{{electronStub.insuredValue||''}}</text></view>
			<view class="vitems">备注：<text>{{electronStub.remark||''}}</text></view>
		</view>
	<!-- 	<view class="vitem">
			<view class="vitems">备注：<text>{{electronStub.remark}}</text></view>
		</view> -->
		<view style="height: 20rpx;"></view>
	</view>
	
	<view class="boxli">
		<view class="vitem">
			<!-- <view class="vitems">代收货款：<text>{{electronStub.goodsPayment||''}}</text></view> -->
			<view class="vitems">团队编码：<text>{{electronStub.groupId||''}}</text></view>
			<view class="vitems">下单人：<text>{{electronStub.groupMember||electronStub.customerName||''}}</text></view>
		</view>
		<view class="vitem">
			<view class="vitems">业务员：<text>{{electronStub.recMan||''}}</text></view>
			<view class="vitems">收件时间：<text>{{electronStub.registerDate||''}}</text></view>
		</view>
		<view class="vitem">
			<!-- <view class="vitems">保价金额：<text>{{electronStub.insuredValue||''}}</text></view> -->
		</view>
	</view>
	
	</view>
</template>

<script>

var _self;
export default {
		data() {
			return {
				billCode:'',
				type:'',
				electronStub:{}
			}
		},
		onLoad(options) {
			_self=this;
			let data = JSON.parse(options.data);
			if(data){
				this.billCode = data.billCode;
				this.type = data.type
				this.electronStub = data.item
			}
		},	
		methods: {
			getMyOrdersDetail(){
				let self = this;
				let data = {
					billCode:self.billCode,
					type:self.type
				}
				self.$api.getMyOrdersDetail(data).then(res =>{
					console.log(res)
					if(res.code ==200){
						self.electronStub = res.data
					}
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.electronStub{
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 16rpx;
		.boxli{
			width: 100%;
			border: 2rpx solid $ztd-color-line;
			border-bottom: none;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.toitm{
				height: 200rpx;
				flex: 1;
				padding: 10rpx 30rpx;
				.ywm{
					width:100%;
					height: 100%;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.title{
					font-size: 38rpx;
					margin-top: 10rpx;
				}
				.title:nth-child(2){
					text-align: center;
				}
			}
			.toitm:first-child{
				border-right: 2rpx solid $ztd-color-line;
			}
			.jrt{
				width: 100%;
				padding:30rpx 20rpx;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.oiconbox{
					margin: 0 20rpx;
					
					.jj {
						background-color: $ztd-color-primary;
					}
					
					.sj {
						background-color: $ztd-color-block;
					}
				}
				.jrb{
					flex: 1;
					.inouts{
						.title,.text{
							font-size: 30rpx;
							color: #666;
							margin-top: 6rpx;
						}
						.text{
							width: 100%;
							font-size: 28rpx;
						}
					}
				}
			}
			.jrdes{
				width: 100%;
				padding:12rpx 20rpx 6rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.downexcel{
					width: 130rpx;
					height:40rpx;	
					line-height:40rpx;
					text-align: center;
					margin: 0 20rpx 20rpx 0; 
					color: $ztd-bgbar-color;
					font-size: $ztd-p-size;
					border-bottom:$ztd-bgbar-color solid 1rpx;
					}
			}
			.vitem{
				width: 100%;
				padding:20rpx;
				display: flex;
				align-items: center;
				.vitems{
					flex: 1;
					color: #666;
				}
			}
		}		
		.boxli:last-child{
			border-bottom: 2rpx solid $ztd-color-line;
		}		
			
	}
</style>
