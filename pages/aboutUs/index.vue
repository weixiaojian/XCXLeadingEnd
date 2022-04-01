<template>
	<view class="aboutUs">
		<image class="img_info" src="../../static/i-topimg.jpeg"></image>
		<view class="page_cont">
			<view class="item">
				<view class="p_title">关于韵达同城：</view>
				<view class="p_content">韵达同城是韵达集团于2021年1月打造的专业的同城配送品牌，韵达同城致力于为用户提供高效、高质、安全的同城配送服务，提供末端最后一公里服务保障，同时将城市配送与新零售业态完美融合，满足不同消费者和商家的需求。
</view>
			</view>
			<!-- <view class="tips">
				哪吒速运努力践行国家战略。做有责任、有智慧、有效率、有温度的速运快递服务平台:
			</view>
			<view class="item">
				<view class="p_title">责任：</view>
				<view class="p_content">肩负乡村振兴、提振经济责任，畅通物流商流，服务生产生活，助推国家双循环战略。</view>
			</view>
			<view class="item">
				<view class="p_title">智慧：</view>
				<view class="p_content">
					用大数据打通源头、物流、仓储、配送、客户之间的信息屏障，打造智慧企业，塑造智慧生活。
				</view>
			</view>
			<view class="item">
				<view class="p_title">效率:</view>
				<view class="p_content">
					构建分布式网络，实施扁平化管理，形成未来物流发展新高地。
				</view>
			</view>
			<view class="item">
				<view class="p_title">温度:</view>
				<view class="p_content">
					赋予客户、承包商、员工以家的温情，同命运、共成长。
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.aboutUs {
		width: 100%;
		height: 100%;
		background-color: #F0F5F5;
		overflow-y: auto;
		color: #444;
		position: relative;
		font-size: 26rpx;

		.img_info {
			height: 370rpx;
			width: 100%;
		}

		.page_cont {
			background-color: #fff;
			font-size: 28rpx;
			margin-top: 16rpx;
			padding: 12rpx 10rpx;
		}

		.item {
			margin: 10rpx 0;

			.p_title {
				border-left: 6rpx solid $ztd-color-primary;
				padding-left: 12rpx;
			}

			.p_content {
				padding: 6rpx 0;
				text-indent: 2em;
				font-size: 26rpx;
				color: #707070;
			}
		}
		.tips{
			font-weight: bold;
			font-size: 28rpx;
			padding: 0 40rpx;
		}
		.big_title {
			font-size: 30rpx;
			text-align: center;
			padding: 14rpx 0;
			background-color: #fff;
			font-weight: bold;
		}
	}
</style>
