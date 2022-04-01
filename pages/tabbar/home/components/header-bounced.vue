<template>
	<!-- 头部弹框 -->
	<view class="bounced" v-if="isShow">
		<!-- 三角形 -->
		<view class="triangle">
			<view class="sjx"></view>
		</view>
		<view class="info">
			<view class="info-list" v-if="userInfo.employeeName && userInfo.siteCode">
				<i class="iconfont licon">&#xe648;</i>
				<view class="val"><text class="">{{userInfo.siteName}}({{userInfo.siteCode}})</text></view>
			</view>
			<view class="info-list" v-if="userInfo.employeeName && userInfo.employeeCode">
				<i class="iconfont licon">&#xe642;</i>
				<view class="val"><text class="">{{userInfo.employeeName}}({{userInfo.employeeCode}})</text></view>
			</view>
			<view class="info-list" v-if="userInfo.mobilePhone">
				<i class="iconfont licon">&#xe618;</i>
				<view class="val"><text class="">{{userInfo.mobilePhone}}</text></view>
			</view>
			<view class="info-list" style="border-bottom: none;">
				<i class="iconfont licon">&#xe64d;</i>
				<view class="val"><text>V {{Version}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			isShow:{
				type:Boolean,
				default:false
			},
			userInfo:{
				type:Object,
			    default:()=>{
					return {}
				}
			},
			// iphone:{
			// 	type:Object,
			// 	default:{}
			// }
		},
		computed:{
			Version(){
				return global.Version
			}
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.bounced{
	position: absolute;
	top:60rpx;
	right: 20rpx;
	overflow: hidden;
	z-index: 9;
	width: auto;
	
	.triangle{
		display: flex;
		padding-right: 30rpx;
		justify-content: flex-end;
		height: 30rpx;
		.sjx{
			margin-top: 20rpx;
			height: 26rpx;
			width: 26rpx;
			background-color: $ztd-color-white;
			border-left: 2rpx solid $ztd-color-line;
			border-top: 2rpx solid $ztd-color-line;
			// transform: rotateX(180deg);
			transform:rotate(45deg);
			-ms-transform:rotate(45deg); 	/* IE 9 */
			-moz-transform:rotate(45deg); 	/* Firefox */
			-webkit-transform:rotate(45deg); /* Safari 和 Chrome */
			-o-transform:rotate(45deg); 	/* Opera */
			z-index: 1;
		}
	}
	
	.info{
		border-radius: $ztd-border-radius;
		background-color: $ztd-color-white;
		border: 2rpx solid $ztd-color-line;
		padding: 10rpx 20rpx;
		&-list{
			width: 260rpx;
			max-width:320rpx;
			display: flex;
			padding: 10rpx;
			align-items: center;
			justify-content: center;
			border-bottom: 2rpx solid $ztd-color-line;
			.val{
				flex-wrap: nowrap;
				display: flex;
				flex: 1;
			}
			text{
				// background-color: $ztd-color-back;
				flex: 1;
				font-size: 24rpx;
				color: $ztd-color-listfont;
			}
			.licon{
				font-size: 32rpx;
				padding-right: 10rpx;
			}
		}
		// &-list:nth-last-child(){
		// 	border-bottom:none;
		// }
		// .version{
		// 	text-align: center;
		// 	padding: 6rpx 0;
		// 	text{
		// 		flex: 1;
		// 		font-size: 26rpx;
		// 		color: $ztd-color-listfont;
		// 	}
		// }
	}
}
</style>
