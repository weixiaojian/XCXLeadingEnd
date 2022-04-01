<template>
	<view class="send-receive">
		<!-- 收寄件信息 -->
		<view class="user-info">
			<view class="user-info-row" @tap.stop.prevent="getNewAddress('jjr')">
				<view  class="oiconbox"> 
					<text class="oicon jj">寄</text>
				</view>
				<view class="botline">
					<view class="send infobox">
						<template v-if="addressDataJJ.name||addressDataJJ.provice">
							<view class="name-box">
								<view class="name uni-ellipsis">{{addressDataJJ.name}}</view>
								<view class="tell uni-ellipsis">{{addressDataJJ.phone}}</view>
							</view>
							<view class="name-box" v-if="addressDataJJ.company">
								<view class="company uni-ellipsis">{{addressDataJJ.company}}</view>
							</view>
							<view class="address uni-ellipsis-2">
								{{addressDataJJ.provice}}{{addressDataJJ.city||''}}{{addressDataJJ.country||''}}{{addressDataJJ.townName||''}}{{addressDataJJ.detailAddress}}
							</view>
						</template>
						<view class="instructions" v-else>
							<view class="name">请选择寄件地址</view>
						</view>
					</view>
					<view class="addreIcon" @tap.stop="myaddress(0)">
						<i class="iconfont" v-html="'&#xe65a;'" ></i>
						<view class="text">
							地址簿
						</view>
					</view>
				</view>
			</view>
			<view class="user-info-row" @tap.stop.prevent="getNewAddress('sjr')">
				<view class="oiconbox">
					<text class="oicon sj">收</text>
				</view>
				<view class="rec infobox">
					<template v-if="addressDataSJ.name||addressDataSJ.provice">
						<view class="name-box">
							<view class="name uni-ellipsis">{{addressDataSJ.name}}</view>
							<view class="tell uni-ellipsis">{{addressDataSJ.phone}}</view>
						</view>
						<view class="name-box" v-if="addressDataSJ.company">
							<view class="company uni-ellipsis">{{addressDataSJ.company}}</view>
						</view>
						<view class="address uni-ellipsis-2">
							{{addressDataSJ.provice}}{{addressDataSJ.city||''}}{{addressDataSJ.country||''}}{{addressDataSJ.townName||''}}{{addressDataSJ.detailAddress}}
						</view>
					</template>
					<view class="instructions" v-else> 
						<view class="name">请选择收件地址</view>
					</view>
				</view>
				<view class="addreIcon" @tap.stop="myaddress(1)">
					<i class="iconfont " v-html="'&#xe65a;'" ></i>
					<view class="text">
						地址簿
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let self;
	export default {
		props:{
			addressDataSJ:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			addressDataJJ:{
				type:Object,
				default:()=>{
					return {}
				}
			}
		},
		data() {
			return {
				
			}
		},
		onLoad(){
			
		},
		created(){
			let self = this;
		},
		mounted(){
			let self = this
		},
		destroyed(){
		},
		methods: {
			// 地址博
			myaddress(tabIndex){
				let obj = {tabIndex}
				this.$emit('myaddress',obj);
			},
			// 地址详情
			getNewAddress(pageId){
				this.$emit('newaddress',pageId);
			},
		
		}
	}
</script>

<style lang="scss" scoped>
	.send-receive{
		width: 100%;
		height: auto;
		padding: 20rpx;
		.placeholderStyle{
			font-size: 26rpx;
			color:$ztd-color-listfont;
		}
		.uni-input{
		 padding:12rpx 0;
		 font-size: 26rpx;
		 height: 100%;
		}
		.user-info{
			background-color:$ztd-color-white;
			width: 100%;
			height: auto;
			padding:20rpx 20rpx;
			border-radius: 16rpx;
			&-row{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: auto;
				padding: 12rpx 0;
				.oiconbox{
					width: 80rpx;
					
					.jj {
						background-color: $ztd-color-primary;
					}
					
					.sj {
						background-color: $ztd-color-block;
					}
					
				}
				.botline{
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex: 1;
					border-bottom:2rpx solid $ztd-color-line;
					padding-bottom: 12rpx;
				}
				.infobox{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					width: 100%;
					// height: 100%;
					height: 130rpx;
					// min-height: 120rpx;
					border-right: 2rpx solid $ztd-color-line;
					.realname{
						position: absolute;
						top: -20rpx;
						// right: -90rpx;
						right: 100rpx;
						font-size: 26rpx;
						color: $ztd-color-warning;
						height: 36rpx;
						padding: 0 10rpx;
						line-height: 26rpx;
						border: 2rpx solid $ztd-color-warning;
						border-radius: 18rpx;
					}
					.instructions{
						display: flex;
						// justify-content: center;
						padding-left: 40rpx;
						align-items: center;
						width: 100%;
						height: 100%;
						
						.name{
							font-size: 30rpx;
							color:$ztd-color-listfont;
						}
					}
					.name-box{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						width: 100%;
						.name{
							width: 120rpx;
							margin-right: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
						.company{
							flex: 1;
							margin-right: 10rpx;
							// font-size: 30rpx;
						}
						.tell{
							flex: 1;
							margin-right: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
					.address{
						margin-top:6rpx;
						font-size: 24rpx;
						color: $ztd-color-listfont;
					}
				}
				.infoIcon{
					font-size: 32rpx;
					margin-right: 20rpx;
				}
				.addreIcon{
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
					.text{
						color: #6d6d6d;
					}
				}
				.rightIcon{
					font-size: 32rpx;
					padding-right: 20rpx;
					color: $ztd-color-listfont;
					border-right: 2rpx solid $ztd-color-line;
				}
			}
			.operate-button{
				width: 210rpx;
				border: 2rpx solid $ztd-color-primary;
				height:50rpx;
				border-radius:50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: $ztd-color-primary;
				margin-left: 10rpx;
				font-size: 26rpx;
			}
			.row:last-child{
				border-bottom: none;
			}
		}
		// .row{
		// 	width: 100%;
		// 	display: flex;
		// 	justify-content: flex-start;
		// 	align-items: center;
		// 	padding:10rpx 10rpx;
		// 	border-bottom: 2rpx solid $ztd-color-line;
		// 	.name{
		// 		font-size: 26rpx;
		// 		height: 50rpx;
		// 		line-height: 50rpx;
		// 		margin-right: 10rpx;
		// 	}
		// 	.content{
		// 		flex: 1;
		// 		display: flex;
		// 		justify-content: space-between;
		// 		align-items: center;
		// 		.input-box{
		// 			flex: 1;
		// 		}
		// 		.text-button{
		// 			background-color:$ztd-color-bgcolor;
		// 			color: $ztd-color-primaryfont;
		// 			padding: 6rpx 26rpx;
		// 			border-radius: 10rpx;
		// 			margin-left: 20rpx;
		// 			font-size: 26rpx;
		// 		}
		// 	}
		// 	.iconfont{
		// 		font-size: 30rpx;
		// 	}
		// }
	}
</style>
